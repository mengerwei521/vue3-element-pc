### 文件名

.editorconfig 配置文件用于在不同编辑器和IDE间保持代码风格一致

.gitattributes 文件是Git版本控制系统中的一个配置文件，主要用于定义特定文件或路径的属性，从而精细控制Git如何处理这些文件
它解决的核心问题是文件在版本控制中的差异化处理需求，特别是跨平台协作时的兼容性问题

jsconfig.json 用于提升编译器感知功能【代码补全，类型检查，模块路径解析】

### 插件

view-ui-plus 组件库

@babel/core @babel/preset-env 主要作用是将 ECMAScript 2015+ 代码转换为向后兼容的 JavaScript 版本，包括语法转换、源代码转换等。它解决了浏览器对 ES6+ 新特性支持不一致的问题，避免在某些低版本浏览器中报错。

‌unplugin-auto-import‌ 主要负责自动导入 JavaScript / TypeScript 的 API 和函数【意味着开发者无需再在每个文件中手动编写 import { ref, reactive } from 'vue' 这样的语句】
unplugin-vue-components‌ 则专注于 Vue 组件的自动导入和注册

babel-plugin-import 实现按需加载组件，减少文件体积

vite-plugin-html 旨在提供对 HTML 文件的灵活控制

js-cookie 用于处理浏览器 Cookie，支持所有现代浏览器且易于使用

less less-loader 配置less样式编译

unplugin-icons 自定义icon插件

### 路由

各模块路由命名规则 xxx_router.js

### 组件

#### SvgIcon组件

使用时：svg文件命名规则 svg_icon_xxx
