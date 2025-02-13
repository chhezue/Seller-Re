const {ProductService} = require('../services/productService');

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }
    
    async getCategories(req, res) {
        console.log('getCategories');
        try{
            const categories = await this.productService.fetchAllCategories();
            console.log('category : ', categories);
            res.status(200).json(categories);
        }catch (err){
            res.status(500).json({error : err.message});
        }
    }
}
module.exports = {ProductController};