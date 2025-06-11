<template>
  <div class="exchange-container container">
    <h1 class="page-title">奢品交换</h1>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索交换需求" 
            @keyup.enter="handleSearch"
            clearable
          >
            <template #append>
              <el-button @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="createExchange">发布交换需求</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="filter-tags">
        <el-col :span="24">
          <el-radio-group v-model="filterStatus" @change="handleFilter">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="pending">等待交换</el-radio-button>
            <el-radio-button label="matched">已匹配</el-radio-button>
            <el-radio-button label="completed">已完成</el-radio-button>
          </el-radio-group>
          
          <el-select v-model="filterCategory" placeholder="商品分类" @change="handleFilter" clearable>
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- 交换列表 -->
    <div class="exchange-list" v-if="exchanges.length > 0">
      <el-card v-for="exchange in exchanges" :key="exchange.id" class="exchange-item">
        <div class="exchange-header">
          <div class="user-info">
            <el-avatar :size="36" :src="exchange.user.avatar"></el-avatar>
            <span class="username">{{ exchange.user.username }}</span>
          </div>
          <div class="status-tag" :class="getStatusClass(exchange.status)">
            {{ getStatusText(exchange.status) }}
          </div>
        </div>

        <div class="exchange-content">
          <div class="exchange-product offer">
            <div class="product-image">
              <img :src="exchange.offerProduct.imageUrl" :alt="exchange.offerProduct.name">
              <div class="product-badge">我的商品</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ exchange.offerProduct.name }}</h3>
              <p class="product-price">¥{{ exchange.offerProduct.price?.toFixed(2) }}</p>
              <p class="product-condition">{{ getConditionText(exchange.offerProduct.condition) }}</p>
            </div>
          </div>

          <div class="exchange-direction">
            <i class="el-icon-d-arrow-right"></i>
          </div>

          <div class="exchange-product want">
            <div class="product-image">
              <img :src="exchange.wantProduct.imageUrl" :alt="exchange.wantProduct.name">
              <div class="product-badge">想要商品</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ exchange.wantProduct.name }}</h3>
              <p class="product-price">¥{{ exchange.wantProduct.price?.toFixed(2) }}</p>
              <p v-if="exchange.additionalCash > 0" class="additional-cash">
                + ¥{{ exchange.additionalCash.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <div class="exchange-footer">
          <div class="exchange-meta">
            <span class="exchange-time">发布时间: {{ formatDate(exchange.createdAt) }}</span>
            <span class="exchange-views">{{ exchange.viewCount || 0 }} 次查看</span>
          </div>

          <div class="exchange-actions">
            <el-button 
              type="primary" 
              size="small" 
              @click="viewExchangeDetail(exchange.id)"
            >
              查看详情
            </el-button>
            
            <el-button 
              v-if="canOffer(exchange)"
              type="success" 
              size="small" 
              @click="offerExchange(exchange.id)"
            >
              我要交换
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-empty description="暂无交换需求" v-if="!loading">
        <el-button type="primary" @click="createExchange">发布交换需求</el-button>
      </el-empty>
      <div v-else class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-container" v-if="totalPages > 1">
      <el-pagination
        layout="prev, pager, next"
        :total="totalItems"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { useProductStore } from '../stores/product'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const productStore = useProductStore()

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// 筛选参数
const searchKeyword = ref('')
const filterStatus = ref('all')
const filterCategory = ref('')
const loading = ref(false)

// 分类数据
const categories = ref([])

// 交换数据
const exchanges = ref([
  {
    id: 1,
    status: 'PENDING',
    createdAt: new Date(),
    viewCount: 128,
    user: {
      id: 1,
      username: 'sneakerhead',
      avatar: 'https://picsum.photos/64/64?random=1'
    },
    offerProduct: {
      id: 1,
      name: 'Air Jordan 1 Chicago',
      price: 12000,
      imageUrl: 'https://picsum.photos/400/400?random=10',
      condition: 'NEW'
    },
    wantProduct: {
      id: 2,
      name: 'Yeezy 350 V2 Zebra',
      price: 10000,
      imageUrl: 'https://picsum.photos/400/400?random=11'
    },
    additionalCash: 2000
  },
  {
    id: 2,
    status: 'MATCHED',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
    viewCount: 87,
    user: {
      id: 2,
      username: 'hypebeast',
      avatar: 'https://picsum.photos/64/64?random=2'
    },
    offerProduct: {
      id: 3,
      name: 'Nike Dunk Low Panda',
      price: 1500,
      imageUrl: 'https://picsum.photos/400/400?random=12',
      condition: 'LIKE_NEW'
    },
    wantProduct: {
      id: 4,
      name: 'Nike SB Dunk Travis Scott',
      price: 7000,
      imageUrl: 'https://picsum.photos/400/400?random=13'
    },
    additionalCash: 5500
  },
  {
    id: 3,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天前
    viewCount: 203,
    user: {
      id: 3,
      username: 'collector99',
      avatar: 'https://picsum.photos/64/64?random=3'
    },
    offerProduct: {
      id: 5,
      name: 'LV 手提包',
      price: 25000,
      imageUrl: 'https://picsum.photos/400/400?random=14',
      condition: 'EXCELLENT'
    },
    wantProduct: {
      id: 6,
      name: 'Gucci 钱包',
      price: 8000,
      imageUrl: 'https://picsum.photos/400/400?random=15'
    },
    additionalCash: 0
  }
])

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchExchanges()
}

// 筛选
const handleFilter = () => {
  currentPage.value = 1
  fetchExchanges()
}

// 分页
const handlePageChange = (page) => {
  currentPage.value = page
  fetchExchanges()
}

// 获取交换列表
const fetchExchanges = async () => {
  loading.value = true
  
  try {
    // 这里应该调用API获取数据
    // 目前使用模拟数据
    
    // 获取URL参数
    if (route.query.keyword) {
      searchKeyword.value = route.query.keyword
    }
    
    if (route.query.status) {
      filterStatus.value = route.query.status
    }
    
    if (route.query.category) {
      filterCategory.value = route.query.category
    }
    
    // 更新URL
    router.push({
      path: '/exchange',
      query: {
        keyword: searchKeyword.value || undefined,
        status: filterStatus.value !== 'all' ? filterStatus.value : undefined,
        category: filterCategory.value || undefined,
        page: currentPage.value > 1 ? currentPage.value : undefined
      }
    })
    
    // 模拟总数据
    totalItems.value = 25
  } catch (error) {
    console.error('获取交换列表失败:', error)
    ElMessage.error('获取交换列表失败')
  } finally {
    loading.value = false
  }
}

// 创建交换需求
const createExchange = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: '/exchange/create' } })
    return
  }
  
  router.push('/exchange/create')
}

