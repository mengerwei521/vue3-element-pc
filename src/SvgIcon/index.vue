<template>
  <i class="svg-icon">
    <svg :class="['icon', name]" :style="svgStyle" aria-hidden="true">
      <use :href="symbolId" />
    </svg>
  </i>
</template>

<script>
export default defineComponent({
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'svg_icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#303133',
    },
    size: {
      type: Number,
      default: 16,
    },
  },
  setup(props) {
    const symbolId = computed(() => {
      return `#${props.name}`
    })
    const svgStyle = computed(() => {
      let style = ''
      if (props.size) {
        style = `width:${props.size}px;height:${props.size}px;`
      }
      if (props.color) {
        style += `color:${props.color};`
      }
      return style
    })
    console.log(svgStyle, 'styoe')
    return { symbolId, svgStyle }
  },
})
</script>
<style lang="less" scoped>
.svg-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  text-align: center;
  vertical-align: middle;
  .icon {
    fill: currentColor; //继承父元素
    overflow: hidden;
  }
}
</style>
