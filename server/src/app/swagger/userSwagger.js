/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 관련 API
 */

const userSwagger = {
    "/api/users": {
        get: {
            summary: "모든 사용자 목록 가져오기",
            description: "데이터베이스에서 모든 사용자를 가져옴",
            tags: ["Users"],
            responses: {
                200: {
                    description: "성공적으로 사용자 목록을 반환",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string", example: "1234" },
                                        username: { type: "string", example: "johndoe" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        post: {
            summary: "새 사용자 생성",
            description: "새로운 사용자를 등록",
            tags: ["Users"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                username: { type: "string", example: "johndoe" },
                                password: { type: "string", example: "password123" },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "사용자 생성 완료",
                },
            },
        },
    },

    "/api/users/login": {
        post: {
            summary: "사용자 로그인",
            description: "이메일과 비밀번호로 로그인",
            tags: ["Users"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                userId: { type: "string", example: "johndoe" },
                                userPassword: { type: "string", example: "password123" },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "로그인 성공",
                },
                401: {
                    description: "로그인 실패",
                },
            },
        },
    },

    "/api/users/logout": {
        post: {
            summary: "사용자 로그아웃",
            description: "로그인된 사용자를 로그아웃",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: "로그아웃 성공",
                },
                401: {
                    description: "인증 실패",
                },
            },
        },
    },
};

module.exports = userSwagger;
