import { createRouter, createWebHistory } from 'vue-router'
import routerList from './list';
import envConfig from '@/env-config'
import { getToken } from '@/lib/cookie'
import { useLoginStore } from '@/stores/modules/login';
console.log(routerList, 'routerList')
const router = createRouter({
  history: createWebHistory(envConfig.base_url),
  routes: routerList,

})
const LOGIN_PAGE_NAME = "login";
router.beforeEach(async (to, from, next) => {
  const token = getToken();
  console.log(token, 'token')
  if (!token) {
    // 未登录
    if (to.name === LOGIN_PAGE_NAME) {
      // 未登陆且要跳转的页面是登录页
      next(); // 跳转
    } else {
      // 未登录且要跳转的页面不是登录页
      next({
        name: LOGIN_PAGE_NAME, // 跳转到登录页
      });
    }
  } else {
    // 已登录
    let loginStore = useLoginStore();
    if (!loginStore?.user?.userid) {
      await loginStore.getCurrentInfor()
    }
    if (token && to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页
      next('/');
    } else {
      next();
    }
  }
});
router.afterEach((to, from) => {
  const publicStore = usePublicStore();
  if (to.meta.cache) {
    // 如果路由需要缓存
    if (to.name) {
      publicStore.addKeepAlive(to.name);
    } else {
      console.warn('路由没有name属性，无法缓存');
    }
  }
});
export default router
