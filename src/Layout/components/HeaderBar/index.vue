<template>
  <div class="header-bar">
    <div class="left">
      <SvgIcon :name="stowUnfoldIcon" :size="30" @click="clickCollapse" />
      <BreadCrumb class="navigation" />
      <el-icon ref="refresh_icon" class="refresh" :size="20" color="#409EFF" @click="onRefresh">
        <Refresh />
      </el-icon>
    </div>
    <div class="right">
      <el-tooltip
        effect="dark"
        :content="isFullscreen ? $t('fullscreen') : $t('outFullscreen')"
        placement="bottom"
      >
        <SvgIcon
          class="full-screen"
          :name="isFullscreen ? 'svg_icon_no_full_screen' : 'svg_icon_full_screen'"
          :size="20"
          color="#000"
          @click="toggle"
        />
      </el-tooltip>
      <el-dropdown class="multilingual" trigger="click" @command="handleSetLanguage">
        <span class="el-dropdown-link">
          <span>{{ multilingualName }} </span>
          <el-icon style="margin-left: 5px"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh"> 简体中文 </el-dropdown-item>
            <el-dropdown-item command="en"> English </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <User />
    </div>
  </div>
</template>

<script>
import { useFullscreen } from '@vueuse/core'
import SvgIcon from '@/SvgIcon/index.vue'
import BreadCrumb from './BreadCrumb.vue'
import User from './User.vue'
import { usePublicStore } from '@/stores/modules/public'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'HeaderBar',
  components: {
    SvgIcon,
    BreadCrumb,
    User,
  },
  setup() {
    const publicStore = usePublicStore()
    const isCollapse = computed(() => {
      return publicStore.isCollapse
    })
    //侧边栏的收起与展开图标
    const stowUnfoldIcon = ref('')
    watch(
      isCollapse,
      (newValue, oldValue) => {
        stowUnfoldIcon.value = newValue === true ? 'svg_icon_put-away' : 'svg_icon_expand'
      },
      { immediate: true, deep: true },
    )
    //侧边栏的收起与展开
    function clickCollapse() {
      if (stowUnfoldIcon.value === 'svg_icon_put-away') {
        publicStore.getSidebarStatus(false)
      } else {
        publicStore.getSidebarStatus(true)
      }
    }
    //返回一个浅层 ref，其值将与模板中的具有匹配 ref attribute 的元素或组件同步。
    const refresh_icon = useTemplateRef('refresh_icon')
    const deg = ref(0)
    function onRefresh() {
      console.log('刷新页面', refresh_icon)
      deg.value += 360
      refresh_icon.value.$el.style.transition = 'transform 1s ease-in-out'
      refresh_icon.value.$el.style.transform = `rotate(${deg.value}deg)`
      publicStore.onRefreshRouter()
    }
    //全屏与非全屏
    const { isFullscreen, toggle } = useFullscreen()
    //多语言切换
    const { locale } = useI18n()
    const handleSetLanguage = (lang) => {
      console.log('切换语言', lang)
      locale.value = lang
      localStorage.setItem('lang', lang)
    }
    const multilingualName = computed(() => {
      switch (locale.value) {
        case 'zh':
          return '简体中文'
        case 'en':
          return 'English'
        default:
          return '简体中文'
      }
    })

    return {
      stowUnfoldIcon,
      clickCollapse,
      refresh_icon,
      onRefresh,
      isFullscreen,
      toggle,
      locale,
      multilingualName,
      handleSetLanguage,
    }
  },
})
</script>

<style lang="less" scoped>
.header-bar {
  flex-shrink: 0;
  background-color: #fff;
  height: 65px;
  box-sizing: border-box;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    .navigation {
      margin-left: 10px;
    }
    .refresh {
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .full-screen {
      cursor: pointer;
    }
    .multilingual {
      margin-left: 20px;
      .el-dropdown-link {
        cursor: pointer;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
