<template>
  <div class="layout function_flex">
    <SideBar class="side-bar" />
    <el-container class="content">
      <HeaderBar class="header-bar" />
      <div class="module">
        <el-main class="main">
          <ParentView />
        </el-main>
        <el-footer class="footer-bar">&copy; 凯德尼医疗科技</el-footer>
      </div>
    </el-container>
  </div>
</template>

<script>
import { usePublicStore } from '@/stores/modules/public'
import ParentView from '_c/ParentView/index.vue'
import SideBar from './components/SideBar/index.vue'
import HeaderBar from './components/HeaderBar/index.vue'
import SvgIcon from '@/SvgIcon/index.vue'
export default defineComponent({
  name: 'Layout',
  components: { SideBar, HeaderBar, ParentView, SvgIcon },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const publicStore = usePublicStore()
    publicStore.getDefaultRoute(router.options.routes) //获取默认概览路由数据
    publicStore.setMenuList(router.options.routes) //获取侧边栏路由列表
    const isCollapse = computed(() => {
      return publicStore.isCollapse
    })
    onMounted(() => {
      publicStore.setBreadCrumb(route)
      getDocumentWidth()
      window.onresize = () => {
        getDocumentWidth()
      }
    })
    watch(route, (newValue, oldValue) => {
      publicStore.setBreadCrumb(newValue)
    })
    //获取窗口高度-动态判断侧边栏收起与展开
    function getDocumentWidth() {
      console.log('document.body.clientWidth', document.body.clientWidth)
      if (document.body.clientWidth <= 960) {
        publicStore.getSidebarStatus(true)
      } else {
        publicStore.getSidebarStatus(false)
      }
    }
    return { isCollapse }
  },
})
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: unset;
  height: 100%;
  .side-bar {
    flex-shrink: 0;
    width: auto;
  }
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f0f0f0;
    .header-bar {
      flex-shrink: 0;
    }
    .module {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .main {
        height: 100%;
        display: flex;
        flex-direction: column;
        margin: 15px 15px 15px 15px;
        padding: 10px;
        background-color: #fff;
      }

      .footer-bar {
        flex-shrink: 0;
        background: #fff;
        border-top: 1px solid #e5e5e5;
        height: 50px;
        box-sizing: border-box;
        padding: 15px 20px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
