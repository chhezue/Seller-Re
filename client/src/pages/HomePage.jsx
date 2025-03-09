import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");  // 토큰 삭제
        navigate("/login");  // 로그인 페이지로 리디렉션
    };

    useEffect(() => {
        fetchLatestProducts();
        fetchPopularProducts();
    }, []);

    // 최신 상품 가져오기
    const fetchLatestProducts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:9000/api/products?page=1&limit=10&sort=latest");
            const data = await response.json();

            if (data.products && data.products.length > 0) {
                const filteredProducts = data.products.filter(product => product.status !== '삭제');
                setLatestProducts(filteredProducts);
            }
        } catch (error) {
            console.error("최신 상품 불러오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 인기 상품 가져오기 (좋아요 많은 순)
    const fetchPopularProducts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:9000/api/products?page=1&limit=10&sort=popular");
            const data = await response.json();

            if (data.products && data.products.length > 0) {
                const filteredProducts = data.products.filter(product => product.status !== '삭제');
                setPopularProducts(filteredProducts);
            }
        } catch (error) {
            console.error("인기 상품 불러오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const lastProductElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore]);

    return (
        <div className="max-w-6xl mx-auto p-8 font-pretendard">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800">샐러리: 중고거래 플랫폼</h1>
            </div>

            {/* 히어로 섹션 */}
            <div className="relative mb-12">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-10 text-white">
                    <h2 className="text-3xl font-bold mb-4">쉽고 빠른 중고거래 시작하기</h2>
                    <p className="text-xl mb-6">나에게 필요하지 않은 물건, 누군가에겐 소중한 보물이 될 수 있어요!</p>
                    <button 
                        onClick={() => navigate("/product/upload")}
                        className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                        상품 등록하기
                    </button>
                </div>
            </div>

            {/* 최신 상품 섹션 */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">최근 등록된 상품</h2>
                    <button 
                        // 단순히 상품 목록 페이지로 이동
                        onClick={() => navigate("/products")}
                        className="text-blue-500 hover:underline"
                    >
                        더보기 →
                    </button>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-xl font-medium text-gray-500">상품을 불러오는 중...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {latestProducts.map((product, index) => (
                            <ProductCard 
                                key={`latest-${product._id}`} 
                                product={product} 
                                refCallback={null} 
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* 인기 상품 섹션 */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">인기 상품</h2>
                    <button 
                        // 단순히 상품 목록 페이지로 이동
                        onClick={() => navigate("/products")}
                        className="text-blue-500 hover:underline"
                    >
                        더보기 →
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-xl font-medium text-gray-500">상품을 불러오는 중...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {popularProducts.map((product, index) => (
                            <ProductCard
                                key={`popular-${product._id}`}
                                product={product}
                                refCallback={null}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
