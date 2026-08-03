import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
// 创建 pinia 实例
const pinia = createPinia()
pinia.use(
  createPersistedState({
    storage: sessionStorage,// 使用 sessionStorage
    auto: true, // 自动持久化
  })
)
// 默认导出，给 main.js 使用
export default pinia;
