<template>
  <div class="user-data-table">
    <DataTable
      :data="datas"
      :currentPage="currentPage"
      :totalPage="totalPage"
      @onChangePage="onChangePage"
      @onTurnToPage="onTurnToPage"
      @getSelectedDatas="getSelectedDatas"
      @onSearchBtnClick="onSearchBtnClick"
    >
      <template v-slot:table-top-right-slot>
        <img src="@/assets/icons/add-user.png" alt="" class="icon" @click="onAddUserIconClick">
        <img src="@/assets/icons/delete.png" alt="" class="icon" @click="onDeleteIconClick">
      </template>
    </DataTable>
    <div class="add-user-box" :class="{hidden:hideAddUser}">
      <input type="text" placeholder="用户名" v-model="addUserName">
      <input type="text" placeholder="密码" v-model="addUserPassword">
      <div class="btns-bar">
        <button @click="onAddUserBtnClick">添加</button>
        <button @click="onAddUserIconClick">取消</button>
      </div>
    </div>
    <MessageBox :messageInfo="messageInfo" v-show="isShowMsgBox">
      <template v-slot:btns-slot>
        <button class="msgbox-btn" @click="onOkBtnClick">确定</button>
        <button class="msgbox-btn" @click="onCancelBtnClick">取消</button>
      </template>
    </MessageBox>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import MessageBox from '@/components/MessageBox.vue'
import { inject } from '@vue/runtime-core'
let ajaxPost = null
let apiUrls = null

export default {
  name: 'UserManage',
  setup () {
    ajaxPost = inject('ajaxPost')
    apiUrls = inject('apiUrls')
  },
  mounted () {
    this.getDatas(1, 20)
  },
  data () {
    return {
      datas: [
      ],
      selectedDatas: [],
      currentPage: 1,
      totalPage: 100,
      hideAddUser: true,
      addUserName: '',
      addUserPassword: '',
      isShowMsgBox: false,
      messageInfo: ''
    }
  },
  components: {
    DataTable,
    MessageBox
  },
  methods: {
    onCheckboxClick (index) {
      // console.log(index)
    },
    onAddUserBtnClick () {
      const reg = /^\s+$/g
      if (this.addUserName !== '' && this.addUserPassword !== '' && !reg.test(this.addUserName) && !reg.test(this.addUserPassword)) {
        const url =
        apiUrls.addUser
        ajaxPost(
          url,
          JSON.stringify({
            username: this.addUserName,
            password: this.addUserPassword
          }),
          (res) => {
            this.getDatas(this.currentPage, 20)

            ajaxPost(
              apiUrls.addLog,
              JSON.stringify({
                operation: 'add user'
              }),
              (res) => {
              },
              () => {
                console.log('000')
              }
            )

            this.onAddUserIconClick()
          },
          () => {
            console.log(0)
          }
        )
      }
    },
    onAddUserIconClick () {
      this.addUserName = ''
      this.addUserPassword = ''
      this.hideAddUser = !this.hideAddUser
    },
    getSelectedDatas (datas) {
      this.selectedDatas = datas
    },
    onDeleteIconClick () {
      this.isShowMsgBox = !this.isShowMsgBox
      this.messageInfo = '确认删除?'
    },
    onOkBtnClick () {
      const url = apiUrls.deleteUser
      for (let i = 0; i < this.selectedDatas.length; i++) {
        ajaxPost(
          url,
          JSON.stringify({
            username: this.selectedDatas[i].username
          }),
          (res) => {
            this.getDatas(this.currentPage, 20)

            ajaxPost(
              apiUrls.addLog,
              JSON.stringify({
                operation: 'delete user'
              }),
              (res) => {
              },
              () => {
                console.log('000')
              }
            )
          },
          () => {
            console.log(0)
          }
        )
      }
      this.isShowMsgBox = false
    },
    onCancelBtnClick () {
      this.isShowMsgBox = false
    },
    getDatas (page, itemPerPage) {
      const url =
        apiUrls.getUserAuthorities
      ajaxPost(
        url,
        JSON.stringify({
          page: page,
          itemPerPage: itemPerPage
        }),
        (res) => {
          const data = JSON.parse(res.response).userAuthorities.items
          for (let i = 0; i < data.length; i++) {
            delete (data[i].allowChangeThreshold)
          }
          this.datas = data
          this.totalPage = JSON.parse(res.responseText).totalPages
        },
        () => {
          console.log(0)
          this.datas = []
        }
      )
    },
    onChangePage (left) {
      if (left) {
        if (this.currentPage > 1) {
          this.currentPage--
        }
      } else {
        if (this.currentPage < this.totalPage) {
          this.currentPage++
        }
      }
      this.getDatas(this.currentPage, 20)
    },
    onTurnToPage (page) {
      this.getDatas(page, 20)
      this.currentPage = page
    },
    onSearchBtnClick (searchedDatas) {
      this.datas = searchedDatas
    }
  }
}
</script>

<style scoped>
.checkbox {
  transform: scale(1.25, 1.25);
}

.add-user-box{
  display: flex;
  flex-direction: column;
  width: 180px;
  padding: 10px;
  border: 1px solid #dadada;
  background-color: #204969;
  color: #08ffc8;
  border-radius: 5px;
  position: absolute;
  top: 110px;
  right: 40px;
  z-index: 999;
}

.add-user-box>input{
  margin-bottom: 10px;
  border: 1px solid #dadada;
  background-color: #fff7f7;
}

.add-user-box>.btns-bar{
  width: 100%;
}

.add-user-box>.btns-bar>button{
  float: left;
  width: 25%;
  margin: 0;
  margin-left: 15%;
  padding: 5px;
  font-size: 16px;
  border-radius: 5px;
  color: #fff;
  background-color: #00000033;
  border: 1px solid #ccc;
}

button {
  user-select: none;
  width: 100px;
  height: 40px;
  margin-right: 40px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  background-color: #fff7f7;
  color: #204969;
  border: 1px solid #ccc;
}

.msgbox-btn {
  user-select: none;
  padding: 5px;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 16px;
  border-radius: 5px;
  color: #fff;
  background-color: #00000033;
  border: 1px solid #ccc;
}

.icon{
  user-select: none;
  width: 30px;
  margin-left: 10px;
  margin-right: 10px;
}

.hidden {
  display: none;
}
</style>
