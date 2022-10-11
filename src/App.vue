<template>
  <div>
    <TopNav :userName="userName" :userInfo="userInfo" />
    <TabBar
      :userName="userName"
      :userId="userId"
      v-show="isLogined"
      :userInfo="userInfo"
    />
    <router-view />
  </div>
</template>

<script>
import TopNav from '@/components/TopNav.vue'
import TabBar from '@/components/TabBar.vue'
// import TryTabBarColorsOn from '@/components/TryTabBarColorsOn.vue'
import * as echarts from 'echarts'
import { provide } from 'vue'

const ColumnTitleDictionary = {
  username: '用户名',
  admin: '是否管理员',
  userId: '用户编号',
  Identity: '职位',
  enterpriseId: '企业编号',
  sensorId: '排污口编号',
  time: '时间',
  pollutionId: '污染物编号',
  pollutionDensity: '污染物浓度',
  pollutionEmission: '污染物排放量',
  operation: '操作名称',
  content: '内容',
  isNormal: '数据风险',
  date: '日期',
  typeByTimeSeries: '时间序列异常分类结果及异常概率',
  typeByRelation: '关联性异常分类结果及异常概率',
  typeNameByTimeSeries: '时间序列异常分类结果',
  possibilityByTimeSeries: '时间序列分类异常概率',
  typeNameByRelation: '关联性异常分类结果',
  possibilityByRelation: '关联性异常分类异常概率',
  abnormalCondition: '异常情况'
}

const ajaxPost = (
  url,
  data,
  success = (xhr) => {},
  fail = (xhr) => {},
  asyn = true
) => {
  const xhr = new XMLHttpRequest()
  xhr.withCredentials = true
  xhr.open('POST', url, asyn)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(xhr)
      } else {
        fail(xhr)
      }
    }
  }
  xhr.send(data)
}

const apiUrls = {
  login: 'http://localhost:8083/login',
  logout: 'http://localhost:8083/logout',
  getUser: 'http://localhost:8083/get-user',
  getUserAuthorities: 'http://localhost:8083/get-user-authorities',
  getSewageData: 'http://localhost:8083/get-sewage-data',
  getSewageDataByEnterprise: 'http://localhost:8083/get-sewage-data-by-enterprise',
  getNormalityByPage: 'http://localhost:8083/get-normality-by-page',
  getAbnormalDates: 'http://localhost:8083/get-abnormal-dates',
  getDatesByEnterprise: 'http://localhost:8083/get-dates-by-enterprise',
  getEnterpriseIds: 'http://localhost:8083/get-enterprise-ids',
  getFeedbacks: 'http://localhost:8083/get-feedbacks',
  getLogs: 'http://localhost:8083/get-logs',
  addUser: 'http://localhost:8083/add-user',
  addFeedback: 'http://localhost:8083/add-feedback',
  addLog: 'http://localhost:8083/add-log',
  deleteFeedback: 'http://localhost:8083/delete-feedback',
  deleteUser: 'http://localhost:8083/delete-user',
  classifyByRelation: 'http://localhost:8083/classify-by-relation',
  classifyByTimeSeries: 'http://localhost:8083/classify-by-time-series',
  isNormal: 'http://localhost:8083/is-normal'
}

export default {
  setup () {
    provide('ec', echarts) // provide
    provide('ColumnTitleDictionary', ColumnTitleDictionary)
    provide('ajaxPost', ajaxPost)
    provide('apiUrls', apiUrls)
  },
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {
    userId () {
      let id = null
      if (this.$route.query.userId !== null) id = this.$route.query.userId
      return Number.parseInt(id)
    },
    userName () {
      return this.$route.query.userName
    },
    isLogined () {
      return this.$route.query.userName !== undefined
    }
  },
  components: {
    TopNav,
    TabBar
    // TryTabBarColorsOn
  },
  watch: {
    userId () {
      const url =
        apiUrls.getUser
      ajaxPost(
        url,
        JSON.stringify({
          id: this.userId
        }),
        (res) => {
          if (!res.responseText) return
          this.userInfo = JSON.parse(res.responseText).user
          /* this.datas = JSON.parse(res.responseText).sewageData.items
          this.screenedDatas = JSON.parse(res.responseText).sewageData.items
          this.totalPage = JSON.parse(res.responseText).totalPages */
        },
        () => {
          console.log(0)
        },
        false
      )
    }
  }
}

// <router-link to="/">Home</router-link> |
// <router-link to="/about">About</router-link>
</script>

<style lang="less">
@import url('./assets/css/normalize.css');
body {
  width: 100%;
  height: 100%;
  background-color: #dadada;
  color: #204969;
  // background-image: url('./assets/images/bg.jpg');
  // background-repeat: no-repeat;
  // background-size: cover;
  // background-attachment: fixed;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
}

.icon,
button {
  cursor: pointer;
}
</style>
