# CLAUDE.md

本文件为 Claude Code（claude.ai/code）在此仓库中工作时提供指导。

## 技术栈

Vue 3（Composition API，`<script setup>`）、Vite 8、Pinia 4、Vue Router 5、Element Plus 2、View UI Plus — 全部使用纯 JavaScript（无 TypeScript）。样式使用 Less。Node 22，通过 Volta 管理版本。

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
  main.js               # 应用入口
  App.vue               # 根组件；onBeforeMount 时获取配置
  env-config.js         # 全局配置：base_url、cookie 域名、DES 密钥
  api/                  # API 接口函数 → 调用 httpGet/httpPost
  service/
    request-http.js      # 导出 httpGet()、httpPost()
    request-axios.js     # Axios 实例，含拦截器（签名、token、去重）
    request-utils.js     # 基于 MD5 的请求签名逻辑
    request-filter.js    # 重复请求取消（后浪拍死前浪策略）
  stores/
    index.js             # Pinia 实例 + sessionStorage 持久化
    modules/
      public.js          # 配置、菜单、面包屑、侧边栏状态、缓存列表
      login.js           # 用户对象（少量内容，开发中）
  router/
    index.js             # 路由实例，含鉴权守卫 + 滚动行为
    list.js              # 基础路由（首页、登录、404），并自动发现 views/**/*_router.js
  Layout/                # 主布局：侧边栏 + 顶栏 + 主内容区
    components/SideBar/  # 可折叠侧边导航（Menu、Title、useSideBar）
    components/HeaderBar/ # 面包屑、刷新、全屏切换、用户菜单
  components/
    ParentView/          # 包裹 router-view，提供 <KeepAlive> + 滚动位置恢复
  plugins/               # 插件注册：Element Plus 图标（全局）、View UI Plus 组件
  SvgIcon/               # 图标组件，通过 unplugin-icons 导入本地 SVG（文件位于 src/assets/icons/）
  lib/
    cookie.js            # js-cookie 封装，用于 auth token 存取
    enc-dec.js           # DES 加解密（CryptoJS、CBC 模式、Pkcs7 填充）
  utils/
    public.js            # 路由工具（getMenuByRouter、getBreadCrumbList），以及响应键名转小写的 trans()
    upload.js            # File 转 base64 Data URL
  views/                 # 页面组件；在此目录下添加 *_router.js 文件即可自动注册路由
  composables/           # （计划中 — home.vue 引用了 useModal，但尚未创建）
