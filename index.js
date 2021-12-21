const express = require("express");
const app = express();
const port = 8000;
const path = require("path");

const http = require("http").Server(app);
const io = require("socket.io")(http);

const body = require("body-parser");
app.use( body.urlencoded( { extended:false } ) );
app.use( body.json() );

app.set("view engine", "ejs");
app.set("views", __dirname+"/views");

app.use("/static", express.static(__dirname+"/public"));
app.use("/uploads",express.static(__dirname+"/uploads"));

const multer = require ("multer");
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        let checkimgfile = [".apng",".avif",".gif",".jpg",".jpeg",".jfif",".pjpeg",".pjp",".png",".svg",".webp"];
        let checkdatafile = ["txt", "csv"];
        if(checkimgfile.includes(path.extname(file.originalname))){
            console.log("forstorage");
            console.log(file);
            cb(null, file.originalname);
        }
        //mimetype 검사
        else if(checkdatafile.includes(path.extname(file.originalname))){
            console.log("data file incoming");
            console.log(file);
            cb(null, "tobechanged.txt");
        }
    }
});
const upload_multer = multer({ storage: storage });

class User{
    constructor(id, name, ip){
        this.id=id;
        this.name=name;
        this.ip=ip;
        this.color=`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`;
        this.img= `/static/defaultpic/${Math.ceil(Math.random()*9)}.jpg`;
        this.laughnum=0;
        this.crynum=0;
        this.msgnum=0;
        this.blockvote=0;
        this.blocked=false;
    }
    newcolor(){
        this.color=`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`;
    }
    laugh(num){
        this.laughnum+=Number(num);
    }
    cry(num){
        this.crynum+=Number(num);
    }
    msg(){
        this.msgnum++;
    }
    block(){
        this.blocked=true;
        this.blockvote=0;
    }
}

const getnamebyid=(id)=>{
    return(ulist.find(u=>u.id==id).name);
}
const getnamebyid2=(id)=>{
    return(dead_ulist.find(u=>u.id==id).name);
}
const getcolorbyid=(id)=>{
    return(ulist.find(u=>u.id==id).color);
}
const getipbyid=(id)=>{
    return(ulist.find(u=>u.id==id).ip);
}
const indbyid=(id)=>{
    return(ulist.findIndex(u=>u.id==id));
}
const getimgbyid=(id)=>{
    return(ulist.find(u=>u.id==id).img);
}

let ulist=[];       // 소켓연결이 생성될 때마다 들어오는 정보로 User class object를 만들고 이 배열에 넣는다. 
let dead_ulist=[];  // 소켓연결이 끊어질 때마다 해당 User object를 위 배열에서 이 배열로 옮긴다.

let blockediplist=[];
let voteip="";

