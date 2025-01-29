# Node-Project

### 폴더구조
```bash
/Seller-Re0 
├── /client # React frontend 
│ ├── /public 
│ ├── /src  
│ └── package.json # React dependencies and scripts 
├── /server # Express backend 
│ ├── /src  
│ │ ├── /app  
│ │ │ ├── /controllers # Controller
│ │ │ │ └── userController.js 
│ │ │ ├── /middlewares # middleware
│ │ │ │ └── authMiddleware.js
│ │ │ ├── /models # Database models
│ │ │ │ ├── Favirote.js
│ │ │ │ ├── History.js
│ │ │ │ ├── Product.js
│ │ │ │ ├── ProductFile.js
│ │ │ │ ├── Region.js
│ │ │ │ ├── TransactionRequest.js
│ │ │ │ └── User.js
│ │ │ ├── /routes # API route handlers
│ │ │ │ └── userRouter.js 
│ │ │ ├── /services # Business logic and services
│ │ │ │ └── userService.js 
│ │ │ └── app.js # Application entry point 
│ │ ├── /config # Configuration files
│ │ │ ├── dotenv.config.js
│ │ │ └── mongoose.js
│ │ ├── /utils # Utility functions
│ │ │ ├── lib.js
│ │ │ └── makeDummy.js 
│ │ ├── index.js # Main server entry point 
│ │ └── startup.js # Initialization logic 
│ └── package.json # Backend dependencies and scripts 
└── README.md # Project documentation
```