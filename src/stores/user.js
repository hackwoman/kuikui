import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/index'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  
  // 动作
  async function login(username, password) {
    try {
      const response = await userApi.login({
        username,
        password
      })
      
      if (response.token) {
        token.value = response.token
        user.value = {
          id: response.id,
          username: response.username,
          email: response.email,
          roles: response.roles
        }
        
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
  
  async function register(username, email, password, name = '', phone = '', address = '') {
    try {
      // 准备注册数据
      const registerData = {
        username,
        email,
        password,
        roles: ["user"] // 默认为普通用户角色
      }
      
      // 添加可选字段（如果提供的话）
      if (name) registerData.name = name
      if (phone) registerData.phone = phone
      if (address) registerData.address = address
      
      console.log('发送注册请求:', registerData)
      
      const response = await userApi.register(registerData)
      console.log('注册成功:', response)
      
      return response
    } catch (error) {
      console.error('Registration error:', error)
      // 重新抛出错误，以便在组件中处理
      throw error
    }
  }
  
  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  
  return {
    token,
    user,
    isLoggedIn,
    login,
    register,
    logout
  }
}) 