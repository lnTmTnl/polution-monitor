<template>
  <div class="data-table">
    <div class="table-top" :class="{ hidden: !isDisplayTableTop }">
      <div class="left">
        <input type="text" name="search-box" class="search-box" />
        <img src="@/assets/icons/search.png" alt="" class="icon" />
      </div>
      <div class="right">
        <slot name="table-top-right-slot"></slot>
        <img
          src="@/assets/icons/screen.png"
          alt=""
          class="icon"
          @click="onScreenIconClick"
        />
        <img
          src="@/assets/icons/rank.png"
          alt=""
          class="icon"
          @click="onRankingIconClick"
        />
        <img
          src="@/assets/icons/export.png"
          alt=""
          class="icon"
          @click="onExportIconClick"
        />
        <div
          class="screen-and-ranking-box screen-box"
          :class="{ hidden: !isScreening }"
        >
          <div>
            <span>筛选依据</span>
            <select>
              <option
                v-for="(value, key) in data[0]"
                :key="key"
                :value="
                  ColumnTitleDictionary[key] ? ColumnTitleDictionary[key] : key
                "
              >
                {{
                  ColumnTitleDictionary[key] ? ColumnTitleDictionary[key] : key
                }}
              </option>
            </select>
          </div>
          <div>
            <span>筛选方式</span>
            <select>
              <option value="equal">等于</option>
              <option value="less">小于</option>
              <option value="more">大于</option>
            </select>
          </div>
          <div>
            <span>筛选值</span>
            <input type="text" />
          </div>
          <div>
            <button @click="onScreen">确定</button>
            <button>清除</button>
          </div>
        </div>
        <div
          class="screen-and-ranking-box ranking-box"
          :class="{ hidden: !isRanking }"
        >
          <div>
            <span>排序依据</span>
            <select>
              <option
                v-for="(value, key) in data[0]"
                :key="key"
                :value="
                  ColumnTitleDictionary[key] ? ColumnTitleDictionary[key] : key
                "
              >
                {{
                  ColumnTitleDictionary[key] ? ColumnTitleDictionary[key] : key
                }}
              </option>
            </select>
          </div>
          <div>
            <span>排序方式</span>
            <select>
              <option value="falling">降序</option>
              <option value="rising">升序</option>
            </select>
          </div>
          <div>
            <button>确定</button>
            <button>清除</button>
          </div>
        </div>
      </div>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th v-for="(value, key) in data[0]" :key="key">
              {{
                ColumnTitleDictionary[key] ? ColumnTitleDictionary[key] : key
              }}
            </th>
            <slot name="additional-th-slot"></slot>
            <th class="operations" :class="{ hidden: !isDisplayOperations }">
              <slot name="thead-slot"></slot>
              <input
                type="checkbox"
                class="checkbox"
                :checked="isCheckedAll"
                @click="checkedAll"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(obj, index) in data"
            :key="index"
            :class="{ 'tr-active': active === index }"
            @mouseover="onTrmouseOver(index)"
            @mouseleave="onTrmouseLeave()"
          >
            <td
              v-for="(value, key, indextd) in obj"
              :key="key"
              :class="{ pullDownDisplayed: pullDownsDisplayed[index] | false }"
              :style="{color: index < tdColors.length && indextd < tdColors[index].length ? (tdColors[index][indextd]) : 'fff'}"
              @dblclick="onTdDbClick(index)"
            >
              {{ value }}
            </td>
            <slot name="additional-td-slot" :index="index"></slot>
            <td
              class="operations"
              :class="{
                pullDownDisplayed: pullDownsDisplayed[index],
                hidden: !isDisplayOperations
              }"
            >
              <slot name="tbody-slot" :index="index"></slot>
              <input
                type="checkbox"
                class="checkbox"
                :checked="findData(data[index]) >= 0"
                @click="checkedOne(index)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="page-bar">
      <span>
        <img
          src="@/assets/icons/down-white.png"
          alt=""
          class="icon left-arrow"
          @click="onChangePage(true)"
        />
      </span>
      <span> {{ currentPage }}/{{ totalPage }} </span>
      <span>
        <img
          src="@/assets/icons/down-white.png"
          alt=""
          class="icon right-arrow"
          @click="onChangePage(false)"
        />
      </span>
      <input type="text" v-model="turnToPage">
      <button class="trunToPageBtn" @click="onTurnToPageBtnClick">跳页</button>
      <span class="warm-info">{{turnToPageWarmInfo}}</span>
    </div>
  </div>
