import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productApi, categoryApi } from '@/api/index'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const product = ref(null)
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // 获取所有产品
  async function fetchProducts(params = {}) {
    try {
      loading.value = true
      error.value = null
      
      const response = await productApi.getProducts(params)
      products.value = response
      
      return response
    } catch (err) {
      error.value = '获取产品列表失败'
      console.error('获取产品列表失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }
  
  // 按分类获取产品
  async function fetchProductsByCategory(categoryId, params = {}) {
    try {
      loading.value = true
      error.value = null
      
      const response = await productApi.getProductsByCategory(categoryId, params)
      products.value = response
      
      return response
    } catch (err) {
      error.value = '获取分类产品失败'
      console.error('获取分类产品失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }
  
  // 获取单个产品详情
  async function fetchProductById(productId) {
    try {
      loading.value = true
      error.value = null
      
      const response = await productApi.getProductById(productId)
      product.value = response
      
      return response
    } catch (err) {
      error.value = '获取产品详情失败'
      console.error('获取产品详情失败:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  
  // 获取所有分类
  async function fetchCategories() {
    try {
      loading.value = true
      error.value = null
      
      const response = await categoryApi.getCategories()
      categories.value = response
      
      return response
    } catch (err) {
      error.value = '获取分类列表失败'
      console.error('获取分类列表失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }
  
  // 搜索产品
  async function searchProducts(keyword, params = {}) {
    try {
      loading.value = true
      error.value = null
      
      const response = await productApi.searchProducts({
        keyword,
        ...params
      })
      products.value = response
      
      return response
    } catch (err) {
      error.value = '搜索产品失败'
      console.error('搜索产品失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }
  
  return {
    products,
    product,
    categories,
    loading,
    error,
    fetchProducts,
    fetchProductsByCategory,
    fetchProductById,
    fetchCategories,
    searchProducts
  }
}) 