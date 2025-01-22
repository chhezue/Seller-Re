const mongoose = require("mongoose");

const RegionSchema = new mongoose.Schema({
    level1: { type: String, required: true },
    level2: { type: String, required: true },
});

module.exports = mongoose.model('Region', RegionSchema, 'Region');