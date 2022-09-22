<template>
  <div>
    <el-row :gutter="30">
      <!-- 左侧 -->
      <el-col :span="12">
        <Search />
      </el-col>
      <!-- 右侧 -->
      <el-col :span="12">
        <Category />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from './Search'
import Category from './Category'
export default {
  components: { Search, Category },
}
</script>

<style>
</style>
