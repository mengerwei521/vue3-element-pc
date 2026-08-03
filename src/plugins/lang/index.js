import { createI18n } from 'vue-i18n'   // 不再用 VueI18n 类
import zh from './zh'
import en from './en'

// 从 localStorage 恢复语言
const savedLang = localStorage.getItem('lang') || 'zh'

// 创建 i18n 实例（使用 createI18n，不是 new）
const i18n = createI18n({
  locale: savedLang,
  fallbackLocale: 'zh',
  messages: { zh, en },
  // 如果需要支持俄语复数，可添加 pluralizationRules（同 Vue 2 写法）
})

export default i18n