</template>

<script>
import { inject } from '@vue/runtime-core'

let ajaxPost = null
let apiUrls = null

export default {
  name: 'DataTable',
  setup () {
    ajaxPost = inject('ajaxPost')
    apiUrls = inject('apiUrls')
  },
  data () {
    return {
      isCheckedAll: false,
      arr: [],
      active: -1,
      isScreening: false,
      isRanking: false,
      turnToPage: '',
      turnToPageWarmInfo: ''
    }
  },
  props: {
    data: {
      type: Array,
      default () {
        return [{ A: 0 }]
      }
    },
    currentPage: {
      type: Number,
      default () {
        return 1
      }
    },
    totalPage: {
      type: Number,
      default () {
        return 1
      }
    },
    pullDownsDisplayed: {
      type: Array,
      default () {
        return []
      }
    },
    isDisplayTableTop: {
      type: Boolean,
      default () {
        return true
      }
    },
    isDisplayOperations: {
      type: Boolean,
      default () {
        return true
      }
    },
    tdColors: {
      type: Array(Array),
      default () {
        return [[]]
      }
    }
  },
  methods: {
    findData (data) {
      for (let i = 0; i < this.arr.length; i++) {
        const keys = Object.keys(data)
        let f = true
        for (let j = 0; j < keys.length; j++) {
          if (data[keys[j]] !== this.arr[i][keys[j]]) {
            f = false
            break
          }
        }
        if (f) {
          return i
        }
      }
      return -1
    },
    checkedOne (index) {
      var itemIndex = this.findData(this.data[index])
      // console.log(itemIndex)
      if (itemIndex >= 0) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.arr.splice(itemIndex, 1)
      } else {
        // 选中该checkbox
        this.arr.push(this.data[index])
      }
      if (this.arr.length === (this.data.length - 1) * this.totalPage) {
        this.isCheckedAll = true
      } else {
        this.isCheckedAll = false
      }
      this.$emit('getSelectedDatas', this.arr)
    },
    checkedAll () {
      this.isCheckedAll = !this.isCheckedAll
      if (this.isCheckedAll) {
        // 全选时
        this.arr = []
        this.data.forEach(function (item) {
          this.arr.push(item)
        }, this)
      } else {
        this.arr = []
      }
      this.$emit('getSelectedDatas', this.arr)
    },
    onTrmouseOver (index) {
      this.active = index
    },
    onTrmouseLeave () {
      this.active = -1
    },
    onTdDbClick (index) {
      this.$emit('onTdDbClick', index)
    },
    onChangePage (left) {
      this.$emit('onChangePage', left)
    },
    onTurnToPageBtnClick () {
      if (/^\d+$/.test(this.turnToPage) && Number.parseInt(this.turnToPage) > 0 && Number.parseInt(this.turnToPage) <= this.totalPage) {
        this.turnToPageWarmInfo = ''
        if (Number.parseInt(this.turnToPage) === this.currentPage) {
          return
        }
        this.$emit('onTurnToPage', Number.parseInt(this.turnToPage))
      } else {
        this.turnToPageWarmInfo = '请输入正确的页码'
      }
    },
    onScreenIconClick () {
      this.isScreening = !this.isScreening
      this.isRanking = false
    },
    onRankingIconClick () {
      this.isScreening = false
      this.isRanking = !this.isRanking
    },
    onScreen () {
      this.$emit('onScreen', '17280000089583')
    },
    onExportIconClick () {
      if (this.isCheckedAll) {
        const url =
          apiUrls.getSewageData
        ajaxPost(
          url,
          JSON.stringify({
            page: 1,
            itemPerPage: this.totalPage * 20
          }),
          (res) => {
            const datas = JSON.parse(res.responseText).sewageData.items
            if (datas.length === 0) return
            const titles = Object.keys(datas[0]).map((item) => this.ColumnTitleDictionary[item] ? this.ColumnTitleDictionary[item] : item)
            this.excelExport({
              fileName: '表格数据',
              suffix: 'csv',
              titles: titles,
              dataSource: datas
            })
          },
          () => {
            console.log(0)
          }
        )
      } else {
        if (this.arr.length === 0) return
        const titles = Object.keys(this.arr[0]).map((item) => this.ColumnTitleDictionary[item] ? this.ColumnTitleDictionary[item] : item)
        this.excelExport({
          fileName: '表格数据',
          suffix: 'csv',
          titles: titles,
          dataSource: this.arr
        })
      }
    },
    excelExport ({
      dataSource = [],
      titles = [],
      fileName = 'data',
      suffix = 'csv'
    }) {
      var dataType = '\uFEFF' // 解决乱码问题
      dataType += titles.join(',') // 添加表格的头
      dataType += '\n' // 以上是导出的Excel文件头部

      // 从dataSource中取出数据存入数据源（dataType）
      dataSource.map((item) => {
        const keys = Object.keys(item)
        for (let i = 0; i < keys.length; i++) {
          dataType += item[keys[i]]
          if (i < keys.length - 1) {
            dataType += ','
          }
        }
        dataType += '\n'
      })

      // 使用Blob，获得二进制实例
      const csvData = new Blob([dataType], {
        type: 'text/csv'
      })

      // 创建a标签
      const _a = document.createElement('a')
      /**
       * URL.createObjectURL() 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL
       * 这里相当于为a标签添加了一个下载地址
       */
      _a.href = URL.createObjectURL(csvData)
      // 该a标签点击后会打开新的标签页，人机交互会更加舒适
      _a.target = '_blank'
      // 为a标签规定被下载的超链接目标
      _a.download = `${fileName}.${suffix}`
      // 将这个制作好的a标签置入body，并在点击之后移除，降低外界感知
      document.body.appendChild(_a)
      _a.click()
      document.body.removeChild(_a)

      ajaxPost(
        apiUrls.addLog,
        JSON.stringify({
          operation: 'export data'
        }),
        (res) => {
        },
        () => {
          console.log('000')
        }
      )
    }
  },
  computed: {
    ColumnTitleDictionary () {
      const ColumnTitleDictionary = inject('ColumnTitleDictionary')
      return ColumnTitleDictionary
    }
  },
  watch: {
    data () {
      if (this.isCheckedAll) {
        for (let i = 0; i < this.data.length; i++) {
          if (this.findData(this.data[i]) === -1) {
            this.arr.push(this.data[i])
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.table,
.table-top {
  display: flex;
}

.table-top {
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.left,
.right {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.search-box {
  width: 250px;
  height: 30px;
  margin-left: 10px;
  background-color: #00000033;
  border: 1px solid #fff;
}

table {
  margin-left: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-collapse: collapse;
  border-spacing: 0;
  flex: 1;
}

.right {
  position: relative;
}

.screen-and-ranking-box {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  background-color: #026a8bee;
  border-radius: 5px;
  color: #fff;
  position: absolute;
  top: 80px;
  right: 0;
  z-index: 999;
}

.screen-and-ranking-box select,
input {
  border: 1px solid #ccc;
  background-color: #00000033;
}

.screen-and-ranking-box > div {
  margin-top: 10px;
  flex: 1;
}

.screen-and-ranking-box > div > * {
  float: left;
  margin-left: 10%;
}

.screen-and-ranking-box select option {
  background-color: #00000066;
}

.screen-and-ranking-box > div > button {
  margin-left: 25%;
  border-radius: 5px;
  background-color: #00000033;
  border: 1px solid #ccc;
}

.screen-box {
  width: 300px;
  height: 200px;
}

.ranking-box {
  width: 300px;
  height: 150px;
}

td,
th {
  border: 1px solid #333;
  height: 24px;
  font-size: 16px;
}

thead {
  background-color: #fff7f7;
}

tbody {
  background-color: #fff;
}

.icon {
  user-select: none;
  width: 30px;
  margin-left: 10px;
  margin-right: 10px;
}

.page-bar {
  color: #fff;
  margin-top: 10px;
  position: relative;
}

.page-bar .left-arrow {
  transform: rotateZ(90deg);
}

.page-bar .right-arrow {
  transform: rotateZ(-90deg);
}

.page-bar input {
  width: 60px;
  text-align: center;
}

.page-bar .trunToPageBtn {
  border-radius: 5px;
  background-color: #00000033;
  border: 1px solid #ccc;
  margin-left: 20px;
}

.warm-info {
  color: red;
  position: absolute;
  margin-left: 10px;
}

tr {
  position: relative;
}

.tr-active {
  background-color: #e0e0e6;
  color: #000;
}

.operations {
  width: 10%;
}

.operations > * {
  width: 20%;
}

.checkbox {
  transform: scale(1.25, 1.25);
}

.pullDownDisplayed {
  padding-bottom: 100px;
}

.hidden {
  display: none;
}
</style>
