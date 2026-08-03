import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVitest from '@vitest/eslint-plugin'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'
export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx}'],// 指定要检查的文件类型
  },
  // 统一管理忽略文件，自动排除构建输出和测试文件
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,// 浏览器环境全局变量
      },
    },
  },
  // 使用ESLint推荐规则
  js.configs.recommended,
  // 使用Vue.js官方规则
  ...pluginVue.configs['flat/essential'],

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  //避免ESLint与Prettier规则冲突
  skipFormatting,
  {
    rules: {
      'vue/multi-word-component-names': 'off', // 禁用该规则 [该规则要求组件名称必须由多个单词组成，以避免与现有的或未来的 HTML 标签冲突]
      "@typescript-eslint/no-explicit-any": ["off"], // 禁用该规则 [禁止使用 any 类型]
      "no-unused-vars": "off", // 禁用该规则 [禁止出现未使用过的变量]
      "no-empty": "off", // 禁用该规则 [禁止出现空语句块]
      'no-undef': 'off', // 禁用该规则 [禁止使用未声明的变量]
    },//规则配置
    extends: ['eslint:recommended', './.eslintrc-auto-import.json'] // 显式继承自动导入配置
  }
])//封装配置，提供更好的类型提示
