import {useCallback, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

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

            if (!response.ok) {
                console.warn(`토큰 갱신 실패: ${response.status}`); // 경고 로그 추가
                if (response.status === 401) {
                    console.error("인증 오류: 로그아웃 처리");
                    handleLogout(); // 401이면 로그아웃
                }
                return; // 500 오류 등에서는 강제 로그아웃 안 함
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
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-8">
                {/* 로고 */}
                <h1 className="text-2xl font-bold text-primary-700 cursor-pointer hover:text-primary-500 transition-colors flex items-center" onClick={() => navigate("/")}>
                    <img src="/logo.png" alt="Seller-RE 로고" className="h-10 mr-2" />
                    Seller-RE
                </h1>

                {/* 로그인 상태에 따른 UI 변경 */}
                {isLoggedIn ? (
                    <div className="flex items-center space-x-4">
                        <Link to="/my-page" className="flex items-center space-x-2 text-primary-600 hover:text-primary-500">
                            <img src={profileImage} alt="프로필이미지" className="w-8 h-8 rounded-full border border-gray-200" />
                            <span>{username}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors shadow-sm"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        로그인
                    </button>
                )}
            </div>
        </header>
    );
}
