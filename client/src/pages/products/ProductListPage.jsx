import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import ProductFilter from "../../components/ProductFilter";

export default function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedSubRegion, setSelectedSubRegion] = useState("");
    const [onlyFree, setOnlyFree] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        fetchCategories();
        fetchRegions();
    }, []);

    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        fetchProducts();
    }, [selectedCategory, selectedRegion, selectedSubRegion, onlyFree]);

    useEffect(() => {
        if (hasMore) {
            fetchProducts();
        }
    }, [page]);

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:9000/api/products/categories");
            const data = await response.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("카테고리 불러오기 실패:", error);
        }
    };

    const fetchRegions = async () => {
        try {
            const response = await fetch("http://localhost:9000/api/products/regions");
            const data = await response.json();
            setRegions(data);
        } catch (error) {
            console.error("지역 불러오기 실패:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const query = new URLSearchParams({
                ...(selectedCategory && { category: selectedCategory }),
                ...(selectedRegion && { level1: selectedRegion }),
                ...(selectedSubRegion && { level2: selectedSubRegion }),
                ...(onlyFree && { tradeType: '나눔' }),
                page: page.toString(),
                limit: '20',
            });

            const response = await fetch(`http://localhost:9000/api/products?${query}`);
            const data = await response.json();

            if (!data.products || data.products.length === 0) {
                setHasMore(false);
                console.log("더이상 로드할 상품이 없습니다.");
            } else {
                console.log("로드된 상품:", data.products);
                const filteredNewProducts = data.products.filter(product => product.status !== '삭제');
                setProducts(prevProducts => {
                    return page === 1 ? filteredNewProducts : [...prevProducts, ...filteredNewProducts];
                });
            }
        } catch (error) {
            console.error("상품 불러오기 실패:", error);
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

    const resetFilters = () => {
        setSelectedCategory("");
        setSelectedRegion("");
        setSelectedSubRegion("");
        setOnlyFree(false);
        setPage(1);
        setHasMore(true);
        setProducts([]);
        fetchProducts(); // 필터 초기화 후 상품 목록 다시 불러오기
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h2 className="text-3xl font-semibold mb-6">상품 목록</h2>
            
            <ProductFilter 
                categories={categories}
                regions={regions}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                selectedSubRegion={selectedSubRegion}
                setSelectedSubRegion={setSelectedSubRegion}
                onlyFree={onlyFree}
                setOnlyFree={setOnlyFree}
                resetFilters={resetFilters}
            />
            
            <div className="grid grid-cols-5 gap-4">
                {products.map((product, index) => {
                    const refCallback = index === products.length - 1 ? lastProductElementRef : null;
                    return (
                        <ProductCard 
                            key={`${product._id}-${index}`} 
                            product={product} 
                            refCallback={refCallback} 
                        />
                    );
                })}
            </div>
        </div>
    );
}