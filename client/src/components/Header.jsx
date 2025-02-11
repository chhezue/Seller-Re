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
        if (accessToken) {
            setIsLoggedIn(true);
        }
    };

    const refreshAccessToken = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return; // accessToken 없으면 서버 요청 안 함

        try {
            const response = await fetch('http://localhost:9000/api/users/refresh', {
                method: 'POST',
                credentials: 'include', // 쿠키에 저장된 Refresh Token 포함
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

    const handleLogout = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return; // accessToken 없으면 서버 요청 안 함

        try {
            const response = await fetch('http://localhost:9000/api/users/logout', {
                method: 'POST',
                credentials: 'include', // 쿠키 포함 (refreshToken 전송)
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
            });

            if (!response.ok) {
                throw new Error("Failed to logout");
            }

            localStorage.removeItem("accessToken");
            document.cookie = "refreshToken=; max-age=0"; // refreshToken 삭제
            setIsLoggedIn(false);
            navigate("/login");
        } catch (err) {
            console.error("로그아웃 실패", err);
        }
    };

    const handleMyPage = () => {
        navigate("/my-page");
    };

    const handleProductUpload = () => {
        navigate("/product/upload");
    };

    return (
        <header>
            {isLoggedIn ? (
                <>
                    <button onClick={handleMyPage}>마이페이지</button>
                    <button onClick={handleLogout}>로그아웃</button>
                    <button onClick={handleProductUpload}>상품 등록</button>
                </>
            ) : (
                <button onClick={() => navigate("/login")}>로그인</button>
            )}
        </header>
    );
}
