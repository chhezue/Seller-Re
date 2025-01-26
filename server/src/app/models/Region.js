const mongoose = require("mongoose");

const RegionSchema = new mongoose.Schema({
    level1: { type: String, required: true },
    level2: { type: String, required: true },
},{
    versionKey : false, // __v 필드 비활성화
});

const Region = mongoose.models.Region || mongoose.model('Region', RegionSchema, 'Region');
module.exports = Region;