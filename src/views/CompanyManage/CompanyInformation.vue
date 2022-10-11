<template>
  <div>
    <div
      class="company-information"
      :class="{ hidden: isDisplaySenserDataTable }"
    >
      <div class="top">
        <img
          src="@/assets/icons/arrow-left-bold.png"
          alt=""
          class="icon back-icon"
          @click="back"
        />
        <span class="company-name">{{enterpriseId}}</span>
      </div>
      <div
        class="pull-bar"
        @click="isDisplayPollutionCondition = !isDisplayPollutionCondition"
      >
        <img
          src="@/assets/icons/down-white.png"
          alt=""
          class="icon pull-icon"
          :class="{ 'pull-up': isDisplayPollutionCondition }"
        />
        <span class="pull-title">排污情况</span>
      </div>
      <div
        class="pollution-condition"
        :class="{ hidden: !isDisplayPollutionCondition }"
      >
        <div class="graph" id="customerChart"></div>
        <div class="btns-box">
            <button :class="{'active-btn': isDisplayEmissionLine}" @click="onDisplayEmissionBtnClick">排放量</button>
            <button :class="{'active-btn': isDisplayDensityLine}" @click="onDisplayDensityBtnClick">浓度</button>
        </div>
        <div class="selects-box">
          <div>排污口：</div>
          <select @change="onSensorIdOptionChange($event)" v-model="selectedSensorId">
            <option v-for="(value, key) in optionsInSensorIdSelect" :key="key" :value ="value">{{value}}</option>
          </select>
          <div>污染物：</div>
          <select @change="onPollutionIdOptionChange($event)" v-model="selectedPollutionId">
            <option v-for="(value, key) in optionsInPollutionIdSelect" :key="key" :value ="value">{{value}}</option>
          </select>
        </div>
        <button @click="onDisplaySenserclick">排污口信息</button>
      </div>
      <div
        class="pull-bar"
        @click="isDisplayIllegalRecords = !isDisplayIllegalRecords"
      >
        <img
          src="@/assets/icons/down-white.png"
          alt=""
          class="icon pull-icon"
          :class="{ 'pull-up': isDisplayIllegalRecords }"
        />
        <span class="pull-title">违规记录</span>
      </div>
      <div
        class="illegal-records"
        :class="{ hidden: !isDisplayIllegalRecords }"
      >
        <DataTable
          :data="illegalRecords"
          :isDisplayOperations="false"
          :currentPage="currentPage"
          :totalPage="totalPages"
          @onChangePage="onChangePage"
          @onSearchBtnClick="onIllegalSearchBtnClick"
        ></DataTable>
      </div>
    </div>
    <SenserDataTable
      :class="{ hidden: !isDisplaySenserDataTable }"
      :isDisplayed="isDisplaySenserDataTable"
      :datas="sensorDatas"
      :enterpriseId="enterpriseId"
      @back="displayCompanyInformation"
      @onSearchBtnClick="onSenserSearchBtnClick"
    ></SenserDataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import SenserDataTable from '@/views/CompanyManage/SenserDataTable.vue'
// import TryDataTableColorsOn from '@/components/TryDataTableColorsOn.vue'
import { inject } from 'vue'
let echarts

