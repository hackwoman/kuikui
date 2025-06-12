<template>
  <div class="cart-container">
    <div class="cart-header-section">
      <h1 class="page-title">购物袋</h1>
    </div>
    
    <div v-if="cartStore.loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else-if="cartStore.cartItems.length === 0" class="empty-cart">
      <div class="empty-icon">
        <i class="el-icon-shopping-bag"></i>
      </div>
      <p class="empty-message">您的购物袋是空的</p>
      <p class="empty-submessage">探索我们的精选商品，开启专属购物之旅</p>
      <el-button type="primary" class="continue-shopping" @click="$router.push('/')">继续购物</el-button>
    </div>
    
    <div v-else-if="!userStore.isLoggedIn" class="auth-required">
      <div class="auth-icon">
        <i class="el-icon-lock"></i>
      </div>
      <h2 class="auth-title">请登录以访问您的专属购物袋</h2>
      <p class="auth-message">登录后您可以添加商品、保存心仪的单品并享受个性化购物体验</p>
      <div class="auth-actions">
        <el-button type="primary" class="login-btn" @click="$router.push('/login')">登录</el-button>
        <el-button plain class="register-btn" @click="$router.push('/register')">注册</el-button>
      </div>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-main">
        <div class="cart-list">
          <!-- 购物车头部 -->
          <div class="cart-list-header">
            <div class="header-left">
              <el-checkbox v-model="allSelected" @change="handleSelectAllChange" class="select-all">
                <span class="select-text">全部选择</span>
              </el-checkbox>
            </div>
            <div class="header-columns">
              <div class="column-product">商品详情</div>
              <div class="column-price">单价</div>
              <div class="column-quantity">数量</div>
              <div class="column-subtotal">小计</div>
              <div class="column-action">操作</div>
            </div>
          </div>
          
          <!-- 购物车商品列表 -->
          <div class="cart-items">
            <div 
              v-for="item in cartStore.cartItems" 
              :key="item.id" 
              class="cart-item"
            >
              <div class="item-select">
                <el-checkbox v-model="item.selected" @change="updateSelected" />
              </div>
              
              <div class="item-content">
                <div class="item-product">
                  <div class="product-image">
                    <img :src="item.product.imageUrl" :alt="item.product.name">
                  </div>
                  <div class="product-info">
                    <router-link :to="`/product/${item.product.id}`" class="product-name">
                      {{ item.product.name }}
                    </router-link>
                    <div class="product-meta" v-if="item.product.brand">{{ item.product.brand }}</div>
                  </div>
                </div>
                
                <div class="item-price">¥{{ Number(item.product.price).toFixed(2) }}</div>
                
                <div class="item-quantity">
                  <el-input-number 
                    v-model="item.quantity" 
                    :min="1" 
                    :max="item.product.stock"
                    :disabled="cartStore.loading"
                    @change="(val) => updateQuantity(item.id, val)"
                    size="small"
                    controls-position="right"
                  />
                </div>
                
                <div class="item-subtotal">¥{{ (Number(item.product.price) * item.quantity).toFixed(2) }}</div>
                
                <div class="item-action">
                  <el-button 
                    type="text" 
                    @click="removeItem(item.id)"
                    :loading="cartStore.loading"
                    class="remove-btn"
                  >
                    移除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 购物车结算 -->
      <div class="cart-footer">
        <div class="footer-actions">
          <div class="actions-left">
            <el-checkbox v-model="allSelected" @change="handleSelectAllChange">
              <span class="select-text">全部选择</span>
            </el-checkbox>
            <el-button type="text" @click="removeSelected" :disabled="!hasSelectedItems" class="action-btn">
              删除选中
            </el-button>
            <el-button type="text" @click="clearCart" class="action-btn">清空购物袋</el-button>
          </div>
        </div>
        
        <div class="cart-summary">
          <div class="summary-details">
            <div class="summary-row">
              <span>商品总计：</span>
              <span>¥{{ totalPrice }}</span>
            </div>
            <div class="summary-row">
              <span>已选商品：</span>
              <span>{{ selectedCount }} 件</span>
            </div>
          </div>
          
          <div class="summary-actions">
            <el-button 
              type="primary" 
              size="large"
              @click="checkout"
              :disabled="!hasSelectedItems || cartStore.loading"
              class="checkout-btn"
            >
              立即结算
            </el-button>
            <el-button 
              plain
              size="large"
              @click="$router.push('/')"
              class="continue-btn"
            >
              继续购物
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 推荐商品 -->
      <div class="recommended-section">
        <h2 class="section-title">为您推荐</h2>
        <div class="recommended-products">
          <div class="recommended-product">
            <div class="product-image">
              <img src="https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg" alt="推荐商品">
            </div>
            <div class="product-info">
              <div class="product-brand">LUXURY TIME</div>
              <div class="product-name">瑞士经典机械表</div>
              <div class="product-price">¥68,000.00</div>
            </div>
          </div>
          <div class="recommended-product">
            <div class="product-image">
              <img src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg" alt="推荐商品">
            </div>
            <div class="product-info">
              <div class="product-brand">ELEGANT</div>
              <div class="product-name">经典菱格链条包</div>
              <div class="product-price">¥29,800.00</div>
            </div>
          </div>
          <div class="recommended-product">
            <div class="product-image">
              <img src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg" alt="推荐商品">
            </div>
            <div class="product-info">
              <div class="product-brand">GEMS & JEWELS</div>
              <div class="product-name">钻石项链</div>
              <div class="product-price">¥235,000.00</div>
            </div>
          </div>
          <div class="recommended-product">
            <div class="product-image">
              <img src="https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg" alt="推荐商品">
            </div>
            <div class="product-info">
              <div class="product-brand">TAILOR MADE</div>
              <div class="product-name">高级定制西装</div>
              <div class="product-price">¥45,800.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

