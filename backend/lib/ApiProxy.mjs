import request from 'request';
import proxy from "http-proxy-middleware";

export function apiProxy(req, res, next) {
  let options = {
    target: req.headers.proxyreferer, // 目标主机
    changeOrigin: true,               // 需要虚拟主机站点
    ws: true,
  };
  let fn = proxy(options);
  fn(req, res, next);
};
