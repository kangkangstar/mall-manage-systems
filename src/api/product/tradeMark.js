// 品牌管理相关的接口
// 引入axios
import request from '@/utils/request'

// 获取品牌列表接口
//  url: /admin/product/baseTrademark/{page}/{limit}   get
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

// 新增品牌的接口
// url: /admin/product/baseTrademark/save   POST   携带参数  logoUrl   tmName   不需要带ID ID是由服务器生成的

// 修改品牌的接口
//  url:/admin/product/baseTrademark/update   PUT   参数 id 品牌名称 品牌logo
// （修改品牌，需要告诉服务器要改哪个，所以需要带id）
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 如果有id就是修改品牌
  if (tradeMark.id) {
    return request({
      url: `/admin/product/baseTrademark/update`,
      method: 'put',
      data: tradeMark
    })
  } else {
    // 新增品牌
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}

// 删除品牌
//  DELETE /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})
