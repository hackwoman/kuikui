import { get } from '@/utils/request'

// 获取商品列表
export function getProducts(params) {
  return get('/products', params)
}

// 获取商品详情
export function getProductDetail(id) {
  return get(`/products/${id}`)
}

// 获取商品分类
export function getCategories() {
  return get('/categories')
} 