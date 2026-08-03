export default {
  //项目名称
  title: import.meta.env.VITE_APP_TITLE,
  //根路由
  base_url: 'tool',
  //默认打开的信息概览的路由name值
  default_name: 'treatment-monitoring-home',
  //cookie配置
  cookie: {
    expires: 7,//cookie保存的天数
    domain: 'shensx.com'//用于指定Cookie有效的域名范围
  },
  //秘钥
  enc_dec: {
    key: '9fb35c36',
    iv: '722f9ec0'
  },
  //APPID
  appid: 'com.minissx.patient'
}
