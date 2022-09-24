<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px auto"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件
    table属性
    data:表格组件将来需要展示的数据---数据类型
    border：给表格添加边框
    column属性
    label:显示的标题
    width:对应列的宽度
    align:标题对齐方式
    type="index"：展示序号
    prop:对应列内容的字段名
    注意1：elementUI当中的table，展示的数据是以列进行展示的
    注意2：图片和操作这块需要使用作用域插槽，通过父组件决定子组件展示的样式，不如ant使用简单
    -->
    <el-table border style="width: 100%" :data="list" size="mini">
      <el-table-column label="序号" width="80px" align="center" type="index" />
      <el-table-column label="品牌名称" prop="tmName" />
      <el-table-column label="品牌LOGO" prop="logoUrl">
        <!-- 展示图片如果直接写，只能显示地址，使用作用域插槽展示为图片 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器
     重要数据：当前第几页，数据总条数、每一页展示条数 连续页码数据
     @current-change=""  当前页码变化时触发
     @size-change=''
     layout：组件布局，子组件名用逗号分隔,加个箭头，让后面的子组件可以靠右展示
     current-page：当前第几页
     total：代表分业务i一共需要展示数据条数
     page-size：每一页展示条数
     page-sizes：可以设置每一页展示多少条数据
     layout：实现分页器布局
     pager-count：页码按钮的数量，减去2就是连续页码数
      -->
    <el-pagination
      style="text-align: center; margin-top: 10px"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, ->,sizes,total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    />
    <!-- 添加的对话框
    :visible.sync：控制对话框显示与隐藏用的-->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单
      model:表单数据对象,将数据收集到哪个对象身上，将来表单验证也需要这个属性
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
       -->
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!--
            这里收集数据，不能用v-model，因为不是表单元素
            action：设置图片上传的地址  项目的地址：/admin/product/fileUpload，记得加前缀/dev-api，不然不转发给代理服务器
            :on-success="handleAvatarSuccess" :检测到图片上传成功，当图片上传成功会执行一次
            :before-upload="beforeAvatarUpload" ：可以在图片上传之前执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 按钮区 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    // 自定义校验规则
    var validatetmName = (rule, value, callback) => {
      // value长度在2-10之间
      if (value.length < 2 || value.length > 10) {
        callback(new Error('长度在 2 到 10 个字符'))
      } else {
        callback()
      }
    }
    return {
      // 代表分页器当前是第几页
      page: 1,
      // 当前分页器展示数据条数
      limit: 3,
      // 总数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏的属性
      dialogFormVisible: false,
      // 收集品牌信息，不能瞎写需要和后台一致
      tmForm: {
        tmName: '',
        logoUrl: '',
      },
      // 对话框中表单的验证规则
      rules: {
        // 品牌名称的验证规则
        // required:必须要校验字段（带星号）  trigger 用户行为设置（事件的设置  blur change）
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // 品牌名称长度2-10
          // {min: 2,max: 10,message: '长度在 2 到 10 个字符',trigger: 'change',},
          { validator: validatetmName, trigger: 'change' },
        ],
        // 品牌的logo验证规则
        logoUrl: [{ required: true, message: '请选择品牌图片' }],
      },
    }
  },
  // 组件挂载完毕发情况
  mounted() {
    // 获取列表数据方法
    this.getPageList()
  },
  methods: {
    // 获取品牌列表的数据(默认值1，点击分页器时会自动传入当前点击的页码数)
    async getPageList(pager = 1) {
      this.page = pager
      // 解构出参数
      const { page, limit } = this
      // 获取品牌列表的接口(需要带参数  page limit)
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 当分页器某一页展示数据条数发生变化时触发
    handleSizeChange(size) {
      this.limit = size
      this.getPageList()
    },
    // 添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true
      // 清除之前的数据
      this.tmForm = {
        tmName: '',
        logoUrl: '',
      }
    },
    // 修改品牌的回调
    updateTradeMark(row) {
      // row :当前用户选择的品牌信息（id logoUrl tmName）
      // 显示对话框
      this.dialogFormVisible = true
      // 将服务器返回的品牌信息赋值给tmForm进行展示，tmForm也就是存储的服务器返回的品牌信息
      // 所以需要使用浅拷贝,tmForm和服务器返回的是两个单独的数据，
      this.tmForm = { ...row }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res:上传成功之前返回给前端的数据，包含图片的地址
      // file：上传成之后服务器返回给前端的数据对象
      // 收集品牌图片的数据，就可以删除data中的imageUrl这个字段,原因是已经获取到图片了
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const max = 500 / 1024
      const isLt2M = file.size / 1024 / 1024 < max

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 500kb !')
      }
      return (isJPG || isPNG) && isLt2M
    },
    // 对话框中的确定添加按钮（添加品牌 | 修改品牌）
    addOrUpdateTradeMark() {
      // 当全部表单验证完毕后再去书写逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果字段全部验证成功
        if (success) {
          // 第一步：隐藏对话框
          this.dialogFormVisible = false
          // 第二步：发请求
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          )
          // 添加成功干什么
          if (result.code === 200) {
            // 弹出提示信息：添加/修改品牌成功
            const message = this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            this.$message({
              message: message,
              type: 'success',
            })
            // 重新获取品牌列表
            // 如果添加品牌：停留在第一页，修改品牌应该停在在当前页面
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('提交失败')
        }
      })
    },
    // 删除品牌的回调
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}品牌？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 点击确定按钮触发
          // 向服务器发请求
          const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
          if (result.code === 200) {
            // 提示成功
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            // 再次发请求获取品牌数据
            // 注意:需要判断list数组长度,如果长度大于1,留在当前页,否则应该回到前一页
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
