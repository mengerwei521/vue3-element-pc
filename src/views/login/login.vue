<template>
  <div class="login">
    <div class="module">
      <h1 class="title">{{ $t('login') }}</h1>
      <Login class="content" @on-submit="handleSubmit">
        <UserName name="userid" />
        <Password name="password" :password="true" />
        <Submit />
      </Login>
    </div>
  </div>
</template>

<script>
import { useLoginStore } from '@/stores/modules/login'
export default {
  name: 'login',
  setup() {
    const router = useRouter()
    const loginStore = useLoginStore()
    const handleSubmit = (valid, { userid, password }) => {
      if (valid) {
        console.log('Received values of form: ', userid, password)
        loginStore
          .handleLogin({ userid, password })
          .then((res) => {
            console.log(res, 'res')
            router.push('/')
          })
          .catch((err) => {
            console.log(err, 'err')
          })
      }
    }
    return { handleSubmit }
  },
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url('../../assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;

  .module {
    position: absolute;
    right: 100px;
    top: 300px;
    width: 400px;
    height: 300px;
    border-radius: 20px;
    background-color: #fff;
    padding: 30px;

    .title {
      text-align: center;
      padding-bottom: 10px;
    }

    .content {
    }
  }
}
</style>
