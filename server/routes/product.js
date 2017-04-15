const Router = require('koa-router')
const product = require('../service/product')


const router = new Router({
    prefix: '/api/product'
})

//通过商品名称获取所有品牌
router.get('/search/:product', async (ctx) => {
    let prd = ctx.params.product
    let results = await product.getProducts(prd)
    ctx.body = results.reduce((a, b) => a.concat(b), [])

})

module.exports = router
