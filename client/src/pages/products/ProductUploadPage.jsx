import React, { useState, useRef, useEffect } from "react";

export default function ProductUploadPage() {
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState(""); // 상품명 상태
    const [tradeType, setTradeType] = useState("sale");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리
    const [images, setImages] = useState([]); // 미리보기 URL
    const [imageFiles, setImageFiles] = useState([]); // 실제 파일 저장
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:9000/api/products/categories", { method: "GET" })
            .then(response => response.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(error => {
                console.error("Error fetching categories:", error);
                setCategories([]);
            });
    }, []);

    const handleImageUpload = (e) => {
        if (imageFiles.length >= 5) return;
        const files = Array.from(e.target.files);
        if (files.length + imageFiles.length > 5) return;

        const newImages = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...newImages]);
        setImageFiles((prev) => [...prev, ...files]); // 실제 파일 저장
    };

    const handleSubmit = async (e, isTemporary = false) => {
        e.preventDefault();

        if (!selectedCategory) {
            alert("카테고리를 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("category", selectedCategory);
        formData.append("tradeType", tradeType);
        formData.append("price", tradeType === "sale" ? price : 0);
        formData.append("description", description);
        formData.append("isTemporary", isTemporary); // 임시 저장 여부 추가

        imageFiles.forEach((file) => formData.append("images", file));

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인 토큰이 없습니다.");
            return;
        }

        try {
            const response = await fetch("http://localhost:9000/api/products", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (response.ok) {
                alert(isTemporary ? "상품이 임시 저장되었습니다!" : "상품이 등록되었습니다!");
            } else {
                alert("상품 저장 실패");
            }
        } catch (error) {
            console.error("Error uploading product:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">상품 등록</h2>

            <form onSubmit={(e) => handleSubmit(e, false)}>
                <label className="block font-medium mb-2">카테고리 선택</label>
                <select
                    className="w-full p-2 border rounded mb-4"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="" disabled>카테고리를 선택해주세요</option>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))
                    ) : (
                        <option>카테고리를 불러오는 중...</option>
                    )}
                </select>

                <label className="block font-medium mb-2">상품명</label>
                <input
                    type="text"
                    maxLength="40"
                    placeholder="상품명을 입력해주세요"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />

                <label className="block font-medium mb-2">거래 방식</label>
                <div className="flex mb-4">
                    <label className="mr-4">
                        <input
                            type="radio"
                            value="sale"
                            checked={tradeType === "sale"}
                            onChange={() => setTradeType("sale")}
                        /> 판매하기
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="free"
                            checked={tradeType === "free"}
                            onChange={() => setTradeType("free")}
                        /> 나눔하기
                    </label>
                </div>

                {tradeType === "sale" && (
                    <input
                        type="number"
                        placeholder="가격을 입력해주세요"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />
                )}

                <label className="block font-medium mb-2">상품 설명</label>
                <textarea
                    maxLength="500"
                    placeholder="상품을 설명해주세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded mb-4 h-32"
                ></textarea>

                <label className="block font-medium mb-2">상품 이미지 (최대 5개)</label>
                <div className="flex space-x-2 mb-4">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt="상품 이미지"
                            className="w-20 h-20 object-cover rounded cursor-pointer"
                        />
                    ))}
                    {images.length < 5 && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="w-20 h-20 flex items-center justify-center border rounded"
                        >
                            +
                        </button>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                />

                <div className="flex justify-between mt-4">
                    <button type="button" className="px-4 py-2 bg-gray-300 rounded">취소</button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, true)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                    >
                        임시 저장
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">등록</button>
                </div>
            </form>
        </div>
    );
}
