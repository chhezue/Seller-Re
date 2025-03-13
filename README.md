# Node-Project

### 폴더구조
```bash
/Seller-Re0 
.
├── client
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── no-img.png
│   │   ├── profileImg-default.png
│   │   └── robots.txt
│   ├── src
│   │   ├── components
│   │   │   ├── Header.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── pages
│   │   │   ├── chat
│   │   │   │   └── ChatPage.jsx
│   │   │   ├── products
│   │   │   │   ├── ProductDetailPage.jsx
│   │   │   │   ├── ProductListPage.jsx
│   │   │   │   └── ProductUploadPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyPage.jsx
│   │   │   └── test.jsx
│   │   ├── utils
│   │   │   └── socket.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── server
│   ├── src
│   │   ├── app
│   │   │   ├── controllers
│   │   │   │   ├── productController.js
│   │   │   │   └── userController.js
│   │   │   ├── middlewares
│   │   │   │   ├── authMiddleware.js
│   │   │   │   └── uploadMiddleware.js
│   │   │   ├── models
│   │   │   │   ├── Category.js
│   │   │   │   ├── Chat_Dev.js
│   │   │   │   ├── Favorite.js
│   │   │   │   ├── History.js
│   │   │   │   ├── Product.js
│   │   │   │   ├── Region.js
│   │   │   │   ├── TransactionRequest.js
│   │   │   │   └── User.js
│   │   │   ├── public
│   │   │   │   └── images
│   │   │   │       └── dummyCat.jpg
│   │   │   ├── routes
│   │   │   │   ├── productRoutes.js
│   │   │   │   └── userRoutes.js
│   │   │   ├── services
│   │   │   │   ├── productService.js
│   │   │   │   └── userService.js
│   │   │   ├── swagger
│   │   │   │   ├── productSwagger.js
│   │   │   │   └── userSwagger.js
│   │   │   ├── uploads
│   │   │   ├── app.js
│   │   │   ├── socketHandler.js
│   │   │   └── swaggerConfig.js
│   │   ├── config
│   │   │   ├── constants.js
│   │   │   ├── dotenv.config.js
│   │   │   ├── logger.js
│   │   │   ├── mongoose.js
│   │   │   └── seller-re-8433cca61115.json
│   │   ├── logs
│   │   │   └── auth.log
│   │   ├── utils
│   │   │   ├── authEventEmitter.js
│   │   │   ├── googleDriveService.js
│   │   │   ├── jwtUtils.js
│   │   │   ├── lib.js
│   │   │   └── makeDummy.js
│   │   ├── index.js
│   │   └── startup.js
│   ├── package-lock.json
│   └── package.json
├── README.md
└── package.json

```