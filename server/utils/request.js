const http = require('http')
const qs = require('querystring')
const Url = require('url')


let defaultOptions = {
    headers: {
        'Upgrade-Insecure-Requests': '1',
        'Host': 'search.jd.com',
        'Connection': 'keep-alive',
        'Origin': 'http://evil.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
    }
}

module.exports = {
    getRaw: url => new Promise((resolve, reject) => {
        http.get(url, res => {
            const { statusCode } = res
            if (statusCode !== 200) {
                reject(new Error(`Request Failed.\nStatus Code: ${statusCode}`))
            }
            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', chunk => rawData += chunk)
            res.on('end', () => {
                resolve(rawData)
            })
        }).on('error', (err) => {
            reject(err)
        })
    }),
    request: (url, options = {}) => new Promise((resolve, reject) => {
        let opt = Object.assign(defaultOptions, options),
            urlInfo = Url.parse(url)

        opt.protocol = urlInfo.protocol
        opt.hostname = urlInfo.hostname
        opt.host = urlInfo.host
        opt.port = urlInfo.port
        opt.path = urlInfo.path


        let req = http.request(opt, res => {
            const { statusCode } = res
            const contentType = res.headers['content-type']
            if (statusCode !== 200) {
                return reject(new Error(`Request Failed.\nStatus Code: ${statusCode}`))
            }
            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', chunk => rawData += chunk)
            res.on('end', () => {
                //throw new Error('eeeeee')
                /^application\/json/.test(contentType) ? resolve(JSON.parse(rawData)) : resolve(rawData)

            })
        })

        req.on('error', (err) => {
            return reject(err)
        })

        //body
        if (opt.method == 'POST' && options.body) {
            req.write(qs.stringify(options.body))
        }

        req.end()
    }),
    get: function (url, options = {}) {
        return this.request(url, options)
    },
    post: function (url, options = {}) {
        return this.request(url, Object.assign(options, {
            method: 'POST'
        }))
    }
}
