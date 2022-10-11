<template>
  <div class="login">
    <div class="login-box">
      <input type="text" placeholder="账号" id="id-input" v-model="name" />
      <div class="warningBox" :class="classOfIdSign">{{ idWarningInfo }}</div>
      <input
        type="password"
        placeholder="密码"
        v-model="password"
        id="password-input"
      />
      <div class="warningBox" :class="classOfPasswordSign">
        {{ passwordWarningInfo }}
      </div>
      <button @click="send">登录</button>
    </div>
  </div>
</template>

<script>
import { inject } from '@vue/runtime-core'

let ajaxPost = null
let apiUrls = null

export default {
  name: 'Login',
  setup () {
    ajaxPost = inject('ajaxPost')
    apiUrls = inject('apiUrls')
  },
  data () {
    return {
      id: '',
      name: '',
      password: '',
      classOfIdSign: '',
      classOfPasswordSign: '',
      idWarningInfo: '',
      passwordWarningInfo: '',
      user: {
        username: this.name,
        password: this.password
      }
    }
  },
  methods: {
    send () {
      const url = apiUrls.login
      const loginUser = {
        username: this.name,
        password: this.password
      }

      ajaxPost(
        url,
        JSON.stringify(loginUser),
        (res) => {
          if (JSON.parse(res.responseText).status === 0) {
            this.id = JSON.parse(res.responseText).userId
            this.user = loginUser
            this.passwordWarningInfo = ''
            this.$router.push({
              path: '/CompanyManage',
              query: {
                userId: this.id,
                userName: this.user.username
              }
            })
            ajaxPost(
              apiUrls.addLog,
              JSON.stringify({
                operation: 'login'
              }),
              (res) => {
              },
              () => {
                console.log('000')
              }
            )
          } else {
            this.passwordWarningInfo = '账号或密码错误'
          }
        },
        () => {
          this.passwordWarningInfo = '登录超时'
        }
      )
    }
  }
}
</script>

<style scope>
.login-box {
  margin-left: calc(50% - 160px);
  margin-top: 100px;
  display: flex;
  align-items: center;
  width: 320px;
  height: 150px;
  padding: 20px 0;
  color: #08ffc8;
  background-color: #204969;
  border: 1px solid #eaeaea;
  flex-direction: column;
}

.login-box > * {
  margin-top: 10px;
}

.warningBox {
  color: red;
  font-size: 14px;
}

button {
  padding: 5px;
  font-size: 16px;
  border-radius: 5px;
  color: #fff;
  background-color: #00000033;
  border: 1px solid #ccc;
}
</style>
