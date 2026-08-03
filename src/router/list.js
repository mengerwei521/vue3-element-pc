import Layout from '@/Layout/index.vue';
/**
 * 路由中meta除了原生参数外可配置的参数:

 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  cache: (false) 设为true后页面会缓存 页面name需要和路由名一致
 *  badge_num：{Number} 未读数
 *  iframe : xxx 内链
 *  href: xx 外链
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */
let routerList = [
  {
    path: '/',
    redirect: '/treatment-management',
    meta: {
      hideInMenu: true
    },
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'route.login',
      hideInMenu: true
    },
    component: () => import('_v/login/login.vue')
  },
  //用于捕获所有未匹配路由的特殊配置
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    meta: {
      title: 'route.notFound',
      hideInMenu: true
    },
    component: () => import('@/views/error-page/404.vue')
  }
];
// 自动发现 views/**/_router.js，eager:true 在构建时静态解析，避免动态 import + 顶层 await 死锁
const modules = import.meta.glob('../views/**/*_router.js', { eager: true, import: 'default' })

for (const path in modules) {
  routerList = routerList.concat(modules[path])
}
export default routerList
