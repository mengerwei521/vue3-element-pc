import { createApp } from 'vue'

import './assets/css/main.css'
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register' // 必须引入的虚拟模块[自定义icon插件]

import App from './App.vue'
import pinia from './stores/index.js'
import router from './router'

import usePlugin from './plugins'

const app = createApp(App)

app.use(pinia)
app.use(router)
usePlugin(app)
app.mount('#app')
