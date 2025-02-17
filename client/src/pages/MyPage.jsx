import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function MyPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        // ✅ localStorage에서 username 가져오기
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            // ✅ 로그인되지 않았다면 로그인 페이지로 리디렉트
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");  // 토큰 삭제
        navigate("/login");  // 로그인 페이지로 리디렉션
    };

    return (
        <div>
            <h1>마이 페이지</h1>
            <div>
                <div>
                    <img src="" alt="프로필이미지"/>
                </div>
                <div>
                    <p>{username}</p>
                </div>
            </div>
        </div>
    );
}
