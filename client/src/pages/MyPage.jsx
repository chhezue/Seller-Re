import { useNavigate } from "react-router-dom";

export default function MyPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");  // 토큰 삭제
        navigate("/login");  // 로그인 페이지로 리디렉션
    };

    return (
        <div>
            <h1>마이 페이지</h1>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
}
