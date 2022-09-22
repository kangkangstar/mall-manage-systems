<template>
  <div>
    <!-- 两个el-card  -->
    <el-card style="margin: 20px auto">
      <!-- 三级联动组件,场景不等于0会禁用 -->
      <CategorySelect :show="scene !== 0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!--底部这里之后会有3部分切换-->
      <!-- 展示SPU列表的结构 -->
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border style="width: 100%; margin: 10px auto" :data="records">
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="80"
          />
          <el-table-column label="SPU名称" prop="spuName" />
          <el-table-column label="SPU描述" prop="description" />
          <el-table-column label="操作">
            <!-- 使用插槽呈现样式 -->
            <template slot-scope="{ row, $index }">
              <!-- 这里按钮将来用 hintButton替换,有hover提示功能 -->
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              />
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              />
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的全部sku列表"
                @click="handler(row)"
              />
              <el-popconfirm
                title="确定要删除当前的spu吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="text-align: center"
          :total="total"
          :current-page="page"
          :page-size="3"
          :page-sizes="[3, 5, 10]"
          layout="prev,pager,next,jumper,->,sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <!-- 添加或修改spu结构 -->
      <spuForm v-show="scene === 1" ref="spu" @changeScene="changeScene" />
      <!-- 展示添加sku的结构 -->
      <skuForm v-show="scene === 2" ref="sku" @changescene="changescene" />
    </el-card>
    <!-- 查看全部sku列表的对话框结构 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table v-loading="loading" border :data="skuList">
        <el-table-column label="名称" width="width" prop="skuName" />
        <el-table-column label="价格" width="width" prop="price" />
        <el-table-column label="重量" width="width" prop="weight" />
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import skuForm from './skuForm'
import spuForm from './spuForm'
export default {
  name: 'Spu',
  components: {
    skuForm,
    spuForm,
  },
  data() {
    return {
      // 各级分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 分页器当前第几页
      page: 1,
      // 每页展示多少条数据
      limit: 3,
      // 存储spu列表的数据
      records: [],
      // 展示数据条数
      total: 0,
      // 底部card切换不同展示内容的标记  0 展示spu列表  1 添加spu  2 查看sku
      scene: 0,
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      // 保存当前点击的spu的信息，再去查看相应的sku列表
      spu: {},
      // 存储sku列表数据
      skuList: [],
      loading: true,
    }
  },
  methods: {
    // 三级联动的自定义事件，可以把子组件相应的id传递给父组件
    // 解构出categoryId level
    getCategoryId({ categoryId, level }) {
      // 存储各级分类的id ，通过level区分
      if (level === 1) {
        this.category1Id = categoryId
        // 清除其他分级的id
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        // 清除三级id
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 三级id有了之后获取SPU列表数据进行展示
        this.getSpuList()
      }
    },
    // 获取SPU列表数据的方法 | 分页器的页码变化时候的回调
    async getSpuList(pages = 1) {
      // 给默认参数，如果有就用传入的，没有就用默认参数
      this.page = pages
      const { page, limit, category3Id } = this
      // 参数：三级分类id category3Id  当前页码page   每页记录数limit
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 分页器某一页展示数据条数变化时的回调
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      // 再次发请求
      this.getSpuList()
    },
    // 添加SPU按钮的回调
    addSpu() {
      // 切换场景
      this.scene = 1
      // 获取子组件spuForm身上的addSpuData方法去发请求--1.获取品牌的数据 2.全部销售属性的数据
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改某一个spu
    updateSpu(row) {
      this.scene = 1
      // 获取子组件spuForm子组件
      // 在父组件当中可以通过$ref获取子组件等等
      this.$refs.spu.initSpuData(row)
    },
    // spuForm的自定义事件回调
    changeScene({ scene, flag }) {
      // flag形参：为了区分保存按钮是添加还是修改
      // 切换场景
      this.scene = scene
      // 获取数据
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除按钮的回调
    async deleteSpu(row) {
      // 发删除请求
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除spu成功' })
        // 如果spu个数的数组长度大于1留在当前页，否则回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku按钮的回到
    addSku(row) {
      // console.log(row)
      // 切换场景为2，展示skuForm子组件
      this.scene = 2
      // 父组件调用子组件的方法，让子组件发请求---3个请求
      // row即为当前点击的这行spu数据
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // skuForm通知父组件修改成0
    changescene(scene) {
      this.scene = scene
    },
    // 查看全部sku按钮的回调
    async handler(row) {
      // 点击按钮显示对话框
      this.dialogTableVisible = true
      // 保存当前的spu
      this.spu = row
      // console.log(this.spu.id)
      // 获取sku列表的数据进行展示
      const result = await this.$API.spu.reqSkuList(row.id)
      if (result.code === 200) {
        this.skuList = result.data
        // 隐藏loading
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done) {
      // loading属性变为真
      this.loading = true
      // 置空，放置快速切换查看sku出现数据回显问题
      this.skuList = []
      // function(done)，done 用于关闭 Dialog
      done()
    },
  },
}
</script>

<style>
</style>
