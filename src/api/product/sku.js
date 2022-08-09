import request from '@/utils/request'

export const reqSkuList = (page, limit) =>
  request({
    baseURL: 'api',
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
  })

export const reqSale = (skuId) =>
  request({
    baseURL: 'api',
    url: `/admin/product/onSale/${skuId}`,
    method: 'get'
  })

export const reqCancel = (skuId) =>
  request({
    baseURL: 'api',
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get'
  })

export const reqSkuById = (skuId) =>
  request({
    baseURL: 'api',
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get'
  })
