import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("accessToken"));
    const [username, setUsername] = useState("");
    const [profileImage, setProfileImage] = useState("/profileImg-default.png");
    const navigate = useNavigate();

    const checkLoginStatus = useCallback(() => { // useCallback을 사용하면 함수를 기억하여 불필요한 재생성을 방지
        const accessToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");
        // console.log("accessToken: ", accessToken, "storedUser: ", storedUser);

        if (accessToken && storedUser) {
            const user = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setUsername(user?.username || "사용자");
            setProfileImage(user?.profileImage || "/profileImg-default.png");
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        checkLoginStatus();
        const interval = setInterval(() => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                refreshAccessToken();
            }
        }, 55 * 1000);
        return () => clearInterval(interval);
    }, [checkLoginStatus]);

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

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
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
                        <Link to="/my-page" className="flex items-center space-x-2">
                            <img src={profileImage} alt="프로필이미지" className="w-8 h-8 rounded-full" />
                            <span className="text-gray-700">{username}</span>
                        </Link>
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
