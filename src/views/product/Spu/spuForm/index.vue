<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          v-model="spu.description"
          type="textarea"
          placeholder="请输入SPU描述"
          rows="4"
        />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 照片墙组件 action图片上传的地址  list-type：文件列表的类型
        on-preview:图片预览的时候触发
        on-remove:删除图片的时候触发
        file-list:照片墙需要展示的数据【数组：数组里面的元素务必要有name,url属性】 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <!-- 弹出框 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrIdAndAttrName"
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
        >
          <el-option
            v-for="(unSelect, index) in unSelectSaleAttr"
            :key="unSelect.id"
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
          />
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示的是当前spu自身的销售属性spuSaleAttrList,名称即为saleAttrName -->
        <el-table
          border
          style="width: 100%; margin-top: 10px"
          :data="spu.spuSaleAttrList"
        >
          <el-table-column
            label="序号"
            prop="prop"
            type="index"
            width="80"
            align="center"
          />
          <el-table-column label="属性名" prop="saleAttrName" width="80" />
          <el-table-column label="属性值名称列表" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <!-- " -->
              <!-- el-tag：展示已有的属性值列表的数据,index即为销售属性值的索引值，和$index是不同的 -->
              <el-tag
                v-for="tag in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 底下的结构可以当作编辑和查看模式的切换 -->
              <!--
                @keyup.enter.native="handleInputConfirm"
                 -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @blur="handleInputConfirm(row)"
              />
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="80">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储spu信息属性,初始化的时候是一个空对象,在修改spu的时候会向服务器发请求，返回spu信息，在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      // 但添加spu,并没有像服务器发请求，那数据收集到哪里？spu  收集数据的时候有哪些字段呢？
      spu: {
        category3Id: 0,
        description: '',
        spuName: '', // 商品名称
        tmId: '', // 品牌id
        // spu图片
        spuImageList: [
          {
            id: '',
            imgName: '',
            imgUrl: '',
            spuId: '',
          },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      // 存储品牌的信息
      tradeMarkList: [],
      // 存储spu图片的信息
      spuImageList: [],
      // 存储销售属性的信息
      saleAttrList: [],
      // 收集未选择的销售属性的id
      attrIdAndAttrName: '',
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 平台全部的销售属性----saleAttrList
      // 当前spu拥有的自己的销售属性---spu.spuSaleAttrList
      // 数组的过滤，会返回一个新的数组,从全部销售属性里将已有销售属性中一样的过滤掉
      const result = this.saleAttrList.filter((item) => {
        // every 返回一个布尔值，真要，假不要
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    },
  },
  methods: {
    // 照片墙删除图片时会触发
    handleRemove(file, fileList) {
      // file：代表删除的那张图片
      // fileList：代表删除后剩余的图片的数组
      // 收集照片墙图片的数据(需要再删除name url字段，这两个属性是照片墙显示需要的属性，但服务器并不需要)
      this.spuImageList = fileList
    },
    // 照片墙图片预览时会触发
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个属性，方便去显示
      this.dialogImageUrl = file.url
      // 显示图片预览对话框
      this.dialogVisible = true
    },
    // 照片墙图片上传成功的回调
    handleSuccess(response, file, fileList) {
      // console.log(fileList)
      // 收集图片的信息
      this.spuImageList = fileList
    },
    // 初始化spuForm数据,接收父组件传递过来的row
    async initSpuData(spu) {
      // 获取spu数据
      const result = await this.$API.spu.reqSpu(spu.id)
      if (result.code === 200) {
        // 修改spu的时候，需要向服务器发请求的，把服务器返回的数据赋值给spu属性
        this.spu = result.data
      }
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
        // console.log(this.tradeMarkList)
      }
      // 获取spu图片的信息
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code === 200) {
        // 由于照片前显示图片的数据需要数组，数组里时对象，有name和url字段
        // 需要把服务器返回的数据进行修改，给每个item都添加 name和url字段
        const arrtList = spuImageResult.data
        arrtList.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的数据赋值给spuImageList,动态展示需要加 ：
        this.spuImageList = arrtList
      }
      // 获取平台全部的销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrLisr()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集到需要添加的销售属性的信息
      // 把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向SPU对象的spuSaleAttrList中添加新的销售属性
      const newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空数据框数据
      this.attrIdAndAttrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 点击销售属性值当中添加按钮的时候，需要将button变成input
      // 向row销售属性的身上添加一个，控制button和input切换($set添加响应式数据)
      // row.inputVisible = true
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据 收集新增的销售属性值
      this.$set(row, 'inputValue', '')
    },
    // el-input失去焦点的回调
    handleInputConfirm(row) {
      // 解构出 baseSaleAttrId  inputValue
      const { baseSaleAttrId, inputValue } = row
      // 1.属性值不能为空
      if (inputValue.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      // 2.属性值不能重复
      const result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName !== inputValue
      )
      // const result = row.spuSaleAttrValueList.some(
      //   (item) => item.saleAttrValueName === inputValue
      // )
      if (!result) {
        // result为真代表不重复，假为重复需要返回
        this.$message('属性值不能重复')
        return
      }
      // 整理成服务器需要的格式
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // push到属性值列表中
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      // 修改inputVisible = false，显示button
      row.inputVisible = false
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数：需要整理照片墙的数据
      // 携带参数：对于图片，需要携带imgName和imgeUrl字段，但新增的图片是没有这两个属性的
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          // 新增加的图需要使用response中的data作为路径，之前就有的图使用url做路劲即可
          imgUrl: (item.response && item.response.data) || item.url,
        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        // 通知父组件切换场景---展示列表
        this.$emit('changeScene', {
          scene: 0,
          flag: this.spu.id ? '修改' : '添加',
        })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加SPU按钮的发请求的回调
    async addSpuData(category3Id) {
      // 添加SPU的时候收集三级分类id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取平台全部的销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrLisr()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 取消按钮的回调
    cancel() {
      // 通知父组件将场景切换为0
      this.$emit('changeScene', { scene: 0, flag: '' })
      // 清理数据
      // Object.assign合并对象，es6新增的，后面的数据赋值给前面的
      // 组件实例this._data，可以操作data中的响应式数据
      // this.$options 可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    },
  },
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
