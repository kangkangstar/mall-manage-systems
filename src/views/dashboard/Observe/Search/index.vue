<template>
  <el-card>
    <!-- 头部文字+查看更多 -->
    <div class="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <!-- <el-dropdown>
          <span>
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
    </div>
    <!-- 内容区 -->
    <div class="context">
      <!-- 折线图区域 -->
      <!-- <el-row :gutter="10">
        <el-col :span="12">
          <lineCharts :list="list" />
        </el-col>
        <el-col :span="12">
          <lineCharts :list="list" />
        </el-col>
      </el-row> -->
      <lineCharts :list.sync="list" />
      <!-- table区域 -->
      <div>
        <el-table
          :data="search"
          style="width: 100%; margin-top: 10px"
          border
          height="200px"
        >
          <el-table-column prop="prop" label="排名" width="80" type="index" />
          <el-table-column prop="word" label="搜索关键词" width="120" />
          <el-table-column prop="user" label="用户数" sortable width="width" />
          <el-table-column prop="count" label="周涨幅" sortable width="width" />
        </el-table>
        <!-- 分页器 -->
        <!-- <el-pagination
          :total="totalmount"
          :current-page.sync="page"
          layout="prev,pager,next"
        /> -->
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import lineCharts from './lineCharts'
export default {
  components: { lineCharts },
  data() {
    return {
      page: 1,
    }
  },
  computed: {
    // home首页的全部数据，直接使用就行
    ...mapState({
      list: (state) => state.home.list,
    }),
    // 关键字数据
    search() {
      return this.list.searchWord
    },
  },
}
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
}
.header {
  border-bottom: 1px solid #eee;
}
.context {
  margin-top: 10px;
}
.pagination {
  float: right;
}
</style>
