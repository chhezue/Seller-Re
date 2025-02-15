const Category = require('../models/Category');
const Product = require("../models/Product");

class ProductService {
    constructor() {

    }

    async fetchAllCategories() {
        // console.log(await Category.find());
        return await Category.find();
    }

    async addProduct(product) {
        const newProduct = new Product(product);
        return await newProduct.save();
    }
}

module.exports = {ProductService};