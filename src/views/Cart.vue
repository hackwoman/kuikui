<template>
  <div class="cart-container container">
    <h1 class="page-title">我的购物车</h1>
    
    <div v-if="cartStore.loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else-if="cartStore.cartItems.length === 0" class="empty-cart">
      <el-empty description="购物车是空的">
        <el-button type="primary" @click="$router.push('/')">去购物</el-button>
      </el-empty>
    </div>
    
    <div v-else class="cart-content">
      <el-card class="cart-list">
        <!-- 购物车头部 -->
        <div class="cart-header">
          <el-checkbox v-model="allSelected" @change="handleSelectAllChange">全选</el-checkbox>
          <div class="header-product">商品信息</div>
          <div class="header-price">单价</div>
          <div class="header-quantity">数量</div>
          <div class="header-subtotal">小计</div>
          <div class="header-action">操作</div>
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
            
            <div class="item-product">
              <div class="product-image">
                <img :src="item.product.imageUrl" :alt="item.product.name">
              </div>
              <div class="product-info">
                <router-link :to="`/product/${item.product.id}`" class="product-name">
                  {{ item.product.name }}
                </router-link>
              </div>
            </div>
            
            <div class="item-price">¥{{ item.product.price.toFixed(2) }}</div>
            
            <div class="item-quantity">
              <el-input-number 
                v-model="item.quantity" 
                :min="1" 
                :max="item.product.stock"
                :disabled="cartStore.loading"
                @change="(val) => updateQuantity(item.id, val)"
                size="small"
              />
            </div>
            
            <div class="item-subtotal">¥{{ (item.product.price * item.quantity).toFixed(2) }}</div>
            
            <div class="item-action">
              <el-button 
                type="danger" 
                size="small"
                @click="removeItem(item.id)"
                :loading="cartStore.loading"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
      
      <!-- 购物车结算 -->
      <div class="cart-footer">
        <div class="cart-summary">
          <div class="summary-left">
            <el-checkbox v-model="allSelected" @change="handleSelectAllChange">全选</el-checkbox>
            <el-button type="text" @click="removeSelected" :disabled="!hasSelectedItems">
              删除选中商品
            </el-button>
            <el-button type="text" @click="clearCart">清空购物车</el-button>
          </div>
          
          <div class="summary-right">
            <div class="total-info">
              <p>已选商品 <span class="total-count">{{ selectedCount }}</span> 件</p>
              <p>合计: <span class="total-price">¥{{ totalPrice }}</span></p>
            </div>
            
            <el-button 
              type="primary" 
              size="large"
              @click="checkout"
              :disabled="!hasSelectedItems || cartStore.loading"
            >
              结算
            </el-button>
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

const router = useRouter()
const cartStore = useCartStore()

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
    .reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
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
      '确定要从购物车中移除该商品吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const success = await cartStore.removeFromCart(itemId)
    if (success) {
      ElMessage.success('商品已从购物车移除')
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
      ElMessage.success('选中商品已从购物车移除')
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
      '确定要清空购物车吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const success = await cartStore.clearCart()
    if (success) {
      ElMessage.success('购物车已清空')
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
  padding-bottom: 40px;
}

.page-title {
  margin: 20px 0;
  font-size: 24px;
  font-weight: 500;
}

.loading-container {
  padding: 40px 0;
}

.empty-cart {
  padding: 60px 0;
  text-align: center;
}

.cart-list {
  margin-bottom: 20px;
}

.cart-header {
  display: grid;
  grid-template-columns: 40px 3fr 1fr 1fr 1fr 80px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-weight: 500;
}

.cart-items {
  padding: 10px 0;
}

.cart-item {
  display: grid;
  grid-template-columns: 40px 3fr 1fr 1fr 1fr 80px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
}

.item-product {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 4px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.product-name:hover {
  color: #409eff;
}

.item-price, .item-subtotal {
  font-weight: 500;
}

.item-subtotal {
  color: #f56c6c;
}

.cart-footer {
  background: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.summary-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  text-align: right;
}

.total-count {
  color: #f56c6c;
  font-weight: bold;
}

.total-price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}

@media (max-width: 768px) {
  .cart-header, .cart-item {
    grid-template-columns: 40px 2fr 1fr 1fr;
    gap: 10px;
  }
  
  .header-price, .item-price {
    display: none;
  }
  
  .header-action, .item-action {
    display: none;
  }
  
  .cart-summary {
    flex-direction: column;
    gap: 15px;
  }
  
  .summary-left, .summary-right {
    width: 100%;
  }
}
</style> 