import React from 'react';

// 취소, 저장, 등록 등의 버튼 그룹
export default function ActionButtons({ 
    onCancel, 
    onSubmit, 
    onTemporarySave,
    showTempSave = false,
    submitText = "등록",
    cancelText = "취소" 
}) {
    return (
        <div className="flex justify-end space-x-4 mt-10">
            <button 
                type="button" 
                onClick={onCancel}
                className="px-6 py-3 bg-gray-300 rounded-lg text-lg hover:bg-gray-400 transition-colors"
            >
                {cancelText}
            </button>
            
            {showTempSave && (
                <button 
                    type="button" 
                    onClick={onTemporarySave}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg text-lg hover:bg-yellow-600 transition-colors"
                >
                    임시 저장
                </button>
            )}
            
            <button 
                type="button" 
                onClick={onSubmit}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition-colors"
            >
                {submitText}
            </button>
        </div>
    );
} 