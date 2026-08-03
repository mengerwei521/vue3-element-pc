import { GetAccessToken, GetCurrentUserInfo } from '@/api/login'
import { setToken, getToken, removeToken } from '@/lib/cookie'
import { GetImgUrlFn } from '@/lib/imageConverter'
import { encrypt } from '@/lib/enc-dec'
export const useLoginStore = defineStore('login', {
  state: () => {
    return {
      user: {},
    }
  },
  actions: {
    //登录
    async handleLogin(params) {
      try {
        let authinfo = params
        let ut = encrypt(JSON.stringify(authinfo))
        let headers = {
          Accept: 'application/json',
          ContentType: 'application/json',
          UT: ut
        }
        const { data } = await GetAccessToken({}, headers);
        setToken(data.token);
        return Promise.resolve(data)
      } catch (error) {
        console.error('登录失败:', error);
        return Promise.reject(error)
      }
    },
    //退出登录
    handleLogout(token_key = '') {
      removeToken(token_key);
    },
    //获取用户信息
    async getCurrentInfor() {
      try {
        let { data } = await GetCurrentUserInfo()
        data = await GetImgUrlFn(data, 'pic')
        this.user = data
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    //权限判断
    authorityJudgement() { },
  }
})
