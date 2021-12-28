## ChatNLZ
An instant messaging platform which analyzes your text logs real-time

view in [Korean](/README_kr.md)

## Working demo link
http://13.209.7.47:8000/chat

## Installation prerequisite

You will need : 
  1. Node.js and npm installed on your machine
 
Installation steps : 
  1. Clone Git repository  `git clone https://github.com/flyingpenguin0/ChatNLZ.git`
  2. In the root of the project directory, run the command  `npm install`

## About this Web Service
### 1. Websocket communication ( via socket.io ) : 
  - Real-time chatting service based on **socket.io** with a real-time notice emitted on every socket connection/disconnection
  .
  ![chatnlz_1](https://user-images.githubusercontent.com/91243754/147536999-1f32f537-592e-4853-a2f3-b1768a48f956.gif)


### 2. Profile image instantly updated on browser on upload : 
  - Server-side mimetype validation of uploaded image files using **Multer**
  - Uploaded files served through Dynamic DOM element manipulation using jQuery AJAX requests
  .
  ![chatnlz_2](https://user-images.githubusercontent.com/91243754/147539688-946d2ac5-f640-4d31-b8d5-0e7fc79baa4b.gif)

 
### 3. Messages classified into DM(Direct Messaging) and Group Messaging  : 
  ![chatnlz_3](https://user-images.githubusercontent.com/91243754/147540849-3384b9f7-d387-4701-a55f-b739537b7d42.gif)



### 4. Blocking an user : 
  - A toggle button to block/unblock a certain user's messages from being received
  ![chatnlz_4](https://user-images.githubusercontent.com/91243754/147541478-036b852e-3057-4df8-b8a2-9be6760da84c.gif)

### 5. Ejecting an user from the group chat via Majority vote : 
  - A button requesting the vote for an ejection of a member
  - A 30 seconds countdown implemented server-side and each second emitted to the browser
  - A voting form with options of Agree/Disagree which sends the selected option at the end of the countdown 
  - Ejecting the member and banning the IP from reentering the group chat if the majority conditions are met

### 6. Analyzing Messages / Data visualization
  - Analysis of a user's chat frequency, frequency of positivity/negativity are analyzed
  - Data is visualized and update real-time via pie charts using **d3.js**
  
### 7. A Responsive web page suited for both PC/Mobile browsers
  
# New functions to be added ...
  - [ ] Analyzing KakaoTalk chat log files that are uploaded to the server
  - [ ] Options of creating a private chat room after Join/Login 
