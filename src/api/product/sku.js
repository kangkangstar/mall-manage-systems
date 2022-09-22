import request from '@/utils/request'

// sku列表的接口
//  /admin/product/list/{page}/{limit}   get
export const reqSkuList = (page, limit) => request({
  url: `/admin/product/list/${page}/${limit}`,
  method: 'get'
})

// sku上架的接口
// url:/admin/product/onSale/{skuId}    get
export const reqSale = (skuId) => request({
  url: `/admin/product/onSale/${skuId}`,
  method: 'get'
})

// sku下架的接口
// ulr:/admin/product/cancelSale/{skuId}   get
export const reqCancel = (skuId) => request({
  url: `/admin/product/cancelSale/${skuId}`,
  method: 'get'
})

// 获取sku详情的接口
// url: /admin/product/getSkuById/{skuId}   get
export const reqSkuById = (skuId) => request({
  url: `/admin/product/getSkuById/${skuId}`,
  method: 'get'
})
