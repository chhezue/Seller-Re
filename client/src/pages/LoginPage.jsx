import React, { useState } from "react";

export default function LoginPage() {
    const [userId, setUserId] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const loginRequest = async (userId, userPassword) => {
        try {
            const response = await fetch("http://localhost:9000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, userPassword }),
                credentials: "include",
            });

            console.log("로그인 응답 상태:", response.status);
            const data = await response.json();
            console.log("로그인 응답 데이터:", data);

            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("user", JSON.stringify(data.user)); // localStorage는 string으로 저장
                window.location.href = "/";
            } else {
                alert("로그인 실패");
            }
        } catch (err) {
            console.error("로그인 오류:", err);
            alert("로그인 오류");
        }
    };

    // 일반 로그인
    const handleLogin = async () => {
        await loginRequest(userId, userPassword);
    };

    // 자동 로그인
    const handleAutoLogin = async () => {
        try {
            const userResponse = await fetch("http://localhost:9000/api/auth/randomUser");
            const userData = await userResponse.json();

            if (!userData) {
                alert("유저 정보를 가져올 수 없습니다.");
                return;
            }
            console.log("가져온 랜덤 유저 정보:", userData);

            // 랜덤 유저로 로그인 요청 보내기
            await loginRequest(userData.userId, userData.userPassword);
        } catch (err) {
            console.error("자동 로그인 오류:", err);
            alert("자동 로그인 오류");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">로그인</h2>

                {/* User ID 입력 */}
                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-2">아이디</label>
                    <input
                        type="text"
                        placeholder="User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                </div>

                {/* Password 입력 */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">비밀번호</label>
                    <input
                        type="password"
                        placeholder="User Password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                </div>

                {/* 로그인 버튼 */}
                <button
                    onClick={handleLogin}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition duration-200 font-medium shadow-sm"
                >
                    로그인
                </button>
                <button
                    onClick={handleAutoLogin}
                    className="w-full bg-secondary-600 text-white py-3 rounded-lg hover:bg-secondary-700 transition duration-200 mt-4 font-medium shadow-sm"
                >
                    자동로그인
                </button>
            </div>
        </div>
    );
}
