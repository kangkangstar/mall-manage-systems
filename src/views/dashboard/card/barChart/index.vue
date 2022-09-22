<template>
  <!-- 准备一个带宽和高的容器 -->
  <div ref="charts" class="charts" />
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
export default {
  props: ['paytrend'],
  mounted() {
    // 初始化echarts实例
    const lineChart = echarts.init(this.$refs.charts)
    // 配置数据
    lineChart.setOption({
      xAxis: {
        //   隐藏x轴
        show: false,
        // 均分
        type: 'category',
        // 数据
        data: [1, 2, 3, 4, 5, 6, 7, 8],
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: 'bar',
          data: this.$props.paytrend,
        },
      ],
      //   布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip: {},
    })
  },
}
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
