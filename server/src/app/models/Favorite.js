const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
},{
    versionKey : false, // __v 필드 비활성화
});

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema, 'Favorite');  
module.exports = Favorite;