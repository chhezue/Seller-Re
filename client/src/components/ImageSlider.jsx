import React, { useState } from 'react';

export default function ImageSlider({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative w-full h-full">
            {/* 이미지 컨테이너 */}
            <div className="relative w-full h-full">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Slide ${index}`}
                        className={`absolute w-full h-full object-contain transition-opacity duration-300 ${
                            index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ display: index === currentIndex ? 'block' : 'none' }}
                        onError={(e) => {
                            console.error(`이미지 로드 실패: ${image}`);
                        }}
                    />
                ))}
                
                {/* 좌우 버튼 */}
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M15 19l-7-7 7-7" 
                                />
                            </svg>
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-200"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 5l7 7-7 7" 
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* 인디케이터 (동그라미) */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === currentIndex 
                                    ? 'bg-white scale-110' 
                                    : 'bg-white/50 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 