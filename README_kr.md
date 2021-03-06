## ChatNLZ
참가자들의 메시지 빈도와 내용에 따른 참여도와 감정을 분석하고 이를 실시간으로 반영한 통계 자료가 함께 표시되는 채팅 서비스

[영어](/README.md)로 보기



## 데모 링크
http://52.78.152.55:5000/chat



## 설치 방법

필요 : 
  1. Node.js와 npm 이 설치되어 있어야 합니다.
 
설치 과정 : 
  1. Git repository 를 터미널에서 클론합니다. `https://github.com/flyingpenguin0/ChatNLZ.git`
  2. 프로젝트 폴더의 루트에서 다음을 실행합니다. `npm install`

## 웹 서비스 내용
### 1. Websocket 통신 ( socket.io 사용 ) : 
  - socket.io를 활용한 실시간 채팅 전송 및 새로운 socket connect/disconnect에 따른 공지 전송 기능 구현
  
  ![chatnlz_1](https://user-images.githubusercontent.com/91243754/147545721-8502a572-907b-4d70-90f1-445d5676ede4.gif)


### 2. 프로필 이미지 업로드 기능 및 업로드 시 즉시 브라우저에 반영 : 
  - **Multer**를 활용한 파일 mimetype에 따른 이미지 파일의 server-side  유효성 검사
  - jQuery를 활용한 AJAX request와 동적 DOM element manipulation으로 리프레쉬 없이 업로드 파일을 serve.
 
  ![chatnlz_2](https://user-images.githubusercontent.com/91243754/147545756-7ee4a877-88e6-44cb-b35c-726fa6815540.gif)

 
### 3.  Direct Messaging(DM) / 전체 메시지 구분 기능

  ![chatnlz_3](https://user-images.githubusercontent.com/91243754/147545776-2ba4e177-84b7-4afe-be63-be46de68fa68.gif)


### 4. 수신 차단 기능 구현 : 
  - 특정 참가자의 메시지의 수신 차단/차단 해제 토글 버튼 구현

  ![chatnlz_4](https://user-images.githubusercontent.com/91243754/147545785-fad12578-cfd9-4af3-a1bb-8ac88c0af27e.gif)

  
### 5.강제 퇴장 과반수 투표 기능 : 
  - 특정 참가자의 메시지의 수신 차단/차단 해제 토글 버튼 구현
  - 30초의 카운트 다운을 서버 사이드에서 진행하며 브라우저에도 카운트다운 동시에 표시
  - 찬성/반대 선택 가능한 투표 form과 카운트다운의 시간이 만료되면 선택 값을 서버로 자동 전송하는 기능
  - 투표 참여자의 과반수 조건 만족 시 해당 유저의 IP 차단하여 재입장 방지 기능

  < 과반수 조건 불만족 : 강제퇴장 X >
  
   ![chatnlz_5](https://user-images.githubusercontent.com/91243754/147545852-607ac34c-3708-4a32-9a6a-2a65f0742a93.gif)

  
  < 과반수 조건 만족 : 강제퇴장 O >
  
   ![chatnlz_6](https://user-images.githubusercontent.com/91243754/147545859-79ad68ee-9e51-4c3c-9e96-a873b2514ec1.gif)


### 6. 메시지 내용 분석 기능
  -  d3.js를 활용하여 채팅 메시지 수 비율,  긍정적인 표현의 비율,  부정적인 표현의 비율을 차트로 표시하고 실시간 업데이트

  ![chatnlz_7 (2)](https://user-images.githubusercontent.com/91243754/147545866-c342dc6f-bda1-4928-a94a-09de26ac704d.gif)

  
### 7. PC/모바일 브라우저 유저 모두의 쾌적한 user experience를 위한 반응형 페이지 구현
  
   ![chatnlz_8](https://user-images.githubusercontent.com/91243754/147545871-86656d52-8348-4236-b61e-01f353eb2de0.gif)

  
## 추가기능 업데이트 예정 ...
  - [ ] 카카오톡 채팅 로그 파일 업로드 시 분석 / 시각화 기능 
  - [ ] 회원가입/로그인 후 비밀 채팅방 생성/참가 기능  

