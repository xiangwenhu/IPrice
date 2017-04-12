const http = require('http')
const qs = require('querystring')  

export default {
    getRaw: url => new Promise((resolve, reject) => {
        http.get(url, res => {
            const { statusCode } = res           
            if (statusCode !== 200) {
                reject ( new Error(`Request Failed.\nStatus Code: ${statusCode}`))
            }   
            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', chunk => rawData += chunk )
            res.on('end', () => {
                resolve(rawData)
            })
        }).on('error', (err) => {
            reject(err)
        })
    }),
    request:(url,options) => new Promise((resolve, reject) => {
        let opt = Object.assign({},options),
            urlInfo = new URL(url)
        
        opt.protocol  = urlInfo.protocol
        opt.hostname = urlInfo.hostname
        opt.host = urlInfo.host
        opt.port = urlInfo.port
        opt.path = urlInfo.path   

        
        let req  = http.request(options, res => {
            const { statusCode } = res           
            if (statusCode !== 200) {
                reject ( new Error(`Request Failed.\nStatus Code: ${statusCode}`))
            }   
            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', chunk => rawData += chunk )
            res.on('end', () => {
                resolve(rawData)
            })
        }).on('error', (err) => {
            reject(err)
        })

        //body
        if(options.body){
            req.write(qs.stringify(options.body))
        }

        req.end()
    }),
    get:(url,options = {})=>{
        return this.request(url,options)
    },
    post:(url,options)=>{
        return this.request(url,Object.assign(options,{
            method:'POST'
        }))
    }
}