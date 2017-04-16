class Home {

    init() {
        this.searchEl = document.querySelector('#search')
        this.listEl = document.querySelector('.list')
        this.keyWordsEl = document.querySelector('#keyWords')

        this.searchEl.addEventListener('click', () => {
            fetch('/api/product/search/' + this.keyWordsEl.value).then(res => res.json()).then(data => this.displayList(data))
        })
    }

    displayList(data) {
        data = this.preHandle(data)
        this.listEl.innerHTML = null
        let htmlStr
        if (data) {
            this.listEl.innerHTML = data.map(v => `<li><a href = 'https://item.jd.com/${v.id}.html' target='_blank'> ${v.title}|${v.price} |${v.avPrice}</a></li>`).join('')
        } else {
            this.listEl.innerHTML = `<li>没有搜索到相关数据</li>`
        }
    }

    preHandle(data) {
        return data.map(v => {
            /*得到 125g*3 */
            let wInfo = v.title.match(/(\d+(k{0,1})g)(x\d+){0,1}(\*\d+){0,1}/ig),
                weight = eval(wInfo[0].replace(/kg/ig, '*1000').replace(/g/ig, '').replace('x', '*')),
                avPrice = (Number.parseFloat(v.price) * 1000 / Number.parseFloat(weight)).toFixed(2)
            return Object.assign({ avPrice }, v)
        }).sort((p1,p2)=> p1.avPrice >= p2.avPrice)
    }
}


new Home().init()