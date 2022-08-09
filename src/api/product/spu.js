import request from '@/utils/request'

export const reqSpuList = (page, limit, category3Id) =>
  request({
    baseURL: 'api',
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: {
      category3Id
    }
  })

export const reqSpu = (spuId) =>
  request({
    baseURL: 'api',
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
  })

export const reqTrademarkList = () =>
  request({
    baseURL: 'api',
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
  })

export const reqSpuImageList = (spuId) =>
  request({
    baseURL: 'api',
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
  })

export const reqBaseSaleAttrList = () =>
  request({
    baseURL: 'api',
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
  })

export const reqUpdateOrSaveSpuInfo = (spuInfo) => {
  let url
  if (spuInfo.id) {
    url = '/admin/product/updateSpuInfo'
  } else {
    url = '/admin/product/saveSpuInfo'
  }
  return request({
    baseURL: 'api',
    url,
    method: 'post',
    data: spuInfo
  })
}

export const reqDeleteSpu = (spuId) =>
  request({
    baseURL: 'api',
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
  })

export const reqSpuSaleAttrList = (spuId) =>
  request({
    baseURL: 'api',
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
  })

export const reqAttrInfoList = ({ category1Id, category2Id, category3Id }) =>
  request({
    baseURL: 'api',
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })

export const reqAddSku = (skuInfo) =>
  request({
    baseURL: 'api',
    url: '/admin/product/saveSkuInfo',
    method: 'post',
    data: skuInfo
  })

export const reqSkuList = (spuId) =>
  request({
    baseURL: 'api',
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
  })
