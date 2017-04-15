const brand = require('./brand')

module.exports = {
    async getProducts(product) {
        let brands = await brand.getBrands(product)      
        let ps = Array.from(brands).slice(0, 2).map(br => brand.getProducts(br, product))
        return Promise.all(ps)
    }
}