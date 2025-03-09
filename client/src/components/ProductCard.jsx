import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, refCallback }) {
    const navigate = useNavigate();

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.log('Invalid date:', dateString); // 디버깅용
            return '';
        }
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // 날짜 디버깅용
    console.log('Product dates:', {
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    });

    // Google Drive URL 변환 함수 추가
    const convertGoogleDriveUrl = (url) => {
        const match = url.match(/id=([^&]+)/);
        return match ? `https://lh3.google.com/u/0/d/${match[1]}` : url;
    };

    return (
        <div 
            className="border p-4 rounded cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/products/${product._id}`)}
            ref={refCallback}
        >
            {product.fileUrls && product.fileUrls.length > 0 && (
                <img 
                    src={convertGoogleDriveUrl(product.fileUrls[0])} 
                    alt={product.name} 
                    className="w-full h-32 object-cover mb-2 product-image" 
                />
            )}
            <h3 className="text-lg font-semibold truncate mb-1" title={product.name}>{product.name}</h3>
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    {product.transactionType === '나눔' ? (
                        <p className="text-sm text-blue-600 font-semibold px-2.5 py-0.5 bg-blue-100 rounded-full">나눔</p>
                    ) : (
                        <p className="text-sm font-medium px-2.5 py-0.5">{product.price?.toLocaleString()}원</p>
                    )}
                    <p className="text-sm text-gray-500 px-2.5 py-0.5 bg-gray-100 rounded-full flex items-center gap-1">
                        ❤️ <span>{product.favoriteCount ? product.favoriteCount : 0}</span>
                    </p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    {product.updatedAt 
                        ? `수정일: ${formatDate(product.updatedAt)}` 
                        : `생성일: ${formatDate(product.createdAt)}`
                    }
                </p>
            </div>
        </div>
    );
} 