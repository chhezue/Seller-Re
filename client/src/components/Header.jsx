import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        checkLoginStatus();
        const interval = setInterval(() => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                refreshAccessToken();
            }
        }, 55 * 1000);
        return () => clearInterval(interval);
    }, []);

    const checkLoginStatus = () => {
        const accessToken = localStorage.getItem("accessToken");
        const storedUsername = localStorage.getItem("username");

        if (accessToken) {
            setIsLoggedIn(true);
            setUsername(storedUsername || "사용자");
        }
    };

    const refreshAccessToken = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            const response = await fetch('http://localhost:9000/api/users/refresh', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) throw new Error("Failed to refresh access token");

            const data = await response.json();
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                setIsLoggedIn(true);
            } else {
                handleLogout();
            }
        } catch (err) {
            console.error("토큰 갱신 실패", err);
            handleLogout();
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <header className="border-b border-gray-300 p-4">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                {/* 로고 */}
                <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
                    Seller-RE
                </h1>

                {/* 로그인 상태에 따른 UI 변경 */}
                {isLoggedIn ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">{username}</span>
                        <button className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
                            편집하기
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 border border-gray-500 text-gray-700 rounded hover:bg-gray-100"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="px-3 py-1 border border-gray-500 text-gray-700 rounded hover:bg-gray-100"
                    >
                        로그인
                    </button>
                )}
            </div>
        </header>
    );
}
