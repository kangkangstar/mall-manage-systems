<template>
  <!-- 借助a链接的hover功能 -->
  <a :title="title" style="margin: auto 10px">
    <!-- 使用 $attrs接收props属性，如果通过props接收过的，则不再此展示  $listeners接收自定义事件  -->
    <!-- 记住 v-bind 和 v-on 不可简写 -->
    <el-button v-bind="$attrs" v-on="$listeners" />
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  props: ['title'],
}
</script>

<style>
</style>
