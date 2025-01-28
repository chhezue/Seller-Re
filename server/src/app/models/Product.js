const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    transactionType: { type: String, required: true },
    description: String,
    createdAt: { type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000) },
    updatedAt: Date,
    deletedAt: Date,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true },
    writeStatus: { type: String, required: true },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
},{
    versionKey : false, // __v 필드 비활성화
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'Product'); 
module.exports = Product;