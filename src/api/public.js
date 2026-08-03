import { httpGet, httpPost } from '@/service/request-http'
//获取配置信息
export function GetConfigInfo(params) {
  return httpGet({
    url: '/api/UserInfoAPI/GetPatientStaticConfigV2',
    params,
  })
}
//获取上传oss信息
export function GetOSSPolicyAndSignForMiniApp(params) {
  return httpGet({
    url: '/api/MiniApp/GetOSSPolicyAndSignForMiniApp',
    params,
  })
}
//获取阿里云图库
export function GeneratePresignedUri(data) {
  return httpPost({
    url: '/api/WXH5Api/BatchGeneratePresignedUri',
    data,
  })
}
