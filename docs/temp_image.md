#놀멍쉬멍
-7기 공통 프로젝트

</br>

## 서비스 소개
 저희는 이용자들이 편안하게 여행만을 즐기게 하기 위해 여행 계획 추천 서비스를 만들었습니다.
제주도에는 방문할 관광지가 정말 많습니다 저희 데이터베이스에 저장된 장소만 약 4천개가량 정도입니다.
그 많은 곳을 찾아보며 여행 경로를 계획하는건 많은 시간과 노력이 필요할 것입니다.
일상이 너무 바빠 여행을 계획할 시간조차 없는 사람들 혹은
여행 경로를 계획하는게 너무 귀찮은 사람들을 위해
놀멍쉬멍이 제주도에 도착할 때부터 제주도를 떠날 때까지 모든 경로를 계획해 드립니다.

</br>

## 프로젝트 진행 기간

2022.07.05 - 2022.08.19

</br>

## 주요 기능
- ### 여행 공유 기능
  -혼자서, 혹은 여럿이서 함께 여행 계획을 짜고 공유하는 것이 가능합니다.
  -여행의 일정, 여행스타일, 이름 등을 사용자가 원하는 대로 생성하고 필요시 수정하는 것이 가능합니다.

- ### 추천 일정 생성 기능
</br>
![create](/uploads/544e94626095839c62d243a37825a368/create.gif)
  - 처음 여행을 생성할 때 사용자가 입력한 정보를 바탕으로 여행 일정을 생성해줍니다.
  
![findPlace](/uploads/74ab6b12da65f6fcb8483e282d1baba2/findPlace.gif)
  - 사용자가 검색을 통하여 일정을 추가할 수 있습니다.

![map](/uploads/b1da3b8782325da4f0db122854d4929d/map.gif)
  - 등록된 일정을 지도로 한번에 조회할 수 있습니다.

![switch](/uploads/0ffb97586990d0483f1d9050c71fb06b/switch.gif)
-일정 순서 변경
  - 등록된 일정은 사용자의 필요에 따라 조정할 수 있습니다.
  - 이 때 변경 내용은 웹소켓을 통하여 같은 여행에 참여중인 사람들에게 실시간으로 반영됩니다.

## 사용 기술
</br>

Backend
- JAVA 8(OpenJDK 1.8)
- SpringBoot 2.7.1
- Spring Security
- Spring Data JPA
- Swagger 3.0.0
- MYSQL 8.0.22

Frontend
- JavaScript
- React 18.2.0
- Redux 8.0.2
- React-router-dom 6.3.0
- Node.js 16.16.0
- Socket.io

CI/CD
- AWS EC2
- Docker
- Jenkins
- Nginx

협업환경
- GitLab
- Jira
- MatterMost
- Discord
- Webex
- Notion

