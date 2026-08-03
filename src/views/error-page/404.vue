<template>
  <div class="error">
    <div class="error-content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在。</p>
      <router-link to="/" class="back-home">返回首页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    return {}
  },
}
</script>

<style lang="less" scoped>
.error {
  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
