<template>
  <!-- 准备一个带宽和高的容器 -->
  <div ref="charts" class="charts" />
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
export default {
  props: ['visittrend'],
  mounted() {
    // console.log(this.$props.visittrend)
    // 初始化echarts实例
    const lineChart = echarts.init(this.$refs.charts)
    // 配置数据
    lineChart.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        type: 'category', // 数据可以均匀分布
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: 'line',
          smooth: true,
          data: this.$props.visittrend,
          //   拐点的样式设置
          itemStyle: {
            opacity: 0,
          },
          //   线条的样式
          lineStyle: {
            color: '#9572e0',
          },
          //   填充区域的颜色
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              // 设置渐变色
              colorStops: [
                {
                  offset: 0,
                  color: '#9572e0', // 0% 处的颜色
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

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
