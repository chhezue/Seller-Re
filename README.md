# Node-Project

### 폴더구조/ 예시
project-root/
├── index.js                # 서버 실행 및 startup.js 호출
├── startup.js              # 서버 초기화 및 Express 실행
├── app/                    # Express 애플리케이션 관련 코드
│   ├── app.js              # Express 인스턴스 생성 및 미들웨어 설정
│   ├── routes/             # 라우팅 관련 파일
│   │   ├── index.js        # 기본 라우트 설정
│   │   └── userRoutes.js   # 사용자 관련 라우트
│   ├── controllers/        # 컨트롤러 파일
│   │   └── userController.js
│   ├── services/           # 비즈니스 로직 (Service Layer)
│   │   └── userService.js
│   ├── models/             # 데이터베이스 모델 정의
│   │   └── userModel.js
│   ├── middlewares/        # 미들웨어 파일
│   │   └── authMiddleware.js
│   └── utils/              # 유틸리티 파일
│       └── makeDummy.js
├── config/                 # 환경설정 파일
│   ├── db.js               # 데이터베이스 연결 설정
│   ├── dotenv.config.js    # dotenv 설정
│   └── default.json        # 기본 환경 변수
├── .env                    # 환경 변수 설정 파일
├── package.json
└── README.md