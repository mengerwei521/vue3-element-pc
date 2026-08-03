<template>
  <div class="home">
    <el-button type="primary" @click="onClick">点击</el-button>
    <el-input
      v-model="input1"
      style="width: 240px"
      size="large"
      placeholder="Please Input"
      suffix-icon="Search"
    />
    <el-input v-model="input2" style="width: 240px" placeholder="Please Input" suffix-icon="User" />
    <button @click="test">改变b的值</button>
    <h2>当前b的值:{{ b }}</h2>
  </div>
</template>

<script setup>
import { usePublicStore } from '@/stores/modules/public'
import { useModal, closeAllModal } from '@/composables/useModal'
import UnityModal from '_c/UnityModal/index.vue'
defineOptions({
  name: 'home',
})
let route = useRoute()
console.log(route, 'routerouteroute')
const publicStore = usePublicStore()
console.log(publicStore.configInfor, 'configInfor')
const input1 = ref('')
const input2 = ref('')
const a = ref(true)
const b = ref(false)

watchEffect((res) => {
  console.log('watchEffect执行了', a.value)
  if (b.value || a.value) {
    console.log('执行了更新操作')
  }
})

// const user = reactive({
//   name: '李四',
//   age: 20,
// })
const user = ref(1)
const test = () => {
  b.value = !b.value
  user.value += 1

  console.log(user, 'useruseruseruser')
  closeAllModal()
}
provide('user', user)
const showModal = useModal()
const Modal = ref(null)
const onClick = () => {
  Modal.value = showModal({
    appendTo: document.body,
    modalComponent: UnityModal,
    title: '弹窗标题',
    prop: {
      type: true,
      bar: 'aa',
    },
    slots: 'aaa',
    onLoadList: loadList,
  })
}
function loadList() {
  console.log(Modal.value, 'ModalModalModal')
  setTimeout(() => {
    ElMessage({
      message: 'Congrats, this is a success message.',
      type: 'success',
    })
    //  Modal.value.close()
  }, 4000)
}
</script>

<style lang="less" scoped></style>
