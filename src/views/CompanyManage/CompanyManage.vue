<template>
  <div class="company-manage">
    <CompanyDataTable :class="{'hidden': !isDisplayCompanyDataTable}" :datas="screenedDatas"
    :currentPage="currentPage"
    :totalPage="totalPage"
    @displayCompanyInfo='displayCompanyInformation'
    @onChangePage='onChangePage'
    @onTurnToPage='onTurnToPage'
    @onSearchBtnClick='onCompanyDatasSearchBtnClick'></CompanyDataTable>
    <CompanyInformation :class="{'hidden': !isDisplayCompanyInformation}"
    :illegalRecords="illegalRecords"
    :totalIllegalRecords="totalIllegalRecords"
    :graph-datas="datas"
    :enterpriseId="enterpriseIdShouldBeDisplayed"
    :currentPage="illegalDatasCurrentPage"
    :totalPages="illegalDatasTotalPage"
    @back='displayCompanyDataTable' ref="companyInformation"
    @onChangePage="onChangeIllegalDatasPage"
    @onIllegalSearchBtnClick="onIllegalSearchBtnClick"></CompanyInformation>
  </div>
</template>

<script>
import CompanyDataTable from '@/views/CompanyManage/CompanyDataTable.vue'
import CompanyInformation from '@/views/CompanyManage/CompanyInformation.vue'
// import TryColorsOn from '@/views/CompanyManage/TryColorsOn.vue'
import { inject } from '@vue/runtime-core'

let ajaxPost = null
let apiUrls = null

