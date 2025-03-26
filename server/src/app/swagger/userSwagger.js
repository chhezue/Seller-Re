/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 관련 API
 */

const userSwagger = {
    "/api/users": {
        get: {
            summary: "모든 사용자 목록 조회",
            description: "데이터베이스에서 모든 사용자 정보를 조회합니다",
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
                                        _id: { type: "string", example: "6798c0ba1e724534c2ffbd3a" },
                                        userid: { type: "string", example: "user123" },
                                        username: { type: "string", example: "홍길동" },
                                        role: { type: "string", enum: ["User", "Admin"], example: "User" },
                                        createdAt: { type: "string", example: "2023-08-01T12:31:01.857Z" },
                                        profileImage: { type: "string", example: "https://drive.google.com/uc?id=profileimage123", nullable: true },
                                        region: { type: "string", example: "6794d5502182ffe7b3b86b75", nullable: true },
                                    },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "서버 오류",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    error: { type: "string", example: "서버 오류가 발생했습니다" }
                                },
                            },
                        },
                    },
                },
            },
        },
        post: {
            summary: "새 사용자 등록",
            description: "새로운 사용자를 등록합니다 (회원가입)",
            tags: ["Users"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["id", "password", "username"],
                            properties: {
                                id: { type: "string", example: "user123", description: "사용자 아이디" },
                                password: { type: "string", example: "password123", description: "비밀번호" },
                                username: { type: "string", example: "홍길동", description: "사용자 이름" },
                                role: { type: "string", enum: ["User", "Admin"], example: "User", description: "사용자 권한" },
                                profileImage: { type: "string", example: "https://drive.google.com/uc?id=profileimage123", description: "프로필 이미지 URL" },
                                region: { type: "string", example: "6794d5502182ffe7b3b86b75", description: "지역 ID" },
                            },
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "사용자 생성 완료",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    _id: { type: "string", example: "6798c0ba1e724534c2ffbd3a" },
                                    userid: { type: "string", example: "user123" },
                                    username: { type: "string", example: "홍길동" },
                                    role: { type: "string", example: "User" },
                                    createdAt: { type: "string", example: "2023-08-01T12:31:01.857Z" },
                                    profileImage: { type: "string", example: "https://drive.google.com/uc?id=profileimage123", nullable: true },
                                    region: { type: "string", example: "6794d5502182ffe7b3b86b75", nullable: true },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: "잘못된 요청 - 이미 존재하는 아이디 또는 유효하지 않은 데이터",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    error: { type: "string", example: "User with id user123 already exists" }
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "서버 오류",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    error: { type: "string", example: "서버 오류가 발생했습니다" }
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    "/api/users/random-user": {
        get: {
            summary: "랜덤 사용자 정보 조회",
            description: "테스트/자동 로그인용 랜덤 사용자 아이디와 비밀번호를 조회합니다",
            tags: ["Users"],
            responses: {
                200: {
                    description: "성공적으로 랜덤 사용자 정보 반환",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    userId: { type: "string", example: "user123" },
                                    userPassword: { type: "string", example: "$2b$10$XG7IbRZPDkqRn/Z8OTBemu1A4EGnECp7Urx8HnGcCZ9d/UCJIMJPa" },
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "서버 오류",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "사용자를 찾을 수 없음" },
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    "/api/users/login": {
        post: {
            summary: "사용자 로그인",
            description: "아이디와 비밀번호로 로그인합니다",
            tags: ["Users"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userId", "userPassword"],
                            properties: {
                                userId: { type: "string", example: "user123" },
                                userPassword: { type: "string", example: "password123" },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "로그인 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    user: {
                                        type: "object",
                                        properties: {
                                            userId: { type: "string", example: "user123" },
                                            username: { type: "string", example: "홍길동" },
                                            profileImage: { type: "string", example: "https://drive.google.com/uc?id=profileimage123" },
                                            region: { type: "string", example: "서울특별시 강남구" },
                                        },
                                    },
                                    accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..."},
                                    refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..."},
                                },
                            },
                        },
                    },
                },
                401: {
                    description: "로그인 실패 - 잘못된 아이디 또는 비밀번호",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "아이디 또는 비밀번호가 올바르지 않습니다." }
                                },
                            },
                        },
                    },
                },
                500: {
                    description: "서버 오류",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    error: { type: "string", example: "서버 오류" }
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    "/api/users/logout": {
        post: {
            summary: "사용자 로그아웃",
            description: "로그인된 사용자를 로그아웃합니다",
            tags: ["Users"],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: "로그아웃 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "정상적으로 로그아웃 되었습니다." }
                                },
                            },
                        },
                    },
                },
                401: {
                    description: "인증 실패",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "인증이 필요합니다." }
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

module.exports = userSwagger;
