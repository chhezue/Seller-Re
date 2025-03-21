/**
 * @swagger
 * tags:
 *   name: Product
 *   description: 상품 관련 API
 */

const productSwagger = {
    "/api/products/regions": {
        get: {
            summary: "지역 정보 목록 조회",
            description: "모든 지역 정보를 조회합니다.",
            tags: ["Products"],
            responses: {
                200: {
                    description: "지역 정보 목록 반환",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        "_id": { "type": "string", "example": "6794d5502182ffe7b3b86b75" },
                                        "level1": { "type": "string", "example": "서울특별시" },
                                        "level2": { "type": "string", "example": "강남구" },
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "서버 오류"
                }
            }
        }
    },
    
    "/api/products/categories": {
        get: {
            summary: "카테고리 목록 조회",
            description: "모든 카테고리를 조회합니다.",
            tags: ["Products"],
            responses: {
                200: {
                    description: "카테고리 목록 반환",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        "_id": { "type": "string", "example": "67ae0366d140723332602dbb" },
                                        "name": { "type": "string", "example": "디지털/가전" }
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "서버 오류"
                }
            }
        }
    },
    
    "/api/products": {
        get: {
            summary: "상품 목록 조회",
            description: "전체 상품 목록 또는 필터링된 상품 목록을 조회합니다.",
            tags: ["Products"],
            parameters: [
                {
                    in: "query",
                    name: "level1",
                    schema: {
                        type: "string"
                    },
                    description: "지역 대분류 (예: 서울특별시)",
                    required: false
                },
                {
                    in: "query",
                    name: "level2",
                    schema: {
                        type: "string"
                    },
                    description: "지역 소분류 (예: 강남구)",
                    required: false
                },
                {
                    in: "query",
                    name: "category",
                    schema: {
                        type: "string"
                    },
                    description: "카테고리 ID",
                    required: false
                },
                {
                    in: "query",
                    name: "tradeType",
                    schema: {
                        type: "string",
                        enum: ["나눔", "판매"]
                    },
                    description: "거래 유형",
                    required: false
                },
                {
                    in: "query",
                    name: "page",
                    schema: {
                        type: "integer",
                        default: 1
                    },
                    description: "페이지 번호",
                    required: false
                },
                {
                    in: "query",
                    name: "limit",
                    schema: {
                        type: "integer",
                        default: 20
                    },
                    description: "페이지당 항목 수",
                    required: false
                }
            ],
            responses: {
                201: {
                    description: "상품 목록 반환",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { "type": "string", "example": "나눔 타입의 상품 목록 조회 성공" },
                                    products: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                "_id": { "type": "string", "example": "67b818f54285db274d3a5f44" },
                                                "name": { "type": "string", "example": "product8" },
                                                "tradeType": { "type": "string", "example": "나눔" },
                                                "price": { "type": "number", "example": 0 },
                                                "fileUrls": {
                                                    "type": "array",
                                                    "items": { "type": "string" },
                                                    "example": []
                                                },
                                                "region": { "type": "string", "example": "서울특별시 강남구" },
                                                "category": { "type": "string", "example": "디지털/가전" },
                                                "createdAt": { "type": "string", "example": "2025-02-21T12:31:01.857Z" },
                                                "updatedAt": { "type": "string", "example": "2025-02-21T12:31:01.857Z" },
                                                "favoriteCount": { "type": "number", "example": 0 }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "서버 오류"
                }
            }
        },
        post: {
            summary: "상품 등록",
            description: "새로운 상품을 등록합니다. 최대 5개의 이미지를 업로드할 수 있습니다.",
            tags: ["Products"],
            security: [{ BearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    description: "상품명",
                                    example: "아이폰 14 Pro"
                                },
                                category: {
                                    type: "string",
                                    description: "카테고리 ID",
                                    example: "67ae0366d140723332602dbb"
                                },
                                tradeType: {
                                    type: "string",
                                    description: "거래 유형",
                                    enum: ["나눔", "판매"],
                                    example: "판매"
                                },
                                description: {
                                    type: "string",
                                    description: "상품 설명",
                                    example: "1년 사용한 아이폰입니다. 상태 좋습니다."
                                },
                                price: {
                                    type: "number",
                                    description: "가격",
                                    example: 800000
                                },
                                region: {
                                    type: "string",
                                    description: "지역 ID",
                                    example: "6794d5502182ffe7b3b86b75"
                                },
                                status: {
                                    type: "string",
                                    description: "상품 상태",
                                    enum: ["판매중", "예약중", "판매완료", "임시저장", "삭제됨"],
                                    example: "판매중"
                                },
                                writeStatus: {
                                    type: "string",
                                    description: "글 상태",
                                    enum: ["임시저장", "등록"],
                                    example: "등록"
                                },
                                images: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        format: "binary"
                                    },
                                    description: "상품 이미지 (최대 5개)"
                                }
                            },
                            required: ["name", "category", "tradeType", "description", "region", "price", "status", "writeStatus"]
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: "상품 등록 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { "type": "string", "example": "상품 등록 성공" },
                                    product: {
                                        type: "object",
                                        properties: {
                                            "_id": { "type": "string", "example": "67b818f54285db274d3a5f44" },
                                            "name": { "type": "string", "example": "아이폰 14 Pro" },
                                            "category": { "type": "string", "example": "67ae0366d140723332602dbb" },
                                            "tradeType": { "type": "string", "example": "판매" },
                                            "description": { "type": "string", "example": "1년 사용한 아이폰입니다. 상태 좋습니다." },
                                            "seller": { "type": "string", "example": "6798c0ba1e724534c2ffbd3a" },
                                            "status": { "type": "string", "example": "판매중" },
                                            "writeStatus": { "type": "string", "example": "등록" },
                                            "region": { "type": "string", "example": "6794d5502182ffe7b3b86b75" },
                                            "price": { "type": "number", "example": 800000 },
                                            "fileUrls": {
                                                "type": "array",
                                                "items": { "type": "string" },
                                                "example": ["https://drive.google.com/uc?id=abcdef123456"]
                                            },
                                            "createdAt": { "type": "string", "example": "2025-02-21T12:31:01.857Z" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "인증 실패 (토큰 없음 또는 만료됨)"
                },
                500: {
                    description: "서버 오류"
                }
            }
        }
    },
    
    "/api/products/temp": {
        get: {
            summary: "임시저장된 상품 조회",
            description: "현재 로그인한 사용자의 임시저장된 상품 글을 조회합니다.",
            tags: ["Products"],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: "임시저장된 상품 정보 반환",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    "_id": { "type": "string", "example": "67b818f54285db274d3a5f44" },
                                    "name": { "type": "string", "example": "아이폰 14 Pro" },
                                    "category": { "type": "string", "example": "디지털/가전" },
                                    "tradeType": { "type": "string", "example": "판매" },
                                    "description": { "type": "string", "example": "1년 사용한 아이폰입니다. 상태 좋습니다." },
                                    "status": { "type": "string", "example": "임시저장" },
                                    "writeStatus": { "type": "string", "example": "임시저장" },
                                    "region": { "type": "string", "example": "서울특별시 강남구" },
                                    "price": { "type": "number", "example": 800000 },
                                    "fileUrls": {
                                        "type": "array",
                                        "items": { "type": "string" },
                                        "example": ["https://drive.google.com/uc?id=abcdef123456"]
                                    },
                                    "fileNames": {
                                        "type": "array",
                                        "items": { "type": "string" },
                                        "example": ["iphone.jpg"]
                                    },
                                    "createdAt": { "type": "string", "example": "2025-02-21T12:31:01.857Z" }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "인증 실패 (토큰 없음 또는 만료됨)"
                },
                404: {
                    description: "임시 저장된 글이 없습니다."
                },
                500: {
                    description: "서버 오류"
                }
            }
        },
        delete: {
            summary: "임시저장된 상품 삭제",
            description: "현재 로그인한 사용자의 임시저장된 상품 글을 삭제합니다.",
            tags: ["Products"],
            security: [{ BearerAuth: [] }],
            responses: {
                204: {
                    description: "임시저장된 상품 삭제 성공"
                },
                401: {
                    description: "인증 실패 (토큰 없음 또는 만료됨)"
                },
                404: {
                    description: "임시 저장된 글이 없습니다."
                },
                500: {
                    description: "서버 오류"
                }
            }
        }
    },
    
    "/api/products/mySales": {
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
    
    "/api/products/myPurchases": {
        get: {
            summary: "로그인한 사용자의 구매 상품 조회",
            description: "현재 로그인한 사용자의 구매 상품을 조회합니다.",
            tags: ["Products"],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: "구매 상품 목록 반환",
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
                                        "status": { "type": "string", "example": "판매완료" },
                                        "writeStatus": { "type": "string", "example": "등록" },
                                        "region": { "type": "string", "example": "6794d5502182ffe7b3b86b75" },
                                        "price": { "type": "number", "example": 1000 },
                                        "fileUrls": {
                                            "type": "array",
                                            "items": { "type": "string" },
                                            "example": []
                                        },
                                        "createdAt": { "type": "string", "example": "2025-02-21T12:31:01.857Z" }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "인증 실패 (토큰 없음 또는 만료됨)"
                },
                500: {
                    description: "서버 오류"
                }
            }
        }
    },
    
    "/api/products/{id}": {
        get: {
            summary: "상품 상세 정보 조회",
            description: "특정 상품의 상세 정보를 조회합니다.",
            tags: ["Products"],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    schema: {
                        type: "string"
                    },
                    required: true,
                    description: "조회할 상품의 ID"
                }
            ],
            responses: {
                200: {
                    description: "상품 상세 정보 반환",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { "type": "string", "example": "상품 상세 조회 성공" },
                                    detailedProduct: {
                                        type: "object",
                                        properties: {
                                            "_id": { "type": "string", "example": "67b818f54285db274d3a5f44" },
                                            "name": { "type": "string", "example": "아이폰 14 Pro" },
                                            "category": { "type": "string", "example": "디지털/가전" },
                                            "tradeType": { "type": "string", "example": "판매" },
                                            "description": { "type": "string", "example": "1년 사용한 아이폰입니다. 상태 좋습니다." },
                                            "createdAt": { "type": "string", "example": "2025-02-21T12:31:01.857Z" },
                                            "updatedAt": { "type": "string", "nullable": true, "example": null },
                                            "status": { "type": "string", "example": "판매중" },
                                            "writeStatus": { "type": "string", "example": "등록" },
                                            "region": { "type": "string", "example": "서울특별시 강남구" },
                                            "price": { "type": "number", "example": 800000 },
                                            "fileUrls": {
                                                "type": "array",
                                                "items": { "type": "string" },
                                                "example": ["https://drive.google.com/uc?id=abcdef123456"]
                                            },
                                            "fileNames": {
                                                "type": "array",
                                                "items": { "type": "string" },
                                                "example": ["iphone.jpg"]
                                            },
                                            "favoriteCount": { "type": "number", "example": 5 },
                                            "seller": {
                                                "type": "object",
                                                "properties": {
                                                    "_id": { "type": "string", "example": "6798c0ba1e724534c2ffbd3a" },
                                                    "username": { "type": "string", "example": "사용자123" },
                                                    "profileImage": { "type": "string", "example": "https://drive.google.com/uc?id=profileimage123" },
                                                    "region": { "type": "string", "example": "서울특별시 강남구" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "상품을 찾을 수 없습니다."
                },
                500: {
                    description: "서버 오류"
                }
            }
        },
        delete: {
            summary: "상품 삭제",
            description: "로그인한 사용자의 특정 상품을 삭제합니다.",
            tags: ["Products"],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    schema: {
                        type: "string"
                    },
                    required: true,
                    description: "삭제할 상품의 ID"
                }
            ],
            responses: {
                200: {
                    description: "상품 삭제 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { "type": "string", "example": "상품이 성공적으로 삭제되었습니다." }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "인증 실패 (토큰 없음 또는 만료됨)"
                },
                403: {
                    description: "본인의 상품만 삭제할 수 있습니다."
                },
                404: {
                    description: "상품을 찾을 수 없습니다."
                },
                500: {
                    description: "서버 오류"
                }
            }
        },
        put: {
            summary: "상품 수정",
            description: "로그인한 사용자의 특정 상품을 수정합니다.",
            tags: ["Products"],
            security: [{ BearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "id",
                    schema: {
                        type: "string"
                    },
                    required: true,
                    description: "수정할 상품의 ID"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    description: "상품명",
                                    example: "아이폰 14 Pro"
                                },
                                category: {
                                    type: "string",
                                    description: "카테고리 ID",
                                    example: "67ae0366d140723332602dbb"
                                },
                                tradeType: {
                                    type: "string",
                                    description: "거래 유형",
                                    enum: ["나눔", "판매"],
                                    example: "판매"
                                },
                                description: {
                                    type: "string",
                                    description: "상품 설명",
                                    example: "1년 사용한 아이폰입니다. 상태 좋습니다."
                                },
                                price: {
                                    type: "number",
                                    description: "가격",
                                    example: 750000
                                },
                                region: {
                                    type: "string",
                                    description: "지역 ID",
                                    example: "6794d5502182ffe7b3b86b75"
                                },
                                status: {
                                    type: "string",
                                    description: "상품 상태",
                                    enum: ["판매중", "예약중", "판매완료", "임시저장", "삭제됨"],
                                    example: "판매중"
                                },
                                images: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        format: "binary"
                                    },
                                    description: "상품 이미지 (최대 5개)"
                                },
                                deletedImages: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    },
                                    description: "삭제할 이미지 ID 목록"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "상품 수정 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { "type": "string", "example": "상품 수정 성공" },
                                    product: {
                                        type: "object",
                                        properties: {
                                            "_id": { "type": "string", "example": "67b818f54285db274d3a5f44" },
                                            "name": { "type": "string", "example": "아이폰 14 Pro" },
                                            "category": { "type": "string", "example": "67ae0366d140723332602dbb" },
                                            "tradeType": { "type": "string", "example": "판매" },
                                            "description": { "type": "string", "example": "1년 사용한 아이폰입니다. 상태 좋습니다." },
                                            "seller": { "type": "string", "example": "6798c0ba1e724534c2ffbd3a" },
                                            "status": { "type": "string", "example": "판매중" },
                                            "writeStatus": { "type": "string", "example": "등록" },
                                            "region": { "type": "string", "example": "6794d5502182ffe7b3b86b75" },
                                            "price": { "type": "number", "example": 750000 },
                                            "fileUrls": {
                                                "type": "array",
                                                "items": { "type": "string" },
                                                "example": ["https://drive.google.com/uc?id=abcdef123456"]
                                            },
                                            "updatedAt": { "type": "string", "example": "2025-02-22T10:15:30.123Z" },
                                            "createdAt": { "type": "string", "example": "2025-02-21T12:31:01.857Z" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "인증 실패 (토큰 없음 또는 만료됨)"
                },
                403: {
                    description: "본인의 상품만 수정할 수 있습니다."
                },
                404: {
                    description: "상품을 찾을 수 없습니다."
                },
                500: {
                    description: "서버 오류"
                }
            }
        }
    }
};

module.exports = productSwagger;