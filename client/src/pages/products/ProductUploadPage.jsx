import React, {useState, useRef, useEffect} from "react";

export default function ProductUploadPage() {
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState("");
    const [tradeType, setTradeType] = useState("sale");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:9000/api/products/categories", { method: "GET" })
            .then(response => response.json())
            .then(data => setCategories(Array.isArray(data) ? data : [])) // 여기 수정
            .catch(error => {
                console.error("Error fetching categories:", error);
                setCategories([]);
            });
    }, []);


    const handleImageUpload = (e) => {
        if (images.length >= 5) return;
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) return;

        const newImages = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...newImages]);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">상품 등록</h2>

            {/* 카테고리 선택 */}
            <label className="block font-medium mb-2">카테고리 선택</label>
            <select className="w-full p-2 border rounded mb-4">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                    ))
                ) : (
                    <option>카테고리를 불러오는 중...</option>
                )}
            </select>

            {/* 상품명 입력 */}
            <label className="block font-medium mb-2">상품명</label>
            <input
                type="text"
                maxLength="40"
                placeholder="상품명을 입력해주세요"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            />

            {/* 거래 방식 선택 */}
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

            {/* 가격 입력 */}
            {tradeType === "sale" && (
                <input
                    type="number"
                    placeholder="가격을 입력해주세요"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
            )}

            {/* 상품 설명 */}
            <label className="block font-medium mb-2">상품 설명</label>
            <textarea
                maxLength="500"
                placeholder="상품을 설명해주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded mb-4 h-32"
            ></textarea>

            {/* 상품 이미지 */}
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

            {/* 등록/취소 버튼 */}
            <div className="flex justify-between mt-4">
                <button className="px-4 py-2 bg-gray-300 rounded">취소</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">등록</button>
            </div>
        </div>
    );
}