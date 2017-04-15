const Router = require('koa-router')
const brand = require('../service/brand')


const router = new Router({
  prefix: '/api/brand'
})

//通过商品名称获取所有品牌
router.get('/getBrands/:product', async (ctx) => {
  let brands = await brand.getBrands(ctx.params.product)
  ctx.body = Array.from(brands)
})

//获取所有品牌
router.get('/getProducts/:brand/:product', async (ctx) => {
  let products = await brand.getProducts(ctx.params.brand,ctx.params.product)
  ctx.body = Array.from(products)
})


module.exports = router
