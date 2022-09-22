import request from '@/utils/request'

// 获取SPU列表数据的接口
//  GET /admin/product/{page}/{limit}   参数：三级分类id  当前页码page   每页记录数limit
export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'get',
  params: {
    // KV一致省略V
    category3Id
  }
})

// 获取SPU信息
// GET /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({
  url: `/admin/product/getSpuById/${spuId}`,
  method: 'get'
})

// 获取品牌的信息
//  GET /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () => request({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method: 'get'
})

// 获取spu图片的接口
// GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'get'
})

// 获取平台属性的接口--一共有3个，不会多于3个
// GET /admin/product/baseSaleAttrList
export const reqBaseSaleAttrLisr = () => request({
  url: '/admin/product/baseSaleAttrList',
  method: 'get'
})

// 修改spu | 添加spu :携带给服务器参数大致一样，区分是有没有id
// 修改url /admin/product/updateSpuInfo   添加url /admin/product/saveSpuInfo   post请求
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带的参数有id---修改spu
  if (spuInfo.id) {
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  } else {
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}

// 删除spu
// url :  /admin/product/deleteSpu/{spuId}  DELETE
export const reqDeleteSpu = (spuId) => request({
  url: `/admin/product/deleteSpu/${spuId}`,
  method: 'delete'
})

// 获取销售属性的数据
//  GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({
  url: `/admin/product/spuSaleAttrList/${spuId}`,
  method: 'get'
})

// 获取平台属性的数据
//  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加sku
//  /admin/product/saveSkuInfo   post
export const reqAddSku = (skuInfo) => request({
  url: '/admin/product/saveSkuInfo',
  method: 'post',
  data: skuInfo
})

// 获取SKU列表数据的接口
//  url /admin/product/findBySpuId/{spuId}  get
export const reqSkuList = (spuId) => request({
  url: `/admin/product/findBySpuId/${spuId}`,
  method: 'get'
})
