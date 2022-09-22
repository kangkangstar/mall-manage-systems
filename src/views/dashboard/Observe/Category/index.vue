<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value" size="mini">
          <el-radio-button label="全部渠道" />
          <el-radio-button label="线上" />
          <el-radio-button label="门店" />
        </el-radio-group>
      </div>
    </div>
    <div>
      <div ref="charts1" class="charts" />
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      value: '线上',
    }
  },
  computed: {
    // home首页的全部数据
    ...mapState({
      saleList: (state) => state.home.list.saleRank,
    }),
    online() {
      const arry = []
      for (let index = 0; index < this.saleList.online.name.length; index++) {
        const item = {
          value: this.saleList.online.value[index],
          name: this.saleList.online.name[index],
        }
        arry.push(item)
      }
      return arry
    },
    shop() {
      const arry = []
      for (let index = 0; index < this.saleList.shop.name.length; index++) {
        const item = {
          value: this.saleList.shop.value[index],
          name: this.saleList.shop.name[index],
        }
        arry.push(item)
      }
      return arry
    },
  },
  watch: {
    // 监听图表标题
    // value() {
    //   this.mycharts1.setOption({
    //     title: {
    //       text: this.value,
    //       // subtext: 1048,
    //       left: 'center',
    //       top: 'center',
    //     },
    //     tooltip: {
    //       trigger: 'item',
    //     },
    //     series: [
    //       {
    //         type: 'pie',
    //         radius: ['40%', '70%'],
    //         avoidLabelOverlap: false,
    //         label: {
    //           show: true,
    //           position: 'outside',
    //         },
    //         labelLine: {
    //           show: true,
    //         },
    //         // 根据标题展示不同数据
    //         data: this.value === '线上' ? this.online : this.shop,
    //       },
    //     ],
    //   })
    // },
  },
  mounted() {
    // 饼图
    const mycharts1 = echarts.init(this.$refs.charts1)
    mycharts1.setOption({
      title: {
        text: '线上销售额',
        // subtext: 1048,
        left: 'center',
        top: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
          },
          labelLine: {
            show: true,
          },
          // 根据标题展示不同数据
          // data: this.value === '线上' ? this.online : this.shop,
          data: [
            { value: 1048, name: '家用电器' },
            { value: 735, name: '食用酒水' },
            { value: 580, name: '个护健康' },
            { value: 484, name: '服饰箱包' },
            { value: 300, name: '母婴产品' },
            { value: 143, name: '其他' },
          ],
        },
      ],
    })
    // 给图表绑定事件
    mycharts1.on('mouseover', (params) => {
      // 获取鼠标移上去的那条数据
      const { name, value } = params.data
      // 重新设置标题
      mycharts1.setOption({
        title: {
          text: name,
          subtext: value,
        },
      })
    })
  },
}
</script>

<style scoped>
.category-header {
  /* 让元素左右分布*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
}
.header {
  border-bottom: 1px solid #eee;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
