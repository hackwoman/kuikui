<template>
  <div class="exchange-detail-container container">
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/exchange' }">奢品交换</el-breadcrumb-item>
        <el-breadcrumb-item>交换详情</el-breadcrumb-item>
      </el-breadcrumb>
      
      <h1 class="page-title">交换详情</h1>
    </div>
    
    <div v-if="exchange" class="exchange-content">
      <el-card class="exchange-card">
        <!-- 交换状态 -->
        <div class="exchange-status">
          <div class="status-tag" :class="getStatusClass(exchange.status)">
            {{ getStatusText(exchange.status) }}
          </div>
          <div class="exchange-meta">
            <span class="exchange-id">交换编号: {{ exchange.id }}</span>
            <span class="exchange-time">发布时间: {{ formatDate(exchange.createdAt) }}</span>
            <span class="exchange-views">{{ exchange.viewCount || 0 }} 次查看</span>
          </div>
        </div>
        
        <!-- 用户信息 -->
        <div class="user-section">
          <div class="user-info">
            <el-avatar :size="48" :src="exchange.user.avatar"></el-avatar>
            <div class="user-detail">
              <div class="username">{{ exchange.user.username }}</div>
              <div class="user-level">等级: Lv{{ exchange.user.level || 1 }}</div>
            </div>
          </div>
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">{{ exchange.user.exchangeCount || 0 }}</div>
              <div class="stat-label">成功交换</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ exchange.user.positiveRate || '100%' }}</div>
              <div class="stat-label">好评率</div>
            </div>
          </div>
        </div>
        
        <!-- 交换商品信息 -->
        <div class="products-section">
          <div class="product-card offer">
            <div class="product-header">
              <h3>我提供的商品</h3>
            </div>
            <div class="product-image">
              <img :src="exchange.offerProduct.imageUrl" :alt="exchange.offerProduct.name">
            </div>
            <div class="product-details">
              <h4 class="product-name">{{ exchange.offerProduct.name }}</h4>
              <p class="product-price">¥{{ exchange.offerProduct.price?.toFixed(2) }}</p>
              <div class="product-info-grid">
                <div class="info-item">
                  <span class="info-label">商品状态:</span>
                  <span class="info-value">{{ getConditionText(exchange.offerProduct.condition) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">鉴定状态:</span>
                  <span class="info-value" :class="{'authenticated': exchange.offerProduct.isAuthenticated}">
                    {{ exchange.offerProduct.isAuthenticated ? '已鉴定' : '未鉴定' }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">购买渠道:</span>
                  <span class="info-value">{{ exchange.offerProduct.source || '官方渠道' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">购买时间:</span>
                  <span class="info-value">{{ exchange.offerProduct.purchaseDate || '未知' }}</span>
                </div>
              </div>
              <p class="product-description">{{ exchange.offerProduct.description || '暂无描述' }}</p>
            </div>
          </div>
          
          <div class="exchange-arrow">
            <i class="el-icon-right"></i>
            <div v-if="exchange.additionalCash > 0" class="additional-cash">
              + ¥{{ exchange.additionalCash.toFixed(2) }}
            </div>
          </div>
          
          <div class="product-card want">
            <div class="product-header">
              <h3>我想要的商品</h3>
            </div>
            <div class="product-image">
              <img :src="exchange.wantProduct.imageUrl" :alt="exchange.wantProduct.name">
            </div>
            <div class="product-details">
              <h4 class="product-name">{{ exchange.wantProduct.name }}</h4>
              <p class="product-price">¥{{ exchange.wantProduct.price?.toFixed(2) }}</p>
              <div class="product-info-grid">
                <div class="info-item">
                  <span class="info-label">商品状态要求:</span>
                  <span class="info-value">{{ getConditionText(exchange.wantCondition || 'GOOD') }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">鉴定要求:</span>
                  <span class="info-value">{{ exchange.requireAuthenticated ? '需鉴定' : '不限' }}</span>
                </div>
              </div>
              <p class="product-note">{{ exchange.note || '暂无备注' }}</p>
            </div>
          </div>
        </div>
        
        <!-- 交换条件 -->
        <div class="exchange-conditions">
          <h3>交换条件</h3>
          <div class="condition-list">
            <div class="condition-item">
              <i class="el-icon-check"></i>
              <span>{{ exchange.locationRequirement ? `限${exchange.locationRequirement}地区` : '不限地区' }}</span>
            </div>
            <div class="condition-item">
              <i class="el-icon-check"></i>
              <span>{{ exchange.faceToFace ? '支持当面交易' : '不支持当面交易' }}</span>
            </div>
            <div class="condition-item">
              <i class="el-icon-check"></i>
              <span>{{ exchange.platformGuarantee ? '需平台担保' : '无需平台担保' }}</span>
            </div>
          </div>
        </div>
        
        <!-- 交换操作 -->
        <div class="exchange-actions">
          <el-button 
            v-if="canOffer(exchange)"
            type="success" 
            size="large" 
            @click="offerExchange"
          >
            我要交换
          </el-button>
          
          <el-button 
            v-if="isOwner(exchange)"
            type="danger" 
            size="large" 
            @click="cancelExchange"
          >
            取消交换
          </el-button>
          
          <el-button 
            type="primary" 
            plain
            size="large" 
            @click="contactOwner"
          >
            联系发布者
          </el-button>
        </div>
      </el-card>
      
      <!-- 相似交换推荐 -->
      <div class="similar-exchanges" v-if="similarExchanges.length > 0">
        <h2 class="section-title">相似交换</h2>
        <div class="similar-list">
          <div v-for="item in similarExchanges" :key="item.id" class="similar-item">
            <div class="exchange-preview">
              <div class="preview-images">
                <img :src="item.offerProduct.imageUrl" :alt="item.offerProduct.name" class="offer-img">
                <i class="el-icon-right exchange-icon"></i>
                <img :src="item.wantProduct.imageUrl" :alt="item.wantProduct.name" class="want-img">
              </div>
              <div class="preview-info">
                <div class="preview-user">
                  <el-avatar :size="24" :src="item.user.avatar"></el-avatar>
                  <span>{{ item.user.username }}</span>
                </div>
                <el-button type="primary" size="small" @click="goToExchange(item.id)">查看</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <div v-else class="error-container">
      <el-empty description="交换信息不存在或已删除">
        <el-button type="primary" @click="$router.push('/exchange')">返回交换列表</el-button>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const exchange = ref(null)
const similarExchanges = ref([])

// 获取交换详情
const fetchExchangeDetail = async () => {
  const exchangeId = route.params.id
  
  loading.value = true
  try {
    // 这里应该调用API获取数据
    // 目前使用模拟数据
    setTimeout(() => {
      exchange.value = {
        id: exchangeId,
        status: 'PENDING',
        createdAt: new Date(),
        viewCount: 256,
        user: {
          id: 1,
          username: 'sneakerhead',
          avatar: 'https://picsum.photos/64/64?random=1',
          level: 5,
          exchangeCount: 28,
          positiveRate: '98%'
        },
        offerProduct: {
          id: 1,
          name: 'Air Jordan 1 Chicago',
          price: 12000,
          imageUrl: 'https://picsum.photos/400/400?random=10',
          condition: 'NEW',
          isAuthenticated: true,
          source: '官方旗舰店',
          purchaseDate: '2023-01-15',
          description: '全新未穿过，带盒带票，支持鉴定。'
        },
        wantProduct: {
          id: 2,
          name: 'Yeezy 350 V2 Zebra',
          price: 10000,
          imageUrl: 'https://picsum.photos/400/400?random=11'
        },
        additionalCash: 2000,
        wantCondition: 'EXCELLENT',
        requireAuthenticated: true,
        locationRequirement: '上海',
        faceToFace: true,
        platformGuarantee: true,
        note: '希望是原盒原票，可接受轻微使用痕迹，必须通过鉴定。'
      }
      
      // 获取相似交换
      similarExchanges.value = [
        {
          id: 4,
          offerProduct: {
            imageUrl: 'https://picsum.photos/400/400?random=20'
          },
          wantProduct: {
            imageUrl: 'https://picsum.photos/400/400?random=21'
          },
          user: {
            username: 'user1',
            avatar: 'https://picsum.photos/64/64?random=5'
          }
        },
        {
          id: 5,
          offerProduct: {
            imageUrl: 'https://picsum.photos/400/400?random=22'
          },
          wantProduct: {
            imageUrl: 'https://picsum.photos/400/400?random=23'
          },
          user: {
            username: 'user2',
            avatar: 'https://picsum.photos/64/64?random=6'
          }
        },
        {
          id: 6,
          offerProduct: {
            imageUrl: 'https://picsum.photos/400/400?random=24'
          },
          wantProduct: {
            imageUrl: 'https://picsum.photos/400/400?random=25'
          },
          user: {
            username: 'user3',
            avatar: 'https://picsum.photos/64/64?random=7'
          }
        }
      ]
      
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('获取交换详情失败:', error)
    ElMessage.error('获取交换详情失败')
    loading.value = false
  }
}

// 我要交换
const offerExchange = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  
  router.push(`/exchange/${exchange.value.id}/offer`)
}

// 取消交换
const cancelExchange = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要取消这个交换需求吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 这里应该调用API取消交换
    ElMessage.success('交换需求已取消')
    exchange.value.status = 'CANCELLED'
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消交换失败:', error)
      ElMessage.error('取消交换失败')
    }
  }
}

// 联系发布者
const contactOwner = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  
  ElMessage.success('消息已发送')
}

// 是否可以提供交换
const canOffer = (exchange) => {
  return exchange.status === 'PENDING' && 
         exchange.user.id !== userStore.user?.id
}

// 是否是交换发布者
const isOwner = (exchange) => {
  return exchange.user.id === userStore.user?.id
}

// 去往其他交换
const goToExchange = (id) => {
  router.push(`/exchange/${id}`)
}

// 获取状态样式
const getStatusClass = (status) => {
  const statusMap = {
    'PENDING': 'pending',
    'MATCHED': 'matched',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled'
  }
  return statusMap[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '等待交换',
    'MATCHED': '已匹配',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  }
  return statusMap[status] || status
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

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

onMounted(() => {
  fetchExchangeDetail()
})
</script>

<style scoped>
.exchange-detail-container {
  padding-bottom: 40px;
}

.page-header {
  margin: 20px 0;
}

.page-title {
  margin: 15px 0;
  font-size: 24px;
  font-weight: 500;
}

.exchange-card {
  margin-bottom: 30px;
}

.exchange-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.status-tag {
  padding: 6px 15px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
}

.status-tag.pending {
  background-color: #e6a23c;
  color: white;
}

.status-tag.matched {
  background-color: #409eff;
  color: white;
}

.status-tag.completed {
  background-color: #67c23a;
  color: white;
}

.status-tag.cancelled {
  background-color: #909399;
  color: white;
}

.exchange-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #909399;
}

.user-section {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.username {
  font-weight: 500;
  font-size: 16px;
}

.user-level {
  font-size: 13px;
  color: #909399;
}

.user-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 500;
  color: #409eff;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.products-section {
  display: flex;
  margin-bottom: 30px;
}

.product-card {
  flex: 1;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.product-header {
  background-color: #f5f7fa;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}

.product-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.product-image {
  height: 300px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  margin-bottom: 10px;
}

.product-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 15px;
}

.product-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.info-item {
  font-size: 13px;
}

.info-label {
  color: #909399;
  margin-right: 5px;
}

.info-value.authenticated {
  color: #67c23a;
  font-weight: 500;
}

.product-description, .product-note {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.exchange-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.exchange-arrow i {
  font-size: 24px;
  color: #409eff;
}

.additional-cash {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #f0f9eb;
  color: #67c23a;
  border-radius: 4px;
  font-weight: 500;
}

.exchange-conditions {
  margin-bottom: 30px;
}

.exchange-conditions h3 {
  font-size: 16px;
  margin-bottom: 15px;
}

.condition-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.condition-item i {
  color: #67c23a;
}

.exchange-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.similar-exchanges {
  margin-top: 30px;
}

.section-title {
  font-size: 18px;
  margin-bottom: 20px;
}

.similar-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.similar-item {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.exchange-preview {
  padding: 10px;
}

.preview-images {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.preview-images img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.exchange-icon {
  color: #409eff;
}

.preview-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.loading-container, .error-container {
  padding: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .products-section {
    flex-direction: column;
    gap: 20px;
  }
  
  .exchange-arrow {
    padding: 15px 0;
    flex-direction: row;
    gap: 10px;
  }
  
  .similar-list {
    grid-template-columns: 1fr;
  }
  
  .exchange-meta {
    display: none;
  }
  
  .user-section {
    flex-direction: column;
    gap: 20px;
  }
  
  .product-info-grid {
    grid-template-columns: 1fr;
  }
}
</style> 