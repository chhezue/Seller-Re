import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../../components/ImageSlider";

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await fetch(`http://localhost:9000/api/products/${id}`);
                const data = await response.json();
                console.log("받은 이미지 URLs:", data.detailedProduct.fileUrls);
                setProduct(data.detailedProduct);
            } catch (error) {
                console.error("상품 상세 정보 불러오기 실패:", error);
            }
        };

        fetchProductDetail();
    }, [id]);

    useEffect(() => {
        if (product) {
            console.log("Product details loaded:", product);
            if (product.fileUrls) {
                console.log("Image URLs:", product.fileUrls);
            } else {
                console.log("No image URLs found.");
            }
        }
    }, [product]);

    if (!product) return <div>로딩중...</div>;

    // 날짜 변환 함수
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // 구글 드라이브 이미지 변환 함수
    const convertGoogleDriveUrl = (url) => {
        const match = url.match(/id=([^&]+)/);
        return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
    };

    return (
        <div className="relative pb-[200px]">
            <div className="max-w-4xl mx-auto p-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-semibold">{product.name}</h2>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            수정
                        </button>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            삭제
                        </button>
                        <button // '목록으로' 버튼 누르면 -1 페이지로 이동
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center"
                            onClick={() => window.history.back()} 
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 6a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm0 5a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            목록으로
                        </button>
                    </div>
                </div>
                {product.fileUrls && product.fileUrls.length > 0 && (
                    <div className="mb-4">
                        <div className="w-full h-96">
                            <ImageSlider 
                                images={product.fileUrls.map(url => {
                                    console.log("처리 전 URL:", url);
                                    const fileId = url.split('id=')[1];
                                    const processedUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                                    console.log("처리 후 URL:", processedUrl);
                                    return processedUrl;
                                })} 
                            />
                        </div>
                    </div>
                )}
                <p className="text-gray-600 mb-2">
                    {product.category} · {product.favoriteCount} 관심<br></br>
                    {
                        product.updatedAt 
                            ? `수정일: ${formatDate(product.updatedAt)}` 
                            : `생성일: ${formatDate(product.createdAt)}`
                    }
                </p>
                <p className="text-xl font-bold mb-4">{product.price}원</p>
                <p className="mb-4">{product.description}</p>
                <h3 className="text-lg font-semibold mb-2">거래 희망 장소</h3>
                <p className="mb-4">{product.region}</p>
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">판매자 정보</h3>
                    <div className="flex items-center">
                        {product.seller.profileImage && (
                            <img src={product.seller.profileImage} alt="프로필 이미지" className="w-16 h-16 object-cover mr-4" />
                        )}
                        <p>{product.seller.username} · {product.seller.region}</p>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto p-4 space-y-2">
                    <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center gap-4">
                            <button className="text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                            <span className="text-xl font-bold">
                                {product.transactionType === '나눔' ? '무료 나눔' : `${product.price?.toLocaleString()}원`}
                            </span>
                        </div>
                        <button className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600">
                            {product.transactionType === '나눔' ? '나눔받기' : '구매하기'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 