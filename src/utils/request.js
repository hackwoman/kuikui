import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: '', // 移除/api前缀，避免与代理配置重复
  timeout: 15000,  // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    
    // 如果存在token，则在请求头中添加token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 如果响应状态码不是200，则认为是错误
    if (response.status !== 200) {
      ElMessage({
        message: res.message || '请求错误',
        type: 'error',
        duration: 5 * 1000
      })
      
      return Promise.reject(new Error(res.message || '请求错误'))
    }
    
    // 正常返回数据
    return res
  },
  error => {
    const { response } = error
    
    if (response) {
      // 401: 未授权 - token过期或未登录
      if (response.status === 401) {
        ElMessage({
          message: '登录状态已过期，请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
        
        // 清除本地token
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // 重定向到登录页
        router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
      } 
      // 403: 禁止访问
      else if (response.status === 403) {
        ElMessage({
          message: '没有权限访问该资源',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 404: 资源不存在
      else if (response.status === 404) {
        ElMessage({
          message: '请求的资源不存在',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 500: 服务器错误
      else if (response.status === 500) {
        ElMessage({
          message: '服务器内部错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
      // 其他错误
      else {
        ElMessage({
          message: response.data.message || `请求错误: ${response.status}`,
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else {
      // 请求超时或网络错误
      if (error.message.includes('timeout')) {
        ElMessage({
          message: '请求超时，请检查网络',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        ElMessage({
          message: '网络错误，请检查您的网络连接',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    
    return Promise.reject(error)
  }
)

// 封装GET请求
export function get(url, params = {}) {
  return service({
    url,
    method: 'get',
    params
  })
}

// 封装POST请求
export function post(url, data = {}) {
  return service({
    url,
    method: 'post',
    data
  })
}

// 封装PUT请求
export function put(url, data = {}) {
  return service({
    url,
    method: 'put',
    data
  })
}

// 封装DELETE请求
export function del(url, params = {}) {
  return service({
    url,
    method: 'delete',
    params
  })
}

// 导出axios实例
export default service 