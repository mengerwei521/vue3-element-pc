<template>
  <el-aside class="aside function_flex" :style="{ width: isCollapse ? '65px' : '250px' }">
    <div class="logo">
      <el-image :src="logoUrl" fit="contain" />
    </div>
    <el-scrollbar class="scroll-bar">
      <el-menu
        class="menu"
        popper-class="popper"
        :default-active="defaultActive"
        :collapse="isCollapse"
        @select="onSelectRouter"
      >
        <Menu v-for="(route, index) in menuList" :key="index" :route-item="route" />
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script>
import envConfig from '@/env-config'
import { usePublicStore } from '@/stores/modules/public'
import logoFull from '@/assets/images/logo.jpg'
import logoMin from '@/assets/images/logo-min.jpg'
import Menu from './Menu.vue'
export default defineComponent({
  components: {
    Menu,
  },
  setup() {
    const route = useRoute()
    const defaultActive = ref(route.name || envConfig.defaultRouteName)
    const publicStore = usePublicStore()
    //侧边栏路由数据
    const menuList = computed(() => {
      return publicStore.menuList
    })
    console.log('menuList', menuList)
    //侧边栏是否折叠
    const isCollapse = computed(() => {
      return publicStore.isCollapse
    })
    // 直接根据状态返回导入的模块
    const logoUrl = computed(() => (isCollapse.value ? logoMin : logoFull))
    const router = useRouter()
    //路由跳转
    function onSelectRouter(value) {
      defaultActive.value = value
      router.push({ name: value })
    }
    return { defaultActive, menuList, isCollapse, logoUrl, onSelectRouter }
  },
})
</script>

<style lang="less" scoped>
.aside {
  transition: width 0.3s;
  .logo {
    height: 65px;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    :deep(.el-image) {
      width: 100%;
      height: 100%;
    }
  }
  .scroll-bar {
    width: fit-content;

    .menu:not(.el-menu--collapse) {
      width: 250px;
      border-right: none !important;
    }
  }
  :deep(.el-menu) {
    border-right: unset !important;
  }
}
</style>
<style lang="less">
.popper {
  border: unset !important;
  .el-menu--popup {
    .el-sub-menu__title {
      .badge {
        .el-badge__content {
          display: none !important;
        }
      }
    }

    .el-menu-item {
      .badge {
        .el-badge__content {
          display: none !important;
        }
      }
    }
  }
}
</style>
