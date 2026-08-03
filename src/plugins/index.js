import iview from './iview';
import elementIcon from './element-icon';
import i18n from './lang';
export default (app) => {
  // 插件逻辑
  iview(app);
  elementIcon(app);
  app.use(i18n)   // 这行必须存在！
}
