# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## skill

"每次会话开始时，先检查可用的全局 skill 和执行项目专属 skill"

## 技术栈

Vue 3（Composition API，`<script setup>`）、Vite 8、Pinia 4、Vue Router 5、Element Plus 2、View UI Plus、Vue I18n — 全部使用纯 JavaScript（无 TypeScript）。样式使用 Less。Node 22，通过 Volta 管理版本。

## 常用命令

```sh
npm run dev          # 启动开发服务器（development 模式）
npm run prod         # 启动开发服务器（production 模式）
npm run build        # 生产环境构建
npm run build-dev    # 开发环境构建
npm run test:unit    # Vitest 单元测试
npm run test:e2e     # Playwright 端到端测试
npm run lint         # 完整检查：oxlint + eslint + prettier
npm run format       # 仅格式化 src/ 目录
```

`npm run dev` 对接的开发 API 地址为 `http://ko.ishenzang.com:1234`。本地预览生产构建使用 `npm run preview`。

## 项目结构

```
src/
  main.js               # 应用入口 → 注册 pinia、router、plugins，挂载 #app
  App.vue               # 根组件；onBeforeMount 时获取配置（getConfigInfo）
  env-config.js         # 全局环境配置：base_url(tool)、cookie 域名、DES 密钥、APPID
  api/                  # API 接口函数 → 调用 httpGet/httpPost
    login.js            # GetAccessToken、GetCurrentUserInfo
    public.js           # GetConfigInfo、GetOSSPolicy...、GeneratePresignedUri
  service/
    request-http.js      # 导出 httpGet()、httpPost()
    request-axios.js     # Axios 实例（HttpRequest 类），含拦截器
    request-utils.js     # 基于 MD5 的请求签名逻辑（makeSign）
    request-filter.js    # 重复请求取消（后浪拍死前浪策略 + 身份校验）
  stores/
    index.js             # Pinia 实例 + sessionStorage 持久化
    modules/
      public.js          # 配置信息、菜单列表、面包屑、侧边栏状态、keep-alive 缓存列表、refreshKey
      login.js           # 用户对象、handleLogin、handleLogout、getCurrentInfor
  router/
    index.js             # 路由实例，含鉴权守卫 + afterEach 缓存注册
    list.js              # 基础路由（首页、登录、404），自动发现 views/**/*_router.js
  Layout/                # 主布局：侧边栏 + 顶栏 + 主内容区
    components/SideBar/  # 可折叠侧边导航（Menu、Title、useSideBar），带 logo 切换
    components/HeaderBar/ # 面包屑、刷新、全屏切换、语言切换、用户菜单
  components/
    ParentView/          # 包裹 router-view，提供 <KeepAlive> + 滚动位置恢复
    CommonIcon/          # 统一图标：含 svg_icon_ 前缀用 SvgIcon，否则用 el-icon
    UnityModal/          # 弹窗组件占位（配合 useModal 使用）
  SvgIcon/               # SVG 精灵图标组件（SVG 文件位于 src/SvgIcon/svg/）
  plugins/
    index.js             # 注册插件入口：iview + elementIcon + i18n
    element-icon.js      # 全局注册所有 Element Plus 图标
    iview.js             # 注册 View UI Plus 组件：Table、Login、UserName、Password、Submit
    lang/                # Vue I18n 中英文语言包（zh.js、en.js）
  lib/
    cookie.js            # js-cookie 封装：setToken、getToken、removeToken
    enc-dec.js           # DES 加解密（CryptoJS、CBC 模式、Pkcs7 填充）
    imageConverter.js    # OSS 图片 URL 转换（批量获取预签名 URL）
  utils/
    public.js            # 路由工具：getMenuByRouter、getBreadCrumbList；trans() 响应键名转小写
    upload.js            # File 转 base64 Data URL
  composables/
    useModal.js          # 命令式弹窗管理器（createVNode + render）
  views/                 # 页面组件；在此目录下添加 *_router.js 文件即可自动注册路由
    home/home.vue        # 首页（demo 页面，含 useModal 弹窗示例）
    login/login.vue      # 登录页（View UI Plus Login 表单）
    error-page/404.vue   # 404 页面
```