export default {
  name: 'CompanyInformation',
  setup () {
    echarts = inject('ec') // 引入
  },
  Mounted () {
    // this.drawGraph()
  },
  components: {
    DataTable,
    // TryDataTableColorsOn,
    SenserDataTable
  },
  data () {
    return {
      sewageDatas: [],
      sensorIds: [],
      pollutionIds: [],
      sensorDatas: [],
      illegalDates: [],
      datasSortedBySensorId: {},
      datasSortedByPollutionId: {},
      selectedSensorId: '',
      selectedPollutionId: '',
      datasForGraph: {
        pollutionDensities: [],
        pollutionEmissions: [],
        times: []
      },
      graphStart: 0,
      graphEnd: 100,
      isDisplayPollutionCondition: true,
      isDisplayIllegalRecords: true,
      isDisplaySenserDataTable: false,
      isDisplayEmissionLine: true,
      isDisplayDensityLine: false
    }
  },
  props: {
    illegalRecords: {
      type: Array,
      default () {
        return []
      }
    },
    totalIllegalRecords: {
      type: Array,
      default () {
        return []
      }
    },
    graphDatas: {
      type: Array,
      default () {
        return []
      }
    },
    enterpriseId: {
      type: String,
      default () {
        return ''
      }
    },
    currentPage: {
      type: Number,
      default () {
        return 1
      }
    },
    totalPages: {
      type: Number,
      default () {
        return 1
      }
    }
  },
  computed: {
    optionsInSensorIdSelect () {
      if (!this.selectedPollutionId) return
      const options = Object.keys(this.datasSortedByPollutionId[this.selectedPollutionId])
      return options
    },
    optionsInPollutionIdSelect () {
      if (!this.selectedSensorId) return
      const options = Object.keys(this.datasSortedBySensorId[this.selectedSensorId])
      return options
    },
    totalSewageData () {
      const times = []
      const sewages = []
      for (let i = 0; i < this.graphDatas.length; i++) {
        times.push(this.graphDatas[i].time)
        sewages.push(this.graphDatas[i].pollutionEmission)
      }
      return {
        times,
        sewages
      }
    }
  },
  methods: {
    back () {
      this.$emit('back')
    },
    onDisplaySenserclick () {
      this.isDisplaySenserDataTable = true
    },
    displayCompanyInformation () {
      this.isDisplaySenserDataTable = false
    },
    drawGraph (title, xAxisDatas, yAxisDatas, illegalDates) {
      // 需要获取到element,所以是onMounted的Hook
      const myChart = echarts.init(document.getElementById('customerChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: title,
          textStyle: {
            color: '#08ffc8'
          }
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: xAxisDatas,
          axisLabel: {
            show: true,
            color: '#08ffc8'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#08ffc8'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            color: '#08ffc8'
          }
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            type: 'line',
            data: yAxisDatas,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: function (e) {
                return illegalDates.indexOf(e.name) === -1 ? '#08ffc8' : '#ff0000'
              }
            },
            lineStyle: {
              color: '#08ffc8'
            }
          }
        ]
      })
      window.onresize = function () {
        // 自适应大小
        myChart.resize()
      }
    },
    sortBySensorId (sewageDatas) {
      const sortedSewageDatas = {}
      for (let i = 0; i < sewageDatas.length; i++) {
        if (sortedSewageDatas[sewageDatas[i].sensorId] === undefined) {
          sortedSewageDatas[sewageDatas[i].sensorId] = {}
        }
        if (sortedSewageDatas[sewageDatas[i].sensorId][sewageDatas[i].pollutionId] === undefined) {
          sortedSewageDatas[sewageDatas[i].sensorId][sewageDatas[i].pollutionId] = {
            pollutionDensities: [],
            pollutionEmissions: [],
            times: []
          }
        }
        sortedSewageDatas[sewageDatas[i].sensorId][sewageDatas[i].pollutionId].pollutionDensities.push(sewageDatas[i].pollutionDensity)
        sortedSewageDatas[sewageDatas[i].sensorId][sewageDatas[i].pollutionId].pollutionEmissions.push(sewageDatas[i].pollutionEmission)
        sortedSewageDatas[sewageDatas[i].sensorId][sewageDatas[i].pollutionId].times.push(sewageDatas[i].time.substring(0, 10))
      }
      return sortedSewageDatas
    },
    sortByPollutionId (sewageDatas) {
      const sortedSewageDatas = {}
      for (let i = 0; i < sewageDatas.length; i++) {
        if (sortedSewageDatas[sewageDatas[i].pollutionId] === undefined) {
          sortedSewageDatas[sewageDatas[i].pollutionId] = {}
        }
        if (sortedSewageDatas[sewageDatas[i].pollutionId][sewageDatas[i].sensorId] === undefined) {
          sortedSewageDatas[sewageDatas[i].pollutionId][sewageDatas[i].sensorId] = {
            pollutionDensities: [],
            pollutionEmissions: [],
            times: []
          }
        }
        sortedSewageDatas[sewageDatas[i].pollutionId][sewageDatas[i].sensorId].pollutionDensities.push(sewageDatas[i].pollutionDensity)
        sortedSewageDatas[sewageDatas[i].pollutionId][sewageDatas[i].sensorId].pollutionEmissions.push(sewageDatas[i].pollutionEmission)
        sortedSewageDatas[sewageDatas[i].pollutionId][sewageDatas[i].sensorId].times.push(sewageDatas[i].time.substring(0, 10))
      }
      return sortedSewageDatas
    },
    drawGraphWithEmission (sewageDatas) {
      const pollutionEmissions = sewageDatas.pollutionEmissions
      const times = sewageDatas.times
      this.drawGraph('排放量', times, pollutionEmissions, this.illegalDates)
    },
    drawGraphWithDensity (sewageDatas) {
      const pollutionDensities = sewageDatas.pollutionDensities
      const times = sewageDatas.times
      this.drawGraph('浓度', times, pollutionDensities, this.illegalDates)
    },
    onDisplayEmissionBtnClick () {
      this.isDisplayEmissionLine = !this.isDisplayEmissionLine
      this.isDisplayDensityLine = !this.isDisplayDensityLine
      if (this.isDisplayEmissionLine) {
        this.drawGraphWithEmission(this.datasForGraph)
      }
    },
    onDisplayDensityBtnClick () {
      this.isDisplayDensityLine = !this.isDisplayDensityLine
      this.isDisplayEmissionLine = !this.isDisplayEmissionLine
      if (this.isDisplayDensityLine) {
        this.drawGraphWithDensity(this.datasForGraph)
      }
    },
    onSensorIdOptionChange (event) {
      this.datasForGraph = this.datasSortedBySensorId[this.selectedSensorId][this.selectedPollutionId]
      if (this.isDisplayEmissionLine) {
        this.drawGraphWithEmission(this.datasForGraph)
      } else if (this.isDisplayDensityLine) {
        this.drawGraphWithDensity(this.datasForGraph)
      }
    },
    onPollutionIdOptionChange (event) {
      this.datasForGraph = this.datasSortedByPollutionId[this.selectedPollutionId][this.selectedSensorId]
      if (this.isDisplayEmissionLine) {
        this.drawGraphWithEmission(this.datasForGraph)
      } else if (this.isDisplayDensityLine) {
        this.drawGraphWithDensity(this.datasForGraph)
      }
    },
    onChangePage (left) {
      this.$emit('onChangePage', left, this.enterpriseId, this.totalIllegalRecords, this.currentPage, this.totalPages)
    },
    onSenserSearchBtnClick (searchedDatas) {
      this.datas = searchedDatas
    },
    onIllegalSearchBtnClick (searchedDatas) {
      this.$emit('onIllegalSearchBtnClick', searchedDatas)
    },
    init (sewageDatas, illegalDates) {
      this.sewageDatas = sewageDatas
      this.illegalDates = illegalDates
      const datasSortedBySensorId = this.sortBySensorId(this.sewageDatas)
      const datasSortedByPollutionId = this.sortByPollutionId(this.sewageDatas)
      this.datasSortedBySensorId = datasSortedBySensorId
      this.datasSortedByPollutionId = datasSortedByPollutionId
      this.sensorIds = Object.keys(datasSortedBySensorId)
      this.pollutionIds = Object.keys(datasSortedByPollutionId)
      this.sensorIds.forEach(sensor => {
        Object.keys(this.datasSortedBySensorId[sensor]).forEach(pollution => {
          this.sensorDatas.push({
            sensorId: sensor,
            pollutionId: pollution
          })
        })
      })
      this.selectedSensorId = this.sensorIds[0]
      this.selectedPollutionId = this.pollutionIds[0]
      this.datasForGraph = this.datasSortedBySensorId[this.selectedSensorId][this.selectedPollutionId]
      this.drawGraphWithEmission(this.datasForGraph)
    }
  }
}
</script>

