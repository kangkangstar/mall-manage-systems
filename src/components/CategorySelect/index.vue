<template>
  <div>
    <!-- 设置 inline 属性可以让表单域变为行内的表单域 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!-- 给一级分类下拉框绑定数据和事件 -->
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          :disabled="show"
          @change="handler1"
        >
          <el-option
            v-for="(c1, index) in list1"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <!-- 将:value="c2.id" 收集到 v-model="cForm.category2Id" -->
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          :disabled="show"
          @change="handler2"
        >
          <el-option
            v-for="(c2, index) in list2"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          :disabled="show"
          @change="handler3"
        >
          <el-option
            v-for="(c3, index) in list3"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: ['show'], // 展示列表隐藏下拉框就不能显示
  data() {
    return {
      // 一级分类的数据
      list1: [],
      // 二级分类的数据
      list2: [],
      // 三级分类的数据
      list3: [],
      // 收集相应一级二级三级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    }
  },
  // 组件挂载完毕:向服务器发请求,获取一级分类的数据
  mounted() {
    // 获取一级分类的数据
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      // 不用携带参数
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 一级分类select事件回调(当一级分类的option发生变化时去获取相应的二级分类的数据)
    async handler1() {
      // 1.清除数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      // 2.解构出一级分类的id
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 3.通过一级分类id 获取二级分类的数据
      const result = await this.$API.attr.reqCategory2List(category1Id)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    // 二级分类select事件回调(当二级分类的option发生变化时去获取相应的三级分类的数据)
    async handler2() {
      // 1.清除数据
      this.list3 = []
      this.cForm.category3Id = ''
      // 2.解构出二级分类的id回传给父组件
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      // 3.通过二级分类id 获取三级分类的数据
      const result = await this.$API.attr.reqCategory3List(category2Id)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    // 三级分类select事件回调
    handler3() {
      // 解构出三级分类的id
      const { category3Id } = this.cForm
      // 通过自定义事件，以对象的形式将数据传递给父组件，加level是为了区分是哪一级的id
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    },
  },
}
</script>

<style>
</style>
