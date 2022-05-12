const googleTrends = require('google-trends-api');
const HttpsProxyAgent = require('https-proxy-agent');
var http = require('http')
const url = require('url');

let proxyAgent =  new HttpsProxyAgent('http://127.0.0.1:54088/');

http.createServer(async function(request,response){
  request = url.parse(request.url, true);
  const methodName = request.pathname.replace("/", '')
  console.log(request)
  let query = {
      keyword: request.query.kw,
      agent: proxyAgent
  };
  try {
    response.setHeader("Content-Type", "application/json;charset=utf-8")
    response.end(await googleTrends[methodName](query));
  }catch(err) {
    response.end(err.toString());
  }
}).listen(28080);

