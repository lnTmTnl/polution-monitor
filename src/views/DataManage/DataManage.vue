<template>
  <div class="data-manage">
    <DataTable :data="datas" :currentPage="currentPage" :totalPage="totalPage"
    @onChangePage='onChangePage'
    @onTurnToPage="onTurnToPage"
    @onSearchBtnClick="onSearchBtnClick"> </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import { inject } from '@vue/runtime-core'

let ajaxPost = null
let apiUrls = null

export default {
  name: 'DataManage',
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
  components: {
    DataTable
  },
  methods: {
    getDatas (page, itemPerPage) {
      const url =
        apiUrls.getSewageData
      ajaxPost(
        url,
        JSON.stringify({
          page: page,
          itemPerPage: itemPerPage
        }),
        (res) => {
          this.datas = JSON.parse(res.responseText).sewageData.items
          this.totalPage = JSON.parse(res.responseText).totalPages
        },
        () => {
          console.log(0)
          this.datas = []
        },
        false
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

<style scoped></style>
