import { HttpRequest } from './request-axios';

const axios = new HttpRequest();
/**
 * @description: http get请求
 * @param {*} url 请求地址
 * @param {*} params  请求参数
 * @param {*} headers 请求头
 * @returns
 */
export const httpGet = ({ url, params = {}, headers = {} }) => {
  return axios.request({
    method: 'get',
    url: url,
    params: params,
    headers: headers
  })
}
/**
 * @description: http post请求
 * @param {*} url 请求地址
 * @param {*} data 请求参数
 * @param {*} headers 请求头
 * @returns
 */
export const httpPost = ({ url, data, headers = {} }) => {
  return axios.request({
    method: 'post',
    url: url,
    data: { data },
    headers: headers
  })
}
