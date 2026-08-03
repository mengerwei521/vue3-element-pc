<template>
  <router-view />
</template>

<script>
import { usePublicStore } from '@/stores/modules/public'
export default {
  setup() {
    console.log('App.vue 组件setup执行了')
    const publicStore = usePublicStore()
    onBeforeMount(async () => {
      await publicStore.getConfigInfo()
    })
  },
}
</script>

<style lang="less" scoped></style>
