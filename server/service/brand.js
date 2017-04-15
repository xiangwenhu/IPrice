const cheerio = require('cheerio')
const request = require('../utils/request')

module.exports = {
    async getBrands(product) {
        let url = `http://search.jd.com/Search?keyword=${encodeURIComponent(product)}&enc=utf-8&suggest=1.his.0.0`
        let data = await request.get(url)
        let $ = cheerio.load(data, {
            normalizeWhitespace: true,
            xmlMode: true
        })
        return $('#J_selector  .s-brand .J_valueList li>a').map((i, v) => v.attribs.title)
    },
    async getProducts(brand, product) {
        //wtype=1京东配送   
        let url = `http://search.jd.com/search?keyword=${encodeURIComponent(product)}&enc=utf-8&ev=exbrand_${encodeURIComponent(brand)}%40&uc=0&psort=3`
        let data = await request.get(url)
        let $ = cheerio.load(data, {
            normalizeWhitespace: true,
            xmlMode: true
        })
        //match(/(\d+(k{0,1})g)(x\d+){0,1}/ig)
        //eval('218kg*2'.replace(/kg/ig,'*1000').replace(/g/ig,'')) 
        return Array.from($('#J_goodsList  .gl-item')).slice(0, 5).map((v) => {
            let el = $(v)
            return {
                id: v.attribs['data-sku'],
                title: el.find('.p-name em').text(),
                price: el.find('.p-price i').text(),
                shop: el.find('.p-shop a').text(),
                comment: el.find('.p-commit a').text(),
                brand: brand
            }
        })

    }
}