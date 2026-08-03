
/**
 * @desc 获取指定路由信息
 * @param {*} routes 路由列表信息
 * @param {*} specify_name 指定路由name
 * @returns
 */
export const getSpecifyRoute = (routes, specify_name) => {
  let defaultRoute = {};
  for (let index = 0; index < routes.length; index++) {
    const element = routes[index];
    if (element.name === specify_name) {
      defaultRoute = element;
      break;
    } else if (element.children && element.children.length) {
      let childDefaultRoute = getSpecifyRoute(element.children, specify_name);
      if (childDefaultRoute.name) {
        defaultRoute = childDefaultRoute;
        break;
      }
    }
  }
  return defaultRoute
}
/**
 * @desc 得到侧边栏菜单列表
 * @param {Array} list 通过路由列表
 * @returns {Array}
 */
export const getMenuByRouter = (list) => {
  let res = []
  list.forEach((item) => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta || {},
      }
      if (item.children && item.children.length !== 0) {
        obj.children = getMenuByRouter(item.children)
      }
      if (item.href) obj.href = item.href
      res.push(obj)
    }
  })
  return res
}
/**
 * @desc 得到面包屑菜单列表
 * @param {Array} route 当前路由metched
 * @param {Obj} defaultRoute 信息概览路由
 * @returns {Array}
 */
export const getBreadCrumbList = (route, defaultRoute) => {
  let routeMetched = route.matched
  // 如果当前页就是默认首页，只显示首页一项
  if (routeMetched.length === 1 && routeMetched[0].name === defaultRoute.name) {
    return [{
      ...defaultRoute,
      icon: (defaultRoute.meta && defaultRoute.meta.icon) || '',
      to: defaultRoute.path,
      meta: defaultRoute.meta || {},
    }]
  }
  // 否则只展示 matched 链条，不额外追加首页
  return routeMetched
    .filter((item) => {
      return item.meta === undefined || !item.meta.hideInBread
    })
    .map((item) => {
      let meta = { ...item.meta }
      if (meta.title && typeof meta.title === 'function') {
        meta.__titleIsFunction__ = true
        meta.title = meta.title(route)
      }
      return {
        icon: (item.meta && item.meta.icon) || '', //图标
        name: item.name, //路由名
        to: item.path,//触发后跳转的页面路由
        meta: meta,
      }
    })
}
/**
 * @desc 大写转为小写
 * @param {*} data 数据
 * @return {*} 转换后的数据
 */
export function trans(data) {
  if (Array.isArray(data)) {
    return data.map(trans)
  }
  if (data !== null && typeof data === 'object') {
    const result = {}
    for (let i in data) {
      result[i.toLowerCase()] = trans(data[i])
    }
    return result
  }
  return data
}
