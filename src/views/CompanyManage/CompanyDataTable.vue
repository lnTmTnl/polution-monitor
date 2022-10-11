<template>
  <div class="company-data-table">
    <DataTable
      :data="processedDatas"
      :currentPage="currentPage"
      :totalPage="totalPage"
      :pullDownsDisplayed="pullDownsDisplayed"
      :tdColors="tdColors"
      @onTdDbClick="displayCompanyInfo"
      @onChangePage="onChangePage"
      @onTurnToPage="onTurnToPage"
      @onSearchBtnClick="onSearchBtnClick"
    >
      <template v-slot:thead-slot>
        <img
          src="@/assets/icons/down.png"
          alt=""
          class="icon invisible"
        />
      </template>
      <template v-slot:tbody-slot="slotProps">
        <img
          src="@/assets/icons/down.png"
          alt=""
          class="icon"
          :class="{ 'rotate-up': pullDownsDisplayed[slotProps.index] }"
          @click="onPullIconClick(slotProps.index)"
        />
        <div
          class="pull-down"
          :class="{ hidden: !pullDownsDisplayed[slotProps.index] }"
        >
          <span>
            <span>地址：</span>
            <span>法人代表：</span>
          </span>
          <span>
            <span>生产产品类型：</span>
            <span>企业联系方式：</span>
          </span>
          <!--<span>
            <button>传感器信息</button>
          </span>-->
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue'

export default {
  name: 'CompanyDataTable',
  components: {
    DataTable
  },
  data () {
    return {
      pullDownsDisplayed: []
    }
  },
  props: {
    datas: {
      type: Array,
      default () {
        return []
      }
    },
    currentPage: {
      type: Number,
      default () {
        return 0
      }
    },
    totalPage: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  computed: {
    orderedDatas () {
      if (this.datas.length === 0) return []
      const dataCopy = []
      for (let i = 0; i < this.datas.length; i++) {
        dataCopy.push({
          enterpriseId: this.datas[i].enterpriseId,
          date: this.datas[i].date,
          isNormal: this.datas[i].isNormal
        })
      }

      for (let i = 0; i <= dataCopy.length - 2; i++) {
        for (let j = dataCopy.length - 1; j >= i + 1; j--) {
          if ((dataCopy[j - 1].isNormal) && (!dataCopy[j].isNormal)) {
            const tmp = dataCopy[j]
            dataCopy[j] = dataCopy[j - 1]
            dataCopy[j - 1] = tmp
          }
        }
      }

      return dataCopy
    },
    processedDatas () {
      const newDatas = []
      for (let i = 0; i < this.orderedDatas.length; i++) {
        newDatas.push({
          enterpriseId: this.orderedDatas[i].enterpriseId,
          // date: this.orderedDatas[i].date,
          isNormal: this.orderedDatas[i].isNormal === true || this.orderedDatas[i].isNormal === '正常' ? '正常' : '预警'
        })
      }
      return newDatas
    },
    tdColors () {
      if (this.orderedDatas.length === 0) return [[]]
      const colors = []
      for (let i = 0; i < this.orderedDatas.length; i++) {
        if ((!this.orderedDatas[i].isNormal) || this.orderedDatas[i].isNormal === '预警') {
          colors.push(['#204969', '#ff0000'])
        } else {
          colors.push(['#204969', '#204969'])
        }
      }
      return colors
    }
  },
  methods: {
    onPullIconClick (i) {
      this.pullDownsDisplayed[i] = !this.pullDownsDisplayed[i]
    },
    displayCompanyInfo (index) {
      this.$emit('displayCompanyInfo', this.processedDatas[index])
    },
    onChangePage (left) {
      this.$emit('onChangePage', left)
    },
    onTurnToPage (page) {
      this.$emit('onTurnToPage', page)
    },
    onSearchBtnClick (searchedDatas) {
      this.$emit('onSearchBtnClick', searchedDatas)
    }
  }
}
</script>

<style scoped>
.icon {
  user-select: none;
  width: 20px;
  margin-right: 15px;
}

.rotate-up {
  transform: rotateX(180deg);
}

.pull-down {
  display: flex;
  position: absolute;
  bottom: 1px;
  left: -1px;
  width: 100%;
  height: 100px;
  border-top: 1px solid #ccc;
  background-color: #eaeaea
}

.pull-down span {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pull-down span button {
  user-select: none;
  width: 100px;
  height: 40px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: #00000033;
  border: 1px solid #ccc;
}

.invisible {
  visibility: hidden;
}

.hidden {
  display: none;
}
</style>
