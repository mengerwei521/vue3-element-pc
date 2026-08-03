<template>
  <el-dropdown class="user" placement="bottom">
    <div class="content">
      <el-avatar :size="30" :src="circleUrl" />
      <div class="name">{{ user.username }}</div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleLogout">{{ $t('logout') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { useLoginStore } from '@/stores/modules/login'
export default defineComponent({
  name: 'User',
  setup() {
    const router = useRouter()
    const loginStore = useLoginStore()
    const user = computed(() => loginStore.user)
    const circleUrl = computed(
      () =>
        user.value.pic_url || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    )
    const handleLogout = () => {
      loginStore.handleLogout()
      router.replace('/login')
    }
    return { circleUrl, handleLogout, user }
  },
})
</script>

<style lang="less" scoped>
.user {
  margin-left: 20px;
  flex-shrink: 0;
  .content {
    display: flex;
    align-items: center;
    cursor: pointer;
    .name {
      margin-left: 10px;
      font-weight: 500;
      font-size: 16px;
      color: #333;
    }
  }
}
</style>
