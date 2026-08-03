import Cookies from 'js-cookie'
import envConfig from '@/env-config'
const TOKEN_KEY = `${envConfig.base_url}_${import.meta.env.VITE_NODE_ENV}_token`
export const setToken = (token, token_key = '') => {
  Cookies.set(token_key || TOKEN_KEY, token, {
    expires: envConfig.expires || 7,//cookie保存的天数
    domain: envConfig.domain || '',//用于指定Cookie有效的域名范围
  })
}
export const getToken = (token_key = '') => {
  const token = Cookies.get(token_key || TOKEN_KEY, { domain: envConfig.domain || '' })
  if (token) return token
  else return ''
}
export const removeToken = (token_key = '') => {
  Cookies.remove(token_key || TOKEN_KEY, { domain: envConfig.domain || '' })
}