## 路径别名

| 别名 | 解析为            |
| ---- | ----------------- |
| `@`  | `src/`            |
| `_c` | `src/components/` |
| `_v` | `src/views/`      |

示例：`import Foo from '_c/Foo/index.vue'` → `src/components/Foo/index.vue`。

## 自动导入（无需手动 import）

Vue API（`ref`、`reactive`、`computed`、`watch`、`watchEffect`、`onMounted`、`onBeforeMount`、`nextTick`、`defineComponent`、`useRoute`、`useRouter`、`useTemplateRef`、`provide`）、Pinia（`defineStore`、`storeToRefs`）以及 Element Plus 组件均已全局自动导入。ESLint 通过 `.eslintrc-auto-import.json` 识别这些全局变量。**不要为这些 API 手动添加 import 语句。**

## 环境与配置

四个 `.env.*` 文件对应不同模式：`dev`（本地开发）、`prod`（生产模式开发服务器）、`build`（生产构建）、`build-dev`（开发构建）。关键环境变量：

| 变量                       | 用途                              |
| -------------------------- | --------------------------------- |
| `VITE_NODE_ENV`            | `'development'` 或 `'production'` |
| `VITE_APP_TITLE`           | 应用标题                          |
| `VITE_SECRET`              | 请求签名密钥（开发与生产不同）    |
| `VITE_HTTP_BASE_URL_API`   | API 代理目标地址                  |
| `VITE_HTTP_BASE_URL_MICRO` | 微服务代理目标地址                |

构建产物输出到 `dist/${VITE_NODE_ENV}_dist/`。生产构建通过 terser 移除 `console.log`。

`env-config.js` 统一管理运行时配置：`base_url: 'tool'`（路由 base + cookie key 前缀），`default_name: 'home'`，cookie 域名 `shensx.com`，DES 密钥、APPID。

## HTTP 请求架构

所有 API 调用通过 `src/service/request-http.js` 中的 `httpGet()` / `httpPost()` 发起。

**注意**：`httpPost` 会将 payload 包装为 `{ data: data }` 嵌套结构，签名时对 `POSTDATA = JSON.stringify(object)` 计算。

`request-axios.js` 中的 `HttpRequest` 类处理：

### 1. 请求拦截器

- **重复请求防控**：`addPendingRequest(config)` 自动检测同 key 请求 → abort 旧的 → 注册新的（"后浪拍死前浪"）
- **请求签名**：`makeSign()` 计算 MD5 签名 → 设置 `SIGN` header → 追加 `?TS=xxx&VERSION_INFO=xxx` 到 URL
- **鉴权**：从 cookie 读取 `TOKEN` → 设置 header；token key = `${base_url}_${VITE_NODE_ENV}_token`

### 2. 响应拦截器

- **成功**：`removeFinishedRequest(config)` 带身份校验移除请求记录（`config._currentController === 存入的 controller` 同一实例才删，防止旧回调误清新请求）。响应键名通过 `trans()` 转为小写。
- **失败**：`removeFinishedRequest(config)` 清理当前请求；**仅 403** 时清 token + 清所有待处理请求 + 跳转登录。其他错误仅转换数据键名 + reject。

### 3. 请求去重核心（request-filter.js）

- `addPendingRequest`: 检查 key 重复 → abort 旧的 → 注册新的 AbortController
- `removeFinishedRequest`: **身份校验** — 对比 `config._currentController === storedController`，旧请求不能误删新请求
- `clearAllRequest`: 中止全部待处理请求

### 添加新 API

在 `src/api/*.js` 中：

```js
import { httpGet, httpPost } from '@/service/request-http'
export function SomeApi(params) {
  return httpGet({ url: '/api/xxx', params })
}
```

## 路由机制

