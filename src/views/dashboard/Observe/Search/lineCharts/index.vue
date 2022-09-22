<template>
  <div>
    <!-- 标题 -->
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <!-- <svg
        t="1658817670080"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2488"
        width="22"
        height="22"
      >
        <path
          d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z"
          p-id="2489"
        />
      </svg> -->
    </div>
    <!-- 文字部分 -->
    <div class="main">
      <span class="main-title">123432</span>
      <span class="main-context">17.1</span>
      <svg
        t="1658842054896"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2327"
        width="16"
        height="14"
      >
        <path
          d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z"
          fill="#1afa29"
          p-id="2328"
        />
      </svg>
      <svg
        t="1658842131935"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1307"
        width="16"
        height="14"
      >
        <path
          d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z"
          fill="#d81e06"
          p-id="1308"
        />
      </svg>
    </div>
    <!-- 图表展示区 -->
    <div class="footer">
      <!-- 准备一个带宽和高的容器 -->
      <div ref="charts" class="charts" />
    </div>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
// import { mapState } from 'vuex'
export default {
  props: ['list'],
  data() {
    return {
      lineChart: null,
      userarry: [],
    }
  },
  computed: {
    // 数据是父组件通过props传递过来的，需要提取需要展示的数据
    newarry() {
      this.$props.list.searchWord.forEach((item) => {
        this.userarry.push(item.user)
      })
      // console.log(this.userarry)
      return this.userarry
    },
  },
  // watch: {
  //   userarry() {
  //     // 配置数据
  //     this.lineChart.setOption({
  //       xAxis: {
  //         //   隐藏x轴
  //         show: false,
  //         type: 'category',
  //       },
  //       yAxis: {
  //         show: false,
  //       },
  //       tooltip: {
  //         trigger: 'axis',
  //       },
  //       series: [
  //         {
  //           type: 'line',
  //           smooth: true,
  //           data: [12, 15, 36, 19, 43, 23, 18, 43],
  //           // data: this.userarry,
  //           //   拐点的样式设置
  //           itemStyle: {
  //             opacity: 0,
  //           },
  //           //   线条的样式
  //           lineStyle: {
  //             color: '#6a92fd',
  //           },
  //           //   填充区域的颜色
  //           areaStyle: {
  //             color: {
  //               type: 'linear',
  //               x: 0,
  //               y: 0,
  //               x2: 0,
  //               y2: 1,
  //               colorStops: [
  //                 {
  //                   offset: 0,
  //                   color: '#6a92fd', // 0% 处的颜色
  //                 },
  //                 {
  //                   offset: 1,
  //                   color: '#fff', // 100% 处的颜色
  //                 },
  //               ],
  //               global: false, // 缺省为 false
  //             },
  //           },
  //           clip: true,
  //         },
  //       ],
  //       //   布局调试
  //       grid: {
  //         left: 0,
  //         top: 0,
  //         right: 0,
  //         bottom: 0,
  //       },
  //     })
  //   },
  // },
  mounted() {
    // 初始化echarts实例
    this.lineChart = echarts.init(this.$refs.charts)
    // 配置数据
    this.lineChart.setOption({
      xAxis: {
        //   隐藏x轴
        show: false,
        type: 'category',
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: [12, 15, 36, 19, 43, 23, 18, 43],
          // data: [],
          //   拐点的样式设置
          itemStyle: {
            opacity: 0,
          },
          //   线条的样式
          lineStyle: {
            color: '#6a92fd',
          },
          //   填充区域的颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#6a92fd', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#fff', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      //   布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    })
  },
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.search-header {
  margin-right: 20px;
  color: darkgray;
}
.main-title {
  margin-right: 30px;
  font-size: 24px;
}
.main {
  margin: 10px 0;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>