// 用于存储选中状态
const selectedItems = ref({})
const allSelected = ref(false)

// 计算已选商品数量
const selectedCount = computed(() => {
  return cartStore.cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.quantity, 0)
})

// 计算已选商品总价
const totalPrice = computed(() => {
  return cartStore.cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0)
    .toFixed(2)
})

// 是否有选中的商品
const hasSelectedItems = computed(() => {
  return cartStore.cartItems.some(item => item.selected)
})

// 初始化购物车数据和选中状态
onMounted(async () => {
  await cartStore.fetchCartItems()
  
  // 默认全选
  cartStore.cartItems.forEach(item => {
    item.selected = true
  })
  allSelected.value = cartStore.cartItems.length > 0
})

// 全选/取消全选
const handleSelectAllChange = (val) => {
  cartStore.cartItems.forEach(item => {
    item.selected = val
  })
}

// 更新选中状态
const updateSelected = () => {
  allSelected.value = cartStore.cartItems.length > 0 && 
    cartStore.cartItems.every(item => item.selected)
}

// 更新商品数量
const updateQuantity = async (itemId, quantity) => {
  await cartStore.updateCartItem(itemId, quantity)
}

// 移除单个商品
const removeItem = async (itemId) => {
  try {
    await ElMessageBox.confirm(
      '确定要从购物袋中移除该商品吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const success = await cartStore.removeFromCart(itemId)
    if (success) {
      ElMessage.success('商品已从购物袋移除')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除购物车商品失败:', error)
    }
  }
}

// 移除选中商品
const removeSelected = async () => {
  if (!hasSelectedItems.value) return
  
  try {
    await ElMessageBox.confirm(
      '确定要删除选中的商品吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const selectedItemIds = cartStore.cartItems
      .filter(item => item.selected)
      .map(item => item.id)
    
    let success = true
    for (const itemId of selectedItemIds) {
      const result = await cartStore.removeFromCart(itemId)
      if (!result) success = false
    }
    
    if (success) {
      ElMessage.success('选中商品已从购物袋移除')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除选中商品失败:', error)
    }
  }
}

// 清空购物车
const clearCart = async () => {
  if (cartStore.cartItems.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      '确定要清空购物袋吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const success = await cartStore.clearCart()
    if (success) {
      ElMessage.success('购物袋已清空')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('清空购物车失败:', error)
    }
  }
}

// 结算
const checkout = () => {
  if (!hasSelectedItems.value) {
    ElMessage.warning('请至少选择一件商品')
    return
  }
  
  // 假设这里跳转到订单确认页面，这个页面需要另外实现
  router.push('/checkout')
}

// 当购物车数据变化时，更新全选状态
watch(() => cartStore.cartItems, () => {
  updateSelected()
}, { deep: true })
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 60px;
  color: #333;
}

.cart-header-section {
  margin-bottom: 30px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  color: #000;
}

.loading-container {
  padding: 60px 0;
  max-width: 600px;
  margin: 0 auto;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
  color: #ccc;
}

.empty-message {
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 300;
  letter-spacing: 1px;
}

.empty-submessage {
  font-size: 16px;
  color: #777;
  max-width: 400px;
  margin-bottom: 30px;
}

.continue-shopping {
  min-width: 180px;
  height: 48px;
  font-size: 16px;
  letter-spacing: 1px;
  background: #000;
  border-color: #000;
}

.cart-content {
  background: #fff;
}

.cart-main {
  margin-bottom: 30px;
}

.cart-list {
  background: #fff;
}

.cart-list-header {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.header-columns {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 80px;
  margin-left: 50px;
  font-size: 14px;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.header-left {
  margin-bottom: 10px;
}

.select-text {
  font-size: 14px;
  color: #555;
}

.cart-items {
  padding: 0;
}

.cart-item {
  padding: 30px 0;
  border-bottom: 1px solid #f5f5f5;
}

.item-select {
  float: left;
  padding-top: 30px;
  margin-right: 15px;
}

.item-content {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr 1fr 80px;
  align-items: center;
}

.item-product {
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
  background: #f9f9f9;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 16px;
  color: #000;
  text-decoration: none;
  margin-bottom: 5px;
  display: block;
  font-weight: 400;
}

.product-name:hover {
  text-decoration: underline;
}

.product-meta {
  font-size: 14px;
  color: #777;
  margin-top: 5px;
}

.item-price, .item-subtotal {
  font-size: 16px;
  color: #000;
}

.item-subtotal {
  font-weight: 500;
}

.remove-btn {
  color: #999;
  text-decoration: underline;
}

.remove-btn:hover {
  color: #333;
}

.cart-footer {
  background: #f9f9f9;
  padding: 30px;
  margin-bottom: 50px;
}

.footer-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.actions-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-btn {
  color: #777;
  text-decoration: underline;
}

.action-btn:hover {
  color: #333;
}

.cart-summary {
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  align-items: center;
}

.summary-details {
  text-align: right;
}

.summary-row {
  margin-bottom: 10px;
  font-size: 14px;
  color: #555;
}

.summary-row:last-child {
  margin-bottom: 0;
  font-size: 18px;
  font-weight: 500;
}

.summary-actions {
  display: flex;
  gap: 15px;
}

.checkout-btn {
  min-width: 180px;
  height: 48px;
  background: #000;
  border-color: #000;
  font-size: 16px;
  letter-spacing: 1px;
}

.continue-btn {
  height: 48px;
  border-color: #ddd;
  color: #555;
  font-size: 16px;
  letter-spacing: 1px;
}

.recommended-section {
  margin-top: 60px;
}

.section-title {
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 30px;
  text-align: center;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.section-title:after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 1px;
  background: #000;
}

.recommended-products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 30px;
}

.recommended-product {
  text-align: center;
}

.recommended-product .product-image {
  width: 100%;
  height: 250px;
  margin-bottom: 15px;
}

.recommended-product .product-brand {
  font-size: 12px;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
}

.recommended-product .product-name {
  font-size: 14px;
  margin-bottom: 5px;
  color: #000;
}

.recommended-product .product-price {
  font-size: 16px;
  font-weight: 500;
  color: #000;
}

.auth-required {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.auth-icon {
  font-size: 60px;
  margin-bottom: 20px;
  color: #ccc;
}

.auth-title {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 10px;
}

.auth-message {
  font-size: 16px;
  color: #777;
  max-width: 400px;
  margin-bottom: 30px;
}

.auth-actions {
  display: flex;
  gap: 15px;
}

.login-btn {
  min-width: 180px;
  height: 48px;
  background: #000;
  border-color: #000;
  font-size: 16px;
  letter-spacing: 1px;
}

.register-btn {
  height: 48px;
  border-color: #ddd;
  color: #555;
  font-size: 16px;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .header-columns, .item-content {
    grid-template-columns: 2fr 1fr 1fr;
  }
  
  .column-price, .item-price,
  .column-action, .item-action {
    display: none;
  }
  
  .cart-summary {
    flex-direction: column;
    align-items: stretch;
  }
  
  .summary-actions {
    flex-direction: column;
  }
  
  .recommended-products {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 