const mongoose = require("mongoose");

const RegionSchema = new mongoose.Schema({
    level1: { type: String, required: true }, // 시/도 단위 (예: 서울특별시, 경기도)
    level2: { type: String, required: true }, // 시/군/구 단위 (예: 강남구, 수원시)
},{
    versionKey : false, // __v 필드 비활성화
});

const Region = mongoose.models.Region || mongoose.model('Region', RegionSchema, 'Region');
module.exports = Region;