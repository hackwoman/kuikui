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
      return false
    }
  }
  
  async function register(username, email, password) {
    try {
      const response = await userApi.register({
        username,
        email,
        password
      })
      
      return response
    } catch (error) {
      console.error('Registration error:', error)
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