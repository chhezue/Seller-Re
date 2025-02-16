import React, { useState, useRef, useEffect } from "react";

export default function ProductUploadPage() {
    const [categories, setCategories] = useState([]);
    const [productName, setProductName] = useState("");
    const [tradeType, setTradeType] = useState("sale");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:9000/api/products/categories")
            .then(response => response.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(error => {
                console.error("Error fetching categories:", error);
                setCategories([]);
            });
    }, []);

    // 이미지 파일을 읽어서 미리보기 생성 (최대 5장 제한)
    const handleImageFiles = (files) => {
        const fileArray = Array.from(files);
        const newPreviews = [];

        // 이미 5개 이상의 이미지가 업로드된 경우, 최대 5개만 추가
        const currentImagesCount = imagePreviews.length;
        const remainingSlots = 5 - currentImagesCount;

        if (remainingSlots > 0) {
            const filesToProcess = fileArray.slice(0, remainingSlots);

            const newImages = filesToProcess.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(newImages).then((images) => {
                setImagePreviews((prev) => [...prev, ...images]);
            });
        }
    };

    // 파일 선택 버튼 클릭 시 실행
    const handleImageUpload = (event) => {
        handleImageFiles(event.target.files);
    };

    // 드래그 앤 드롭 관련 이벤트 핸들러
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleImageFiles(event.dataTransfer.files);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-6">상품 등록</h2>

            {/* 상품명 입력 */}
            <label className="block text-gray-700 font-medium mb-2">상품명</label>
            <input
                type="text"
                maxLength="40"
                placeholder="상품명을 입력해주세요"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-4 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-500"
            />

            {/* 거래 방식 선택 */}
            <label className="block text-gray-700 font-medium mb-2">거래 방식</label>
            <div className="flex space-x-4 mb-6">
                <button
                    type="button"
                    className={`flex-1 py-3 rounded-lg text-center font-medium text-lg ${tradeType === "sale" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setTradeType("sale")}
                >
                    판매하기
                </button>
                <button
                    type="button"
                    className={`flex-1 py-3 rounded-lg text-center font-medium text-lg ${tradeType === "free" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setTradeType("free")}
                >
                    나눔하기
                </button>
            </div>

            {/* 가격 입력 (판매하기 선택 시만 노출) */}
            {tradeType === "sale" && (
                <div className="relative mb-6">
                    <input
                        type="number"
                        placeholder="가격을 입력해주세요"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                    />
                    <span className="absolute right-4 top-3 text-gray-500 text-xl">원</span>
                </div>
            )}

            {/* 상품 설명 입력 */}
            <label className="block text-gray-700 font-medium mb-2">상품 설명</label>
            <textarea
                maxLength="500"
                placeholder="상품을 설명해주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 border rounded-lg h-36 focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="text-right text-gray-500 text-sm mt-1">
                {description.length} / 500
            </div>

            {/* 📸 이미지 업로드 (드래그 앤 드롭 추가) */}
            <label className="block text-gray-700 font-medium mt-6 mb-2">사진 업로드</label>
            <div
                className={`w-full h-56 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {imagePreviews.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                        {imagePreviews.map((src, index) => (
                            <img key={index} src={src} alt={`미리보기 ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-400">클릭하거나 이미지를 드래그하여 업로드하세요</span>
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

            {/* 버튼 영역 */}
            <div className="flex justify-end space-x-4 mt-8">
                <button type="button" className="px-6 py-3 bg-gray-300 rounded-lg text-lg">취소</button>
                <button type="button" className="px-6 py-3 bg-yellow-500 text-white rounded-lg text-lg">임시 저장</button>
                <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg">등록</button>
            </div>
        </div>
    );
}
