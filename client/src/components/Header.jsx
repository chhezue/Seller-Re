import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkLoginStatus();
        const interval = setInterval(refreshAccessToken, 55 * 1000); // 55초마다 토큰 갱신
        return () => clearInterval(interval);
    }, []);

    const checkLoginStatus = () => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            setIsLoggedIn(true);
        } else {
            refreshAccessToken();
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/users/refresh', {
                method: 'POST',
                credentials: 'include', // ✅ 쿠키에 저장된 Refresh Token 포함
            });

            if (!response.ok) {
                throw new Error("Failed to refresh access token");
            }

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



    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        document.cookie = "refreshToken=; max-age=0"; // Refresh Token 삭제
        setIsLoggedIn(false);
        navigate("/login");
    };

    const handleMyPage = () => {
        navigate("/my-page");
    };

    return (
        <header>
            {isLoggedIn ? (
                <>
                    <button onClick={handleMyPage}>마이페이지</button>
                    <button onClick={handleLogout}>로그아웃</button>
                </>
            ) : (
                <button onClick={() => navigate("/login")}>로그인</button>
            )}
        </header>
    );
}
