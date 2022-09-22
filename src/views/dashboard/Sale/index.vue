<template>
  <el-card class="box-card" style="margin: 10px 0">
    <!-- 上半部分 -->
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visite" />
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        />
      </div>
    </div>
    <!-- 下半部分 -->
    <div class="content">
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 图表区 -->
          <div ref="charts" class="charts" />
        </el-col>
        <el-col :span="6">
          <!-- 右侧排行榜 -->
          <div>
            <h3>品牌{{ title }}排名</h3>
            <ul v-if="title === '销售额'">
              <li v-for="(order, index) in liststate.orderRank" :key="order.id">
                <span :class="order.no < 4 ? 'rindex' : 'rspan'">{{
                  order.no
                }}</span>
                <span>{{ order.name }}</span>
                <span class="rvalue">{{ order.money }}</span>
              </li>
            </ul>
            <ul v-if="title === '访问量'">
              <li v-for="(user, index) in liststate.userRank" :key="user.id">
                <span :class="user.no < 4 ? 'rindex' : 'rspan'">{{
                  user.no
                }}</span>
                <span>{{ user.name }}</span>
                <span class="rvalue">{{ user.money }}</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      activeName: 'sale',
      mycharts: null,
      // 收集日历数据
      date: [],
    }
  },
  computed: {
    // 计算属性-右侧排名的标题
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState({
      // 把首页全部的数据都保存下来需要啥写啥
      liststate: (state) => state.home.list,
    }),
  },
  // 监听属性
  watch: {
    // 监听图表标题
    title() {
      // 重新修改图表的标题配置
      // 图表配置数据可以再次修改，有新的用新的，没有就用之前的数据
      this.mycharts.setOption({
        title: {
          text: this.title,
        },
        xAxis: {
          // 根据标题展示不同数据
          data:
            this.title === '销售额'
              ? this.liststate.orderFullYearAxis
              : this.liststate.userFullYearAxis,
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data:
              this.title === '销售额'
                ? this.liststate.orderFullYear
                : this.liststate.userFullYear,
          },
        ],
      })
    },
    // 监听liststate数据回来再set一次
    liststate() {
      // 配置数据
      this.mycharts.setOption({
        title: {
          text: this.title,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.liststate.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.liststate.orderFullYear,
          },
        ],
        // 底部是mounted，为什么第一次没有数据呢？因为执行一次，没有数据所以不显示
      })
    },
  },
  mounted() {
    // 初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts)
    // 配置数据
    this.mycharts.setOption({
      title: {
        text: this.title,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [],
        },
      ],
      // 底部是mounted，为什么第一次没有数据呢？因为执行一次，没有数据所以不显示
    })
    // echar自带resize方法，视口改变响应式适应，记得销毁时关闭
    // window.onresize = () => {
    //   this.mycharts.resize()
    // }
  },
  // destroyed() {
  //   // 组件销毁的时候赋空销毁窗口事件
  //   return () => {
  //     window.onresize = null
  //   }
  // },
  methods: {
    // 今日时间的设置
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本月
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    },
  },
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 250px !important;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
  font-size: 12px;
}
.charts {
  height: 300px;
  width: 100%;
}
.el-col {
  padding: 0px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
  margin-right: 10px;
}
.rvalue {
  float: right;
}
.rspan {
  margin: 0 10px 0 8px;
}
</style>
