import envConfig from '@/env-config'
import { getSpecifyRoute, getMenuByRouter, getBreadCrumbList, } from '@/utils/public.js'
import { GetConfigInfo } from '@/api/public'
export const usePublicStore = defineStore('public', {
  state: () => {
    return {
      configInfor: {},//配置信息
      keepAliveList: [],//缓存路由
      defaultRoute: {},//默认信息概览路由数据
      menuList: [],//侧边栏导航列表
      breadCrumbList: [],//面包屑列表
      isCollapse: true,//侧边栏收起与展开， true 收起 false展开
      refreshKey: 0,//刷新路由页面
    }
  },
  actions: {
    //获取配置信息
    async getConfigInfo() {
      try {
        const { data } = await GetConfigInfo();
        this.configInfor = data;
        return Promise.resolve(data)
      } catch (error) {
        console.error('获取配置信息失败:', error);
        return Promise.reject(error)
      }
    },
    //获取默认概览路由数据
    getDefaultRoute(routes) {
      this.defaultRoute = getSpecifyRoute(routes, envConfig.default_name)
    },
    //获取侧边栏导航列表
    setMenuList(routes) {
      this.menuList = getMenuByRouter(routes);
      console.log(this.menuList, routes, 'menuList-routes')
    },
    //获取面包屑列表
    setBreadCrumb(route) {
      this.breadCrumbList = getBreadCrumbList(route, this.defaultRoute)
    },
    //侧边栏收起与展开
    getSidebarStatus(status) {
      this.isCollapse = status;
    },
    //刷新路由页面
    onRefreshRouter() {
      this.refreshKey += 1
    },
    //添加缓存路由
    addKeepAlive(name) {
      !this.keepAliveList.includes(name) && this.keepAliveList.push(name);
    },
    //移除缓存路由
    removeKeepAlive(name) {
      this.keepAliveList = this.keepAliveList.filter(item => item !== name);
    }
  },
})
