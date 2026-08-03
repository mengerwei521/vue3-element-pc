import { GeneratePresignedUri } from '@/api/public'
/**
 * @desc 获取图片 将对应的key图片转换为http模板
 * @param  d   {}或者[] 必传  传入带有图片的对象
 * @param  img_key  string  必传 图片字段,  同时存在多张照片用逗号分割
 * @param level 图片级别 默认 1
 */
export async function GetImgUrlFn(d, img_key, level = 1) {
  let osskeyList = []
  osskeyList = mixinsPicForEachGet(d, img_key, osskeyList)
  if (osskeyList.length > 0) {
    try {
      osskeyList.forEach((item) => {
        item.level = level || 1
      })
      let { data: res } = await GeneratePresignedUri(osskeyList)
      //图片数组去重
      if (res.length >= 2) {
        let list = res.map((v) => v.osskey)
        let arr = []
        arr = res.filter((item, index) => {
          return list.indexOf(item.osskey) == index
        })
        res = arr
      }
      let shuju = mixinsDistributePic(res, d, img_key)
      return new Promise((resolve, reject) => {
        resolve(shuju)
      })
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject()
      })
    }
  } else {
    return new Promise((resolve, reject) => {
      resolve(d)
    })
  }
}
//获取图片不分发
export async function getImgAddress(array) {
  if (array.length > 0) {
    try {
      let { data } = await GeneratePresignedUri(array)
      return new Promise((resolve, reject) => {
        resolve(data)
      })
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject()
      })
    }
  } else {
    return new Promise((resolve, reject) => {
      reject()
    })
  }
}
//img_key遍历 value  数据    img_key 图片key  osskeyList图片数组
/**
 * @param  value   {}或者[] 必传  传入带有图片的对象
 * @param  img_key  string  必传 图片字段,  同时存在多张照片用逗号分割
 * @param  osskeyList  []  必传 图片数组,
 */
function mixinsPicForEachGet(value, img_key, osskeyList) {
  if (value == null || value == undefined) {
    return []
  }
  if (value.constructor == Object) {
    for (let key in value) {
      if (key == img_key && value[key]) {
        if (value[key].constructor == Object) {
          //可能性不大(极低) 如：pic: {pic:''}
          mixinsPicForEachGet(value[key], img_key, osskeyList)
        } else if (value[key].constructor == Array) {
          //如 pic:[{},{}]或 pic:['',''] 或者 pic:[[],[]]
          for (let item in value[key]) {
            // console.log(value[key],'value[key][item]')
            if (value[key][item] == null || value[key][item] == undefined) {
              break
            }
            if (value[key][item].constructor == Object || value[key][item].constructor == Array) {
              mixinsPicForEachGet(value[key][item], img_key, osskeyList)
            } else if (value[key][item].constructor == String) {
              osskeyList.push.apply(osskeyList, multiplexFnOne(value[key][item]))
            }
          }
        } else if (value[key].constructor == String) {
          osskeyList.push.apply(osskeyList, multiplexFnOne(value[key]))
        }
      } else {
        //属性名不等于img_key
        mixinsPicForEachGet(value[key], img_key, osskeyList)
      }
    }
  } else if (value.constructor == Array) {
    for (const key in value) {
      mixinsPicForEachGet(value[key], img_key, osskeyList)
    }
  }
  return osskeyList
}
//复用函数1
function multiplexFnOne(data) {
  let list = []
  if (data.indexOf(',') != -1) {
    //字符串中有多个图片地址
    data.split(',').forEach((element, num) => {
      list.push({
        osskey: element,
        level: 1,
      })
    })
  } else {
    //字符串中只有一个图片地址
    list.push({
      osskey: data,
      level: 1,
    })
  }
  return list
}
/**
 * @desc 获取的图片地址进行分发
 * @param  value   {}或者[] 必传  图片地址集合
 * @param  data   {}或者[] ，必传  数据
 * @param  img_key   string  必传 图片字段,
 */
function mixinsDistributePic(value, data, img_key) {
  if (data == null || data == undefined) {
    return data
  }
  if (data.constructor == Object) {
    for (let key in data) {
      if (key == img_key) {
        if (data[key] == null || data[key] == undefined) {
          break
        }
        if (data[key].constructor == Object) {
          //可能性不大(极低) 如：pic: {pic:''}
          mixinsDistributePic(value, data[key], img_key)
        } else if (data[key].constructor == Array) {
          //图片osskey地址为数组 ["",""]
          data[img_key + '_url'] = []
          data[key].forEach((item, index) => {
            value.forEach((element, num) => {
              if (element.osskey == item) {
                data[img_key + '_url'].push(element.url)
              }
            })
          })
        } else if (data[key].constructor == String) {
          data[img_key + '_url'] = multiplexFnTwo(value, data[key])
        }
      } else {
        mixinsDistributePic(value, data[key], img_key)
      }
    }
  } else if (data.constructor == Array) {
    for (const key in data) {
      mixinsDistributePic(value, data[key], img_key)
    }
  }
  return data
}
//复用函数2 value图片地址集合
function multiplexFnTwo(value, data) {
  let list = []
  if (data.indexOf(',') != -1) {
    //字符串中有多个图片地址
    data.split(',').forEach((item, num) => {
      value.forEach((element, num) => {
        if (element.osskey == item) {
          list.push(element.url)
        }
      })
    })
  } else {
    //字符串中只有一个图片地址
    value.forEach((item, index) => {
      if (item.osskey == data) {
        list = item.url
      }
    })
  }
  return list
}
