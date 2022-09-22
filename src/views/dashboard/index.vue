<template>
  <div>
    <!-- 上 -->
    <Card />
    <!-- 中 -->
    <Sale />
    <!-- 下 -->
    <Observe />
  </div>
</template>

<script>
import Card from './card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'Dashboard',
  components: { Card, Sale, Observe },
  mounted() {
    // 派发action,获取home的模拟数据
    this.$store.dispatch('getData')
  },
}
</script>

