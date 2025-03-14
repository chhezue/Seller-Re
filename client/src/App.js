import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";  // 홈 페이지 추가
import MyPage from "./pages/MyPage";      // 마이 페이지 추가
import ProductUploadPage from "./pages/products/ProductUploadPage";
import ProductListPage from "./pages/products/ProductListPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import ProductEditPage from "./pages/products/ProductEditPage";

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

    useEffect(() => {
        const checkLoginStatus = () => {
            const accessToken = localStorage.getItem("accessToken");
            setIsLoggedIn(!!accessToken);
        };
        checkLoginStatus();

        window.addEventListener("storage", checkLoginStatus);
        return () => window.removeEventListener("storage", checkLoginStatus);
    }, []);

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/my-page" element={isLoggedIn ? <MyPage /> : <LoginPage />} />
                <Route path="/product/upload" element={isLoggedIn ? <ProductUploadPage /> : <LoginPage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/products/edit/:id" element={isLoggedIn ? <ProductEditPage /> : <LoginPage />} />
            </Routes>
        </Router>
    );
}
