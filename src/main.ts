import md5 from 'md5';
import * as https from 'node:https'
import * as querystring from 'querystring'
import { appid, key } from './private';


type ErrorMap = {
    [key: string]: string
}
type BaiduResult = {// 百度返回的结果是独对象
    error_code?: string;
    error_msg?: string;
    from: string;
    to: string;
    trans_result: { src: string; dst: string; }[]
}
const errorMap: ErrorMap = {// 错误表,使用hash表消除if else
    52003: '用户认证失败',
    54001: '签名错误',
    54004: '账户余额不足',
};
export const translate= (word:string)=> {
    let from
    let to
    if (/[a-zA-Z]/.test(word[0])) {
        from = 'en';
        to = 'zh';
    } else {
        from = 'zh';
        to = 'en';
    }
    const salt=Math.random().toString()
    const sign =md5(appid+word+salt+key)
    // 查询参数
    const query =querystring.stringify({
        q:word,
        from:from,
        to:to,
        appid:appid,
        salt:salt,
        sign:sign
    })
    const options = {
        hostname: 'fanyi-api.baidu.com',
        port: 443,
        path: `/api/trans/vip/translate?${query}`,
        method: 'GET'
    };
    const request = https.request(options, (response) => {
        let chunks: Buffer[] = [];// 接收数据，缓存储存
        response.on('data', (chunk) => {// 将一段段的数据不断推进储存
            chunks.push(chunk);
          })
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString();// 连接一段段数据
            const object: BaiduResult = JSON.parse(string);// 还原成对象
            if (object.error_code) {
                console.error(errorMap[object.error_code] || object.error_msg);
                process.exit(2);
            } else {
                object.trans_result.map(obj => {
                console.log(obj.dst);
                });
                process.exit(0);// 退出进程
            }
        });
    })
    request.on('error', (e) => {
        console.error(e)
    });
    request.end();
}
