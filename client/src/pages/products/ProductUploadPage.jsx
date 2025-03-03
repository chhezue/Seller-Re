import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function ProductUploadPage() {
    const [productId, setProductId] = useState(null);
    const [categories, setCategories] = useState([]); // 카테고리 상태
    const [tempCategory, setTempCategory] = useState(null);
    const [productName, setProductName] = useState(""); // 상품명 상태
    const [tradeType, setTradeType] = useState("sale");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 카테고리
    const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기
    const [imageFiles, setImageFiles] = useState([]); // 이미지 파일 상태
    const [deletedImages, setDeletedImages] = useState([]); // 삭제된 이미지 저장
    const [isDragging, setIsDragging] = useState(false); // 드래그 상태
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // 뒤로가기 위한 navigate 사용
    const [hasConfirmedTempProduct, setHasConfirmedTempProduct] = useState(false); // 확인 여부 상태
    const [regions, setRegions] = useState([]);
    const [selectedLevel1, setSelectedLevel1] = useState("");
    const [selectedLevel2, setSelectedLevel2] = useState("");
    const [filteredLevel2, setFilteredLevel2] = useState([]);

    // 카테고리 데이터를 API에서 불러오는 useEffect
    useEffect(() => {
        fetch("http://localhost:9000/api/products/categories", {method: "GET"})
            .then((response) => response.json())
            .then((data) => setCategories(Array.isArray(data) ? data : []))
            .catch((error) => {
                console.error("카테고리 불러오기 실패:", error);
                setCategories([]);
            });
    }, []); // 빈 배열을 의존성으로 넣어 한 번만 호출되도록

    // 지역 데이터를 API에서 불러오는 useEffect
    useEffect(() => {
        fetch("http://localhost:9000/api/products/regions", {method: "GET"})
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const formattedData = data.map(region => ({
                        _id: region._id?.$oid || region._id,
                        level1: region.level1,
                        level2: region.level2
                    }));
                    setRegions(formattedData);
                } else {
                    setRegions([]);
                }
            })
            .catch((error) => {
                console.error("지역 데이터 불러오기 실패:", error);
                setRegions([]);
            });
    }, []);

    useEffect(() => {
        if (selectedLevel1) {
            setFilteredLevel2(regions.filter(region => region.level1 === selectedLevel1));
        } else {
            setFilteredLevel2([]);
        }
    }, [selectedLevel1, regions]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token || hasConfirmedTempProduct) return; // 이미 확인한 경우 리턴

        fetch("http://localhost:9000/api/products/temp", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === '임시 작성된 글이 없습니다.') {
                    //임시 저장된 글이 없는 경우
                    return;
                }
                // Alert를 한번만 띄우도록
                let userConfirmed = window.confirm("임시 저장된 글이 있습니다. 이어서 작성하시겠습니까?");

                if (!userConfirmed) {
                    userConfirmed = window.confirm("임시 저장된 글이 삭제됩니다.");
                    userConfirmed = !userConfirmed;
                }

                if (userConfirmed) {
                    setProductName(data.name);

                    setTradeType(data.transactionType === "판매" ? "sale" : "free");
                    setPrice(data.price);
                    setDescription(data.description);
                    setProductId(data._id);

                    if (categories.length > 0) {
                        const categoryObj = categories.find(category => category.name === data.category);
                        setSelectedCategory(categoryObj ? categoryObj._id : "");
                    } else {
                        setTempCategory(data.category); // 후속 업데이트를 위해 저장
                    }

                    // Google Drive 링크 변환 후 미리보기로 추가
                    if (data.fileUrls && Array.isArray(data.fileUrls)) {
                        console.log(data.fileUrls);
                        const convertedUrls = data.fileUrls.map(convertGoogleDriveUrl);
                        setImagePreviews(convertedUrls);
                        console.log("Updated imagePreviews:", convertedUrls);
                    }
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
                setHasConfirmedTempProduct(true); // 확인 후 상태 변경
            })
            .catch((error) => {
                console.error("임시 저장 글 불러오기 오류:", error);
            });
    }, []);

    useEffect(() => {
        if (tempCategory && categories.length > 0) {
            // console.log("Checking category selection...");
            // console.log("tempCategory:", tempCategory);
            // console.log("categories:", categories.map(c => c.name)); // 카테고리 목록 확인

            const categoryObj = categories.find(category => category.name === tempCategory);

            if (categoryObj) {
                // console.log("Found category:", categoryObj);
                setSelectedCategory(categoryObj._id);
            } else {
                // console.warn("Category not found! tempCategory remains:", tempCategory);
            }

            setTempCategory(null); // 이후 불필요한 실행 방지
        }
    }, [tempCategory, categories]); // tempCategory가 변경될 때도 실행

    const convertGoogleDriveUrl = (url) => {
        const match = url.match(/id=([^&]+)/);
        console.log('match : ', match);
        // return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
        return match ? `https://lh3.google.com/u/0/d/${match[1]}` : url;
    };

    // // imagePreviews 변경 시 로그 찍기
    // useEffect(() => {
    //     console.log("Updated imagePreviews:", imagePreviews);
    //     console.log("ImagePreviews length:", imagePreviews.length);
    // }, [imagePreviews]);

    const handleImageFiles = (files) => {
        const fileArray = Array.from(files);
        const currentImagesCount = imagePreviews.length;
        const remainingSlots = 5 - currentImagesCount;

        if (remainingSlots > 0) {
            const filesToProcess = fileArray.slice(0, remainingSlots);
            const newImagePromises = filesToProcess.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(newImagePromises).then((images) => {
                setImagePreviews((prev) => [...prev, ...images]);
                setImageFiles((prev) => [...prev, ...filesToProcess]); // File 객체 저장
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

    // 이미지 삭제 핸들러
    const handleImageDelete = (index) => {
        const imageToDelete = imagePreviews[index];

        if (typeof imageToDelete === "string" && imageToDelete.startsWith("https://lh3.google.com/u/0/d/")) {
            // 기존에 등록된 Google Drive 이미지인 경우 → 삭제할 이미지 ID 저장
            const match = imageToDelete.match(/\/d\/([^?]+)/);
            if (match) {
                setDeletedImages((prev) => [...prev, match[1]]);
            }
        } else {
            // 새로 추가된 이미지 삭제 → imageFiles에서도 제거
            setImageFiles((prev) => prev.filter((_, i) => i !== index));
        }

        // 미리보기에서 삭제
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };


    const handleSubmit = async (e, isTemporary = false) => {
        e.preventDefault();

        if (!selectedCategory) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        // 선택한 level1과 level2를 가진 지역 찾기
        const selectedRegion = regions.find(region =>
            region.level1 === selectedLevel1 && region.level2 === selectedLevel2
        );

        if (!selectedRegion) {
            alert("올바른 지역을 선택하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("category", selectedCategory);
        formData.append("tradeType", tradeType);
        formData.append("price", tradeType === "sale" ? price : 0);
        formData.append("description", description);
        formData.append("isTemporary", isTemporary); // 임시 저장 여부 추가
        formData.append("region", selectedRegion._id);

        imageFiles.forEach((file) => formData.append("images", file));

        //기존 이미지 중 삭제된 이미지만 전송
        if (deletedImages.length > 0) {
            formData.append("deletedImages", JSON.stringify(deletedImages));
        }

        //임시저장글 불러온 경우 product._id 를 가지고 있음
        if (productId) {
            formData.append("productId", productId);
        }

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

            {/* 지역 선택 */}
            <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">지역 선택</h2>

                <label className="text-gray-700 font-medium mb-2">시/도 선택:</label>
                <select
                    onChange={(e) => setSelectedLevel1(e.target.value)}
                    value={selectedLevel1}
                    className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">선택하세요</option>
                    {[...new Set(regions.map(region => region.level1))].map(level1 => (
                        <option key={level1} value={level1}>{level1}</option>
                    ))}
                </select>

                {selectedLevel1 && (
                    <div className="w-full">
                        <label className="text-gray-700 font-medium mb-2">구/군 선택:</label>
                        <select
                            onChange={(e) => setSelectedLevel2(e.target.value)}
                            value={selectedLevel2}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">선택하세요</option>
                            {filteredLevel2.map(region => (
                                <option key={region._id} value={region.level2}>{region.level2}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* 사진 업로드 */}
            <label className="block text-gray-700 font-medium mb-2">사진 업로드</label>
            <div
                className={`w-full h-56 border-2 border-dashed rounded-lg flex flex-wrap items-center justify-center relative ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                />

                {imagePreviews.length ? (
                    imagePreviews.map((src, index) => (
                        <div key={index} className="relative w-24 h-24 mx-2">
                            <img
                                src={src}
                                alt={`Uploaded ${index}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                onClick={(e) => {
                                    e.stopPropagation(); // 클릭 이벤트가 상위 div로 전달되지 않도록 방지
                                    handleImageDelete(index);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))
                ) : (
                    <span>이미지를 업로드하세요</span>
                )}
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

            {/*/!* test *!/*/}
            {/*<div>*/}
            {/*    /!* 403 forbidden *!/*/}
            {/*    <img src={'https://drive.google.com/uc?id=1-vKmLYKJyNs3D7FqDCRfD2PFUkb6aS0n'} alt="Google Drive Image"/>*/}
            {/*    <img src={'https://drive.google.com/uc?export=view&id=1-vKmLYKJyNs3D7FqDCRfD2PFUkb6aS0n'} alt="Google Drive Image"/>*/}
            {/*    /!* 302 Found *!/*/}
            {/*    <img src={'https://lh3.google.com/u/0/d/119a88yF-U0E74S63cMtzKaPGPDhtKrm4=w1610-h992-iv1'} alt="Google Drive Image"/>*/}
            {/*    <img src={'https://lh3.googleusercontent.com/d/1jnnrhKtAWPAF1ceRmGGHzgtS0OajdSJ0'} alt="Google Drive Image" />*/}

            {/*</div>*/}
        </div>
    );
}
