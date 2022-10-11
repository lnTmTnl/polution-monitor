<template>
  <div class="personal-center">
    <div class="left">
      <form action="" class="profile">
        <span class="item" v-for="(item, index) in profileItems" :key="index">
          <span>{{ item.name }}：</span>
          <input
            type="text"
            v-model="profileItems[index].value"
            :ref="inputs"
            @change="changeInputWidth(index)"
            :disabled="inputDisabled"
          />
          <span class="hidden-span" :ref="hiddenSpans">{{
            profileItems[index].value
          }}</span>
        </span>
      </form>
      <div>
        <button @click="onChangeProfileBtnClick" class="change-info-btn">{{ profileBtnText }}</button>
      </div>
      <form action="" class="feedback">
        <span>反馈信息：</span>
        <textarea name="" id="" cols="75" rows="6" v-model="feedbackContent"></textarea>
        <button class="submit" @click="onSubmitFeedback">提交反馈</button>
      </form>
    </div>
    <div class="right">
      <img :src="portrait" alt="" class="portrait"/>
    </div>
    <MessageBox :messageInfo="messageInfo" v-show="isShowMsgBox">
      <template v-slot:btns-slot>
        <button @click="onOkBtnClick">确定</button>
      </template>
    </MessageBox>
  </div>
</template>

<script scoped>
import MessageBox from '@/components/MessageBox.vue'
import { reactive, ref, nextTick, inject } from 'vue'

var profileItems = reactive([
  {
    name: '用户名',
    value: 'Name'
  },
  {
    name: 'ID',
    value: '000000'
  },
  {
    name: '所属单位',
    value: 'XXX部门'
  },
  {
    name: '工作电话',
    value: '114514'
  },
  {
    name: '单位地址',
    value: 'XX省XX市XX区XX街道00号'
  }
])

var inputArr = []
var hiddenSpanArr = []
let ajaxPost = null
let apiUrls = null

export default {
  name: 'PersonalCenter',
  setup () {
    ajaxPost = inject('ajaxPost')
    apiUrls = inject('apiUrls')

    const Ref = ref([])
    const inputs = (el) => {
      Ref.value.push(el)
      inputArr.push(el)
    }
    const hiddenSpans = (el) => {
      Ref.value.push(el)
      hiddenSpanArr.push(el)
    }
    nextTick(() => {
      for (let i = 0; i < Ref.value.length; i += 2) {
        Ref.value[i].style.width = Ref.value[i + 1].offsetWidth + 'px'
      }
    })
    return {
      inputs,
      hiddenSpans
    }
  },
  mounted () {
    ajaxPost(
      apiUrls.getUser,
      JSON.stringify({
        id: this.$route.query.userId
      }),
      (res) => {
        if (!res.responseText) return
        this.userInfo = JSON.parse(res.responseText).user
        profileItems[0].value = this.$route.query.userName
        profileItems[1].value = this.$route.query.userId
        profileItems[2].value = this.userInfo.department
        profileItems[3].value = this.userInfo.phone
        profileItems[4].value = this.userInfo.address
        this.portrait = this.userInfo.portrait
      },
      () => {
        console.log('000')
      }
    )
  },
  data () {
    return {
      profileItems,
      inputValue: '',
      inputDisabled: true,
      profileBtnText: '修改信息',
      feedbackContent: '',
      userInfo: [],
      portrait: '',
      isShowMsgBox: false,
      messageInfo: ''
    }
  },
  components: {
    MessageBox
  },
  methods: {
    changeInputWidth (index) {
      inputArr[index].style.width = hiddenSpanArr[index].offsetWidth + 'px'
    },
    onChangeProfileBtnClick () {
      if (this.inputDisabled) {
        this.profileBtnText = '完成'
      } else {
        this.profileBtnText = '修改信息'
      }
      this.inputDisabled = !this.inputDisabled
    },
    onSubmitFeedback () {
      if (this.feedbackContent.length === 0) return
      ajaxPost(
        apiUrls.addFeedback,
        JSON.stringify({
          userId: this.$route.query.userName,
          content: this.feedbackContent
        }),
        (res) => {
          this.isShowMsgBox = true
          this.messageInfo = '提交成功！'
          this.feedbackContent = ''
        },
        () => {
          console.log('000')
        }
      )
    },
    onOkBtnClick () {
      this.isShowMsgBox = false
    }
  }
}
</script>

<style scoped>
button,
.submit {
  user-select: none;
  width: 100px;
  height: 40px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #fff7f7;
  color: #204969;
  border: 1px solid #ccc;
}

.personal-center {
  display: flex;
}

.profile {
  display: flex;
  position: relative;
  flex-flow: row wrap;
  margin: 0 10px;
  background-color: #79BEDB;
  border: 1px solid #ccc;
}

.profile .item {
  display: flex;
  flex: 0 50%;
  margin: 30px 0;
}

.profile .item:nth-child(odd) {
  position: relative;
  left: 10%;
}

.profile .item:nth-child(even) {
  position: relative;
}

.profile .item span {
  white-space: nowrap;
}

.profile,
.feedback {
  font-size: 16px;
  color: #364857;
}

.profile input {
  margin-left: 5px;
  color: #204969;
  border: none;
  background-color: #00000000;
}

.change-info-btn{
  margin-top: 20px;
}

.feedback {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  margin-top: 90px;
  position: relative;
  left: 21%;
}

.feedback textarea {
  margin: 20px 0;
  background-color: #ccc;
  border: 1px solid #fff7f7;
  resize: none;
}

.right {
  position: absolute;
  top: 200px;
  right: 100px;
}

.right .portrait {
  position: absolute;
  height: 160px;
  right: 150px;
  top: -100px;
}

.submit {
  margin-left: 25%;
  cursor: pointer;
}

.hidden-span {
  font-size: 18px;
  padding: 0;
  visibility: hidden;
}
</style>
