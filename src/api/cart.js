import request from '@/utils/request'

// 获取购物车列表
export function getCart() {
  return request({
    url: '/api/cart',
    method: 'get'
  })
}

// 添加商品到购物车
export function addToCart(data) {
  return request({
    url: '/api/cart/add',
    method: 'post',
    data
  })
}

// 更新购物车商品数量
export function updateCartItem(cartItemId, data) {
  return request({
    url: `/api/cart/update/${cartItemId}`,
    method: 'put',
    data
  })
}

// 从购物车中移除商品
export function removeFromCart(cartItemId) {
  return request({
    url: `/api/cart/remove/${cartItemId}`,
    method: 'delete'
  })
}

// 清空购物车
export function clearCart() {
  return request({
    url: '/api/cart/clear',
    method: 'delete'
  })
}

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} 