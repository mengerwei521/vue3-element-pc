/**
 * @desc 将file对象转化为base64 Data URL 图片
 * @param {*} file 图片对象
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result) // 返回 base64 字符串
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}
