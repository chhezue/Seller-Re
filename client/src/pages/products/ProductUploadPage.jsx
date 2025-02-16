import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductUploadPage() {
    const [categories, setCategories] = useState([]); // 카테고리 상태
    const [productName, setProductName] = useState(""); // 상품명 상태
    const [tradeType, setTradeType] = useState("sale");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리
    const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기
    const [imageFiles, setImageFiles] = useState([]); // 이미지 파일 상태
    const [isDragging, setIsDragging] = useState(false); // 드래그 상태
    const [hasConfirmedTempProduct, setHasConfirmedTempProduct] = useState(false); // 확인 여부 상태
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // 뒤로가기 위한 navigate 사용

    // 카테고리 데이터를 API에서 불러오는 useEffect
    useEffect(() => {
        fetch("http://localhost:9000/api/products/categories", { method: "GET" })
            .then((response) => response.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch((error) => {
                console.error("카테고리 불러오기 실패:", error);
                setCategories([]);
            });
    }, []); // 빈 배열을 의존성으로 넣어 한 번만 호출되도록

    // 임시 저장된 글 확인
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token || hasConfirmedTempProduct) return; // 이미 확인한 경우 리턴

        // 임시 저장된 글 불러오기
        fetch("http://localhost:9000/api/products/temp", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    // 팝업이 한번만 뜨도록 확인
                    if (!hasConfirmedTempProduct) {
                        console.log(`Alert shown count: 1`); // 한번만 호출되도록 확인
                        const userConfirmed = window.confirm("임시 저장된 글이 있습니다. 이어서 작성하시겠습니까?");

                        if (userConfirmed) {
                            setProductName(data.name);
                            setSelectedCategory(data.category);
                            setTradeType(data.transactionType === "판매" ? "sale" : "free");
                            setPrice(data.price);
                            setDescription(data.description);
                            setImagePreviews(data.images || []);
                            setImageFiles(data.images || []);
                            setHasConfirmedTempProduct(true); // 상태 업데이트
                        } else {
                            fetch("http://localhost:9000/api/products/temp", {
                                method: "DELETE",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            })
                                .then((deleteResponse) => {
                                    if (deleteResponse.ok) {
                                        alert("임시 저장된 글이 삭제되었습니다.");
                                    } else {
                                        alert("임시 글 삭제 실패");
                                    }
                                })
                                .catch((error) => {
                                    console.error("임시 글 삭제 오류:", error);
                                });
                        }
                    }
                }
            })
            .catch((error) => {
                console.error("임시 저장 글 불러오기 오류:", error);
            });
    }, [hasConfirmedTempProduct]); // 의존성 배열에 hasConfirmedTempProduct만 넣어서 한 번만 실행되도록

    
    
    const handleImageFiles = (files) => {
        const fileArray = Array.from(files);
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
                setImageFiles((prev) => [...prev, ...filesToProcess]);
            });
        }
    };

    const handleImageUpload = (event) => {
        handleImageFiles(event.target.files);
    };

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
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert(isTemporary ? "상품이 임시 저장되었습니다!" : "상품이 등록되었습니다!");
                navigate("/"); // 상품 등록 후 메인 페이지로 이동
            } else {
                alert("상품 저장 실패");
            }
        } catch (error) {
            console.error("Error uploading product:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-6">상품 등록</h2>

            {/* 카테고리 선택 */}
            <label className="block text-gray-700 font-medium mb-2">카테고리 선택</label>
            <select
                className="w-full p-4 border rounded-lg mb-6"
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
                <button onClick={() => setTradeType("sale")}
                        className={`flex-1 py-3 rounded-lg text-lg ${tradeType === "sale" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>판매하기
                </button>
                <button onClick={() => setTradeType("free")}
                        className={`flex-1 py-3 rounded-lg text-lg ${tradeType === "free" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>나눔하기
                </button>
            </div>

            {/* 가격 입력 */}
            {tradeType === "sale" && (
                <div className="relative mb-6">
                    <input type="number" placeholder="가격을 입력해주세요" value={price}
                           onChange={(e) => setPrice(e.target.value)}
                           className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"/>
                    <span className="absolute right-4 top-3 text-gray-500 text-xl">원</span>
                </div>
            )}

            {/* 상품 설명 */}
            <label className="block text-gray-700 font-medium mb-2">상품 설명</label>
            <textarea maxLength="500" placeholder="상품을 설명해주세요" value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-4 border rounded-lg h-36 focus:ring-2 focus:ring-blue-500"></textarea>

            {/* 사진 업로드 */}
            <label className="block text-gray-700 font-medium mt-6 mb-2">사진 업로드</label>
            <div onClick={() => fileInputRef.current.click()}
                 className={`w-full h-56 border-2 border-dashed rounded-lg flex items-center justify-center ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden"
                       onChange={handleImageUpload}/>
                {imagePreviews.length ? imagePreviews.map((src, index) => <img key={index} src={src}
                                                                               className="w-24 h-24 object-cover rounded-lg mx-2"/>) :
                    <span>이미지를 업로드하세요</span>}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-4 mt-8">
                <button onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-300 rounded-lg text-lg">취소</button>
                <button onClick={(e) => handleSubmit(e, true)}
                        className="px-6 py-3 bg-yellow-500 text-white rounded-lg text-lg">임시 저장
                </button>
                <button onClick={(e) => handleSubmit(e, false)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg">등록
                </button>
            </div>
        </div>
    );
}
