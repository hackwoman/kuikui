import { get, post } from '@/utils/request'

// 用户登录
export function login(data) {
  return post('/auth/login', data)
}

// 用户注册
export function register(data) {
  return post('/auth/register', data)
}

// 获取用户信息
export function getUserInfo() {
  return get('/user/info')
}

// 用户登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
} 