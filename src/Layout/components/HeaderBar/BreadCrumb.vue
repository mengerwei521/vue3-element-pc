<template>
  <el-breadcrumb class="bread-crumb" :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in breadCrumbList" replace :key="item.name" :to="item.to">{{
      $t(item.meta.title)
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { usePublicStore } from '@/stores/modules/public'
export default defineComponent({
  name: 'BreadCrumb',
  setup() {
    const publicStore = usePublicStore()
    const breadCrumbList = computed(() => {
      return publicStore.breadCrumbList
    })
    console.log(breadCrumbList, 'breadCrumbListbreadCrumbList')
    return { breadCrumbList }
  },
})
</script>

<style lang="less" scoped>
.bread-crumb {
  :v-deep(.el-breadcrumb__item:last-child) {
    .el-breadcrumb__inner {
      font-weight: bold;
      color: var(--el-text-color-primary);
    }
  }
}
</style>
