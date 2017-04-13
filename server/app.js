const Koa = require('koa')
const koaStatic  = require('koa-static') 
const path = require('path')
const betterBody  = require('koa-better-body')
//const routes = require('./routes')
const app = new Koa()
const request = require('./utils/request')

//better body
app.use(betterBody()) 

//静态服务器资源
app.use(koaStatic(path.resolve(__dirname,'../client/dist')))

//自定义错误处理
app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      await ctx.render('404', {
        msg: '404 未找到'
      })
    }
  } catch (err) {
    let status = err.status || 500
    await ctx.render('500', {
      status,
      msg: '服务器内部错误' + err.body || err.message
    })
    console.log(err)
  }
})

//logger
app.use(async function (ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}`)  
})

//路由
//routes(app)

//异常
app.on('error', (err, ctx) => {
  console.log('error url:' + ctx.url)
  console.log('error detail:' + err)
  console.log('error stack:' + err.stack)
})


request.get('http://p.3.cn/prices/mgets?type=1&skuIds=J_1001881807').then(data=>console.log(data)).catch(err=>
  console.log('log:' +err)
)


app.listen(8083)