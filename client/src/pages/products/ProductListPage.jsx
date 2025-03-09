import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

export default function ProductListPage() {
    const navigate = useNavigate();
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
                ...(onlyFree && { transactionType: '나눔' }),
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
            <div className="flex space-x-4 mb-6">
                <select className="p-2 border rounded" value={selectedRegion} onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedSubRegion("");
                }}>
                    <option value="">지역 선택</option>
                    {Array.from(new Set(regions.map(region => region.level1)))
                        .map(level1 => (
                            <option key={level1} value={level1}>{level1}</option>
                        ))
                    }
                </select>
                <select 
                    className="p-2 border rounded" 
                    value={selectedSubRegion} 
                    onChange={(e) => setSelectedSubRegion(e.target.value)}
                >
                    <option value="">구/군 선택</option>
                    {regions
                        .filter(region => region.level1 === selectedRegion)
                        .map(region => (
                            <option key={region._id} value={region.level2}>
                                {region.level2}
                            </option>
                        ))
                    }
                </select>
                <select className="p-2 border rounded" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">카테고리 선택</option>
                    {categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                <label className="flex items-center">
                    <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} className="mr-2" />
                    나눔만
                </label>
                <button onClick={resetFilters} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">초기화</button>
            </div>
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