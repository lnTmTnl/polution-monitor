<template>
  <div class="tab-bar">
    <div class="box" ref="tabBarBox">
      <ul class="list">
        <router-link
          v-for="(obj, index) in selections"
          :key="index"
          :to="obj.url + '?userId=' + userId + '&userName=' + userName"
        >
          <li
            @click="selectionClicked(index)"
            :class="{ selected: obj.selected }"
            :hidden="userInfo&&obj.isAdminOnly&&!userInfo.isAdmin"
          >
            {{ obj.item }}
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'TabBar',
  mounted () {
    window.addEventListener('scroll', this.paperScroll, true)
  },
  data () {
    return {
      selections: reactive([
        {
          selected: true,
          item: '企业管理',
          url: '/CompanyManage',
          isAdminOnly: false
        },
        {
          selected: false,
          item: '个人中心',
          url: '/PersonalCenter',
          isAdminOnly: false
        },
        {
          selected: false,
          item: '用户管理',
          url: '/UserManage',
          isAdminOnly: true
        },
        {
          selected: false,
          item: '日志管理',
          url: '/LogManage',
          isAdminOnly: true
        },
        {
          selected: false,
          item: '数据管理',
          url: '/DataManage',
          isAdminOnly: false
        },
        {
          selected: false,
          item: '反馈信息管理',
          url: '/FeedbackManage',
          isAdminOnly: true
        }
      ])
    }
  },
  props: {
    userId: {
      type: Number,
      default: NaN
    },
    userName: {
      type: String,
      default: ''
    },
    userInfo: {
      type: Object,
      default: null
    }
  },
  methods: {
    selectionClicked (index) {
      for (let i = 0; i < this.selections.length; i++) {
        if (i === index) {
          this.selections[i].selected = true
        } else {
          this.selections[i].selected = false
        }
      }
    },
    paperScroll () {
      if (this.$refs.tabBarBox.getBoundingClientRect().top <= 0) {
        this.$refs.tabBarBox.style.position = 'fixed'
        this.$refs.tabBarBox.style.top = '0'
      }
      if (document.documentElement.scrollTop <= 60) {
        this.$refs.tabBarBox.style.position = ''
      }
    }
  }
}
</script>

<style scoped>
.tab-bar {
  float: left;
  width: 180px;
  height: 660px;
}

.list {
  flex: 1;
  padding: 0;
  margin: 0;
  padding-top: 15px;
  width: 180px;
  height: 660px;
  list-style: none;
  display: flex;
  flex-direction: column;
  background-color: #09192f;
}

.list li {
  user-select: none;
  color: #ccc;
  font-size: 18px;
  width: 100%;
  padding: 15px 0;
}

.list .selected {
  color: #fff;
  background-color: #000;
}

a {
  text-decoration: none;
}
</style>
