<template>
  <div class="log-manage">
    <DataTable
      :data="reversedDatas"
      :currentPage="currentPage"
      :totalPage="totalPage"
      @onChangePage="onChangePage"
      @onTurnToPage="onTurnToPage"
      @onSearchBtnClick="onSearchBtnClick"
    >
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import { inject } from '@vue/runtime-core'
let ajaxPost = null
let apiUrls = null

export default {
  name: 'LogManage',
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
      currentPage: 1,
      totalPage: 100
    }
  },
  computed: {
    reversedDatas () {
      const datas = this.datas
      return datas.reverse()
    }
  },
  components: {
    DataTable
  },
  methods: {
    getDatas (page, itemPerPage) {
      const url =
        apiUrls.getLogs
      ajaxPost(
        url,
        JSON.stringify({
          page: page,
          itemPerPage: itemPerPage
        }),
        (res) => {
          this.datas = JSON.parse(res.response).logs.items
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

<style></style>