```

## 路径别名

| 别名 | 解析为 |
| --- | --- |
| `@` | `src/` |
| `_c` | `src/components/` |
| `_v` | `src/views/` |

示例：`import Foo from '_c/Foo/index.vue'` → `src/components/Foo/index.vue`。

## 自动导入（无需手动 import）

Vue API（`ref`、`reactive`、`computed`、`watch`、`watchEffect`、`onMounted`、`onBeforeMount`、`nextTick`、`defineComponent`、`useRoute`、`useRouter`、`useTemplateRef`、`provide`）、Pinia（`defineStore`、`storeToRefs`）以及 Element Plus 组件均已全局自动导入。ESLint 通过 `.eslintrc-auto-import.json` 识别这些全局变量。**不要为这些 API 手动添加 import 语句。**

## 环境与配置

四个 `.env.*` 文件对应不同模式：`dev`（本地开发）、`prod`（生产模式开发服务器）、`build`（生产构建）、`build-dev`（开发构建）。关键环境变量：

| 变量 | 用途 |
| --- | --- |
| `VITE_NODE_ENV` | `'development'` 或 `'production'` |
| `VITE_SECRET` | 请求签名密钥（开发与生产不同） |
| `VITE_HTTP_BASE_URL_API` | API 代理目标地址 |
| `VITE_HTTP_BASE_URL_MICRO` | 微服务代理目标地址 |

构建产物输出到 `dist/${VITE_NODE_ENV}_dist/`。生产构建通过 terser 移除 `console.log`。

## HTTP 请求架构

所有 API 调用通过 `src/service/request-http.js` 中的 `httpGet()` / `httpPost()` 发起。`request-axios.js` 中的 Axios 实例执行以下处理：

1. **重复请求防控**（`request-filter.js`）：如果相同的请求（URL + 方法 + 参数）正在发送中，旧的会被中止并替换。使用 AbortController 实现，并通过身份校验防止旧请求误删新请求。
2. **请求签名**（`request-utils.js`）：每个请求携带 `SIGN` 头部，值为对包含 SECRET、TOKEN、VERSION_INFO、TS 的排序键值对进行大写 MD5 计算得到。查询字符串携带 TS 和 VERSION_INFO。POST 数据先 JSON 序列化再签名。响应键名通过 `trans()` 转为小写。
3. **鉴权**：`TOKEN` 头部从 cookie 读取（js-cookie）。token 键名格式为：`${base_url}_${VITE_NODE_ENV}_token`。

在 `src/api/*.js` 中添加新接口时，遵循以下模式：引入 `httpGet`/`httpPost`，导出具名函数，调用时传入 `{ url, params/data, headers }`。

## 路由机制

- **自动发现**：在 `src/views/` 的子目录中放置 `*_router.js` 文件。这些文件通过 `import.meta.glob` 导入并在启动时合并到路由列表。每个模块导出路由配置数组。
- **路由 meta** 控制侧边栏可见性（`hideInMenu`）、面包屑（`hideInBread`）、缓存（`cache` — 需与路由 `name` 一致）、徽标数（`badge_num`）和图标（`icon`）。外链使用 `href`，内嵌 iframe 使用 `iframe`。
- **鉴权守卫**：无 token → 跳转到 `/login`。有 token 且在登录页 → 跳转到 `/`。未知路由 → `/404`。
- **Keep-alive**：`meta.cache: true` 的路由会被加入 `publicStore.keepAliveList`，并在 `ParentView` 中由 `<KeepAlive :include>` 包裹。缓存页面的滚动位置会被保存和恢复。

## 状态管理

Pinia 配合 `pinia-plugin-persistedstate` 将所有 store 持久化到 `sessionStorage`。共两个 store：

- **`public`**（`publicStore`）：应用级 UI 状态 — 配置信息（应用挂载时获取）、侧边栏菜单列表、面包屑、侧边栏展开/收起状态、缓存列表、刷新 key。
- **`login`**（`loginStore`）：用户对象（目前内容较少，预期会扩展）。

## UI 框架注意事项

- **Element Plus** 是主力组件库，组件和图标均已自动导入。
- **View UI Plus** 提供表单组件：`Table`、`Login`、`UserName`、`Password`、`Submit`（在 `plugins/iview.js` 中手动注册）。
- **CommonIcon**（`_c/CommonIcon/index.vue`）由 `unplugin-icons` 在构建时自动生成 — 它将图标名称解析为 iconify 图标集。不要手动创建此文件。
- **SvgIcon** 通过 SVG 精灵技术渲染 `src/SvgIcon/svg/` 中的本地 SVG。
- 侧边栏在视口宽度 ≤ 960px 时自动折叠。
- 顶栏使用 fixed 定位；主内容区域使用 flex 纵向布局，overflow auto。

## 代码风格

- **Prettier**：无分号，单引号，每行 100 字符宽度。
- **ESLint** + **oxlint**：`vue/multi-word-component-names` 已关闭。`no-unused-vars` 和 `no-undef` 已关闭（由自动导入处理）。correctness 规则设为 error 级别。
- **Vue 组件风格**：使用 Composition API，`defineComponent` 或 `<script setup>`。组件局部注册（Element Plus 和 View UI Plus 除外）。

## 已知问题

以下是代码库中已存在的问题，开发时需注意：

1. **缺少源文件** — 以下导入引用了不存在的文件：
   - `src/views/home/home.vue` 导入了 `@/composables/useModal` 和 `_c/UnityModal/index.vue`
   - `src/Layout/components/SideBar/Menu.vue` 和 `Title.vue` 导入了 `_c/CommonIcon/index.vue`（该文件由 `unplugin-icons` 自动生成，运行时可用，但源文件不存在是正常的）

2. **`src/lib/cookie.js` 中的 bug**：读取的是 `envConfig.expires` 和 `envConfig.domain`，但实际配置对象嵌套在 `envConfig.cookie` 下（`envConfig.cookie.expires`、`envConfig.cookie.domain`）。domain 设置会静默回退为 `''`（无域名限制）。

3. **路由守卫过度重定向**：`src/router/index.js` 中的 `beforeEach` 守卫对所有已认证的导航都调用 `next('/')`（而不仅仅是登录页访问）。这导致所有已登录用户都被强制跳回首页，使首页以外的页面无法访问。

4. **占位测试**：`src/__tests__/App.spec.js` 和 `e2e/vue.spec.js` 都断言了 Vite 脚手架文本 `"You did it!"`，该文本已不在应用中。这些测试会失败。

5. **首次运行才生成的文件**：`eslint.config.js` 继承 `./.eslintrc-auto-import.json`，Vite 会生成 `types/eslintrc-auto-import.d.ts` 和 `types/icons.d.ts`。这些文件在首次运行 dev server 或构建之前不存在。在执行 lint 之前先运行一次 `npm run dev` 以生成这些文件。
