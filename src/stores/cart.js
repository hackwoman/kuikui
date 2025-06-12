import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api/index'
import { useUserStore } from './user'
import { ElMessage } from 'element-plus'
import router from '@/router'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const userStore = useUserStore()
  
  // 计算属性
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity)
    }, 0).toFixed(2)
  })
  
  // 检查用户登录状态，如果未登录则提示并跳转到登录页
  const checkLoginStatus = () => {
    if (!userStore.isLoggedIn) {
      ElMessage.warning('请先登录以使用购物袋功能')
      router.push('/login')
      return false
    }
    return true
  }
  
  // 动作
  async function fetchCartItems() {
    if (!userStore.isLoggedIn) return
    
    try {
      loading.value = true
      error.value = null
      
      const response = await cartApi.getCart()
      cartItems.value = response
      
      return response
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // 未授权错误，用户未登录
        error.value = '请先登录以查看购物袋'
        cartItems.value = []
      } else {
        error.value = '获取购物袋信息失败'
        console.error('获取购物袋失败:', err)
      }
    } finally {
      loading.value = false
    }
  }
  
  async function addToCart(productId, quantity = 1) {
    if (!checkLoginStatus()) return false
    
    try {
      loading.value = true
      error.value = null
      
      const response = await cartApi.addToCart({
        productId,
        quantity
      })
      
      await fetchCartItems()
      ElMessage.success('商品已添加到购物袋')
      return true
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // 未授权错误，用户未登录
        error.value = '请先登录以添加商品到购物袋'
        ElMessage.warning('请先登录以添加商品到购物袋')
        router.push('/login')
      } else {
        error.value = '添加商品到购物袋失败'
        ElMessage.error('添加商品到购物袋失败')
        console.error('添加到购物袋失败:', err)
      }
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function updateCartItem(cartItemId, quantity) {
    if (!checkLoginStatus()) return false
    
    try {
      loading.value = true
      error.value = null
      
      const response = await cartApi.updateCartItem(cartItemId, {
        quantity
      })
      
      await fetchCartItems()
      return true
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error.value = '请先登录以更新购物袋'
        ElMessage.warning('请先登录以更新购物袋')
        router.push('/login')
      } else {
        error.value = '更新购物袋失败'
        ElMessage.error('更新购物袋失败')
        console.error('更新购物袋失败:', err)
      }
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function removeFromCart(cartItemId) {
    if (!checkLoginStatus()) return false
    
    try {
      loading.value = true
      error.value = null
      
      const response = await cartApi.removeFromCart(cartItemId)
      
      await fetchCartItems()
      return true
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error.value = '请先登录以移除购物袋商品'
        ElMessage.warning('请先登录以移除购物袋商品')
        router.push('/login')
      } else {
        error.value = '从购物袋移除商品失败'
        ElMessage.error('从购物袋移除商品失败')
        console.error('移除购物袋商品失败:', err)
      }
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function clearCart() {
    if (!checkLoginStatus()) return false
    
    try {
      loading.value = true
      error.value = null
      
      const response = await cartApi.clearCart()
      
      cartItems.value = []
      return true
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error.value = '请先登录以清空购物袋'
        ElMessage.warning('请先登录以清空购物袋')
        router.push('/login')
      } else {
        error.value = '清空购物袋失败'
        ElMessage.error('清空购物袋失败')
        console.error('清空购物袋失败:', err)
      }
      return false
    } finally {
      loading.value = false
    }
  }
  
  // 初始化时尝试获取购物车
  if (userStore.isLoggedIn) {
    fetchCartItems()
  }
  
  return {
    cartItems,
    loading,
    error,
    totalItems,
    totalPrice,
    fetchCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  }
}) 