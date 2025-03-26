import React, {useRef, useState} from "react";

// 이미지 업로드 및 미리보기 처리
export default function ImageUploader({ 
    imagePreviews, 
    setImagePreviews, 
    imageFiles, 
    setImageFiles, 
    setDeletedImages 
}) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

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

    return (
        <div>
            <label className="block text-gray-700 font-medium mb-2">사진 업로드 (최대 5장)</label>
            <p className="text-sm text-gray-500 mb-3">상품 이미지를 등록해주세요. 드래그하여 한 번에 여러 이미지를 업로드할 수 있습니다.</p>
            <div
                className={`w-full h-56 border-2 border-dashed rounded-lg flex flex-wrap items-center justify-center cursor-pointer transition-all ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
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
                    <div className="flex flex-wrap justify-center gap-3 p-4 w-full">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative w-24 h-24">
                                <img
                                    src={src}
                                    alt={`Uploaded ${index}`}
                                    className="w-full h-full object-cover rounded-lg shadow-sm"
                                />
                                <button
                                    type="button"
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleImageDelete(index);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {imagePreviews.length < 5 && (
                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                                +
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="mt-2 text-gray-500">이미지를 업로드하세요</p>
                        <p className="text-sm text-gray-400">클릭하거나 이미지를 끌어다 놓으세요</p>
                    </div>
                )}
            </div>
            <p className="text-right text-sm text-gray-500 mt-1">{imagePreviews.length}/5장</p>
        </div>
    );
} 