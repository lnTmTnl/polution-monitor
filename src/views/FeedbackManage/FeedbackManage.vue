<template>
  <div class="feedback-manage">
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
      <img src="@/assets/icons/delete.png" alt="" class="icon" @click="onDeleteIconClick">
    </template>
    </DataTable>
    <MessageBox :messageInfo="messageInfo" v-show="isShowMsgBox">
      <template v-slot:btns-slot>
        <button @click="onOkBtnClick">确定</button>
        <button @click="onCancelBtnClick">取消</button>
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
  name: 'FeedbackManage',
  setup () {
    ajaxPost = inject('ajaxPost')
    apiUrls = inject('apiUrls')
  },
  mounted () {
    this.getDatas(1, 20)
  },
  data () {
    return {
      datas: [],
      selectedDatas: [],
      currentPage: 1,
      totalPage: 100,
      isShowMsgBox: false,
      messageInfo: ''
    }
  },
  components: {
    DataTable,
    MessageBox
  },
  methods: {
    getDatas (page, itemPerPage) {
      const url = apiUrls.getFeedbacks
      ajaxPost(
        url,
        JSON.stringify({
          page: page,
          itemPerPage: itemPerPage
        }),
        (res) => {
          this.datas = JSON.parse(res.response).feedbacks.items
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
    getSelectedDatas (datas) {
      this.selectedDatas = datas
    },
    onDeleteIconClick () {
      this.isShowMsgBox = !this.isShowMsgBox
      this.messageInfo = '确认删除?'
    },
    onOkBtnClick () {
      const url = apiUrls.deleteFeedback
      for (let i = 0; i < this.selectedDatas.length; i++) {
        ajaxPost(
          url,
          JSON.stringify({
            feedbackId: this.selectedDatas[i].id
          }),
          (res) => {
            this.getDatas(this.currentPage, 20)

            ajaxPost(
              apiUrls.addLog,
              JSON.stringify({
                operation: 'delete feedback'
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
    onSearchBtnClick (searchedDatas) {
      this.datas = searchedDatas
    }
  }
}
</script>

<style scoped>
.icon{
  user-select: none;
  width: 35px;
  margin-left: 10px;
  margin-right: 10px;
}

button{
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
</style>
