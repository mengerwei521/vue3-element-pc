<template>
  <span class="title">
    {{ title }}
    <el-badge v-if="badgeNum" :is-dot="isDot" :value="badgeNum" :max="99" />
  </span>
</template>

<script>
import CommonICon from '_c/CommonIcon/index.vue'
export default {
  name: 'Title',
  components: {
    CommonICon,
  },
  props: {
    isDot: {
      type: Boolean,
      default: false,
    }, //是否显示小红点而非数字
    title: {
      type: String,
      default: '',
    }, //路由标题
    badgeNum: {
      type: Number,
      default: 0,
    }, // 未读数
  },
  watch: {
    badgeNum: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {},
    },
  },
  setup() {
    return {}
  },
}
</script>

<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
  :deep(.el-badge) {
    margin-left: 5px;
    display: flex;
    align-items: center;
  }
}
</style>
