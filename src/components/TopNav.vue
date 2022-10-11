<template>
  <div class="top-nav">
    <span class="logo">
      <img src="@/assets/images/logo.png" alt="">
    </span>
    <span class="profile">
      <span class="img-box">
        <img :src="userInfo? userInfo.portrait:''" alt="">
      </span>
      <span class="name">{{userName}}</span>
      <span class="identity">{{identity}}</span>
      <a href="#/Login" class="quit" @click="onLogoutClick">{{aWords}}</a>
    </span>
  </div>
</template>

<script>
import { inject } from '@vue/runtime-core'

let ajaxPost = null
let apiUrls = null

export default {
  name: 'TopNav',
  setup () {
    ajaxPost = inject('ajaxPost')
    apiUrls = inject('apiUrls')
  },
  data () {
    return {}
  },
  props: {
    userInfo: {
      type: Object,
      default: null
    },
    userName: {
      type: String,
      default: ''
    }
  },
  methods: {
    onLogoutClick () {
      const url =
        apiUrls.logout
      ajaxPost(
        url,
        JSON.stringify({
        }),
        (res) => {
          // console.log(res.responseText)
        },
        () => {
          console.log(0)
        }
      )
    }
  },
  computed: {
    aWords () {
      if (this.userName === '') {
        return '登录'
      } else {
        return '退出登录'
      }
    },
    identity () {
      if (this.userInfo && Object.keys(this.userInfo).length > 0) {
        return this.userInfo.isAdmin ? '系统管理员' : '监测人员'
      } else {
        return ''
      }
    }
  },
  watch: {
    userInfo () {
      // console.log(this.userInfo)
    }
  }
}
</script>

<style scoped>
  .top-nav{
    height: 60px;
  }

  .top-nav .profile{
    width: 20%;
    height: 100%;
    margin-right: 30px;
    display: flex;
    float: right;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }

  .top-nav .profile .img-box{
    width: 35px;
    height: 35px;
    margin-left: 20px;
    background-color: #ccc;
    border-radius: 50%;
  }

  .top-nav .profile .img-box img{
    width: 100%;
    border-radius: 50%;
  }

  .top-nav .profile .name{
    font-size: 14px;
    color: #204969;
  }

  .top-nav .profile .identity{
    padding: 5px;
    font-size: 14px;
    border-radius: 5px;
    color: #08ffc8;
    background-color: #204969;
    border: 1px solid #eaeaea;
  }

  .top-nav .profile .quit{
    color: #5aa7ef;
    text-decoration: none;
  }

  .logo{
      height: 100%;
      color: #5aa7ef;
      float: left;
      margin-left: 20px;
  }

  .logo>img{
    height: 95%;
    padding-top: 5px;
    user-select: none;
  }
</style>
