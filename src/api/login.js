import { httpGet, httpPost } from '@/service/request-http'
//注册获取token
export function GetAccessToken(params, headers) {
  return httpGet({
    url: '/api/userinfoapi/GetAccessToken',
    params,
    headers,
  })
}
//获取个人信息
export function GetCurrentUserInfo(params) {
  return httpGet({
    url: '/api/userinfoapi/GetCurrentUserInfo',
    params,
  })
}
