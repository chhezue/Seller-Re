import React, {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import ActionButtons from "../../components/ActionButtons";

export default function ProductUploadPage() {
    const [productId, setProductId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [tempCategory, setTempCategory] = useState(null);
    const [productName, setProductName] = useState("");
    const [tradeType, setTradeType] = useState("sale");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [hasConfirmedTempProduct, setHasConfirmedTempProduct] = useState(false);
    const [regions, setRegions] = useState([]);
    const [selectedLevel1, setSelectedLevel1] = useState("");
    const [selectedLevel2, setSelectedLevel2] = useState("");
    const [filteredLevel2, setFilteredLevel2] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 카테고리 데이터 로드
    useEffect(() => {
        fetch("http://localhost:9000/api/products/categories", {method: "GET"})
            .then((response) => response.json())
            .then((data) => {
                setCategories(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("카테고리 불러오기 실패:", error);
                setCategories([]);
                setIsLoading(false);
            });
    }, []);

    // 지역 데이터 로드
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

    // 지역 필터링
    useEffect(() => {
        if (selectedLevel1) {
            setFilteredLevel2(regions.filter(region => region.level1 === selectedLevel1));
        } else {
            setFilteredLevel2([]);
        }
    }, [selectedLevel1, regions]);

    // 임시 저장 글 불러오기
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token || hasConfirmedTempProduct) return;

        fetch("http://localhost:9000/api/products/temp", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === '임시 작성된 글이 없습니다.') {
                    return;
                }

                const userConfirmed = window.confirm("임시 저장된 글이 있습니다. 이어서 작성하시겠습니까?");

                if (userConfirmed) {
                    loadTempProduct(data);
                } else {
                    const deleteConfirmed = !window.confirm("임시 저장된 글이 삭제됩니다.");
                    if (deleteConfirmed) {
                        deleteTempProduct(token);
                    }
                }
                setHasConfirmedTempProduct(true);
            })
            .catch((error) => {
                console.error("임시 저장 글 불러오기 오류:", error);
            });
    }, []);

    // 임시 글 데이터 로드 함수
    const loadTempProduct = (data) => {
                    setProductName(data.name);
                    setTradeType(data.tradeType === "판매" ? "sale" : "free");
                    setPrice(data.price);
                    setDescription(data.description);
                    setProductId(data._id);

                    if (categories.length > 0) {
                        const categoryObj = categories.find(category => category.name === data.category);
                        setSelectedCategory(categoryObj ? categoryObj._id : "");
                    } else {
            setTempCategory(data.category);
                    }

                    if (data.fileUrls && Array.isArray(data.fileUrls)) {
                        const convertedUrls = data.fileUrls.map(convertGoogleDriveUrl);
                        setImagePreviews(convertedUrls);
                    }
    };

    // 임시 글 삭제 함수
    const deleteTempProduct = (token) => {
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
    };

    // 임시 카테고리 설정
    useEffect(() => {
        if (tempCategory && categories.length > 0) {
            const categoryObj = categories.find(category => category.name === tempCategory);
            if (categoryObj) {
                setSelectedCategory(categoryObj._id);
            }
            setTempCategory(null);
        }
    }, [tempCategory, categories]);

    // URL 변환 함수
    const convertGoogleDriveUrl = (url) => {
        const match = url.match(/id=([^&]+)/);
        return match ? `https://lh3.google.com/u/0/d/${match[1]}` : url;
    };

    // 이미지 파일 처리
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
                setImageFiles((prev) => [...prev, ...filesToProcess]);
            });
        }
    };

    const handleImageUpload = (event) => {
        handleImageFiles(event.target.files);
    };

    // 이미지 드래그 & 드롭 핸들러
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
            const match = imageToDelete.match(/\/d\/([^?]+)/);
            if (match) {
                setDeletedImages((prev) => [...prev, match[1]]);
            }
        } else {
            setImageFiles((prev) => prev.filter((_, i) => i !== index));
        }

        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (isTemporary = false) => {
        // 유효성 검사
        if (!selectedCategory) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        
        // 지역 선택 검사
        const selectedRegion = regions.find(region =>
            region.level1 === selectedLevel1 && region.level2 === selectedLevel2
        );

        if (!selectedRegion) {
            alert("올바른 지역을 선택하세요.");
            return;
        }

        // 폼 데이터 구성
        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("category", selectedCategory);
        formData.append("tradeType", tradeType);
        formData.append("price", tradeType === "sale" ? price : 0);
        formData.append("description", description);
        formData.append("isTemporary", isTemporary);
        formData.append("region", selectedRegion._id);

        // 이미지 파일 추가
        imageFiles.forEach((file) => formData.append("images", file));

        // 삭제된 이미지 추가
        if (deletedImages.length > 0) {
            formData.append("deletedImages", JSON.stringify(deletedImages));
        }

        // 임시저장 ID 추가
        if (productId) {
            formData.append("productId", productId);
        }

        // 토큰 확인
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // API 요청
            const response = await fetch("http://localhost:9000/api/products", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert(isTemporary ? "상품이 임시 저장되었습니다!" : "상품이 등록되었습니다!");
                navigate("/");
            } else {
                const errorData = await response.json();
                alert(`상품 저장 실패: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
            }
        } catch (error) {
            console.error("상품 등록 오류:", error);
            alert("상품 등록 중 오류가 발생했습니다.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">데이터를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-8 text-center">상품 등록</h2>
            
            <form className="space-y-8">
                <ProductForm 
                    categories={categories}
                    productName={productName}
                    setProductName={setProductName}
                    tradeType={tradeType}
                    setTradeType={setTradeType}
                    price={price}
                    setPrice={setPrice}
                    description={description}
                    setDescription={setDescription}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    regions={regions}
                    selectedLevel1={selectedLevel1}
                    setSelectedLevel1={setSelectedLevel1}
                    selectedLevel2={selectedLevel2}
                    setSelectedLevel2={setSelectedLevel2}
                    imagePreviews={imagePreviews}
                    setImagePreviews={setImagePreviews}
                    imageFiles={imageFiles}
                    setImageFiles={setImageFiles}
                    setDeletedImages={setDeletedImages}
                />

                <ActionButtons 
                    onCancel={() => navigate(-1)}
                    onSubmit={() => handleSubmit(false)}
                    onTemporarySave={() => handleSubmit(true)}
                    showTempSave={true}
                    submitText="등록"
                />
            </form>
        </div>
    );
}
