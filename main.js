const googleTrends = require('google-trends-api');
const HttpsProxyAgent = require('https-proxy-agent');
var http = require('http')
const url = require('url');
const NodeCache = require("node-cache");
const cache = new NodeCache();

let proxyAgent = new HttpsProxyAgent('http://127.0.0.1:54088/');

http.createServer(async function (request, response) {
  request = url.parse(request.url, true);
  const methodName = request.pathname.replace("/", '')
  const kw = request.query.kw
  let data;
  const cacheKey = methodName + "-" + kw
  try {
    if (!cache.get(cacheKey)) {
      let query = {
        keyword: kw,
        agent: proxyAgent
      };
      data = await googleTrends[methodName](query)
      cache.set(cacheKey, data, 86400)
    } else {
      data = cache.get(cacheKey)
    }
    response.setHeader("Content-Type", "application/json;charset=utf-8")
    response.end(data);
  } catch (err) {
    response.end(err.toString());
  }
}).listen(28080);

