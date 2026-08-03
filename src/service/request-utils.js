//请求配置方法
import md5 from 'md5';
import { getToken } from '@/lib/cookie'
let Secret = import.meta.env.VITE_SECRET
let Version = "2.0.0";
export function makeSign(object, httpMethod) {
  let obj = {};
  if (httpMethod.toUpperCase() === 'POST') {
    obj.POSTDATA = JSON.stringify(object);
  } else {
    obj = deepCopy(object);//克隆并去除空值
  }
  obj.VERSION_INFO = Version;
  obj.TS = new Date().valueOf();
  obj.TOKEN = getToken();
  obj.SECRET = Secret;
  console.log("请求参数：", obj);
  let mapData = paramsSlot(obj);
  let sign = md5(toQueryString(mapData)).toUpperCase();
  let filterData = filterParams(mapData);
  let queryString = toQueryString(filterData);
  return {
    sign: sign,//请求签名
    queryString: queryString//请求公共参数
  };
}

/**
 * @desc 克隆并去除空值
 * @param {*} p 源对象
 * @param {*} c 赋值对象
 * @return {*} 克隆出来的对象
 */
function deepCopy(p, c) {
  let a = c || {};
  for (let i in p) {
    if (!Object.prototype.hasOwnProperty.call(p, i)) {
      continue;
    }
    if (p[i] === null || p[i] === '') {
      continue;
    }
    //typeof会认为null也为object
    if (typeof p[i] === "object") {
      a[i] = p[i].constructor === Array ? [] : {};
      deepCopy(p[i], a[i]);
    } else {
      a[i] = p[i];
    }
  }
  return a;
}
/**
 * @desc 请求参数排序集合
 * @param {*} obj 参数
 */
function paramsSlot(obj) {
  let mapdata = [];
  let mapDataKey = [];
  let mapDataArry = [];
  for (let p in obj) {
    if (typeof obj[p] === "function") {
      continue;
    }
    // p 为属性名称，obj[p]为对应属性的值
    let item = {};
    item.Key = p.toUpperCase();
    item.Value = obj[p];
    mapDataKey.push(item.Key)
    mapdata.push(item);
  }
  mapDataKey.sort();
  mapDataKey.forEach((item) => {
    mapdata.forEach((element) => {
      if (item === element.Key) {
        mapDataArry.push(element)
      }
    })
  })

  return mapDataArry;
}
/**
 * @desc 生成参数xx=xxx字符串
 * @param {*} mapData
 * @return {*}
 */
function toQueryString(mapData) {
  if (!mapData || mapData.length === 0) return "";
  let queryStr = "?";
  for (let item in mapData) {
    if (isNullOrEmpty(mapData[item].Value)) {
      continue;
    }
    queryStr += format("{0}={1}&", mapData[item].Key, mapData[item].Value);
  }
  return queryStr.slice(0, queryStr.length - 1);
}
/**
 * @desc 过滤掉不需要的参数
 * @param {*} mapData
 * @return {*}
 */
function filterParams(mapData) {
  let filterArray = mapData.filter(function (item) {
    if (item.Key === "VERSION_INFO" || item.Key === "TS" || item.Key === 'UNIONID') {
      return true;
    }
    return false;
  });
  return filterArray;
}
/// 判断是否为空
function isNullOrEmpty(str) {
  return str == null || str === '';
}
/**
 * @desc 格式化字符串
 * @return {*}
 */
function format() {
  if (arguments.length == 0) return null;
  let str = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    let re = new RegExp("\\{" + (i - 1) + "\\}", "gm");
    str = str.replace(re, arguments[i]);
  }
  return str;
}
