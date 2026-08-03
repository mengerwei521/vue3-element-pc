import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//自定义icon插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')
  return {
    plugins: [
      vue(),
      vueJsx(),
      // vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        // 自动导入 Vue 相关 API（ref, reactive, computed 等），再也不用手动 import 了
        imports: ['vue', 'vue-router', 'pinia'],
        eslintrc: {
          enabled: true, // 生成 .eslintrc-auto-import.json //自动生成，声明通过自动导入的全局变量
          filepath: './.eslintrc-auto-import.json',
        },
        dts: 'types/eslintrc-auto-import.d.ts', // 自动生成的类型声明文件 [ 因为你是 JS 项目，不需要生成 .d.ts 文件，设为 false 更干净]
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: false,
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/SvgIcon/svg')],
        symbolId: '[name]',
      }),
      {
        name: 'vite-clean-and-zip', // 插件名称
        apply: 'build', // 只在构建时应用
        buildStart() {
          // 删除dist目录
          if (fs.existsSync(path.resolve('dist'))) {
            fs.rmSync(path.resolve('dist'), { recursive: true })
          }
        },
        closeBundle() {
          execSync(`tar -czvf dist/${env.VITE_NODE_ENV}_dist.zip dist/${env.VITE_NODE_ENV}_dist`)
        },
      },
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        _c: fileURLToPath(new URL('./src/components', import.meta.url)),
        _v: fileURLToPath(new URL('./src/views', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "./src/assets/css/public.less";`,
          javascriptEnabled: true,
        },
      },
    },
    build: {
      outDir: `dist/${env.VITE_NODE_ENV}_dist`,
      target: ['es2022', 'edge90', 'chrome90', 'firefox90', 'safari15'],
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '^/api': {
          target: env.VITE_HTTP_BASE_URL_API,
          changeOrigin: true,
        },
        '/micro': {
          target: env.VITE_HTTP_BASE_URL_MICRO,
          rewrite: (path) => path.replace(/^\/micro/, ''),
          changeOrigin: true,
        },
      },
    }
  }
})
