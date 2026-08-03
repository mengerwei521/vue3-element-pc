import { useI18n } from 'vue-i18n';
// 按照惯例，组合式函数名以“use”开头
export function useSideBar() {
  const { t, locale } = useI18n()
  //线上路由标题
  function showTitle(route) {
    let title = '';
    if (route.meta && route.meta.title) {
      if (typeof route.meta.title === 'function') {
        title = route.meta.title(route)
      } else {
        title = route.meta.title
      }
    }
    return title ? t(title) : '';
  }
  function judgeRouteIsChildren(route) {
    let data = {
      type: 'duo',
      route: {}
    }
    if (route.children?.length > 1) {
      data = {
        type: 'duo',
        route: route
      }
    } else {
      if (route.children?.length === 1) {
        if (route.children[0].children?.length > 0) {
          data = {
            type: 'duo',
            route: route.children[0]
          }
        } else {
          data = {
            type: 'dan',
            route: route.children[0]
          }
        }
      } else {
        data = {
          type: 'dan',
          route: route
        }
      }
    }
    return data
  }
  //获取唯一标识符
  function getUniqueKey(route) {

    return status
  }
  //判断父级是否展示小红点
  function judgeParentShow(route) {
    if (route?.meta?.badge_num > 0) {
      return true
    }
    if (route?.children?.length > 0) {
      for (let index = 0; index < route?.children.length; index++) {
        const element = route?.children[index];
        if (element?.meta?.badge_num > 0) {
          return true
        }
        if (element?.children?.length > 0 && judgeParentShow(element)) {
          return true
        }
      }
    }
    return false
  }
  //获取路由模块中的name或者href
  function getNameOrHref(route) {
    return route.href ? route.href : route.name
  }
  return { showTitle, judgeRouteIsChildren, getNameOrHref, judgeParentShow }
}
