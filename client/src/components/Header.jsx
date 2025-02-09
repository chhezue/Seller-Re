import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // 페이지가 로드될 때 localStorage에서 accessToken을 확인
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            setIsLoggedIn(true);  // accessToken이 있으면 로그인 상태
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");  // accessToken 삭제
        document.cookie = "refreshToken=; max-age=0"; // refreshToken 쿠키 삭제
        setIsLoggedIn(false);  // 로그아웃 상태로 변경
        navigate("/login");  // 로그인 페이지로 리디렉션
    };

    const handleMyPage = () => {
        navigate("/my-page");  // 마이 페이지로 이동
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
