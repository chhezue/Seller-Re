import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";  // 홈 페이지 추가
import MyPage from "./pages/MyPage";      // 마이 페이지 추가
import ProductUploadPage from "./pages/products/ProductUploadPage";

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("accessToken"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={isLoggedIn ? <HomePage /> : <LoginPage />} />
                <Route path="/my-page" element={isLoggedIn ? <MyPage /> : <LoginPage />} />
                <Route path="/product/upload" element={isLoggedIn ? <ProductUploadPage /> : <LoginPage />} />
            </Routes>
        </Router>
    );
}
