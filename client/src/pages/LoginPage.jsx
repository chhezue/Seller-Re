import React, { useState } from "react";

export default function LoginPage() {
    const [userId, setUserId] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const handleLogin = async () => {
        console.log("로그인 버튼 클릭됨!");

        try {
            const response = await fetch("http://localhost:9000/api/users/login", {
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
                window.location.href = "/";
            } else {
                alert("로그인 실패");
            }
        } catch (err) {
            console.error("로그인 오류:", err);
            alert("로그인 오류");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>

                {/* User ID 입력 */}
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">아이디</label>
                    <input
                        type="text"
                        placeholder="User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                </div>

                {/* Password 입력 */}
                <div className="mb-3">
                    <label className="block text-gray-700 text-sm font-bold mb-2">비밀번호</label>
                    <input
                        type="password"
                        placeholder="User Password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                    />
                </div>

                {/* 로그인 버튼 */}
                <button
                    onClick={handleLogin}
                    className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                    로그인
                </button>
            </div>
        </div>
    );
}
