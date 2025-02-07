import { useState } from "react";
import { useNavigate } from "react-router-dom";  // 페이지 이동을 위한 useNavigate 훅

export default function LoginPage() {
    const [userId, setUserId] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const navigate = useNavigate();

    // 로그인 처리 함수
    const handleLogin = async () => {
        const response = await fetch("http://localhost:9000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, userPassword }),
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem("token", data.token);  // JWT 토큰을 로컬 스토리지에 저장
            navigate("/home");  // 로그인 후 홈 페이지로 리디렉션
        } else {
            alert("로그인 실패");
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            <input
                type="text"
                placeholder="아이디"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
            />
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
}
