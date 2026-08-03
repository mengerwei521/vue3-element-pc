<template>
  <div class="unity-model">
    <div>{{ title }}</div>
    <div>{{ user }}</div>
    <el-button type="primary" @click="onClick">关闭</el-button>
  </div>
</template>

<script>
export default defineComponent({
  name: 'unity-modal',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: '' },
    prop: { type: Object, default: () => ({}) },
  },
  emits: ['update:visible', 'loadList'],
  setup(props, { emit }) {
    const user = inject('user', null)

    function onClick() {
      emit('loadList')
      emit('update:visible', false)
    }

    return { onClick, user }
  },
})
</script>
