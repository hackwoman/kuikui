import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api/index'
import { useUserStore } from './user'

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
      return total + (item.product.price * item.quantity)
    }, 0).toFixed(2)
  })
  
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
      error.value = '获取购物车信息失败'
      console.error('获取购物车失败:', err)
    } finally {
      loading.value = false
    }
  }
  
  async function addToCart(productId, quantity = 1) {
    if (!userStore.isLoggedIn) return false
    
    try {
      loading.value = true
      error.value = null
      
      const response = await cartApi.addToCart({
        productId,
        quantity
      })
      
      await fetchCartItems()
      return true
    } catch (err) {
      error.value = '添加商品到购物车失败'
      console.error('添加到购物车失败:', err)
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function updateCartItem(cartItemId, quantity) {
    if (!userStore.isLoggedIn) return false
    
    try {
      loading.value = true
      error.value = null
      
      const response = await cartApi.updateCartItem(cartItemId, {
        quantity
      })
      
      await fetchCartItems()
      return true
    } catch (err) {
      error.value = '更新购物车失败'
      console.error('更新购物车失败:', err)
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function removeFromCart(cartItemId) {
    if (!userStore.isLoggedIn) return false
    
    try {
      loading.value = true
      error.value = null
      
      const response = await cartApi.removeFromCart(cartItemId)
      
      await fetchCartItems()
      return true
    } catch (err) {
      error.value = '从购物车移除商品失败'
      console.error('移除购物车商品失败:', err)
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function clearCart() {
    if (!userStore.isLoggedIn) return false
    
    try {
      loading.value = true
      error.value = null
      
      const response = await cartApi.clearCart()
      
      cartItems.value = []
      return true
    } catch (err) {
      error.value = '清空购物车失败'
      console.error('清空购物车失败:', err)
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