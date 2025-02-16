import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkLoginStatus();
        const interval = setInterval(() => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                refreshAccessToken();
            }
        }, 55 * 1000); // 55초마다 토큰 갱신
        return () => clearInterval(interval);
    }, []);

    const checkLoginStatus = () => {
        const accessToken = localStorage.getItem("accessToken");
        setIsLoggedIn(!!accessToken);
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
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        try {
            const response = await fetch('http://localhost:9000/api/users/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
            });

            if (!response.ok) throw new Error("Failed to logout");

            localStorage.removeItem("accessToken");
            document.cookie = "refreshToken=; max-age=0";
            setIsLoggedIn(false);
            navigate("/login");
        } catch (err) {
            console.error("로그아웃 실패", err);
        }
    };

    return (
        <header className="bg-blue-600 p-4 shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1
                    className="text-white text-2xl font-semibold cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Seller-Re
                </h1>

                <nav className="flex space-x-4">
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={() => navigate("/my-page")}
                                className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-100"
                            >
                                마이페이지
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                로그아웃
                            </button>
                            <button
                                onClick={() => navigate("/product/upload")}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                상품 등록
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-100"
                        >
                            로그인
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
