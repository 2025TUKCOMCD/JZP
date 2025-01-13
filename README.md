# 🖥️ ageAPT 
### 인공지능 기반 사용자 반응형 키오스크
<h4>카메라로 사람을 인식하고 해당 사람의 연령을 추정하여 연령층에 맞게 UI 변형을 제공하고, <br/>해당 연령층의 선호도 데이터를 바탕으로 사용자가 많이 선택한 카테고리를 제공해주는 키오스크 서비스</h4>
<br/>

# 📐 System Architecture
<p align="center">

![Group 10](https://github.com/user-attachments/assets/3a9ef602-8efe-4059-9432-e627afaa7c48)

</p>

# 📌 프로젝트 환경 구성

### 1. 개발환경
<details>
<summary>개발환경 상세 보기</summary>

### 프레임워크 및 라이브러리
- **프론트엔드**: React (Vite 기반 프로젝트 생성)
- **백엔드**: Spring Boot (Java 11 이상)
- **AI 서버**: TensorFlow, OpenCV
- **데이터베이스**: MySQL 8.0

### 개발 도구
- **IDE**: IntelliJ IDEA (Spring Boot), Visual Studio Code (React, Flask)
- **패키지 매니저**: npm (프론트엔드), pip (AI 서버)
- **버전 관리**: Git + GitHub/GitLab

### 필요 도구
- **Postman**: API 테스트
- **Docker**: TensorFlow 컨테이너화

### 가상 환경 관리
- **Python**: `conda' 사용

</details>

### 2. 운용환경
<details>
<summary> 운용환경 상세 보기</summary>

### 운영체제
- **AWS EC2** (Ubuntu 20.04 LTS)

### 프레임워크 및 라이브러리
- **프론트엔드**: React 배포 (Nginx 서버)
- **백엔드**: Spring Boot 실행 (Java 11+)
- **AI 서버**: 서버 실행 (Python + TensorFlow)

### 데이터베이스
- **Amazon RDS** (MySQL 8.0)

### 네트워크 설정
- **EC2 보안 그룹**:
  - Flask (5000번 포트)
  - Spring Boot (8080번 포트)
  - React (80번 포트)
- **DNS**:
  - Route53로 도메인 설정

### 외부 API
- **Kakao Pay API**:
  - 결제 데이터 처리
- **Naver Cloud SMS API**:
  - 사용자 메시지 전송

</details>

### 3. 데모환경
<details>
<summary> 데모환경 상세 보기</summary>

### 하드웨어
- **Lenovo Yoga 6 노트북**
  - 사양: AMD Ryzen 5/7, 16GB RAM, SSD

### 운영체제
- **Windows 10/11**

### 네트워크 환경
- 로컬 네트워크 또는 AWS EC2 서버 접근

### 소프트웨어 구성
- **프론트엔드**:
  - 로컬 React 서버 실행 (`npm run dev`)
- **백엔드**:
  - Spring Boot 실행 (`java -jar app.jar`)
- **AI 서버**:
  - Flask 실행 (`python app.py`)
- **데이터베이스**:
  - 로컬 MySQL 서버 또는 AWS RDS 연결

</details>


# 🛠️ Tech Stack
<p align="center">
<strong> Frontend <br></strong>
<br>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
   <img src="https://img.shields.io/badge/styled components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white"/>
</p>
<p align="center">
<strong> Backend <br></strong>
<br>
  <img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white"> <img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black" alt="icon" />
</p>
<p align="center">
<strong> DB <br></strong>
<br>
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> <img src="https://img.shields.io/badge/Amazon S3-DD344C?style=for-the-badge&logo=Amazon S3&logoColor=white"> <img 
</p>
<p align="center">
<strong> DevOps <br></strong>
<br>
<img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/Amazon AWS-FF9900?style=for-the-badge&logo=Amazon AWS&logoColor=white"> <img src="https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white">  <img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=Amazon EC2&logoColor=white">
</p>
<p align="center">
<strong> Tool <br></strong>
<br>
<img src="https://img.shields.io/badge/figma-5B0BB5?style=for-the-badge&logo=figma&logoColor=white" alt="icon" /> <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white" alt="icon" />  <img src="https://img.shields.io/badge/visualstudiocode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="icon" /> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white" alt="icon" /> 
</p>

# 📅 수행일정
<p align="center">
<img width="680" alt="수행일정" src="https://github.com/user-attachments/assets/9fa4a073-a58e-48fa-8456-a5e789184fe2">
</p>

# 📄 Daily Scrum
<p align="center">
  https://overthehump.notion.site/Daily-Scrum-13404a82c20c81299405e3a8f57fa8f2
<img width="761" alt="스크린샷 2025-01-12 오후 9 13 14" src="https://github.com/user-attachments/assets/329442a5-4229-4670-8bef-d439180f2687" />
</p>

# ‼️ Commit Convention
<p align="center">
<img width="818" alt="스크린샷 2025-01-12 오후 9 28 36" src="https://github.com/user-attachments/assets/a91a87ba-430a-41a4-9299-6518eabaf808" />

```
[ Commit convention ]

feat : 새로운 기능을 추가할 경우
fix : 버그를 고친 경우
!HOTFIX : 급하게 치명적인 버그를 고쳐야할 경우
design : CSS등 사용자 UI 디자인 변경
style : 코드 포맷변경, 세미콜론 누락 -> 코드 수정이 없는 경우
refactor : 코드 리팩토링
comment : 필요한 주석 추가 및 변경
docs : Readme.md와 같은 문서 수정의 경우
test : 테스트 추가, 테스트 리팩토링 (프로덕션코드 수정x)
rename : 파일, 폴더명 변경
Remove : 파일, 폴더 삭제
Chore : 기타
```
</p>

# 🙋🏻 Team .JZP 
  
[최향도](https://github.com/chlgideh)|[김윤승](https://github.com/FluffBeanTofu)|[석민정](https://github.com/minjaon)|[조승연](https://github.com/moanuna)|
------|------|--------------------------------------|------------------|
![최향도](https://github.com/user-attachments/assets/f225f261-1d71-44db-9e5d-dd4c02b02e24)|![김윤승](https://github.com/user-attachments/assets/730e5aad-1cf5-4197-a27d-20ce35f06c3b)|![석민정](https://github.com/user-attachments/assets/beafec53-9742-4ef2-9d45-f42f32fb5bc7)|![조승연](https://github.com/user-attachments/assets/85861e0c-f189-4935-8a8b-4bfe1dbb277d)|
Leader, AI Engineer|AI Engineer|Back-end Developer, DevOps|Front-end Developer|

