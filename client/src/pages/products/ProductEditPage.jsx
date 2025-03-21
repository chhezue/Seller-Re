// import React, {useState, useRef, useEffect} from "react";
// import {useNavigate, useParams} from "react-router-dom";
//
// export default function ProductEditPage() {
//     const { productId } = useParams();
//     const [categories, setCategories] = useState([]);
//     const [tempCategory, setTempCategory] = useState(null);
//     const [productName, setProductName] = useState("");
//     const [tradeType, setTradeType] = useState("sale");
//     const [price, setPrice] = useState("");
//     const [description, setDescription] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [imageFiles, setImageFiles] = useState([]);
//     const [deletedImages, setDeletedImages] = useState([]);
//     const [isDragging, setIsDragging] = useState(false);
//     const fileInputRef = useRef(null);
//     const navigate = useNavigate();
//     const [regions, setRegions] = useState([]);
//     const [selectedLevel1, setSelectedLevel1] = useState("");
//     const [selectedLevel2, setSelectedLevel2] = useState("");
//     const [filteredLevel2, setFilteredLevel2] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [originalData, setOriginalData] = useState(null);
//
//     // 카테고리 및 지역 데이터 로드
//     useEffect(() => {
//         const fetchInitialData = async () => {
//             try {
//                 const [categoriesResponse, regionsResponse] = await Promise.all([
//                     fetch("http://localhost:9000/api/products/categories", {method: "GET"}),
//                     fetch("http://localhost:9000/api/products/regions", {method: "GET"})
//                 ]);
//
//                 const categoriesData = await categoriesResponse.json();
//                 const regionsData = await regionsResponse.json();
//
//                 setCategories(Array.isArray(categoriesData) ? categoriesData : []);
//
//                 if (Array.isArray(regionsData)) {
//                     const formattedData = regionsData.map(region => ({
//                         _id: region._id?.$oid || region._id,
//                         level1: region.level1,
//                         level2: region.level2
//                     }));
//                     setRegions(formattedData);
//                 } else {
//                     setRegions([]);
//                 }
//
//                 // 이제 카테고리와 지역 데이터가 로드된 후에 상품 정보를 로드
//                 await loadProductData();
//             } catch (error) {
//                 console.error("초기 데이터 불러오기 실패:", error);
//                 setLoading(false);
//             }
//         };
//
//         fetchInitialData();
//     }, []);
//
//     // 상품 상세 정보 로드
//     const loadProductData = async () => {
//         if (!productId) {
//             setLoading(false);
//             return;
//         }
//
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//             alert("로그인이 필요합니다.");
//             navigate("/login");
//             return;
//         }
//
//         try {
//             // 상품 정보 불러오기
//             const response = await fetch(`http://localhost:9000/api/products/${productId}`, {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//
//             if (!response.ok) {
//                 throw new Error("상품 정보를 불러올 수 없습니다.");
//             }
//
//             const data = await response.json();
//             setOriginalData(data);
//
//             // 상품 정보 설정
//             setProductName(data.name || "");
//             setTradeType(data.transactionType === "판매" ? "sale" : "free");
//             setPrice(data.price || "");
//             setDescription(data.description || "");
//
//             // 카테고리 설정
//             if (categories.length > 0 && data.category) {
//                 const categoryObj = categories.find(category => category.name === data.category);
//                 if (categoryObj) {
//                     setSelectedCategory(categoryObj._id);
//                 } else {
//                     setTempCategory(data.category);
//                 }
//             }
//
//             // 이미지 설정
//             if (data.fileUrls && Array.isArray(data.fileUrls)) {
//                 const convertedUrls = data.fileUrls.map(convertGoogleDriveUrl);
//                 setImagePreviews(convertedUrls);
//             }
//
//             // 지역 설정
//             if (data.region) {
//                 const regionId = typeof data.region === 'object' ? data.region._id : data.region;
//                 const regionData = regions.find(r => r._id === regionId);
//
//                 if (regionData) {
//                     setSelectedLevel1(regionData.level1);
//                     setSelectedLevel2(regionData.level2);
//                 } else {
//                     // 지역 정보가 ID로만 제공된 경우 추가 요청으로 지역 정보를 가져옴
//                     try {
//                         const regionResponse = await fetch(`http://localhost:9000/api/products/regions/${regionId}`, {
//                             method: "GET",
//                             headers: { Authorization: `Bearer ${token}` }
//                         });
//
//                         if (regionResponse.ok) {
//                             const regionDetail = await regionResponse.json();
//                             setSelectedLevel1(regionDetail.level1);
//                             setSelectedLevel2(regionDetail.level2);
//                         }
//                     } catch (error) {
//                         console.error("지역 정보 로드 실패:", error);
//                     }
//                 }
//             }
//         } catch (error) {
//             console.error("상품 정보 불러오기 오류:", error);
//             alert(error.message);
//             navigate(-1);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // 지역 필터링
//     useEffect(() => {
//         if (selectedLevel1) {
//             setFilteredLevel2(regions.filter(region => region.level1 === selectedLevel1));
//         } else {
//             setFilteredLevel2([]);
//         }
//     }, [selectedLevel1, regions]);
//
//     // 임시 카테고리 설정
//     useEffect(() => {
//         if (tempCategory && categories.length > 0) {
//             const categoryObj = categories.find(category => category.name === tempCategory);
//             if (categoryObj) {
//                 setSelectedCategory(categoryObj._id);
//             }
//             setTempCategory(null);
//         }
//     }, [tempCategory, categories]);
//
//     // URL 변환 함수
//     const convertGoogleDriveUrl = (url) => {
//         const match = url.match(/id=([^&]+)/);
//         return match ? `https://lh3.google.com/u/0/d/${match[1]}` : url;
//     };
//
//     // 이미지 파일 처리
//     const handleImageFiles = (files) => {
//         const fileArray = Array.from(files);
//         const currentImagesCount = imagePreviews.length;
//         const remainingSlots = 5 - currentImagesCount;
//
//         if (remainingSlots > 0) {
//             const filesToProcess = fileArray.slice(0, remainingSlots);
//             const newImagePromises = filesToProcess.map((file) => {
//                 return new Promise((resolve) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => resolve(reader.result);
//                     reader.readAsDataURL(file);
//                 });
//             });
//
//             Promise.all(newImagePromises).then((images) => {
//                 setImagePreviews((prev) => [...prev, ...images]);
//                 setImageFiles((prev) => [...prev, ...filesToProcess]);
//             });
//         }
//     };
//
//     const handleImageUpload = (event) => {
//         handleImageFiles(event.target.files);
//     };
//
//     // 이미지 드래그 & 드롭 핸들러
//     const handleDragOver = (event) => {
//         event.preventDefault();
//         setIsDragging(true);
//     };
//
//     const handleDragLeave = () => {
//         setIsDragging(false);
//     };
//
//     const handleDrop = (event) => {
//         event.preventDefault();
//         setIsDragging(false);
//         handleImageFiles(event.dataTransfer.files);
//     };
//
//     // 이미지 삭제 핸들러
//     const handleImageDelete = (index) => {
//         const imageToDelete = imagePreviews[index];
//
//         if (typeof imageToDelete === "string" && imageToDelete.startsWith("https://lh3.google.com/u/0/d/")) {
//             const match = imageToDelete.match(/\/d\/([^?]+)/);
//             if (match) {
//                 setDeletedImages((prev) => [...prev, match[1]]);
//             }
//         } else {
//             setImageFiles((prev) => prev.filter((_, i) => i !== index));
//         }
//
//         setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//     };
//
//     // 폼 제출 핸들러
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         // 유효성 검사
//         if (!selectedCategory) {
//             alert("카테고리를 선택해주세요.");
//             return;
//         }
//
//         // 지역 선택 검사
//         const selectedRegion = regions.find(region =>
//             region.level1 === selectedLevel1 && region.level2 === selectedLevel2
//         );
//
//         if (!selectedRegion) {
//             alert("올바른 지역을 선택하세요.");
//             return;
//         }
//
//         // 변경된 필드만 포함하는 객체 생성
//         const formData = new FormData();
//
//         // 원본 데이터와 비교하여 변경된 필드만 추가
//         if (productName !== originalData.name)
//         formData.append("productName", productName);
//
//         if (selectedCategory !== (categories.find(c => c.name === originalData.category)?._id))
//         formData.append("category", selectedCategory);
//
//         const originalTradeType = originalData.transactionType === "판매" ? "sale" : "free";
//         if (tradeType !== originalTradeType)
//         formData.append("tradeType", tradeType);
//
//         if (tradeType === "sale" && price !== originalData.price)
//             formData.append("price", price);
//         else if (tradeType === "free")
//             formData.append("price", "0");
//
//         if (description !== originalData.description)
//         formData.append("description", description);
//
//         // 지역 정보는 항상 포함 (비교 복잡)
//         formData.append("region", selectedRegion._id);
//
//         // 상품 ID 추가
//         formData.append("productId", productId);
//
//         // 새로 추가된 이미지 파일 추가
//         if (imageFiles.length > 0) {
//         imageFiles.forEach((file) => formData.append("images", file));
//         }
//
//         // 삭제된 이미지 추가
//         if (deletedImages.length > 0) {
//             formData.append("deletedImages", JSON.stringify(deletedImages));
//         }
//
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//             alert("로그인이 필요합니다.");
//             return;
//         }
//
//         try {
//             // PATCH 요청으로 변경
//             const response = await fetch(`http://localhost:9000/api/products/${productId}`, {
//                 method: "PATCH",
//                 body: formData,
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//
//             if (response.ok) {
//                 alert("상품이 성공적으로 수정되었습니다!");
//                 navigate(`/products/${productId}`);
//             } else {
//                 const errorData = await response.json();
//                 alert(`상품 수정 실패: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
//             }
//         } catch (error) {
//             console.error("상품 수정 오류:", error);
//             alert("상품 수정 중 오류가 발생했습니다.");
//         }
//     };
//
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="text-xl">상품 정보를 불러오는 중...</div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
//             <h2 className="text-3xl font-semibold mb-8 text-center">상품 수정</h2>
//
//             <form className="space-y-8">
//                 {/* 상품 기본 정보 섹션 */}
//                 <section className="space-y-6">
//                     <h3 className="text-xl font-medium text-gray-800 pb-2 border-b">기본 정보</h3>
//
//             {/* 카테고리 선택 */}
//                     <div>
//             <label className="block text-gray-700 font-medium mb-2">카테고리 선택</label>
//             <select
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//                 <option value="" disabled>카테고리를 선택해주세요</option>
//                 {categories.length > 0 ? (
//                     categories.map((category) => (
//                         <option key={category._id} value={category._id}>{category.name}</option>
//                     ))
//                 ) : (
//                     <option>카테고리 불러오는 중...</option>
//                 )}
//             </select>
//                     </div>
//
//             {/* 상품명 입력 */}
//                     <div>
//             <label className="block text-gray-700 font-medium mb-2">상품명</label>
//             <input
//                 type="text"
//                 maxLength="40"
//                 placeholder="상품명을 입력해주세요"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                         />
//                     </div>
//                 </section>
//
//                 {/* 거래 정보 섹션 */}
//                 <section className="space-y-6">
//                     <h3 className="text-xl font-medium text-gray-800 pb-2 border-b">거래 정보</h3>
//
//             {/* 거래 방식 선택 */}
//                     <div>
//             <label className="block text-gray-700 font-medium mb-2">거래 방식</label>
//                         <div className="flex space-x-4">
//                             <button type="button" onClick={() => setTradeType("sale")}
//                                     className={`flex-1 py-3 rounded-lg text-lg font-medium transition-all ${tradeType === "sale" ? "bg-blue-500 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"}`}>판매하기
//                 </button>
//                             <button type="button" onClick={() => setTradeType("free")}
//                                     className={`flex-1 py-3 rounded-lg text-lg font-medium transition-all ${tradeType === "free" ? "bg-blue-500 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"}`}>나눔하기
//                 </button>
//                         </div>
//             </div>
//
//             {/* 가격 입력 */}
//             {tradeType === "sale" && (
//                         <div>
//                             <label className="block text-gray-700 font-medium mb-2">가격</label>
//                             <div className="relative">
//                     <input type="number" placeholder="가격을 입력해주세요" value={price}
//                            onChange={(e) => setPrice(e.target.value)}
//                                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 transition-all"/>
//                                 <span className="absolute right-4 top-3 text-gray-500 text-lg">원</span>
//                             </div>
//                 </div>
//             )}
//
//             {/* 지역 선택 */}
//                     <div>
//                         <label className="block text-gray-700 font-medium mb-2">거래 지역</label>
//                         <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
//                             <div className="mb-4">
//                                 <label className="block text-gray-700 font-medium mb-2">시/도 선택:</label>
//                 <select
//                     onChange={(e) => setSelectedLevel1(e.target.value)}
//                     value={selectedLevel1}
//                                     className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                 >
//                     <option value="">선택하세요</option>
//                     {[...new Set(regions.map(region => region.level1))].map(level1 => (
//                         <option key={level1} value={level1}>{level1}</option>
//                     ))}
//                 </select>
//                             </div>
//
//                 {selectedLevel1 && (
//                                 <div>
//                                     <label className="block text-gray-700 font-medium mb-2">구/군 선택:</label>
//                         <select
//                             onChange={(e) => setSelectedLevel2(e.target.value)}
//                             value={selectedLevel2}
//                                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                         >
//                             <option value="">선택하세요</option>
//                             {filteredLevel2.map(region => (
//                                 <option key={region._id} value={region.level2}>{region.level2}</option>
//                             ))}
//                         </select>
//                     </div>
//                 )}
//             </div>
//                     </div>
//                 </section>
//
//                 {/* 상품 설명 섹션 */}
//                 <section className="space-y-6">
//                     <h3 className="text-xl font-medium text-gray-800 pb-2 border-b">상품 설명</h3>
//
//                     {/* 설명 입력 */}
//                     <div>
//                         <label className="block text-gray-700 font-medium mb-2">상품 설명</label>
//                         <textarea
//                             maxLength="500"
//                             placeholder="상품을 자세히 설명해주세요. 구매자에게 도움이 되는 정보를 포함하면 좋습니다."
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             className="w-full p-4 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                         ></textarea>
//                         <p className="text-right text-sm text-gray-500 mt-1">{description.length}/500자</p>
//                     </div>
//                 </section>
//
//                 {/* 사진 업로드 섹션 */}
//                 <section className="space-y-6">
//                     <h3 className="text-xl font-medium text-gray-800 pb-2 border-b">상품 이미지</h3>
//
//                     <div>
//                         <label className="block text-gray-700 font-medium mb-2">사진 업로드 (최대 5장)</label>
//                         <p className="text-sm text-gray-500 mb-3">상품 이미지를 등록해주세요. 드래그하여 한 번에 여러 이미지를 업로드할 수 있습니다.</p>
//                         <div
//                             className={`w-full h-56 border-2 border-dashed rounded-lg flex flex-wrap items-center justify-center cursor-pointer transition-all ${
//                                 isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
//                 }`}
//                 onClick={() => fileInputRef.current.click()}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//             >
//                 <input
//                     type="file"
//                     ref={fileInputRef}
//                     accept="image/*"
//                     multiple
//                     className="hidden"
//                     onChange={handleImageUpload}
//                 />
//
//                 {imagePreviews.length ? (
//                                 <div className="flex flex-wrap justify-center gap-3 p-4 w-full">
//                                     {imagePreviews.map((src, index) => (
//                                         <div key={index} className="relative w-24 h-24">
//                             <img
//                                 src={src}
//                                 alt={`Uploaded ${index}`}
//                                                 className="w-full h-full object-cover rounded-lg shadow-sm"
//                             />
//                             <button
//                                 type="button"
//                                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition-colors"
//                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                     handleImageDelete(index);
//                                 }}
//                             >
//                                 ✕
//                             </button>
//                         </div>
//                                     ))}
//                                     {imagePreviews.length < 5 && (
//                                         <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
//                                             +
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <div className="text-center">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                                     </svg>
//                                     <p className="mt-2 text-gray-500">이미지를 업로드하세요</p>
//                                     <p className="text-sm text-gray-400">클릭하거나 이미지를 끌어다 놓으세요</p>
//                                 </div>
//                 )}
//             </div>
//                         <p className="text-right text-sm text-gray-500 mt-1">{imagePreviews.length}/5장</p>
//                     </div>
//                 </section>
//
//                 {/* 버튼 그룹 */}
//                 <div className="flex justify-end space-x-4 mt-10">
//                     <button type="button" onClick={() => navigate(-1)}
//                             className="px-6 py-3 bg-gray-300 rounded-lg text-lg hover:bg-gray-400 transition-colors">
//                         취소
//                 </button>
//                     <button type="button" onClick={handleSubmit}
//                             className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition-colors">
//                         수정 완료
//                 </button>
//             </div>
//             </form>
//         </div>
//     );
// }
