// 平台属性管理模块请求文件
import request from '@/utils/request'

// 获取一级分类数据
//   GET /admin/product/getCategory1
export const reqCategory1List = () => request({
  url: '/admin/product/getCategory1',
  method: 'get'
})

// 获取二级分类数据
// /admin/product/getCategory2/{category1Id}  get
export const reqCategory2List = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: 'get'
})

// 获取三级分类数据
// /admin/product/getCategory3/{category2Id}   get
export const reqCategory3List = (category2Id) => request({
  url: `/admin/product/getCategory3/${category2Id}`,
  method: 'get'
})

// 获取平台属性接口
//  GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加属性与属性值接口
//   POST /admin/product/saveAttrInfo
export const reqAddOrUpdateAttr = (data) => request({
  url: `/admin/product/saveAttrInfo`,
  data,
  method: 'post'
})

/*  参数格式
{
  "attrName": "string",  属性名
  "attrValueList": [    属性名的属性值列表，属性值可以是多个
    {
      "attrId": 0,   属性名的id---归属于哪个属性分类
      "valueName": "string"   属性值
    }
  ],
  "categoryId": 0,——category3Id
  "categoryLevel": 3,
}
*/

// 删除平台属性
//  DELETE /admin/product/deleteAttr/{attrId}
export const reqDeleteAttr = (attrId) => request({
  url: `/admin/product/deleteAttr/${attrId}`,
  method: 'delete'
})
