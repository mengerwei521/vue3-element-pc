import { createRouter, createWebHistory } from 'vue-router'
import routerList from './list';
import envConfig from '@/env-config'
import { getToken } from '@/lib/cookie'
import { useLoginStore } from '@/stores/modules/login';
import { usePublicStore } from '@/stores/modules/public';
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
      // 不 await，避免 API 不可达时阻塞导航
      loginStore.getCurrentInfor().catch(() => { })
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
  // 先移除离开的页面缓存，再添加进入的页面缓存（防止同名冲突）
  if (from.meta.cache && from.name) {
    publicStore.removeKeepAlive(from.name);
  }
  if (to.meta.cache) {
    if (to.name) {
      publicStore.addKeepAlive(to.name);
    } else {
      console.warn('路由没有name属性，无法缓存');
    }
  }
});
export default router
