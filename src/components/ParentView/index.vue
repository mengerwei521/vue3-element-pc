<template>
  <div ref="scrollView" class="parent-view">
    <router-view v-slot="{ Component }" :key="refreshKey">
      <KeepAlive :include="cachedComponents">
        <component :is="Component" :key="route.path" />
      </KeepAlive>
    </router-view>
  </div>
</template>

<script>
import { usePublicStore } from '@/stores/modules/public'
export default {
  setup() {
    let publicStore = usePublicStore()
    let cachedComponents = computed(() => {
      return publicStore.keepAliveList
    }) //缓存路由
    let refreshKey = computed(() => {
      return publicStore.refreshKey
    }) //刷新路由
    const route = useRoute()

    const scrollView = ref(null)
    const scrollPositions = {}
    // 监听路由变化
    watch(
      () => route.name,
      async (newName, oldName) => {
        if (!scrollView.value) return
        // 1️⃣ 离开旧页面：如果是缓存页，保存滚动位置
        if (oldName && publicStore.keepAliveList.includes(oldName)) {
          scrollPositions[oldName] = scrollView.value.scrollTop
        }

        // 2️⃣ 进入新页面
        if (newName && publicStore.keepAliveList.includes(newName)) {
          // 缓存页面：恢复位置（默认 0）
          await nextTick()
          const pos = scrollPositions[newName] ?? 0
          scrollView.value.scrollTop = pos
        }
      },
      { immediate: true },
    )
    return { route, scrollView, cachedComponents, refreshKey }
  },
}
</script>

<style lang="less" scoped>
.parent-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
}
</style>
