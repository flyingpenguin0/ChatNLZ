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
        cb(null,"./uploads/");
    },
    filename:(req,file,cb)=>{
        let checkimgfile = ["image/avif","image/gif","image/jpg","image/jpeg","image/png","image/svg","image/webp"];
        let checkdatafile = ["text/rtf", "text/xml", "text/csv"];
        if(checkimgfile.includes(file.mimetype)){
            console.log("forstorage");
            console.log(file);
            cb(null, file.originalname);
        }
        else if(checkdatafile.includes(file.mimetype)){
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

let ulist=[];       // ??????????????? ????????? ????????? ???????????? ????????? User class object??? ????????? ??? ????????? ?????????. 
let dead_ulist=[];  // ??????????????? ????????? ????????? ?????? User object??? ??? ???????????? ??? ????????? ?????????.

let blockediplist=[];
let voteip="";

io.on("connection", (socket)=>{
    console.log(socket.id); 
    console.log(socket.request.connection.remoteAddress); // socket???????????? ?????????????????? ip?????? ????????????

    let newulist=()=>{
        io.emit("newulist", {ulist:ulist, dead_ulist:dead_ulist});
    }

    socket.emit("primary", {id:socket.id});

    socket.on("matchid", (data)=>{
        console.log(data);
        let newuser= new User(socket.id, data.username, socket.request.connection.remoteAddress);
        ulist.push(newuser);

        io.emit("notice", `${data.username}?????? ?????????????????????.`);
        newulist();
    });


    socket.on("disconnect",()=>{
        dead_ulist.push(ulist.find(u=>u.id==socket.id));
        ulist=ulist.filter(u=>u.id!=socket.id);

        newulist();
        io.emit("notice",`${getnamebyid2(socket.id)}??? ?????????`);
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

        let [checklaugh, checkcry] = [ ["???", "???", "???", "???","???","???","lol"] , ["???","???","???","??????"] ];  
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
        if(voteip!=""){  //voteip??? ????????? ""??? ????????? ????????????
            console.log("timer already in use.")
            socket.emit("alert", "?????? ????????? ??????????????????. ????????? ???????????? ?????? ??????????????????");
        }
        else{
            /* let ind = ulist.findIndex(u=>u.id==data.id); */
            let ind = indbyid(data.id);
            let majority = ulist.length/2;
            voteip=ulist[ind].ip;

            console.log(`${ulist[ind].name} (${ulist[ind].id}) [${ulist[ind].ip}]??? ?????? ?????? ??????`);
            content={
                name:ulist[ind].name,
                id:ulist[ind].id
            }
            io.emit("vote",content);
            /* let a = new Promise((res,rej)=>{}) */
            let timer = 20;
            for(let i=0; i<timer+1; i++){  /// ?????? ????????? promise then catch??? ?????? ??????
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
                            io.emit("alert",`[????????? : ${num}] > [????????? : ${majority}] \n : IP ?????? ??? ???????????? ??????`);
                        }
                        else{
                            console.log(`${num} =< ${majority} : this ip won't be blocked`);
                            ulist[ind].blockvote=0;
                            io.emit("alert",`[????????? : ${num}] <= [????????? : ${majority}] \n : ?????? ??????????????? ??????`);
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
            ulist[ind].img = "/uploads/"+req.file.originalname;

            content={
                id:req.body.id,
                src:"/uploads/"+req.file.originalname
            }
            io.emit("newimg_toclient", content)
        }
    }
    res.send({src:"/uploads/"+req.file.originalname});
});

app.get('/blocked',(req,res)=>{
    res.send("<h1>Sorry. Your IP is banned</h1>");
});

http.listen(port,()=>{
    console.log("8000! http");
});