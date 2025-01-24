const mongoose = require("mongoose");

const RegionSchema = new mongoose.Schema({
    level1: { type: String, required: true },
    level2: { type: String, required: true },
});

const Region = mongoose.models.Region || mongoose.model('Region', RegionSchema, 'Region');
module.exports = Region;