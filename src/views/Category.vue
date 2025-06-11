<template>
  <div class="category-container container">
    <div class="filter-section">
      <h2 class="section-title">{{ categoryName || '所有商品' }}</h2>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-input
            placeholder="搜索商品"
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            class="search-input"
          >
            <template #append>
              <el-button @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="filter-row">
        <el-col :span="24">
          <el-radio-group v-model="sortBy" @change="fetchProducts">
            <el-radio-button label="default">默认排序</el-radio-button>
            <el-radio-button label="price_asc">价格从低到高</el-radio-button>
            <el-radio-button label="price_desc">价格从高到低</el-radio-button>
            <el-radio-button label="newest">最新上架</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20" v-if="!loading">
      <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="product in products" :key="product.id" class="product-col">
        <product-card :product="product" />
      </el-col>
      <el-col :span="24" v-if="products.length === 0" class="empty-result">
        <el-empty description="暂无商品" />
      </el-col>
    </el-row>
    
    <div v-else class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <el-pagination
      v-if="totalPages > 1"
      layout="prev, pager, next"
      :total="totalItems"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
      class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/product'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// 筛选和排序
const categoryId = ref(null)
const categoryName = ref('')
const searchKeyword = ref('')
const sortBy = ref('default')

// 商品列表和加载状态
const products = ref([])
const loading = ref(false)

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true
  
  try {
    let sortParam = {}
    
    // 根据排序选项设置参数
    switch (sortBy.value) {
      case 'price_asc':
        sortParam = { sort: 'price,asc' }
        break
      case 'price_desc':
        sortParam = { sort: 'price,desc' }
        break
      case 'newest':
        sortParam = { sort: 'createdAt,desc' }
        break
      default:
        sortParam = {}
    }
    
    // 分页参数
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value,
      ...sortParam
    }
    
    // 如果有搜索关键词
    if (searchKeyword.value) {
      const response = await productStore.searchProducts(searchKeyword.value, params)
      products.value = response.content || []
      totalItems.value = response.totalElements || 0
    } 
    // 如果有分类ID
    else if (categoryId.value) {
      const response = await productStore.fetchProductsByCategory(categoryId.value, params)
      products.value = response.content || []
      totalItems.value = response.totalElements || 0
      
      // 设置分类名称
      if (productStore.categories.length > 0) {
        const category = productStore.categories.find(c => c.id === parseInt(categoryId.value))
        if (category) {
          categoryName.value = category.name
        }
      }
    } 
    // 所有商品
    else {
      const response = await productStore.fetchProducts(params)
      products.value = response.content || []
      totalItems.value = response.totalElements || 0
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索商品
const handleSearch = () => {
  currentPage.value = 1
  router.push({
    path: '/category',
    query: { 
      ...route.query,
      keyword: searchKeyword.value || undefined,
      page: undefined
    }
  })
}

// 分页切换
const handlePageChange = (page) => {
  currentPage.value = page
  router.push({
    path: '/category',
    query: { 
      ...route.query,
      page: page > 1 ? page : undefined
    }
  })
}

// 监听路由变化
watch(() => route.query, (newQuery) => {
  categoryId.value = newQuery.id || null
  searchKeyword.value = newQuery.keyword || ''
  currentPage.value = parseInt(newQuery.page) || 1
  fetchProducts()
}, { immediate: true })

// 初始化
onMounted(async () => {
  // 获取分类列表
  if (productStore.categories.length === 0) {
    await productStore.fetchCategories()
  }
})
</script>

<style scoped>
.category-container {
  padding-bottom: 40px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-row {
  margin-top: 20px;
}

.search-input {
  width: 100%;
}

.product-col {
  margin-bottom: 20px;
}

.loading-container {
  padding: 20px 0;
}

.empty-result {
  padding: 40px 0;
  text-align: center;
}

.pagination {
  margin-top: 30px;
  text-align: center;
}
</style> 