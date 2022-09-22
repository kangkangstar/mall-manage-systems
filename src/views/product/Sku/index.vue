<template>
  <div>
    <!-- 表格结构 -->
    <el-table
      border
      style="width: 100%; margin: 20px 0"
      :data="records"
      height="450"
    >
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column width="110" label="名称" align="center" prop="skuName" />
      <el-table-column
        label="描述"
        width="width"
        align="center"
        prop="skuDesc"
      />
      <el-table-column label="默认图片" width="110" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(KG)"
        width="80"
        align="center"
        prop="weight"
      />
      <el-table-column
        label="价格(元)"
        width="80"
        align="center"
        prop="price"
      />
      <el-table-column label="操作" width="width" align="center">
        <!-- 有5个按钮 -->
        <template slot-scope="{ row, $index }">
          <HintButton
            v-if="row.isSale === 1"
            title="下架商品"
            type="warning"
            icon="el-icon-bottom"
            size="mini"
            @click="cancel(row)"
          />
          <HintButton
            v-else
            title="上架商品"
            type="success"
            icon="el-icon-top"
            size="mini"
            @click="sale(row)"
          />
          <HintButton
            title="查看sku"
            type="primary"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          />
          <HintButton
            type="info"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          />
          <!-- <el-button type="danger" icon="el-icon-delete" size="mini" /> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
    />
    <!-- sku详情查看的抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <!-- 内部使用layout布局 -->
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              v-for="(attr, index) in skuInfo.skuAttrValueList"
              :key="attr.id"
              style="margin: 0px 10px 10px 10px"
              type="success"
              >{{ attr.attrId }}-{{ attr.attrName }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <template slot-scope="">
            <el-carousel height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item"
              >
                <img :src="item.imgUrl" style="width: 200px; height: 200px" />
              </el-carousel-item>
            </el-carousel>
          </template>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 代表当前第几页
      page: 1,
      // 代表一页展示多少条数据
      limit: 5,
      // 存储sku列表的数据
      records: [],
      // 存储分页器总数据
      total: 0,
      // 存储sku详情的数据
      skuInfo: {},
      // 控制抽屉显示与隐藏的属性
      drawer: false,
    }
  },
  mounted() {
    // 获取sku列表数据
    this.getSkuList()
  },
  methods: {
    // 发请求获取sku列表数据
    async getSkuList(pages = 1) {
      // 这样页码改变时也能获取到相应得数据
      this.page = pages
      // 解构出参数
      const { page, limit } = this
      const result = await this.$API.sku.reqSkuList(page, limit)
      this.records = result.data.records
      this.total = result.data.total
    },
    // 当每页展示条数改变时触发的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 上架的回调
    async sale(row) {
      // 发请求上架，只有目前显示上架按钮的row才能上架
      const result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        // 将属性改成1，显示向下的箭头
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    // 下架的回调
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        // 将属性值改为0，显示向上的箭头
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    // 获取sku详情的方法
    async getSkuInfo(row) {
      this.drawer = true
      const result = await this.$API.sku.reqSkuById(row.id)
      // console.log(result)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    },
    // 正在开发中的回调
    edit() {
      this.$message({ type: 'info', message: '正在开发中' })
    },
  },
}
</script>

<style>
.el-carousel__item:nth-child(2n) {
  /* background-color: #99a9bf; */
  text-align: center;
}

.el-carousel__item:nth-child(2n + 1) {
  /* background-color: #d3dce6; */
  text-align: center;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  font-weight: 600;
}
.el-col {
  margin: 10px;
}

/* 深度选择器可以实现样式穿透 */
>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>
