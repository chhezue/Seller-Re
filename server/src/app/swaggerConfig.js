const swaggerJSDoc = require("swagger-jsdoc");
const userSwagger = require("./swagger/userSwagger");
const productSwagger = require("./swagger/productSwagger");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Seller-Re API Documentation",
            version: "1.0.0",
            description: "Seller-Re api 문서",
        },
        servers: [{ url: "http://localhost:9000" }],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [], // routes 폴더에서 JSDoc을 직접 읽지 않고 별도 파일에서 관리
};

const swaggerSpec = swaggerJSDoc(options);

// 사용자 API 문서 추가
swaggerSpec.paths = {
    ...swaggerSpec.paths,
    ...userSwagger,
    ...productSwagger
};

module.exports = swaggerSpec;