export default {
  name: 'CompanyManage',
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
      screenedDatas: [],
      currentPage: 1,
      totalPage: 1,
      totalDataNum: 0,
      datasPerPage: 20,
      isDisplayCompanyDataTable: true,
      isDisplayCompanyInformation: false,
      enterpriseIdShouldBeDisplayed: '',
      illegalRecords: [],
      totalIllegalRecords: [],
      illegalDates: [],
      illegalDatasCurrentPage: 1,
      illegalDatasTotalPage: 1
    }
  },
  components: {
    CompanyDataTable,
    CompanyInformation
    // TryColorsOn
  },
  methods: {
    displayCompanyInformation (data) {
      const enterpriseId = data.enterpriseId
      this.enterpriseIdShouldBeDisplayed = enterpriseId
      let sewageDatas = []
      const url = apiUrls.getSewageDataByEnterprise
      this.illegalRecords = [{ abnormalCondition: '无异常数据' }]
      ajaxPost(
        url,
        JSON.stringify({
          enterpriseId: enterpriseId
        }),
        (res) => {
          sewageDatas = JSON.parse(res.responseText).sewageData.items
          const newIllegalDatas = []
          let currentIllegalDatas = []
          let dates = []
          if (data.isNormal === '预警') {
            ajaxPost(
              apiUrls.getAbnormalDates,
              JSON.stringify({
                enterpriseId: enterpriseId
              }),
              (res) => {
                dates = JSON.parse(res.responseText).abnormalDates
                for (let i = 0; i < dates.length; i++) {
                  const formatedDate = dates[i].substr(0, 10).replace(/-/g, '/')
                  newIllegalDatas.unshift({
                    date: formatedDate
                  })
                  dates[i] = dates[i].substr(0, 10)
                }
                this.illegalDates = dates
                this.$refs.companyInformation.init(sewageDatas, this.illegalDates)
              },
              () => {
                console.log(1)
              },
              false
            )
            this.illegalDatasTotalPage = parseInt(newIllegalDatas.length / this.datasPerPage) + 1
            currentIllegalDatas = this.getCurrentIllegalDatas(enterpriseId, newIllegalDatas, this.datasPerPage, this.illegalDatasCurrentPage)
            this.totalIllegalRecords = newIllegalDatas
          }
          this.illegalRecords = currentIllegalDatas
        },
        () => {
          console.log(0)
        }
      )
      this.isDisplayCompanyDataTable = false
      this.isDisplayCompanyInformation = true
    },
    displayCompanyDataTable () {
      this.isDisplayCompanyDataTable = true
      this.isDisplayCompanyInformation = false
    },
    getDatas (page, itemPerPage) {
      const url = apiUrls.getNormalityByPage
      // let enterpriseIds = []
      ajaxPost(
        url,
        JSON.stringify({
          page: page,
          itemPerPage: itemPerPage
        }),
        (res) => {
          this.datas = JSON.parse(res.responseText).normality
          this.screenedDatas = JSON.parse(res.responseText).normality
          this.totalPage = JSON.parse(res.responseText).totalPages
        },
        () => {
          console.log(0)
          this.datas = []
          this.screenedDatas = []
        }
      )
    },
    getCurrentIllegalDatas (enterpriseId, illegalDatas, datasPerPage, currentPage) {
      const currentIllegalDatas = []

      for (let i = (currentPage - 1) * datasPerPage; i < currentPage * datasPerPage; i++) {
        if (i === illegalDatas.length) break
        ajaxPost(
          apiUrls.classifyByTimeSeries,
          JSON.stringify({
            enterpriseId: enterpriseId,
            date: illegalDatas[i].date
          }),
          (res) => {
            if (JSON.parse(res.responseText).status === 2) {
              console.log(illegalDatas[i].date)
              illegalDatas[i].typeByTimeSeries = null
              // illegalDatas[i].typeNameByTimeSeries = null
              // illegalDatas[i].possibilityByTimeSeries = null
              return
            }
            illegalDatas[i].typeByTimeSeries = (((JSON.parse(res.responseText).classification.typeName) === '数据缺失')
              ? ('机器故障' + ': -') : (JSON.parse(res.responseText).classification.typeName) +
             ': ' + (JSON.parse(res.responseText).classification.possibility * 100).toFixed(1) + '%')
            // illegalDatas[i].typeNameByTimeSeries = JSON.parse(res.responseText).classification.typeName
            // illegalDatas[i].possibilityByTimeSeries = (JSON.parse(res.responseText).classification.possibility * 100).toFixed(1) + '%'
          },
          () => {
            console.log(1)
          },
          false
        )
        ajaxPost(
          apiUrls.classifyByRelation,
          JSON.stringify({
            enterpriseId: enterpriseId,
            date: illegalDatas[i].date
          }),
          (res) => {
            if (JSON.parse(res.responseText).status === 2) {
              illegalDatas[i].typeByRelation = null
              // illegalDatas[i].typeNameByRelation = null
              // illegalDatas[i].possibilityByRelation = null
              return
            }
            illegalDatas[i].typeByRelation = JSON.parse(res.responseText).classification.typeName + ': ' +
            (JSON.parse(res.responseText).classification.typeName === '关联性正常' ? '-'
              : (JSON.parse(res.responseText).classification.possibility * 100).toFixed(1) + '%')
            // illegalDatas[i].typeNameByRelation = JSON.parse(res.responseText).classification.typeName
            // illegalDatas[i].possibilityByRelation = (JSON.parse(res.responseText).classification.possibility * 100).toFixed(1) + '%'
          },
          () => {
            console.log(1)
          },
          false
        )
        currentIllegalDatas.push(illegalDatas[i])
      }

      return currentIllegalDatas
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
    onChangeIllegalDatasPage (left, enterpriseId, totalIllegalRecords, currentPage, totalPages) {
      if (left) {
        if (currentPage > 1) {
          this.illegalDatasCurrentPage--
          this.illegalRecords = this.getCurrentIllegalDatas(enterpriseId, totalIllegalRecords, this.datasPerPage, this.illegalDatasCurrentPage)
        }
      } else {
        if (currentPage < totalPages) {
          this.illegalDatasCurrentPage++
          this.illegalRecords = this.getCurrentIllegalDatas(enterpriseId, totalIllegalRecords, this.datasPerPage, this.illegalDatasCurrentPage)
        }
      }
    },
    onCompanyDatasSearchBtnClick (searchedDatas) {
      this.screenedDatas = searchedDatas
    },
    onIllegalSearchBtnClick (searchedDatas) {
      this.illegalRecords = searchedDatas
    }
  }
}
</script>

<style scoped>
.hidden{
  display: none;
}
</style>