<style scoped>
.top {
  display: flex;
  height: 30px;
  background-color: #fff7f7;
  border: 1px solid #666;
  align-items: center;
}

.icon {
  user-select: none;
  width: 20px;
  margin-left: 10px;
}

.pull-bar {
  display: flex;
  height: 30px;
  margin: 15px 10px;
  margin-left: 190px;
  background-color: #5db1d7;
  border: 1px solid #dadada;
  align-items: center;
  user-select: none;
  color: #004d61;
  font-weight: bold;
}

.company-name{
  margin-left: 10px;
  font-size: 16px;
}

.pull-icon {
  width: 30px;
}

.pull-title {
  margin-left: 10px;
}

.pull-up {
  transform: rotateZ(180deg);
}

.graph {
  display: inline-block;
  width: 1000px;
  height: 300px;
  margin-top: 10px;
  margin-left: 10px;
  padding: 10px;
  padding-bottom: 0;
  background-color: #204969;
  border: 1px solid #eee;
}

.pollution-condition {
  text-align: left;
}

.pollution-condition button {
  position: relative;
  float: right;
  user-select: none;
  width: 100px;
  height: 40px;
  margin-right: 10px;
  margin-top: 10px;
  font-size: 16px;
  border-radius: 5px;
  background-color: #fff7f7;
  color: #204969;
  border: 1px solid #ccc;
}

.pollution-condition .btns-box{
  position: absolute;
  top: 155px;
  right: 135px;
  display: flex;
  flex-direction: column;
}

.selects-box {
  position: absolute;
  right: 20px;
  top: 280px;
  display: flex;
  flex-direction: column;
  color: #204969;
}

.selects-box>select {
  margin-bottom: 20px;
  background-color: #fff7f7;
  color: #204969;
}

.selects-box>div {
  margin-bottom: 5px;
}

.selects-box>select option {
  background-color: #fff7f7;
  color: #204969;
}

#customerChart {
  position: relative;
}

.active-btn {
  background-color: #204969 !important;
  color: #08ffc8 !important;
}

.hidden {
  display: none;
}
</style>
