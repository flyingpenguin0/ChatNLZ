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

### 2. Profile image instantly updated on browser on upload : 
  - Server-side mimetype validation of uploaded image files using **Multer**
  - Uploaded files served through Dynamic DOM element manipulation using jQuery AJAX requests
 
### 3. Messages classified into DM(Direct Messaging) and Group Messaging  : 

### 4. Blocking an user : 
  - A toggle button to block/unblock a certain user's messages from being received
  
### 5. Ejecting an user from the group chat via Majority vote : 
  - A button requesting the vote for an ejection of a member
  - A 30 seconds countdown implemented server-side and each second emitted to the browser
  - A voting form with options of Agree/Disagree which sends the selected option at the end of the countdown 
  - Ejecting the member and banning the IP from reentering the group chat if the majority conditions are met

### 6. Analyzing Messages / Data visualization
  - Analysis of a user's chat frequency, frequency of positivity/negativity are analyzed
  - Data is visualized and update real-time via pie charts using **d3.js**
  
### 7. PC/모바일 브라우저 유저 모두의 쾌적한 user experience를 위한 반응형 페이지 구현
  
# New functions to be added ...
  - Analyzing KakaoTalk chat log files that are uploaded to the server
  - Options of creating a private chat room after Join/Login 
