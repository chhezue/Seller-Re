const mongoose = require("mongoose");

const ProductFileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

const ProductFile = mongoose.models.ProductFile || mongoose.model('ProductFile', ProductFileSchema, 'ProductFile'); 
module.exports = ProductFile;