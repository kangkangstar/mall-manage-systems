<template>
  <!-- 准备一个带宽和高的容器 -->
  <div ref="charts" class="charts" />
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
export default {
  props: ['count'],
  mounted() {
    // 初始化echarts实例
    const lineChart = echarts.init(this.$refs.charts)
    // 配置数据
    lineChart.setOption({
      xAxis: {
        //   隐藏x轴
        show: false,
        // 最小值与最大值的设置
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        // 均分
        type: 'category',
      },
      series: [
        {
          type: 'bar',
          data: [this.$props.count],
          // 设置柱状图的宽度
          barWidth: 10,
          color: 'yellowgreen',
          // 背景颜色设置
          showBackground: true,
          // 设置背景颜色
          backgroundStyle: {
            color: '#eee',
          },
          // 文本设置
          label: {
            show: true,
            // 改变文本内容
            formatter: '|',
            // 设置标签位置
            position: 'right',
            fontWeight: 'bold',
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
