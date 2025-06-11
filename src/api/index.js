import { get, post, put, del } from '@/utils/request'

// 用户相关API
export const userApi = {
  // 用户登录
  login: (data) => post('/auth/signin', data),
  
  // 用户注册
  register: (data) => post('/auth/signup', data),
  
  // 获取用户信息
  getUserInfo: () => get('/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data) => put('/user/info', data),
  
  // 修改密码
  changePassword: (data) => post('/user/password/change', data)
}

// 商品相关API
export const productApi = {
  // 获取商品列表
  getProducts: (params) => get('/products', params),
  
  // 获取商品详情
  getProductById: (id) => get(`/products/${id}`),
  
  // 按分类获取商品
  getProductsByCategory: (categoryId, params) => get(`/categories/${categoryId}/products`, params),
  
  // 搜索商品
  searchProducts: (params) => get('/products/search', params),
  
  // 获取限量商品
  getLimitedProducts: (params) => get('/products/limited', params),
  
  // 获取商品鉴定信息
  getAuthentication: (productId) => get(`/products/${productId}/authentication`)
}

// 分类相关API
export const categoryApi = {
  // 获取所有分类
  getCategories: () => get('/categories'),
  
  // 获取分类详情
  getCategoryById: (id) => get(`/categories/${id}`)
}

// 购物车相关API
export const cartApi = {
  // 获取购物车
  getCart: () => get('/cart'),
  
  // 添加商品到购物车
  addToCart: (data) => post('/cart/add', data),
  
  // 更新购物车商品
  updateCartItem: (id, data) => put(`/cart/update/${id}`, data),
  
  // 移除购物车商品
  removeFromCart: (id) => del(`/cart/remove/${id}`),
  
  // 清空购物车
  clearCart: () => del('/cart/clear')
}

// 订单相关API
export const orderApi = {
  // 创建订单
  createOrder: (data) => post('/orders', data),
  
  // 获取订单列表
  getOrders: (params) => get('/orders', params),
  
  // 获取订单详情
  getOrderById: (id) => get(`/orders/${id}`),
  
  // 取消订单
  cancelOrder: (id) => put(`/orders/${id}/cancel`),
  
  // 确认收货
  confirmOrder: (id) => put(`/orders/${id}/confirm`)
}

// 交换相关API
export const exchangeApi = {
  // 获取交换列表
  getExchanges: (params) => get('/exchanges', params),
  
  // 获取交换详情
  getExchangeById: (id) => get(`/exchanges/${id}`),
  
  // 创建交换需求
  createExchange: (data) => post('/exchanges', data),
  
  // 提出交换
  offerExchange: (id, data) => post(`/exchanges/${id}/offer`, data),
  
  // 接受交换
  acceptExchange: (id, offerId) => put(`/exchanges/${id}/accept/${offerId}`),
  
  // 拒绝交换
  rejectExchange: (id, offerId) => put(`/exchanges/${id}/reject/${offerId}`),
  
  // 取消交换
  cancelExchange: (id) => put(`/exchanges/${id}/cancel`),
  
  // 完成交换
  completeExchange: (id) => put(`/exchanges/${id}/complete`)
}

// 地址相关API
export const addressApi = {
  // 获取地址列表
  getAddresses: () => get('/addresses'),
  
  // 添加地址
  addAddress: (data) => post('/addresses', data),
  
  // 更新地址
  updateAddress: (id, data) => put(`/addresses/${id}`, data),
  
  // 删除地址
  deleteAddress: (id) => del(`/addresses/${id}`),
  
  // 设置默认地址
  setDefaultAddress: (id) => put(`/addresses/${id}/default`)
} 