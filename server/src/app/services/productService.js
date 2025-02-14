const Category = require('../models/Category');

class ProductService {
    constructor() {

    }

    async fetchAllCategories() {
        // console.log(await Category.find());
        return await Category.find();
    }
}

module.exports = {ProductService};