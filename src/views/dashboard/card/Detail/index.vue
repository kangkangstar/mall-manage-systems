<template>
  <!-- 此文件为cart组件内每个详情展示的模板，里面可以更换信息也可以修改布局 -->
  <div>
    <!-- cart头部 -->
    <div class="card-header">
      <!-- 标题 -->
      <span>{{ title }}</span>
    </div>
    <!-- card内容 -->
    <div class="card-content">{{ count }}</div>
    <!-- card图表 -->
    <div class="card-chart">
      <slot name="charts" />
    </div>
    <!-- card底部 -->
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'count'],
}
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #8a8a8a;
  font-size: 12px;
}
.card-content {
  font-size: 30px;
  padding: 10px 0;
}
.card-chart {
  height: 50px;
  font-size: 12px;
  line-height: 40px;
}
.card-footer {
  border-top: 1px solid #8a8a8a;
  padding-top: 10px;
  font-size: 12px;
  line-height: 20px;
}
</style>
