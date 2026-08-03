/* 请求【axios】封装 */
import axios from 'axios';
import envConfig from '@/env-config';
import { makeSign } from './request-utils';
import { trans } from '@/utils/public';
import { getToken, removeToken } from '@/lib/cookie'
import { removeFinishedRequest, addPendingRequest, clearAllRequest } from './request-filter';
import router from '@/router';

export class HttpRequest {
  constructor() {
    this.instance = axios.create();
    this.interceptors();
  }
  //拦截器
  interceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        // 注册请求到 pendingRequests
        // addPendingRequest 内部自动处理重复：发现同 key 请求 → abort 旧的 → 注册新的（后浪拍死前浪）
        addPendingRequest(config);
        let { method, params, data } = config;
        const token = getToken();
        let result = makeSign(params || data, method.toUpperCase())
        // 签名
        const sign = result.sign;
        // 在发送请求之前做些什么
        config.url += result.queryString
        // 设置请求的超时
        config.timeout = 30000;
        // 设置请求的headers
        let headers = {
          SIGN: sign,
          TOKEN: token,
          pretty_json: 'on',
          'Cache-Control': 'no-cache',
          APPID: envConfig.appid
        }
        config.headers = Object.assign(headers, config.headers);
        return config;
      },
      (error) => {
        console.error('请求错误:', error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { config } = response;
        // 带身份校验移除：config._currentController === Map 中存取的 controller 同一实例才删除
        // 防止旧请求（被后续重复请求 abort 后）的响应回调误删新请求的记录
        removeFinishedRequest(config)
        response.data = trans(response.data);
        return response;
      },
      (error) => {
        const { config, response } = error || {};
        console.error('请求错误:', error);

        // 同样带身份校验移除当前失败请求，避免误清替换后的新请求
        if (config) {
          removeFinishedRequest(config)
        }

        if (response) {
          // 403：鉴权失效，清 token、清所有待处理请求、跳转登录
          if (response.status === 403) {
            removeToken();
            clearAllRequest();
            router.replace({ name: 'login' })
          }

          if (response.data) {
            response.data = trans(response.data)
          }
        }

        return Promise.reject(error);
      }
    );
  }
  request(options) {
    return this.instance(options)
  }
}
