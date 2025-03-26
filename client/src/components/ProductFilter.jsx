import React from 'react';

// 상품 목록 필터링 UI
export default function ProductFilter({
    categories,
    regions,
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    setSelectedRegion,
    selectedSubRegion,
    setSelectedSubRegion,
    onlyFree,
    setOnlyFree,
    resetFilters
}) {
    return (
        <div className="flex space-x-4 mb-6">
            <select 
                className="p-2 border rounded" 
                value={selectedRegion} 
                onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedSubRegion("");
                }}
            >
                <option value="">지역 선택</option>
                {Array.from(new Set(regions.map(region => region.level1)))
                    .map(level1 => (
                        <option key={level1} value={level1}>{level1}</option>
                    ))
                }
            </select>
            
            <select 
                className="p-2 border rounded" 
                value={selectedSubRegion} 
                onChange={(e) => setSelectedSubRegion(e.target.value)}
            >
                <option value="">구/군 선택</option>
                {regions
                    .filter(region => region.level1 === selectedRegion)
                    .map(region => (
                        <option key={region._id} value={region.level2}>
                            {region.level2}
                        </option>
                    ))
                }
            </select>
            
            <select 
                className="p-2 border rounded" 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="">카테고리 선택</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
            
            <label className="flex items-center">
                <input 
                    type="checkbox" 
                    checked={onlyFree} 
                    onChange={(e) => setOnlyFree(e.target.checked)} 
                    className="mr-2" 
                />
                나눔만
            </label>
            
            <button 
                onClick={resetFilters} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                초기화
            </button>
        </div>
    );
} 