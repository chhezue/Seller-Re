import React, {useEffect, useState} from "react";

// 시/도 및 구/군 선택 UI
export default function RegionSelector({ 
    regions,
    selectedLevel1, 
    setSelectedLevel1, 
    selectedLevel2, 
    setSelectedLevel2,
    disabled = false
}) {
    const [filteredLevel2, setFilteredLevel2] = useState([]);

    // 지역 필터링
    useEffect(() => {
        if (selectedLevel1) {
            setFilteredLevel2(regions.filter(region => region.level1 === selectedLevel1));
        } else {
            setFilteredLevel2([]);
        }
    }, [selectedLevel1, regions]);

    return (
        <div>
            <label className="block text-gray-700 font-medium mb-2">거래 지역</label>
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">시/도 선택:</label>
                    <select
                        onChange={(e) => {
                            setSelectedLevel1(e.target.value);
                            setSelectedLevel2("");
                        }}
                        value={selectedLevel1}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        disabled={disabled}
                    >
                        <option value="">선택하세요</option>
                        {[...new Set(regions.map(region => region.level1))].map(level1 => (
                            <option key={level1} value={level1}>{level1}</option>
                        ))}
                    </select>
                </div>

                {selectedLevel1 && (
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">구/군 선택:</label>
                        <select
                            onChange={(e) => setSelectedLevel2(e.target.value)}
                            value={selectedLevel2}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            disabled={disabled}
                        >
                            <option value="">선택하세요</option>
                            {filteredLevel2.map(region => (
                                <option key={region._id} value={region.level2}>{region.level2}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
} 