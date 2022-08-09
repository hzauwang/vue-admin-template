import request from '@/utils/request'

export const reqTradeMarkList = (page, limit) =>
  request({
    baseURL: 'api',
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  let url = ''
  let method = ''
  if (tradeMark.id) {
    url = '/admin/product/baseTrademark/update'
    method = 'put'
  } else {
    url = '/admin/product/baseTrademark/save'
    method = 'post'
  }
  return request({
    baseURL: 'api',
    url,
    method,
    data: tradeMark
  })
}

export const reqDeleteTradeMark = (id) =>
  request({
    baseURL: 'api',
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
