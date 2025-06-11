<template>
  <div class="product-card">
    <router-link :to="`/product/${product.id}`" class="product-link">
      <div class="product-badges">
        <span v-if="product.isAuthenticated" class="badge authenticated">已鉴定</span>
        <span v-if="product.isLimited" class="badge limited">限量版</span>
        <span v-if="product.isExchangeable" class="badge exchangeable">可交换</span>
        <span v-if="product.condition" class="badge condition">{{ getConditionText(product.condition) }}</span>
      </div>
      
      <div class="product-image">
        <img :src="product.imageUrl" :alt="product.name">
      </div>
      
      <div class="product-info">
        <div v-if="product.brand" class="product-brand">{{ product.brand }}</div>
        <h3 class="product-name">{{ product.name }}</h3>
        
        <div class="product-price-section">
          <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
          <p v-if="product.originalPrice" class="product-original-price">¥{{ product.originalPrice.toFixed(2) }}</p>
        </div>
        
        <div class="product-meta">
          <span class="product-sold">已售 {{ product.soldCount || 0 }}</span>
          <span class="product-likes">{{ product.likeCount || 0 }} 喜欢</span>
        </div>
      </div>
    </router-link>
    
    <div class="product-actions">
      <div class="action-buttons">
        <el-button 
          type="primary" 
          size="small" 
          @click="addToCart"
          class="buy-button"
        >
          立即购买
        </el-button>
        
        <el-button 
          v-if="product.isExchangeable"
          size="small" 
          @click="offerExchange"
          class="exchange-button"
        >
          发起交换
        </el-button>
      </div>
      
      <div class="action-icons">
        <el-tooltip content="加入收藏" placement="top">
          <i 
            class="action-icon" 
            :class="[isLiked ? 'el-icon-star-on liked' : 'el-icon-star-off']"
            @click="toggleLike"
          ></i>
        </el-tooltip>
        
        <el-tooltip content="加入购物车" placement="top">
          <i class="action-icon el-icon-shopping-cart-2" @click.stop="addToCartOnly"></i>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()
const isLiked = ref(false)

// 添加到购物车并跳转到购物车页面
const addToCart = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: `/product/${props.product.id}` } })
    return
  }
  
  try {
    const success = await cartStore.addToCart(props.product.id, 1)
    if (success) {
      router.push('/cart')
    }
  } catch (error) {
    console.error('添加到购物车失败', error)
    ElMessage.error('添加到购物车失败')
  }
}

// 仅添加到购物车
const addToCartOnly = async (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: `/product/${props.product.id}` } })
    return
  }
  
  try {
    const success = await cartStore.addToCart(props.product.id, 1)
    if (success) {
      ElMessage.success('已添加到购物车')
    }
  } catch (error) {
    console.error('添加到购物车失败', error)
    ElMessage.error('添加到购物车失败')
  }
}

// 发起交换
const offerExchange = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: `/product/${props.product.id}` } })
    return
  }
  
  router.push(`/exchange/create?productId=${props.product.id}`)
}

// 切换喜欢状态
const toggleLike = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  
  isLiked.value = !isLiked.value
  ElMessage.success(isLiked.value ? '已加入收藏' : '已取消收藏')
}

// 获取商品状态文本
const getConditionText = (condition) => {
  const conditionMap = {
    'NEW': '全新',
    'LIKE_NEW': '几乎全新',
    'EXCELLENT': '优良',
    'GOOD': '良好',
    'FAIR': '一般',
    'POOR': '较差'
  }
  return conditionMap[condition] || condition
}
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-link {
  color: inherit;
  text-decoration: none;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
}

.authenticated {
  background-color: #409eff;
  color: white;
}

.limited {
  background-color: #f56c6c;
  color: white;
}

.exchangeable {
  background-color: #67c23a;
  color: white;
}

.condition {
  background-color: #e6a23c;
  color: white;
}

.product-info {
  padding: 15px;
  flex: 1;
}

.product-brand {
  color: #909399;
  font-size: 12px;
  margin-bottom: 5px;
}

.product-name {
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 44px;
}

.product-price-section {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.product-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
  margin-right: 8px;
}

.product-original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.product-actions {
  padding: 0 15px 15px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.buy-button, .exchange-button {
  flex: 1;
}

.action-icons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.action-icon {
  cursor: pointer;
  font-size: 18px;
  color: #909399;
  transition: color 0.3s;
}

.action-icon:hover {
  color: #409eff;
}

.action-icon.liked {
  color: #f56c6c;
}
</style> 