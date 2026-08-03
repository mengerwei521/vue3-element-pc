<template>
  <!-- 单 -->
  <template v-if="danRouteShow">
    <el-menu-item :class="['dan', uniqueKey]" :index="uniqueKey">
      <el-badge
        :is-dot="isCollapse && danRouteInfor.meta && danRouteInfor.meta.badge_num > 0"
        class="badge"
      >
        <CommonIcon
          class="common-icon"
          v-if="danRouteInfor.meta && danRouteInfor.meta.icon"
          :icon-name="danRouteInfor.meta.icon"
        />
      </el-badge>
      <template #title>
        <Title :title="showTitle(danRouteInfor)" :badge-num="danRouteInfor.meta.badge_num" />
      </template>
    </el-menu-item>
  </template>
  <!-- 多 -->
  <template v-else>
    <el-sub-menu :class="uniqueKey" :index="uniqueKey">
      <template #title>
        <el-badge :is-dot="isCollapse && judgeParentShow(routeItem)" class="badge">
          <CommonIcon
            class="common-icon"
            v-if="routeItem.meta && routeItem.meta.icon"
            :icon-name="routeItem.meta.icon"
          />
        </el-badge>
        <Title :title="showTitle(routeItem)" :isDot="true" :badge-num="routeItem.meta.badge_num" />
      </template>
      <Menu v-for="(route, index) in routeItem.children" :key="index" :route-item="route" />
    </el-sub-menu>
  </template>
</template>

<script>
import { usePublicStore } from '@/stores/modules/public'
import { useSideBar } from './useSideBar.js'
import CommonICon from '_c/CommonIcon/index.vue'
import Title from './Title.vue'
export default defineComponent({
  name: 'Menu',
  components: {
    CommonICon,
    Title,
  },
  props: {
    routeItem: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  setup(props, context) {
    let danRouteInfor = ref({}) //单路由数据
    let danRouteShow = ref(false) //单路由展示
    let uniqueKey = ref('') //唯一标识符
    const { showTitle, judgeRouteIsChildren, getNameOrHref, judgeParentShow } = useSideBar()

    //获取标识符、是否展示单路由、单路由数据
    function getUniqueKeyShowDanRouter() {
      let data = judgeRouteIsChildren(props.routeItem)
      if (data.type == 'dan') {
        danRouteInfor.value = data.route
        danRouteShow.value = true
      } else {
        danRouteShow.value = false
      }
      uniqueKey.value = data.route.name
    }
    getUniqueKeyShowDanRouter()

    const publicStore = usePublicStore()
    //获取侧边栏是否展开
    const isCollapse = computed(() => {
      return publicStore.isCollapse
    })
    return {
      judgeRouteIsChildren,
      judgeParentShow,
      showTitle,
      danRouteInfor,
      danRouteShow,
      uniqueKey,
      isCollapse,
    }
  },
})
</script>

<style lang="less" scoped>
.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  .common-icon {
    flex-shrink: 0;
    width: unset !important;
    margin-right: 10px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  }
}
</style>
