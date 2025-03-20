# 🛒 Seller-Re 🛍️

> 💫 **중고거래의 새로운 패러다임을 제시합니다!** 💫

중고거래 플랫폼 프로젝트입니다. 판매자와 구매자를 연결하여 다양한 중고 물품 거래를 중개하는 웹 애플리케이션입니다.

<div align="center">
  
  ![Status](https://img.shields.io/badge/상태-개발중-yellow)
  ![Version](https://img.shields.io/badge/버전-1.0.0-blue)
  ![License](https://img.shields.io/badge/라이센스-MIT-green)
  
</div>

---

## 📋 프로젝트 개요

이 프로젝트는 React 기반의 프론트엔드와 Express 기반의 백엔드로 구성된 풀스택 웹 애플리케이션입니다. MongoDB를 데이터베이스로 사용하며, RESTful API를 통해 클라이언트와 서버가 통신합니다.

<details>
<summary>💡 프로젝트 목표</summary>
<br>
<ul>
  <li>사용자 친화적인 UI/UX 제공</li>
  <li>안전하고 신뢰할 수 있는 거래 환경 조성</li>
  <li>지역 기반 중고거래 활성화</li>
  <li>빠르고 효율적인 검색 기능 제공</li>
</ul>
</details>

## ✨ 주요 기능

- 🔐 **사용자 인증 및 권한 관리** - 안전한 로그인과 회원가입
- 📦 **중고 물품 등록 및 검색** - 손쉬운 상품 등록과 다양한 검색 옵션
- ❤️ **관심 상품 저장 기능** - 마음에 드는 상품을 찜하기
- 🤝 **거래 요청 및 관리** - 편리한 거래 과정 관리
- 🗺️ **지역별 상품 조회** - 내 주변의 상품 쉽게 찾기

## 🛠️ 기술 스택

<div align="center">
  
| 분야 | 기술 |
|:---:|:---:|
| **프론트엔드** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black) |
| **백엔드** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=Express&logoColor=white) |
| **데이터베이스** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white) |
| **인증** | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=JSON%20Web%20Tokens&logoColor=white) |
  
</div>

## 📂 폴더 구조

```bash
/Seller-Re 
├── /client # 🖥️ React 프론트엔드 
│ ├── /public 
│ ├── /src  
│ └── package.json # React 의존성 및 스크립트 
├── /server # ⚙️ Express 백엔드 
│ ├── /src  
│ │ ├── /app  
│ │ │ ├── /controllers # 🎮 컨트롤러 - 요청 처리 및 응답 반환
│ │ │ │ └── userController.js 
│ │ │ ├── /middlewares # 🔄 미들웨어 - 요청 전처리 및 인증
│ │ │ │ └── authMiddleware.js
│ │ │ ├── /models # 💾 데이터베이스 모델 - 스키마 정의
│ │ │ │ ├── Favirote.js # ❤️ 관심 상품 모델
│ │ │ │ ├── History.js # 📜 조회 기록 모델
│ │ │ │ ├── Product.js # 📦 상품 모델
│ │ │ │ ├── ProductFile.js # 🖼️ 상품 관련 파일 모델
│ │ │ │ ├── Region.js # 🗺️ 지역 정보 모델
│ │ │ │ ├── TradeRequest.js # 🤝 거래 요청 모델
│ │ │ │ └── User.js # 👤 사용자 모델
│ │ │ ├── /routes # 🛣️ API 라우트 핸들러 - 엔드포인트 정의
│ │ │ │ └── userRouter.js 
│ │ │ ├── /services # ⚡ 비즈니스 로직 및 서비스 - 핵심 기능 구현
│ │ │ │ └── userService.js 
│ │ │ └── app.js # 🚀 애플리케이션 진입점 
│ │ ├── /config # ⚙️ 설정 파일
│ │ │ ├── dotenv.config.js # 🔐 환경 변수 설정
│ │ │ └── mongoose.js # 🔌 MongoDB 연결 설정
│ │ ├── /utils # 🔧 유틸리티 함수
│ │ │ ├── lib.js # 🛠️ 공통 유틸리티 함수
│ │ │ └── makeDummy.js # 🧪 테스트용 더미 데이터 생성
│ │ ├── index.js # 🏁 서버 메인 진입점 
│ │ └── startup.js # 🚦 초기화 로직 
│ └── package.json # 📦 백엔드 의존성 및 스크립트 
└── README.md # 📚 프로젝트 문서
```

## 🚀 설치 및 실행 방법

### 🔍 사전 요구사항
- Node.js (v14 이상)
- MongoDB

### ⚙️ 백엔드 설치 및 실행
```bash
cd server
npm install
npm start
```

### 🖥️ 프론트엔드 설치 및 실행
```bash
cd client
npm install
npm start
```

## 📡 API 문서

주요 API 엔드포인트는 다음과 같습니다:

| 메소드 | 엔드포인트 | 설명 |
|:---:|:---|:---|
| `POST` | `/api/users/register` | 👤 사용자 등록 |
| `POST` | `/api/users/login` | 🔑 사용자 로그인 |
| `GET` | `/api/products` | 📋 상품 목록 조회 |
| `POST` | `/api/products` | ➕ 상품 등록 |
| `GET` | `/api/products/:id` | 🔍 특정 상품 조회 |

## 👨‍💻 개발자

<div align="center">
  
  이 프로젝트는 **Seller-Re 팀**에 의해 개발되었습니다.
  
  [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Seller-Re)
  
  ---
  
  ### 🙏 감사합니다!
  
  [![Star](https://img.shields.io/github/stars/Seller-Re/Seller-Re?style=social)](https://github.com/Seller-Re/Seller-Re)
  
</div>