/* 请求【axios】封装 */
import axios from 'axios';
import envConfig from '@/env-config';
import { makeSign } from './request-utils';
import { trans } from '@/utils/public';
import { getToken, removeToken } from '@/lib/cookie'
import { removeFinishedRequest, addPendingRequest, removePendingRequest, clearAllRequest } from './request-filter';
export class HttpRequest {
  constructor() {
    this.instance = axios.create();
    this.interceptors();
  }
  //拦截器
  interceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        // 添加请求拦截器
        removePendingRequest(config) // 检查是否存在重复请求
        addPendingRequest(config); // 添加请求到pendingRequests
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
        return error;
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        // 响应拦截器
        const { config } = response;
        console.log('请求成功:', response);
        // 从pendingRequests中移除请求
        removePendingRequest(config)
        // 处理响应数据
        response.data = trans(response.data);
        return response;
      },
      (error) => {
        // 错误处理
        const { response } = error || {};
        console.error('请求错误response:', response);
        response.data = trans(response.data)
        if (response) {
          removePendingRequest(response)
          clearAllRequest()
          console.error('请求错误response:', response)
          if (response.status == 403) {
            // Message.error('请重新登录');
            removeToken();//清除token
            closeAllModals();//清除后续所有请求
            router.replace({ name: 'login' })
          }
          if (response.status == 410 && response.data?.errorinfo) {
            // Message.error(response.data.errorinfo)
          }
        }

        return error;
      }
    );
  }
  request(options) {
    return this.instance(options)
  }
}
