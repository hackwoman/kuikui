import { get, post, put, del } from '@/utils/request'

// 用户相关API
export const userApi = {
  // 用户登录
  login: (data) => post('/api/auth/signin', data),
  
  // 用户注册
  register: (data) => post('/api/auth/signup', data),
  
  // 获取用户信息
  getUserInfo: () => get('/api/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => put('/api/user/info', data),
  
  // 修改密码
  changePassword: (data) => post('/api/user/password/change', data)
}

// 商品相关API
export const productApi = {
  // 获取商品列表
  getProducts: (params) => get('/api/products', params),
  
  // 获取商品详情
  getProductById: (id) => get(`/api/products/${id}`),
  
  // 按分类获取商品
  getProductsByCategory: (categoryId, params) => get(`/api/categories/${categoryId}/products`, params),
  
  // 搜索商品
  searchProducts: (params) => get('/api/products/search', params),
  
  // 获取限量商品
  getLimitedProducts: (params) => get('/api/products/limited', params),
  
  // 获取商品鉴定信息
  getAuthentication: (productId) => get(`/api/products/${productId}/authentication`),
  
  // 获取我的商品
  getMyProducts: () => get('/api/products/my')
}

// 分类相关API
export const categoryApi = {
  // 获取所有分类
  getCategories: () => get('/api/categories'),
  
  // 获取分类详情
  getCategoryById: (id) => get(`/api/categories/${id}`)
}

// 购物车相关API
export const cartApi = {
  // 获取购物车
  getCart: () => get('/api/cart'),
  
  // 添加商品到购物车
  addToCart: (data) => post('/api/cart/add', data),
  
  // 更新购物车商品
  updateCartItem: (id, data) => put(`/api/cart/update/${id}`, data),
  
  // 移除购物车商品
  removeFromCart: (id) => del(`/api/cart/remove/${id}`),
  
  // 清空购物车
  clearCart: () => del('/api/cart/clear')
}

// 订单相关API
export const orderApi = {
  // 创建订单
  createOrder: (data) => post('/api/orders', data),
  
  // 获取订单列表
  getOrders: (params) => get('/api/orders', params),
  
  // 获取订单详情
  getOrderById: (id) => get(`/api/orders/${id}`),
  
  // 取消订单
  cancelOrder: (id) => put(`/api/orders/${id}/cancel`),
  
  // 确认收货
  confirmOrder: (id) => put(`/api/orders/${id}/confirm`)
}

// 交换相关API
export const exchangeApi = {
  // 获取交换列表
  getExchanges: (params) => get('/api/exchanges', params),
  
  // 获取交换详情
  getExchangeById: (id) => get(`/api/exchanges/${id}`),
  
  // 创建交换需求
  createExchange: (data) => post('/api/exchanges', data),
  
  // 提出交换
  offerExchange: (id, data) => post(`/api/exchanges/${id}/offer`, data),
  
  // 接受交换
  acceptExchange: (id, offerId) => put(`/api/exchanges/${id}/accept/${offerId}`),
  
  // 拒绝交换
  rejectExchange: (id, offerId) => put(`/api/exchanges/${id}/reject/${offerId}`),
  
  // 取消交换
  cancelExchange: (id) => put(`/api/exchanges/${id}/cancel`),
  
  // 完成交换
  completeExchange: (id) => put(`/api/exchanges/${id}/complete`)
}

// 地址相关API
export const addressApi = {
  // 获取地址列表
  getAddresses: () => get('/api/addresses'),
  
  // 添加地址
  addAddress: (data) => post('/api/addresses', data),
  
  // 更新地址
  updateAddress: (id, data) => put(`/api/addresses/${id}`, data),
  
  // 删除地址
  deleteAddress: (id) => del(`/api/addresses/${id}`),
  
  // 设置默认地址
  setDefaultAddress: (id) => put(`/api/addresses/${id}/default`)
} 