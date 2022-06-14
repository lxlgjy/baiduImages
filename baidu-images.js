//调用的js库
const axios = require('axios')  //请求网站用的
const download = require('download');

//请求头不用改
const header = {
    'Cookie': 'BIDUPSID=10F598A19004F99CC5137C9058C04EF1; PSTM=1651584495; BAIDUID=10F598A19004F99C254DDEC6F1D794AB:FG=1; BDUSS=nNWRDNjNHJKNEJxTUNoWTBXU3M5TmVYaUVxMWV4Y3hCYUJJYVh3STRNS1c1cGhpRVFBQUFBJCQAAAAAAAAAAAEAAAA~muzzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJZZcWKWWXFiU; BDUSS_BFESS=nNWRDNjNHJKNEJxTUNoWTBXU3M5TmVYaUVxMWV4Y3hCYUJJYVh3STRNS1c1cGhpRVFBQUFBJCQAAAAAAAAAAAEAAAA~muzzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJZZcWKWWXFiU; BAIDUID_BFESS=10F598A19004F99C254DDEC6F1D794AB:FG=1; BAIDU_WISE_UID=wapp_1652527424241_463; BDRCVFR[dG2JNJb_ajR]=mk3SLVN4HKm; userFrom=null; ab_sr=1.0.1_YzdmMjI0NTVlNWY2MWQ2MDNjNTA2OTNmYzNjZDgyNjQ4NGNmOTRmMTE2MDExOGNiYzY3OTZmM2I2N2U4MGQ2YzM4OTY3OThlZDZkMzRjY2ZiYzE0YzA1ZDg1YmY1Zjc3OTA1Y2ExODk4NjZlZDhjNjg5ZTM2YjQ2MTQ3ZmNiZDlmNWMxMjU0YmMyZDliNDljMzZjYWYwZjZiOGM5OGZmOQ==; BDRCVFR[-pGxjrCMryR]=mk3SLVN4HKm',
    'Host': 'image.baidu.com',
    'Pragma': 'no-cache',
    'Referer': 'https://image.baidu.com/search/index?tn=baiduimage&ct=201326592&lm=-1&cl=2&ie=gb18030&word=%CD%BC%C6%AC&fr=ala&ala=1&alatpl=normal&pos=0&dyTabStr=MCwzLDYsMSw0LDIsNSw3LDgsOQ%3D%3D',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36 Edg/101.0.1210.39',
    'X-Requested-With': 'XMLHttpRequest',
    "Accept": " text/plain, */*; q=0.01",
    "Accept-Encoding": " gzip, deflate, br",
    "Accept-Language": " zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "Cache-Control": " no-cache",
    "Connection": " keep-alive",
}

const list = (url) => {
    return new Promise(resolve => {
        axios({
            url: url,
            method: 'GET',
            headers: header
        }).then(res => {
            resolve(res)
        })
    })
}
//去除标题的不合规则字符
const replace = (list) => {
    return new Promise(resolve => {
        let newTile = list.replace(/[a-z]/g, '').replace('ω', '').replace(/\//g, "").replace('> ', '').replace(/"/g,'').replace(/\s/g,'').replace(/:/g,'').replace(/\|/g,'').replace('?','')


        resolve(newTile)
    })
}

//匹配标题和图片链接的处理代码
const get_list = async (url) => {

    const html = await list(url)

    let all = html.data

    let all_one = html.data.data

    if (typeof all === 'object') {

        for (let i = 0; i < all_one.length - 1; i++) {

            let title = await replace(all_one[i]["fromPageTitleEnc"])

            let url = all_one[i]["hoverURL"]

            downloads(url, title)
        }
    } else if (typeof all === 'string') {

        let re = /"fromPageTitleEnc":"(.*?)"/g

        let re1 = /"hoverURL":"(.*?)"/g

        while ((res = re.exec(all)) != null, (res1 = re1.exec(all)) != null) {
            let title = await replace(res[1])
            let url = res1[1]
            downloads(url, title)
        }
    }
}
//下载到本地
const downloads = async (url, name) => {
    await download(url, 'img', { //img 是保存图片的文件夹，可以更换名字
        filename: `${name}.jpg`
    });
}

let shop = '蝴蝶忍' //搜索什么类型的图片  这个为实例
let ts = encodeURIComponent(shop)

let limit = 0 //代表前面有几张图片，每次增加30  第一页为0 ，第二页为30
let rn = limit + 30 //每次获取几张图片，默认为30

let urls = `https://image.baidu.com/search/acjson?tn=resultjson_com&logid=7856952621204077217&ipn=rj&ct=201326592&is=&fp=result&fr=ala&word=${ts}&queryWord=${ts}&cl=1&lm=1&ie=utf-8&oe=utf-8&adpicid=&st=&z=&ic=&hd=&latest=&copyright=&s=&se=&tab=&width=&height=&face=&istype=&qc=&nc=&expermode=&nojc=&isAsync=&pn=${limit}&rn=${rn}&gsm=1e&1652102434577=`


get_list(urls)




