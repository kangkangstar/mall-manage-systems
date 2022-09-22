<template>
  <div>
    <!-- 上半部分：三级分类 -->
    <el-card style="margin: 20px auto; padding-bottom: -10px">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <!-- 下半部分：属性表格 -->
    <el-card>
      <!-- 场景一：属性展示列表&&添加属性button -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格：展示平台属性
        只要在el-table元素中定义了height属性，即可实现固定表头的表格，而不需要额外的代码。-->
        <el-table :data="attrList" border style="margin: 10px 0" height="250">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80"
          />
          <el-table-column label="属性名称" width="150" prop="attrName" />
          <el-table-column label="属性值列表">
            <!-- 子组件的样式由父组件决定，使用作用域插槽,可以接收row,再从里面解构想要的属性值 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                type="success"
                style="margin: 0px 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <!-- 修改属性按钮 -->
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              />
              <!-- 删除气泡 -->
              <el-popconfirm
                :title="`确定删除${row.attrName}吗？`"
                @onConfirm="deleteAttr(row, $index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  style="margin-left: 15px"
                  @click="isShow = true"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 场景二：添加属性值 | 修改属性值的结构 -->
      <div v-show="!isShowTable">
        <!-- form -->
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <!-- 按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button type="" @click="isShowTable = true">取消</el-button>
        <!-- 表格 -->
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          />
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 编辑(input)与查看(span)模式切换
               @blur="toLook(row)" 鼠标离开隐藏 input 显示span 即为查看模式
               @click="toEdit(row, $index)" 点击span显示 input 隐藏span 即为编辑模式
              @keyup.native.enter="toLook(row)" input按回车显示span 隐藏 input
              修饰符 enter只能用于DOM事件，加上 native来进行触发   -->
              <el-input
                v-if="row.flag"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              />
              <span
                v-else
                style="display: block"
                @click="toEdit(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <!-- 删除按钮 -->
          <el-table-column label="操作" width="width" prop="prop">
            <template slot-scope="{ row, $index }">
              <!-- pop 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 按钮 -->
        <!-- 如果属性值为空则【保存】按钮禁用 -->
        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length < 1"
          @click="addOrUpdateAttr"
          >保存</el-button
        >
        <el-button type="" @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash中深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      flag: true,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // table平台属性的数据源
      attrList: [],
      // 控制添加属性+表格显示或隐藏
      isShowTable: true,
      isShow: false,
      // 收集新增属性|修改属性使用的
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值列表，得是数组
          // {
          //   attrId: 0, // 相应的属性名的id
          //   valueName: '',
          // },
        ],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3, // 服务器需要区分是哪级分类
      },
    }
  },
  methods: {
    // 自定义事件的回调，三个分类都绑定了，分开获取分类id进行存储，最后拿着3个id去获取数据
    getCategoryId({ categoryId, level }) {
      // 区分三级分类相应的id,并在父组件内存储
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId
        // 发请求获取平台属性数据
        this.getAttrList()
      }
    },
    // 获取平台属性数据
    async getAttrList() {
      // this.page = page
      const { category1Id, category2Id, category3Id } = this
      // 带一二三级分类的id去获取数据
      const result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      )
      if (result.code === 200) {
        this.attrList = result.data
        this.total = result.data.length
      }
    },
    // 添加属性按钮的回调---清除数据
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false
      // 清除数据，解决取消后数据回显问题
      // 收集三级分类的id
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [],
        categoryId: this.category3Id, // 三级分类的id
        categoryLevel: 3, // 服务器需要区分是哪级分类
      }
    },
    // 添加属性值按钮的回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      // attrId：是相应的属性的id,目前还没有id,先写undefined，如果新增是有id的
      // valueName ：相应属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以在已有属性值基础上新增（需要将已有的id带上啊）
        valueName: '',
        // flag属性：给每一个属性值添加一个标记flag,用户切换查看模式与编辑模式，好处：每一个属性值可以控制自己的模式切换，互相之间不影响，当前flag属性是响应式数据（数据变化视图跟着变化）
        // 这里的数组attrInfo，attrValueList都是在data中声明的，在data中声明的都是响应式数据，数组是push进来的，vue是可以检测到这个方法的，所以flag也是响应式的
        flag: true,
      })
      // 新增的文本框自动聚焦，数组的最后一项：长度-1即为index
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 修改某一个属性的回调--需要获取选中的数据
    updateAttr(row) {
      // 将table隐藏
      this.isShowTable = false
      // 将选中的属性赋值给attrInfo
      // 由于数组结构当汇总存在对象里套数组，数组里面套对象，需要使用深拷贝解决此类问题
      // 借助 lodash中的深拷贝解决
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记，便于切换编辑和查看模式
      this.attrInfo.attrValueList.forEach((item) => {
        // 以下代码可以添加flag属性，但视图不会跟着变化，因为数据不是响应式的
        // item.flag = false
        // 必须用于向响应式对象上添加新 property，因为Vue无法探测到普通的新增 property
        // 需要使用$set  格式： 给谁添加  什么属性  属性值
        this.$set(item, 'flag', false)
      })
    },
    // 添加属性值输入框失去焦点的事件---切换为查看模式，显示span
    toLook(row) {
      // 情况1：如果属性值为空不能作为新的属性值，需要给用户提示，让输入一个不为空的值
      // Trim是String型数据的一个方法，作用是去掉字符串开头和结尾的空格，比如说字符串a="____a__"，其中_表示一个空格，那么a.Trim() = "a"，字符串前后的空格都被清掉了。调用这个方法后，a的值是不变的，也就是说，虽然a.Trim() = "a"，但a="____a__"还是成立的。
      if (row.valueName.trim() === '') {
        this.$message('请输入一个不为空的属性值')
        return
      }
      // 情况2：新增的属性值不能与已有的属性值重复
      // some至少有一个符合就返回真
      const isRepeat = this.attrInfo.attrValueList.some((item) => {
        // row是最新添加的值，需要把已有的数组当中新增的这个属性值去掉，之和前面添加的比较
        // 判断的时候，不等于的话可以将其去除
        if (row !== item) {
          // 属性值相等返回
          return row.valueName === item.valueName
        }
      })
      // 如果重复直接弹窗和return,后面的代码就不执行了
      if (isRepeat) {
        this.$message('属性值重复请重新输入')
        return
      }
      // row：形参是当前用户添加的最新的属性值
      // 切换为查看模式
      row.flag = false
    },
    // 点击span的回调，切换为编辑模式
    toEdit(row, $index) {
      row.flag = true
      // 获取input节点，实现自动聚焦
      // console.log(this.$refs[$index])   ----undefined
      // 注意：点击span的时候，切换为input编辑模式，是使用v-if和v-else实现的，会导致页面重绘和重排，对于浏览器而言这些都需要时间
      // 所以点击span的时候，不可能立马获取到input,因而出现了 undefined报错
      // 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
      this.$nextTick(() => {
        // 让相应的input自动聚焦
        this.$refs[$index].focus()
      })
    },
    // 气泡确定框的确定按钮回调
    // 项目中element版本 2.13 ，确定事件需要写成 onConfirm  新版本写成 confirm 注意区分
    deleteAttrValue(index) {
      // 当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮：进行添加属性或修改属性的回调
    async addOrUpdateAttr() {
      // 整理参数
      // 1.flag不需要带给服务器
      // 2.用户添加很多属性值且为空的属性值也不需要提交给服务器
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉属性值为空的
          if (item.valueName != '') {
            //  删除掉flag属性
            delete item.flag
            return true
          }
        }
      )
      try {
        // 发请求保存数据
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        // 保存成功弹框
        this.$message({ type: 'success', message: '保存成功' })
        // 展示平台属性列表
        this.isShowTable = true
        // 保存成功之后需要再次获取平台属性进行展示
        this.getAttrList()
      } catch (error) {
        console.log('保存失败')
      }
    },
    // 删除属性按钮的回调
    async deleteAttr(row, index) {
      // 删除指定数据
      this.attrList.splice(index, 1)
      try {
        // 发请求删除数据
        const result = await this.$API.attr.reqDeleteAttr(row.id)
        // 成功关闭弹框并提示
        if (result.code === 200) {
          this.isShow = false
          this.$message({
            type: 'success',
            message: '删除成功',
          })
        }
      } catch (error) {
        console.log('删除失败')
      }
    },
  },
}
</script>

<style>
</style>
