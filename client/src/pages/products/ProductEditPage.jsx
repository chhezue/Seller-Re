import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import ActionButtons from "../../components/ActionButtons";

export default function ProductEditPage() {
    const { productId } = useParams();
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
    const navigate = useNavigate();
    const [regions, setRegions] = useState([]);
    const [selectedLevel1, setSelectedLevel1] = useState("");
    const [selectedLevel2, setSelectedLevel2] = useState("");
    const [loading, setLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null);

    // 카테고리 및 지역 데이터 로드
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [categoriesResponse, regionsResponse] = await Promise.all([
                    fetch("http://localhost:9000/api/products/categories", {method: "GET"}),
                    fetch("http://localhost:9000/api/products/regions", {method: "GET"})
                ]);

                const categoriesData = await categoriesResponse.json();
                const regionsData = await regionsResponse.json();

                setCategories(Array.isArray(categoriesData) ? categoriesData : []);

                if (Array.isArray(regionsData)) {
                    const formattedData = regionsData.map(region => ({
                        _id: region._id?.$oid || region._id,
                        level1: region.level1,
                        level2: region.level2
                    }));
                    setRegions(formattedData);
                } else {
                    setRegions([]);
                }

                // 이제 카테고리와 지역 데이터가 로드된 후에 상품 정보를 로드
                await loadProductData();
            } catch (error) {
                console.error("초기 데이터 불러오기 실패:", error);
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // 상품 상세 정보 로드
    const loadProductData = async () => {
        if (!productId) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        try {
            // 상품 정보 불러오기
            const response = await fetch(`http://localhost:9000/api/products/${productId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("상품 정보를 불러올 수 없습니다.");
            }

            const data = await response.json();
            setOriginalData(data);

            // 상품 정보 설정
            setProductName(data.name || "");
            setTradeType(data.tradeType === "판매" ? "sale" : "free");
            setPrice(data.price || "");
            setDescription(data.description || "");

            // 카테고리 설정
            if (categories.length > 0 && data.category) {
                const categoryObj = categories.find(category => category.name === data.category);
                if (categoryObj) {
                    setSelectedCategory(categoryObj._id);
                } else {
                    setTempCategory(data.category);
                }
            }

            // 이미지 설정
            if (data.fileUrls && Array.isArray(data.fileUrls)) {
                const convertedUrls = data.fileUrls.map(convertGoogleDriveUrl);
                setImagePreviews(convertedUrls);
            }

            // 지역 설정
            if (data.region) {
                const regionId = typeof data.region === 'object' ? data.region._id : data.region;
                const regionData = regions.find(r => r._id === regionId);

                if (regionData) {
                    setSelectedLevel1(regionData.level1);
                    setSelectedLevel2(regionData.level2);
                } else {
                    // 지역 정보가 ID로만 제공된 경우 추가 요청으로 지역 정보를 가져옴
                    try {
                        const regionResponse = await fetch(`http://localhost:9000/api/products/regions/${regionId}`, {
                            method: "GET",
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (regionResponse.ok) {
                            const regionDetail = await regionResponse.json();
                            setSelectedLevel1(regionDetail.level1);
                            setSelectedLevel2(regionDetail.level2);
                        }
                    } catch (error) {
                        console.error("지역 정보 로드 실패:", error);
                    }
                }
            }
        } catch (error) {
            console.error("상품 정보 불러오기 오류:", error);
            alert(error.message);
            navigate(-1);
        } finally {
            setLoading(false);
        }
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

    // 폼 제출 핸들러
    const handleSubmit = async () => {
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

        // 변경된 필드만 포함하는 객체 생성
        const formData = new FormData();

        // 원본 데이터와 비교하여 변경된 필드만 추가
        if (productName !== originalData.name)
        formData.append("productName", productName);

        if (selectedCategory !== (categories.find(c => c.name === originalData.category)?._id))
        formData.append("category", selectedCategory);

        const originalTradeType = originalData.tradeType === "판매" ? "sale" : "free";
        if (tradeType !== originalTradeType)
        formData.append("tradeType", tradeType);

        if (tradeType === "sale" && price !== originalData.price)
            formData.append("price", price);
        else if (tradeType === "free")
            formData.append("price", "0");

        if (description !== originalData.description)
        formData.append("description", description);

        // 지역 정보는 항상 포함 (비교 복잡)
        formData.append("region", selectedRegion._id);

        // 상품 ID 추가
        formData.append("productId", productId);

        // 새로 추가된 이미지 파일 추가
        if (imageFiles.length > 0) {
        imageFiles.forEach((file) => formData.append("images", file));
        }

        // 삭제된 이미지 추가
        if (deletedImages.length > 0) {
            formData.append("deletedImages", JSON.stringify(deletedImages));
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // PATCH 요청으로 변경
            const response = await fetch(`http://localhost:9000/api/products/${productId}`, {
                method: "PATCH",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("상품이 성공적으로 수정되었습니다!");
                navigate(`/products/${productId}`);
            } else {
                const errorData = await response.json();
                alert(`상품 수정 실패: ${errorData.message || '알 수 없는 오류가 발생했습니다.'}`);
            }
        } catch (error) {
            console.error("상품 수정 오류:", error);
            alert("상품 수정 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">상품 정보를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold mb-8 text-center">상품 수정</h2>

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
                    onSubmit={handleSubmit}
                    showTempSave={false}
                    submitText="수정 완료"
                />
            </form>
        </div>
    );
}
