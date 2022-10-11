<template>
  <div class="senser-data-table">
    <div class="top">
      <img src="@/assets/icons/down-white.png" alt="" class="icon back-icon"
      @click="back">
      <span class="company-name">{{enterpriseId}}</span>
    </div>
    <DataTable :data="datas" @onSearchBtnClick="onSearchBtnClick"></DataTable>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue'

export default {
  name: 'SenserDataTable',
  components: {
    DataTable
  },
  data () {
    return {}
  },
  props: {
    isDisplayed: {
      type: Boolean,
      default () {
        return false
      }
    },
    datas: {
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
    onSearchBtnClick (searchedDatas) {
      this.$emit('onSearchBtnClick', searchedDatas)
    }
  },
  computed: {
  },
  methods: {
    back () {
      this.$emit('back')
    }
  }
}
</script>

<style scoped>
.top{
  display: flex;
  height: 30px;
  background-color: #00000033;
  border: 1px solid #ccc;
  align-items: center
}

.icon{
  user-select: none;
  width: 20px;
  margin-left: 10px;
}

.back-icon{
  transform: rotateZ(90deg);
}

.company-name{
  margin-left: 10px;
  font-size: 14px;
  color: #fff;
}
</style>