- **base_url**：`createWebHistory('tool')`，所有路由在 `/tool/` 路径下
- **自动发现**：在 `src/views/` 子目录放置 `*_router.js` 文件，通过 `import.meta.glob` 自动导入合并
- **路由 meta** 控制侧边栏可见（`hideInMenu`）、面包屑（`hideInBread`）、缓存（`cache` → 需与路由 `name` 一致）、徽标数（`badge_num`）、图标（`icon`）。外链用 `href`，内嵌 iframe 用 `iframe`
- **鉴权守卫**：无 token → 跳转 `/login`；有 token 但无 userid → 调用 `loginStore.getCurrentInfor()` 获取用户信息；有 token 且访问 `/login` → 跳转 `/`
- **Keep-alive**：`meta.cache: true` 的路由通过 `afterEach` 加入 `keepAliveList`，在 `ParentView` 中由 `<KeepAlive :include>` 包裹，滚动位置保存恢复

## 状态管理

Pinia 配合 `pinia-plugin-persistedstate` 自动持久化所有 store 到 `sessionStorage`。

| Store    | 用途                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------- |
| `public` | `configInfor`、`keepAliveList`、`menuList`、`breadCrumbList`、`isCollapse`、`refreshKey`                       |
| `login`  |
| Store    | 用途                                                                                                           |
| ---      | ---                                                                                                            |
| `public` | `configInfor`、`keepAliveList`、`menuList`、`breadCrumbList`、`isCollapse`、`refreshKey`                       |
| `login`  | `user` 对象；`handleLogin`（DES 加密 + 获取 token）、`handleLogout`、`getCurrentInfor`（含 OSS 图片 URL 转换） |

## UI 框架注意事项

- **Element Plus** 是主力组件库，组件和图标均已自动导入
- **View UI Plus** 提供登录表单组件：`Table`、`Login`、`UserName`、`Password`、`Submit`
- **CommonIcon**：自动判断 — iconName 含 `svg_icon_` 前缀用 SvgIcon，否则用 Element Plus 图标
- **SvgIcon**：通过 `vite-plugin-svg-icons` 生成 SVG 精灵（`createSvgIconsPlugin`），`<use href="#图标名">` 方式渲染。SVG 文件在 `src/SvgIcon/svg/`，使用 `svg_icon_` 前缀命名
- **Vue I18n**：支持中英文，缓存到 `localStorage.lang`
- 侧边栏在视口宽度 ≤ 960px 时自动折叠
- 顶栏使用 fixed 定位；主内容区域使用 flex 纵向布局

## 代码风格

- **Prettier**：无分号，单引号，每行 100 字符宽度
- **ESLint** + **oxlint**：`vue/multi-word-component-names` 关闭；`no-unused-vars`、`no-undef` 关闭（自动导入处理）；correctness 设为 error
- **Vue 组件**：Composition API，`defineComponent` 或 `<script setup>`；组件局部注册

## 已知问题

1. **`src/lib/cookie.js` 读取配置路径错误**：读取 `envConfig.expires` 和 `envConfig.domain`，但实际配置在 `envConfig.cookie` 下。domain 设置静默回退为 `''`（无域名限制）。

2. **`SideBar/index.vue` 引用不存在的配置项**：`envConfig.defaultRouteName` 未定义，实际键名为 `envConfig.default_name`。

3. **占位测试**：`src/__tests__/App.spec.js` 和 `e2e/vue.spec.js` 断言 Vite 脚手架文本 `"You did it!"`，该文本已不在应用中，测试会失败。

4. **首次运行才生成的文件**：`eslint.config.js` 继承 `./.eslintrc-auto-import.json`，Vite 会生成 `types/eslintrc-auto-import.d.ts` 和 `types/icons.d.ts`。首次执行 lint 前先运行一次 `npm run dev`。

5. **`httpPost` 数据嵌套**：POST 请求 payload 被包装为 `{ data: data }`，签名时 `POSTDATA = JSON.stringify({ data: ... })`，后端需按此结构解析。