io.on("connection", (socket)=>{
    console.log(socket.id); 
    console.log(socket.request.connection.remoteAddress); // socket연결에서 클라이언트의 ip주소 가져오기

    let newulist=()=>{
        io.emit("newulist", {ulist:ulist, dead_ulist:dead_ulist});
    }

    socket.emit("primary", {id:socket.id});

    socket.on("matchid", (data)=>{
        console.log(data);
        let newuser= new User(socket.id, data.username, socket.request.connection.remoteAddress);
        ulist.push(newuser);

        io.emit("notice", `${data.username}님이 입장하셨습니다.`);
        newulist();
    });


    socket.on("disconnect",()=>{
        dead_ulist.push(ulist.find(u=>u.id==socket.id));
        ulist=ulist.filter(u=>u.id!=socket.id);

        newulist();
        io.emit("notice",`${getnamebyid2(socket.id)}님 도망감`);
    });

    socket.on("newcolor_toserver", ()=>{
        /* let ind = ulist.findIndex(u=>u.id==socket.id); */
        let ind = indbyid(socket.id);
        ulist[ind].newcolor();
        let content={
            id:socket.id,
            color:ulist[ind].color
        }
        io.emit("newcolor_toclient", content);
        newulist();
    });


    socket.on("msg_toserver", (data)=>{
        console.log(data);

        /* let ind = ulist.findIndex(u=>u.id==socket.id); */
        let ind = indbyid(socket.id);
        ulist[ind].msg();

        let [checklaugh, checkcry] = [ ["ㅎ", "ㅋ", "하", "헤","히","힣","lol"] , ["ㅜ","ㅠ","엉","으앙"] ];  
        checklaugh.forEach(i => ulist[ind].laugh(data.msg.split(i).length - 1));
        checkcry.forEach(i=> ulist[ind].cry(data.msg.split(i).length - 1));

        data["color"]=getcolorbyid(socket.id);
        data["ip"]=socket.request.connection.remoteAddress;
        data["img"]=getimgbyid(socket.id);
        
        if(data.isDM==true && data.toid){
            data["fromname"] = getnamebyid(socket.id);
            io.to(data.toid).emit("msg_toclient", data);
        }
        else{
            io.emit("msg_toclient", data);
        }
        newulist();
    });


    socket.on("sendvote",(data)=>{
       /*  let ind = ulist.findIndex( u => u.id == data.id ); */
        let ind = indbyid(data.id);
        if(data.vote==1){
            ulist[ind].blockvote++;
        }
    });
    

    socket.on("requestvote",(data)=>{
        if(voteip!=""){  //voteip는 초기값 ""로 정의된 전역변수
            console.log("timer already in use.")
            socket.emit("alert", "다른 투표가 진행중입니다. 투표가 완료되면 다시 요청해주세요");
        }
        else{
            /* let ind = ulist.findIndex(u=>u.id==data.id); */
            let ind = indbyid(data.id);
            let majority = ulist.length/2;
            voteip=ulist[ind].ip;

            console.log(`${ulist[ind].name} (${ulist[ind].id}) [${ulist[ind].ip}]에 대한 투표 시작`);
            content={
                name:ulist[ind].name,
                id:ulist[ind].id
            }
            io.emit("vote",content);
            /* let a = new Promise((res,rej)=>{}) */
            let timer = 20;
            for(let i=0; i<timer+1; i++){  /// 시간 남으면 promise then catch로 다시 짜기
                setTimeout(()=>{
                    io.emit("getseconds",{sec:timer-i} );
                    console.log(timer-i);
                },1000*i);
                if(i==timer){
                    setTimeout(()=>{
                        io.emit("retrievevote", {id:ulist[ind].id});
                        console.log("retrieving votes.....");
                    },21000)
                    setTimeout(()=>{
                        let num = ulist[ind].blockvote;
                        if(num > majority){
                            console.log(`${num} > ${majority} : this ip will be blocked`);
                            blockediplist.push(voteip);
                            ulist.map(u=>{
                                if(u.ip==voteip){
                                    u.block();
                                }
                            });
                            io.emit("blockthisip",{ip:voteip});
                            io.emit("alert",`[찬성표 : ${num}] > [과반수 : ${majority}] \n : IP 차단 및 강제퇴장 완료`);
                        }
                        else{
                            console.log(`${num} =< ${majority} : this ip won't be blocked`);
                            ulist[ind].blockvote=0;
                            io.emit("alert",`[찬성표 : ${num}] <= [과반수 : ${majority}] \n : 강제 퇴장시키지 않음`);
                        }
                        console.log("calculating votes and resetting voteip");
                        voteip="";
                    },24000)
                }
            }
        }
    });
})

app.get("/chat", (req,res)=>{  //request.socket.remoteAddress
    console.log(req.ip);
    if(blockediplist.includes(req.ip)){
        res.redirect("/blocked")
    }
    else{
        res.render("socketentry");
    }
});

app.post("/chat", (req,res)=>{
    if(blockediplist.includes(req.ip)){
        res.redirect("/blocked");
    }
    else{
        if(req.body.name){
            let content={
                username:req.body.name,
            }
            res.render("socketchat", content);
        }
    }
});

app.post("/upload", upload_multer.single("newpic"), (req,res)=>{
    console.log("app post");
    console.log(req.body);
    console.log(req.file);
    if(req.body && req.file){
        let checkext = [".apng",".avif",".gif",".jpg",".jpeg",".jfif",".pjpeg",".pjp",".png",".svg",".webp"];
        if(checkext.includes(path.extname(req.file.originalname))){
            console.log("it is an image file");
            let ind = indbyid(req.body.id);
            ulist[ind].img = req.file.path;

            content={
                id:req.body.id,
                src:req.file.path
            }
            io.emit("newimg_toclient", content)
        }
    }
    res.send({src:req.file.path});
});

app.get('/blocked',(req,res)=>{
    res.send("<h1>Sorry. Your IP is banned</h1>");
});

http.listen(port,()=>{
    console.log("8000! http");
});