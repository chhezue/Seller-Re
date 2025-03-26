import React from "react";
import RegionSelector from "./RegionSelector";
import ImageUploader from "./ImageUploader";

// 상품 정보 입력 폼
export default function ProductForm({
    categories,
    productName,
    setProductName,
    tradeType,
    setTradeType,
    price,
    setPrice,
    description,
    setDescription,
    selectedCategory,
    setSelectedCategory,
    regions,
    selectedLevel1,
    setSelectedLevel1,
    selectedLevel2,
    setSelectedLevel2,
    imagePreviews,
    setImagePreviews,
    imageFiles,
    setImageFiles,
    setDeletedImages
}) {
    return (
        <div className="space-y-8">
            {/* 상품 기본 정보 섹션 */}
            <section className="space-y-6">
                <h3 className="text-xl font-medium text-gray-800 pb-2 border-b">기본 정보</h3>

                {/* 카테고리 선택 */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">카테고리 선택</label>
                    <select
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="" disabled>카테고리를 선택해주세요</option>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))
                        ) : (
                            <option>카테고리 불러오는 중...</option>
                        )}
                    </select>
                </div>

                {/* 상품명 입력 */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">상품명</label>
                    <input
                        type="text"
                        maxLength="40"
                        placeholder="상품명을 입력해주세요"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                </div>
            </section>

            {/* 거래 정보 섹션 */}
            <section className="space-y-6">
                <h3 className="text-xl font-medium text-gray-800 pb-2 border-b">거래 정보</h3>

                {/* 거래 방식 선택 */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">거래 방식</label>
                    <div className="flex space-x-4">
                        <button type="button" onClick={() => setTradeType("sale")}
                                className={`flex-1 py-3 rounded-lg text-lg font-medium transition-all ${tradeType === "sale" ? "bg-blue-500 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"}`}>판매하기
                        </button>
                        <button type="button" onClick={() => setTradeType("free")}
                                className={`flex-1 py-3 rounded-lg text-lg font-medium transition-all ${tradeType === "free" ? "bg-blue-500 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"}`}>나눔하기
                        </button>
                    </div>
                </div>

                {/* 가격 입력 */}
                {tradeType === "sale" && (
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">가격</label>
                        <div className="relative">
                            <input type="number" placeholder="가격을 입력해주세요" value={price}
                                   onChange={(e) => setPrice(e.target.value)}
                                   className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 transition-all"/>
                            <span className="absolute right-4 top-3 text-gray-500 text-lg">원</span>
                        </div>
                    </div>
                )}

                {/* 지역 선택 */}
                <RegionSelector 
                    regions={regions}
                    selectedLevel1={selectedLevel1}
                    setSelectedLevel1={setSelectedLevel1}
                    selectedLevel2={selectedLevel2}
                    setSelectedLevel2={setSelectedLevel2}
                />
            </section>

            {/* 상품 설명 섹션 */}
            <section className="space-y-6">
                <h3 className="text-xl font-medium text-gray-800 pb-2 border-b">상품 설명</h3>
                
                {/* 설명 입력 */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">상품 설명</label>
                    <textarea 
                        maxLength="500" 
                        placeholder="상품을 자세히 설명해주세요. 구매자에게 도움이 되는 정보를 포함하면 좋습니다."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-4 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    ></textarea>
                    <p className="text-right text-sm text-gray-500 mt-1">{description.length}/500자</p>
                </div>
            </section>

            {/* 사진 업로드 섹션 */}
            <section className="space-y-6">
                <h3 className="text-xl font-medium text-gray-800 pb-2 border-b">상품 이미지</h3>
                
                <ImageUploader 
                    imagePreviews={imagePreviews}
                    setImagePreviews={setImagePreviews}
                    imageFiles={imageFiles}
                    setImageFiles={setImageFiles}
                    setDeletedImages={setDeletedImages}
                />
            </section>
        </div>
    );
} 