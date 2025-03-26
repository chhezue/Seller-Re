/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 인증 관련 API
 */

const authSwagger = {
    "/api/auth/login": {
        post: {
            summary: "사용자 로그인",
            description: "아이디와 비밀번호로 로그인하고 JWT 토큰을 받습니다",
            tags: ["Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userId", "userPassword"],
                            properties: {
                                userId: { type: "string", example: "user123" },
                                userPassword: { type: "string", example: "password123" }
                            }
                        }
                    }
                }
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
                                            id: { type: "string", example: "6798c0ba1e724534c2ffbd3a" },
                                            userid: { type: "string", example: "user123" },
                                            username: { type: "string", example: "홍길동" },
                                            role: { type: "string", example: "User" },
                                            profileImage: { type: "string", example: "https://drive.google.com/uc?id=profileimage123" },
                                            region: { type: "string", example: "서울특별시 강남구" }
                                        }
                                    },
                                    accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." }
                                }
                            }
                        }
                    },
                    headers: {
                        "Set-Cookie": {
                            schema: {
                                type: "string",
                                example: "refreshToken=eyJhbGciOiJIUzI1NiIsIn...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800"
                            },
                            description: "HTTP-only 쿠키에 저장되는 리프레시 토큰"
                        }
                    }
                },
                401: {
                    description: "로그인 실패 - 잘못된 아이디 또는 비밀번호",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "아이디 또는 비밀번호가 올바르지 않습니다." }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    "/api/auth/refresh": {
        post: {
            summary: "액세스 토큰 갱신",
            description: "리프레시 토큰을 사용하여 새 액세스 토큰을 발급받습니다",
            tags: ["Auth"],
            parameters: [
                {
                    in: "cookie",
                    name: "refreshToken",
                    schema: {
                        type: "string"
                    },
                    required: true,
                    description: "리프레시 토큰 (쿠키에서 자동으로 전송)"
                }
            ],
            responses: {
                200: {
                    description: "토큰 갱신 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsIn..." }
                                }
                            }
                        }
                    }
                },
                403: {
                    description: "토큰 갱신 실패 - 유효하지 않거나 만료된 리프레시 토큰",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "유효하지 않은 리프레시 토큰입니다." }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    "/api/auth/logout": {
        post: {
            summary: "사용자 로그아웃",
            description: "현재 인증된 사용자의 리프레시 토큰을 제거합니다",
            tags: ["Auth"],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: "로그아웃 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "성공적으로 로그아웃되었습니다." }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "인증 실패",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "인증이 필요합니다." }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: "서버 오류",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "로그아웃 중 오류가 발생했습니다." }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    "/api/auth/me": {
        get: {
            summary: "현재 사용자 정보 조회",
            description: "현재 인증된 사용자의 정보를 조회합니다",
            tags: ["Auth"],
            security: [{ BearerAuth: [] }],
            responses: {
                200: {
                    description: "사용자 정보 조회 성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    user: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string", example: "6798c0ba1e724534c2ffbd3a" },
                                            userid: { type: "string", example: "user123" },
                                            username: { type: "string", example: "홍길동" },
                                            role: { type: "string", example: "User" },
                                            profileImage: { type: "string", example: "https://drive.google.com/uc?id=profileimage123" },
                                            region: { type: "string", example: "서울특별시 강남구" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    description: "인증 실패",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "인증이 필요합니다." }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = authSwagger; 