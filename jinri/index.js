const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
//编码格式
const iconv = require('iconv-lite');
const wallpaper = require('wallpaper');
//速率
const async = require('async');
const mysql = require('mysql');
const filter = require('bloom-filter-x');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wuif1805'
});
//增
// let insert_sql='insert into fuck (title,dsc,content) values (?,?,?) ';
// connection.query(insert_sql,['三十多岁多', '撒大声地所多', '第五位多无多'],(err,results,fields)=>{
//     if (err) throw err;
//     console.log(results.insertId);
// })
//删
connection.connect();
// let delete_sql='delete from fuck where id=?';
// connection.query(delete_sql,[23],(err,results,fields)=>{
//     if(err)throw err;
//     console.log(results.affectedRows);
//     // connection.end();
// })
//改
// let update_sql='update fuck set title=? where id=?';
// connection.query(update_sql,['萨芬撒发放飒飒',11],(err,results,fields)=>{
//     if(err) throw err;
//     console.log(results.affectedRows);
// })
//查
// let select_sql='select * from fuck where id=?';
// connection.query(select_sql,[11],(err,results,fields)=>{
//     if(err) throw err;
//     console.log(results);
// })

connection.end();

// request.get('http://www.baidu.com',
//     (err, res, body) => {
//         let $ = cheerio.load(body);
//         $('img').each((k, v) => {
//             let src = $(v).attr('src');
//             if (!src.startsWith('http:')) {
//                 src = 'http:' + src;
//             }
//             request(src).pipe(fs.createWriteStream('./huaban.jpg'));
//         })
//     })
// request(
//     {url: 'http://huaban.com/?jlesu2gc&max=1842790346&limit=20&wfl=1'},
//     (err, res, body) => {
//         let o = JSON.parse(body);
//         o.pins.forEach( v=>{
//             console.log(v)
//             let src = v.link;
//             request(src).pipe(fs.createWriteStream('./huaban.jpg'));
//             })
// //     })
// request(
//     {url:'https://cn.bing.com/'},
//     (err, res, body) => {
//         let $ = cheerio.load(body);
//         let src='http://cn.bing/com'+$('img').last().attr('src');
//         let ws=fs.createWriteStream('./ing.jpg');
//         request(src).pipe(ws);
//         ws.on('finish',()=>{
//             wallpaper.set('./ing.jpg').then(()=>{
//                 console.log('done')
//             })
//     })
//     }
// )
;
//setInterval
//url 去重
function fetch_news() {
    request(
        {
            url: 'https://news.zol.com.cn/',
            encoding: null
        },
        (err, res, body) => {
            body = iconv.decode(body, 'gb2312');
            let $ = cheerio.load(body);

            let urls = [];
            $('.content-list li').each((k, v) => {
                let url = $(v).find('.info-head a').attr('href');
                let title = $(v).find('.info-head a').text();
                let dsc = $(v).find('p').contents().eq(0).text();
                let image = $(v).find('img').attr('.src');
                if (filter.add(url)) {
                    urls.push(url);
                }
            })
            if (!urls.length) {
                let d = new Date();
                console.log(d.toUTCString() + "本次更新数据" + urls.length + "条");
            } else {
                let d = new Date();
                console.log(d.toUTCString() + "本次更新数据" + urls.length + "条");
                async.eachLimit(urls, 1, (v, next) => {
                    request({
                        url: v,
                        encoding:null
                    }, (err, res, body) => {
                        body = iconv.decode(body, 'gb2312');
                        let $ = cheerio.load(body);
                        let pubtime = $('#pubtime_baidu').attr('content');
                        let content = $('#article-content').text();
                        console.log(content);
                        next(null);
                    })
                })
            }

            // $('.content-list li').each((k,v)=>{
            //     let t=$(v).find('.info-head a');
            //     let title=t.text();
            //     let url=t.attr('href');
            //     let dsc=$(v).find('p').contents().eq(0).text();
            //     let image=$(v).find('img').attr('.src');
            //     request({
            //         encoding:null,
            //         url:url
            //     },(err,res,body)=>{
            //         body=iconv.decode(body,'gb2312');
            //         let $=cheerio.load(body);
            //         let pubtime=$('#pubtime_baidu').attr('content');
            //         let content=$('#article-content').html();
            //         console.log(content);
            //     })
            // })
        }
    )
}
fetch_news();
setInterval(fetch_news, 10000);
//初始化布隆过滤器
// --从数据库读取已有的url
//----添加到布隆过滤器
//定时抓取新闻网管站上的数据
//----根据布隆过滤器判定有没有新的新闻
