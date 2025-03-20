/**
 * @swagger
 * tags:
 *   name: Product
 *   description: 상품 관련 API
 */

const productSwagger = {
    "/products/mySales": {
        get: {
            summary: "로그인한 사용자의 판매 상품 조회",
            description: "현재 로그인한 사용자의 판매 상품을 조회합니다.",
            tags: ["Products"],
            security: [{ BearerAuth: [] }],  // JWT 인증 적용
            responses: {
                200: {
                    description: "판매 상품 목록 반환",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        "_id": { "type": "string", "example": "67b818f54285db274d3a5f44" },
                                        "name": { "type": "string", "example": "product8" },
                                        "category": { "type": "string", "example": "67ae0366d140723332602dbb" },
                                        "tradeType": { "type": "string", "example": "나눔" },
                                        "description": { "type": "string", "example": "abc" },
                                        "updatedAt": { "type": "string", "nullable": true, "example": null },
                                        "deletedAt": { "type": "string", "nullable": true, "example": null },
                                        "seller": { "type": "string", "example": "6798c0ba1e724534c2ffbd3a" },
                                        "status": { "type": "string", "example": "판매중" },
                                        "writeStatus": { "type": "string", "example": "등록" },
                                        "region": { "type": "string", "example": "6794d5502182ffe7b3b86b75" },
                                        "price": { "type": "number", "example": 1000 },
                                        "fileUrls": {
                                            "type": "array",
                                            "items": { "type": "string" },
                                            "example": []
                                        },
                                        "createdAt": { "type": "string", "example": "2025-02-21T12:31:01.857Z" }
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: "인증 실패 (토큰 없음 또는 만료됨)",
                },
                500: {
                    description: "서버 오류",
                },
            },
        },
    },
};

module.exports = productSwagger;