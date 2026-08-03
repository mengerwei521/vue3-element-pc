<template>
  <template v-if="isSvgIcon">
    <SvgIcon :name="iconName" :color="iconColor" :size="iconSize" />
  </template>
  <template v-else>
    <el-icon :color="iconColor" :size="iconSize">
      <component :is="iconName" />
    </el-icon>
  </template>
</template>

<script>
import { defineComponent, computed } from 'vue'
import SvgIcon from '@/SvgIcon/index.vue'
export default defineComponent({
  name: 'CommonIcon',
  components: {
    SvgIcon,
  },
  props: {
    iconName: {
      type: String,
      required: true,
    }, //icon名称
    iconColor: {
      type: String,
      default: '#303133',
    }, //颜色
    iconSize: {
      type: Number,
      default: 20,
    }, //大小
  },
  setup(props) {
    let isSvgIcon = computed(() => {
      return props.iconName.includes('svg_icon_')
    }) //是否使用是SvgIcon
    return {
      isSvgIcon,
    }
  },
})
</script>

<style lang="less" scoped>
:deep(.el-icon) {
  display: flex;
  align-items: center;
  margin-right: unset;
  path {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
}
</style>
