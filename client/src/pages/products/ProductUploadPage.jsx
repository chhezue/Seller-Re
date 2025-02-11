import React, { useState, useRef } from "react";

const categories = [
    "디지털기기", "생활가전", "가구/인테리어", "생활/주방", "유아동", "유아도서",
    "여성의류", "여성잡화", "남성패션/잡화", "뷰티/미용", "스포츠/레저", "식물",
    "취미/게임/음반", "도서", "티켓/교환권", "가공식품", "건강기능식품", "반려동물식품", "기타 중고물품"
];

export default function ProductUploadPage() {
    const [productName, setProductName] = useState("");
    const [tradeType, setTradeType] = useState("sale");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        if (images.length >= 5) return;
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) return;

        const newImages = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setShowModal(true);
    };

    const handleDeleteImage = () => {
        setImages((prev) => prev.filter((_, i) => i !== selectedImageIndex));
        setShowModal(false);
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">상품 등록</h2>

            <label className="block mb-2">카테고리 선택</label>
            <select className="w-full p-2 border rounded mb-4">
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <label className="block mb-2">상품명</label>
            <input
                type="text"
                maxLength="40"
                placeholder="상품명을 입력해주세요"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            />

            <label className="block mb-2">거래 방식</label>
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

            <label className="block mb-2">상품 설명</label>
            <textarea
                maxLength="500"
                placeholder="상품을 설명해주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded mb-4 h-32"
            ></textarea>

            <label className="block mb-2">상품 이미지 (최대 5개)</label>
            <div className="flex space-x-2 mb-4">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt="상품 이미지"
                        className="w-20 h-20 object-cover rounded cursor-pointer"
                        onClick={() => handleImageClick(index)}
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

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md">
                        <p>이미지를 삭제하시겠습니까?</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={handleDeleteImage} className="px-4 py-2 bg-red-500 text-white rounded">Yes</button>
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
