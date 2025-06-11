<template>
  <div class="detail-container container" v-if="product">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/category', query: { id: product.category?.id } }">
        {{ product.category?.name || '商品分类' }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="product-detail">
      <el-row :gutter="30">
        <el-col :md="12" :sm="24">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name">
          </div>
        </el-col>
        <el-col :md="12" :sm="24">
          <div class="product-info">
            <h1 class="product-name">{{ product.name }}</h1>
            <div class="product-price">¥{{ product.price?.toFixed(2) }}</div>
            
            <div class="product-description">
              <p>{{ product.description }}</p>
            </div>
            
            <div class="product-actions">
              <el-input-number 
                v-model="quantity" 
                :min="1" 
                :max="product.stock" 
                class="quantity-input"
              />
              
              <el-button 
                type="primary" 
                size="large" 
                @click="addToCart" 
                :loading="loading"
                :disabled="product.stock <= 0"
              >
                加入购物车
              </el-button>
              
              <el-button 
                size="large" 
                @click="buyNow" 
                :disabled="product.stock <= 0"
              >
                立即购买
              </el-button>
            </div>
            
            <div class="product-meta">
              <p><span>商品编号:</span> {{ product.id }}</p>
              <p><span>库存状态:</span> {{ product.stock > 0 ? '有货' : '无货' }}</p>
              <p><span>剩余库存:</span> {{ product.stock }}</p>
              <p v-if="product.category"><span>分类:</span> {{ product.category.name }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="product-tabs">
      <el-tabs>
        <el-tab-pane label="商品详情">
          <div class="product-content">
            <h3>商品详情</h3>
            <div class="product-description-full">
              <p>{{ product.description }}</p>
              <!-- 这里可以放详细的HTML内容 -->
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户评价">
          <div class="product-reviews">
            <p>暂无评价</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="related-products" v-if="relatedProducts.length > 0">
      <h2 class="section-title">相关商品</h2>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="item in relatedProducts" :key="item.id" class="product-col">
          <product-card :product="item" />
        </el-col>
      </el-row>
    </div>
  </div>
  
  <div v-else-if="loading" class="loading-container">
    <el-skeleton :rows="10" animated />
  </div>
  
  <div v-else class="error-container container">
    <el-empty description="商品不存在或已下架" />
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useProductStore } from '../stores/product'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const cartStore = useCartStore()
const userStore = useUserStore()

const product = ref(null)
const relatedProducts = ref([])
const quantity = ref(1)
const loading = ref(false)

// 获取商品详情
const fetchProduct = async () => {
  loading.value = true
  try {
    const productId = route.params.id
    if (!productId) {
      ElMessage.error('商品ID不存在')
      router.push('/')
      return
    }
    
    const data = await productStore.fetchProductById(productId)
    product.value = data
    
    // 获取相关商品
    if (data && data.category) {
      const relatedData = await productStore.fetchProductsByCategory(data.category.id, { size: 6 })
      relatedProducts.value = relatedData.content?.filter(p => p.id !== data.id) || []
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

// 添加到购物车
const addToCart = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  
  loading.value = true
  try {
    const success = await cartStore.addToCart(product.value.id, quantity.value)
    if (success) {
      ElMessage.success('成功加入购物车')
    } else {
      ElMessage.error('加入购物车失败')
    }
  } catch (error) {
    console.error('添加到购物车失败:', error)
    ElMessage.error('添加到购物车失败')
  } finally {
    loading.value = false
  }
}

// 立即购买
const buyNow = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  
  // 先添加到购物车
  try {
    const success = await cartStore.addToCart(product.value.id, quantity.value)
    if (success) {
      // 跳转到购物车页面
      router.push('/cart')
    } else {
      ElMessage.error('添加到购物车失败')
    }
  } catch (error) {
    console.error('添加到购物车失败:', error)
    ElMessage.error('添加到购物车失败')
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.detail-container {
  padding-bottom: 40px;
}

.breadcrumb {
  margin: 20px 0;
}

.product-detail {
  margin-bottom: 30px;
}

.product-image {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.product-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 500;
}

.product-price {
  font-size: 28px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 20px;
}

.product-description {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.6;
}

.product-actions {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
}

.quantity-input {
  width: 120px;
}

.product-meta {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.product-meta p {
  margin: 5px 0;
  color: #666;
}

.product-meta span {
  color: #999;
  margin-right: 5px;
}

.product-tabs {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 30px;
}

.product-content, .product-reviews {
  padding: 20px 0;
}

.product-description-full {
  line-height: 1.8;
}

.related-products {
  margin-top: 40px;
}

.product-col {
  margin-bottom: 20px;
}

.loading-container {
  padding: 40px 0;
}

.error-container {
  text-align: center;
  padding: 60px 0;
}
</style> 