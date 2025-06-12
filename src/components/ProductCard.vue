<template>
  <div class="product-card">
    <router-link :to="`/product/${product.id}`" class="product-link">
      <div class="product-badges">
        <span v-if="product.isAuthenticated" class="badge authenticated">已鉴定</span>
        <span v-if="product.isLimited" class="badge limited">限量</span>
        <span v-if="product.isExchangeable" class="badge exchangeable">可交换</span>
        <span v-if="product.condition" class="badge condition">{{ getConditionText(product.condition) }}</span>
      </div>
      
      <div class="product-image">
        <img :src="product.imageUrl" :alt="product.name">
      </div>
    </router-link>
    
    <div class="product-info">
      <div class="product-header">
        <div v-if="product.brand" class="product-brand">{{ product.brand }}</div>
        <div v-else class="product-brand">精品奢华</div>
        <div class="favorite-icon" @click.stop="toggleLike">
          <i :class="[isLiked ? 'el-icon-star-on liked' : 'el-icon-star-off']"></i>
        </div>
      </div>
      
      <router-link :to="`/product/${product.id}`" class="product-name-link">
        <h3 class="product-name">{{ product.name }}</h3>
      </router-link>
      
      <div class="product-price-section">
        <p class="product-price">¥{{ Number(product.price).toFixed(2) }}</p>
        <p v-if="product.originalPrice" class="product-original-price">¥{{ Number(product.originalPrice).toFixed(2) }}</p>
      </div>
      
      <div class="product-actions">
        <el-button 
          type="primary" 
          class="add-to-cart-btn"
          @click.stop="addToCartOnly"
        >
          加入购物袋
        </el-button>
        
        <el-button 
          plain
          class="buy-now-btn"
          @click.stop="addToCart"
        >
          立即购买
        </el-button>
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
const addToCart = async (event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
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
    console.error('添加到购物袋失败', error)
    ElMessage.error('添加到购物袋失败')
  }
}

// 仅添加到购物车
const addToCartOnly = async (event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: `/product/${props.product.id}` } })
    return
  }
  
  try {
    const success = await cartStore.addToCart(props.product.id, 1)
    if (success) {
      ElMessage.success('已添加到购物袋')
    }
  } catch (error) {
    console.error('添加到购物袋失败', error)
    ElMessage.error('添加到购物袋失败')
  }
}

// 发起交换
const offerExchange = () => {
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
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;
}

.product-card:hover {
  border-color: #ddd;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.product-link {
  color: inherit;
  text-decoration: none;
  display: block;
}

.product-image {
  height: 280px;
  overflow: hidden;
  position: relative;
  background-color: #f9f9f9;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.03);
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
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.authenticated {
  background-color: #000;
  color: white;
}

.limited {
  background-color: #be0000;
  color: white;
}

.exchangeable {
  background-color: #333;
  color: white;
}

.condition {
  background-color: #555;
  color: white;
}

.product-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.product-brand {
  color: #777;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.favorite-icon {
  cursor: pointer;
  font-size: 18px;
  color: #ccc;
  transition: color 0.3s;
}

.favorite-icon:hover {
  color: #333;
}

.favorite-icon .liked {
  color: #be0000;
}

.product-name-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 10px;
}

.product-name {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #000;
}

.product-name:hover {
  text-decoration: underline;
}

.product-price-section {
  display: flex;
  align-items: baseline;
  margin-bottom: 15px;
}

.product-price {
  font-size: 16px;
  font-weight: 500;
  color: #000;
  margin-right: 10px;
}

.product-original-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.product-actions {
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.add-to-cart-btn, .buy-now-btn {
  height: 40px;
  font-size: 13px;
  border-radius: 0;
  padding: 0;
}

.add-to-cart-btn {
  background: #000;
  border-color: #000;
}

.buy-now-btn {
  color: #000;
  border-color: #000;
}

.buy-now-btn:hover {
  color: #fff;
  background-color: #333;
  border-color: #333;
}

@media (max-width: 767px) {
  .product-image {
    height: 200px;
  }
  
  .product-actions {
    grid-template-columns: 1fr;
  }
}
</style> 