// 查看交换详情
const viewExchangeDetail = (id) => {
  router.push(`/exchange/${id}`)
}

// 我要交换
const offerExchange = (id) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: `/exchange/${id}` } })
    return
  }
  
  router.push(`/exchange/${id}/offer`)
}

// 是否可以提供交换
const canOffer = (exchange) => {
  return exchange.status === 'PENDING' && exchange.user.id !== userStore.user?.id
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

onMounted(async () => {
  // 获取分类
  try {
    const categoriesData = await productStore.fetchCategories()
    categories.value = categoriesData
  } catch (error) {
    console.error('获取分类失败:', error)
  }
  
  // 获取交换列表
  fetchExchanges()
})
</script>

<style scoped>
.exchange-container {
  padding-bottom: 40px;
}

.page-title {
  margin: 20px 0;
  font-size: 24px;
  font-weight: 500;
}

.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.filter-tags {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.filter-tags .el-select {
  margin-left: 20px;
  width: 140px;
}

.exchange-list {
  margin-bottom: 30px;
}

.exchange-item {
  margin-bottom: 20px;
}

.exchange-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-weight: 500;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
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

.exchange-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.exchange-product {
  width: 45%;
  position: relative;
}

.exchange-direction {
  width: 10%;
  display: flex;
  justify-content: center;
  font-size: 24px;
  color: #409eff;
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 10px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.product-name {
  font-size: 16px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 5px;
}

.product-condition {
  font-size: 12px;
  color: #909399;
}

.additional-cash {
  font-size: 14px;
  color: #67c23a;
  font-weight: bold;
}

.exchange-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.exchange-meta {
  font-size: 12px;
  color: #909399;
}

.exchange-time {
  margin-right: 15px;
}

.exchange-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

.loading-state {
  padding: 20px;
}

.pagination-container {
  margin-top: 30px;
  text-align: center;
}

@media (max-width: 768px) {
  .exchange-content {
    flex-direction: column;
  }
  
  .exchange-product {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .exchange-direction {
    width: 100%;
    margin: 10px 0;
    transform: rotate(90deg);
  }
  
  .exchange-footer {
    flex-direction: column;
    gap: 15px;
  }
  
  .exchange-meta {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
}
</style> 