import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";  // 홈 페이지 추가
import MyPage from "./pages/MyPage";      // 마이 페이지 추가

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 페이지가 로드될 때 localStorage에서 JWT 토큰을 확인
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);  // 토큰이 있으면 로그인 상태
        }
    }, []);

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={isLoggedIn ? <HomePage /> : <LoginPage />} />
                <Route path="/my-page" element={isLoggedIn ? <MyPage /> : <LoginPage />} />
            </Routes>
        </Router>
    );
}
