<template>
  <div>
    <!-- label-width：表单域标签的宽度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。 -->
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <!-- type="number"可以出现增加和价绍的箭头 -->
      <el-form-item label="价格(元)">
        <el-input
          v-model="skuInfo.price"
          placeholder="价格(元)"
          type="number"
        />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" rows="4" type="textarea" />
      </el-form-item>
      <!-- 平台属性部分，item内嵌form表单，再去嵌套需要的数据实现的 -->
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
            :label="attr.attrName"
          >
            <el-select v-model="attr.arrtIdAndValueId" placeholder="请选择">
              <el-option
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
          >
            <el-select v-model="saleAttr.attrIdAndValue" placeholder="请选择">
              <el-option
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80" />
          <el-table-column label="图片">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" />
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                v-if="row.isDefault === 0"
                type="primary"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else type="success" plain>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savaSku">保存</el-button>
        <el-button type="" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 存储销售属性的信息
      spuSaleAttrList: [],
      // 存储平台属性的信息
      attrInfoList: [],
      // 收集sku数据的信息---到时候带给服务器
      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0, // spu的id
        tmId: 0, // 品牌id

        // 第二类数据：通过数据双向绑定实现
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',

        // 第三类数据：需要发请求获取的
        // 默认图片
        skuDefaultImg: '',
        // 平台属性
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          },
        ],
        // 收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 销售属性列表
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: 'string',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: 'string',
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      // 收集选中的图片的字段,但需要注意，当前收集的数据中缺少isDefault字段
      imageList: [],
    }
  },
  methods: {
    // 获取skuForm数据,spu参数是父组件传递过来的，可以从上面获取需要的数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给的spu的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu

      // promise.all同时处理多个异步
      // 获取图片的数据
      const result = await this.$API.spu.reqSpuImageList(spu.id)
      if (result.code === 200) {
        const list = result.data
        // 给每条数据加上isDefault字段
        list.forEach((item) => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性的数据
      const result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data
      }
      // 获取平台属性的数据
      const result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      )
      if (result2.code === 200) {
        this.attrInfoList = result2.data
      }
    },
    // table复选框按钮的事件--全部选中的图片
    handleSelectionChange(params) {
      // params 即为选中的图片的信息
      // 获取到用户选中图片的信息数据，但需要注意，当前收集的数据中，缺少isDefault字段
      // 在getData获取数据的时候就添加上
      this.imageList = params
    },
    // 排他思想，进当前点击的变成绿色按钮
    changeDefault(row) {
      // 图片列表的数据的isDefault都改成0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      // 将点击项的isDefault改为1
      row.isDefault = 1
      // 设置为默认图片
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮的回调
    cancel() {
      // 触发自定义事件，让父组件切换场景为0
      this.$emit('changescene', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的回调
    async savaSku() {
      // 收集数据提交给服务器
      // 整理平台属性数据,如果有arrtIdAndValueId代表当前平台属性用户选中了，将此属性分割后以对象的形式push进skuInfo.skuAttrValueList
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // #region
      // 整理平台属性的数据方式1
      // 新建一个数据，接收整理好的数据
      // const arr = []
      // attrInfoList.forEach((item) => {
      //   if (item.arrtIdAndValueId) {
      //     // 切割字符串   arrtIdAndValueId:"106:175"
      //     const [attrId, valueId] = item.arrtIdAndValueId.spilt(':')
      //     // 携带给服务器参数应该是对象
      //     const obj = { attrId, valueId }
      //     arr.push(obj)
      //   }
      // })
      // 将整理好的参数赋值给skuInfo
      // skuInfo.skuAttrValueList = arr
      // #endregion

      // 整理平台属性的方式2
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.arrtIdAndValueId) {
          const [attrId, valueId] = item.arrtIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])

      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValue) {
          // 分割字符串
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValue.split(':')
          // 以对象形式push进数组
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])

      // console.log(imageList)
      // 整理图片数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        }
      })

      // 发请求
      const result = await this.$API.spu.reqAddSku(skuInfo)
      // console.log(result)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '添加sku成功' })
        // 通知父组件切换场景为0
        this.$emit('changescene', 0)
        // 直接返回就行不需要再发请求，因为这里不需要查看
        Object.assign(this._data, this.$options.data())
      }
    },
  },
}
</script>

<style>
</style>
