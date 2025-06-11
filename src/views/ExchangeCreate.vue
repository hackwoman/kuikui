<template>
  <div class="exchange-create-container container">
    <h1 class="page-title">发布交换需求</h1>
    
    <el-card class="form-card">
      <el-steps :active="currentStep" finish-status="success" simple>
        <el-step title="选择我的商品" />
        <el-step title="选择想要的商品" />
        <el-step title="设置交换条件" />
        <el-step title="确认发布" />
      </el-steps>
      
      <div class="form-content">
        <!-- 步骤1: 选择我的商品 -->
        <div v-if="currentStep === 0" class="step-content">
          <h3 class="step-title">选择我要交换的商品</h3>
          
          <el-form label-position="top">
            <el-form-item label="选择商品">
              <div class="my-products-list">
                <div 
                  v-for="product in myProducts" 
                  :key="product.id"
                  :class="['product-item', { 'selected': selectedOffer.id === product.id }]"
                  @click="selectOffer(product)"
                >
                  <div class="product-image">
                    <img :src="product.imageUrl" :alt="product.name">
                    <div v-if="product.isAuthenticated" class="product-badge">已鉴定</div>
                  </div>
                  <div class="product-info">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
                    <div class="product-condition">{{ getConditionText(product.condition) }}</div>
                  </div>
                </div>
                
                <div class="add-product-item" @click="goToAddProduct">
                  <i class="el-icon-plus"></i>
                  <span>添加新商品</span>
                </div>
              </div>
            </el-form-item>
            
            <el-form-item v-if="selectedOffer.id">
              <div class="selected-product-detail">
                <h4>已选商品</h4>
                <div class="product-detail-info">
                  <div class="detail-image">
                    <img :src="selectedOffer.imageUrl" :alt="selectedOffer.name">
                  </div>
                  <div class="detail-content">
                    <h5>{{ selectedOffer.name }}</h5>
                    <p class="detail-price">¥{{ selectedOffer.price.toFixed(2) }}</p>
                    <p class="detail-condition">状态: {{ getConditionText(selectedOffer.condition) }}</p>
                    <p class="detail-auth">
                      鉴定: 
                      <span :class="{ 'authenticated': selectedOffer.isAuthenticated }">
                        {{ selectedOffer.isAuthenticated ? '已鉴定' : '未鉴定' }}
                      </span>
                      <el-button v-if="!selectedOffer.isAuthenticated" type="text" @click="goToAuthenticate">
                        去鉴定
                      </el-button>
                    </p>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
          
          <div class="step-actions">
            <el-button 
              type="primary" 
              @click="nextStep" 
              :disabled="!selectedOffer.id"
            >
              下一步
            </el-button>
          </div>
        </div>
        
        <!-- 步骤2: 选择想要的商品 -->
        <div v-else-if="currentStep === 1" class="step-content">
          <h3 class="step-title">选择我想要的商品</h3>
          
          <el-form label-position="top">
            <el-form-item label="搜索商品">
              <el-input 
                v-model="searchKeyword" 
                placeholder="输入商品名称、品牌等关键词" 
                @keyup.enter="searchProducts"
              >
                <template #append>
                  <el-button @click="searchProducts">搜索</el-button>
                </template>
              </el-input>
            </el-form-item>
            
            <div v-if="searchResults.length > 0" class="search-results">
              <div 
                v-for="product in searchResults" 
                :key="product.id"
                :class="['product-item', { 'selected': selectedWant.id === product.id }]"
                @click="selectWant(product)"
              >
                <div class="product-image">
                  <img :src="product.imageUrl" :alt="product.name">
                </div>
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
                </div>
              </div>
            </div>
            
            <el-form-item v-if="selectedWant.id">
              <div class="selected-product-detail">
                <h4>已选商品</h4>
                <div class="product-detail-info">
                  <div class="detail-image">
                    <img :src="selectedWant.imageUrl" :alt="selectedWant.name">
                  </div>
                  <div class="detail-content">
                    <h5>{{ selectedWant.name }}</h5>
                    <p class="detail-price">¥{{ selectedWant.price.toFixed(2) }}</p>
                    
                    <div class="requirement-form">
                      <el-form-item label="商品状态要求">
                        <el-select v-model="wantCondition" placeholder="请选择">
                          <el-option label="全新" value="NEW" />
                          <el-option label="几乎全新" value="LIKE_NEW" />
                          <el-option label="优良" value="EXCELLENT" />
                          <el-option label="良好" value="GOOD" />
                          <el-option label="一般" value="FAIR" />
                        </el-select>
                      </el-form-item>
                      
                      <el-form-item label="鉴定要求">
                        <el-switch
                          v-model="requireAuthenticated"
                          active-text="需鉴定"
                          inactive-text="不限"
                        />
                      </el-form-item>
                      
                      <el-form-item label="补差价">
                        <el-input-number 
                          v-model="additionalCash" 
                          :min="0" 
                          :max="100000"
                          :step="100"
                          controls-position="right"
                        />
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
          
          <div class="step-actions">
            <el-button @click="prevStep">上一步</el-button>
            <el-button 
              type="primary" 
              @click="nextStep" 
              :disabled="!selectedWant.id"
            >
              下一步
            </el-button>
          </div>
        </div>
        
        <!-- 步骤3: 设置交换条件 -->
        <div v-else-if="currentStep === 2" class="step-content">
          <h3 class="step-title">设置交换条件</h3>
          
          <el-form label-position="top">
            <el-form-item label="交换地区限制">
              <el-select v-model="locationRequirement" placeholder="选择地区" clearable>
                <el-option label="不限地区" value="" />
                <el-option label="北京" value="北京" />
                <el-option label="上海" value="上海" />
                <el-option label="广州" value="广州" />
                <el-option label="深圳" value="深圳" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="交易方式">
              <el-checkbox v-model="faceToFace">支持当面交易</el-checkbox>
              <el-checkbox v-model="platformGuarantee">需平台担保</el-checkbox>
            </el-form-item>
            
            <el-form-item label="备注信息">
              <el-input 
                v-model="note" 
                type="textarea" 
                :rows="4" 
                placeholder="添加其他交换要求或说明"
              />
            </el-form-item>
          </el-form>
          
          <div class="step-actions">
            <el-button @click="prevStep">上一步</el-button>
            <el-button type="primary" @click="nextStep">下一步</el-button>
          </div>
        </div>
        
        <!-- 步骤4: 确认发布 -->
        <div v-else-if="currentStep === 3" class="step-content">
          <h3 class="step-title">确认交换信息</h3>
          
          <div class="exchange-preview">
            <div class="exchange-products">
              <div class="product-card">
                <div class="product-header">我的商品</div>
                <div class="product-image">
                  <img :src="selectedOffer.imageUrl" :alt="selectedOffer.name">
                </div>
                <div class="product-details">
                  <h4>{{ selectedOffer.name }}</h4>
                  <p class="product-price">¥{{ selectedOffer.price.toFixed(2) }}</p>
                  <p class="product-condition">{{ getConditionText(selectedOffer.condition) }}</p>
                </div>
              </div>
              
              <div class="exchange-arrow">
                <i class="el-icon-right"></i>
                <div v-if="additionalCash > 0" class="additional-cash">
                  + ¥{{ additionalCash.toFixed(2) }}
                </div>
              </div>
              
              <div class="product-card">
                <div class="product-header">想要商品</div>
                <div class="product-image">
                  <img :src="selectedWant.imageUrl" :alt="selectedWant.name">
                </div>
                <div class="product-details">
                  <h4>{{ selectedWant.name }}</h4>
                  <p class="product-price">¥{{ selectedWant.price.toFixed(2) }}</p>
                  <p class="product-condition">状态要求: {{ getConditionText(wantCondition) }}</p>
                  <p class="product-auth">鉴定要求: {{ requireAuthenticated ? '需鉴定' : '不限' }}</p>
                </div>
              </div>
            </div>
            
            <div class="exchange-conditions-preview">
              <h4>交换条件</h4>
              <ul>
                <li>地区限制: {{ locationRequirement || '不限地区' }}</li>
                <li>当面交易: {{ faceToFace ? '支持' : '不支持' }}</li>
                <li>平台担保: {{ platformGuarantee ? '需要' : '不需要' }}</li>
                <li v-if="note">备注: {{ note }}</li>
              </ul>
            </div>
          </div>
          
          <div class="agreement">
            <el-checkbox v-model="agreement">
              我同意平台《交易规则》和《交换协议》
            </el-checkbox>
          </div>
          
          <div class="step-actions">
            <el-button @click="prevStep">上一步</el-button>
            <el-button 
              type="primary" 
              @click="submitExchange" 
              :loading="submitting"
              :disabled="!agreement"
            >
              确认发布
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { useProductStore } from '../stores/product'

const router = useRouter()
const userStore = useUserStore()
const productStore = useProductStore()

// 步骤控制
const currentStep = ref(0)
const submitting = ref(false)

// 我的商品
const myProducts = ref([
  {
    id: 101,
    name: 'Nike Air Force 1 Low',
    price: 999,
    imageUrl: 'https://picsum.photos/400/400?random=101',
    condition: 'NEW',
    isAuthenticated: true
  },
  {
    id: 102,
    name: 'Adidas Yeezy Boost 700',
    price: 2500,
    imageUrl: 'https://picsum.photos/400/400?random=102',
    condition: 'LIKE_NEW',
    isAuthenticated: false
  },
  {
    id: 103,
    name: 'Supreme Box Logo Hoodie',
    price: 4800,
    imageUrl: 'https://picsum.photos/400/400?random=103',
    condition: 'EXCELLENT',
    isAuthenticated: true
  }
])

// 搜索相关
const searchKeyword = ref('')
const searchResults = ref([])

// 表单数据
const selectedOffer = ref({})
const selectedWant = ref({})
const wantCondition = ref('GOOD')
const requireAuthenticated = ref(false)
const additionalCash = ref(0)
const locationRequirement = ref('')
const faceToFace = ref(false)
const platformGuarantee = ref(true)
const note = ref('')
const agreement = ref(false)

// 下一步
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 选择我的商品
const selectOffer = (product) => {
  selectedOffer.value = { ...product }
}

// 选择想要的商品
const selectWant = (product) => {
  selectedWant.value = { ...product }
  
  // 计算价格差
  const priceDiff = selectedWant.value.price - selectedOffer.value.price
  additionalCash.value = priceDiff > 0 ? priceDiff : 0
}

// 添加新商品
const goToAddProduct = () => {
  ElMessage.info('跳转到添加商品页面')
  // router.push('/product/add')
}

// 去鉴定
const goToAuthenticate = () => {
  ElMessage.info('跳转到商品鉴定页面')
  // router.push('/authenticate')
}

// 搜索商品
const searchProducts = async () => {
  if (!searchKeyword.value) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  try {
    // 模拟搜索结果
    searchResults.value = [
      {
        id: 201,
        name: 'Air Jordan 1 Chicago',
        price: 12000,
        imageUrl: 'https://picsum.photos/400/400?random=201'
      },
      {
        id: 202,
        name: 'Nike Dunk Low Panda',
        price: 1500,
        imageUrl: 'https://picsum.photos/400/400?random=202'
      },
      {
        id: 203,
        name: 'Yeezy 350 V2 Zebra',
        price: 3000,
        imageUrl: 'https://picsum.photos/400/400?random=203'
      }
    ]
  } catch (error) {
    console.error('搜索商品失败:', error)
    ElMessage.error('搜索商品失败')
  }
}

// 提交交换
const submitExchange = async () => {
  if (!agreement.value) {
    ElMessage.warning('请同意平台交易规则和交换协议')
    return
  }
  
  submitting.value = true
  
  try {
    // 这里应该调用API提交交换需求
    setTimeout(() => {
      ElMessage.success('交换需求发布成功')
      router.push('/exchange')
    }, 1500)
  } catch (error) {
    console.error('发布交换需求失败:', error)
    ElMessage.error('发布交换需求失败')
  } finally {
    submitting.value = false
  }
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

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({ path: '/login', query: { redirect: '/exchange/create' } })
  }
})
</script>

<style scoped>
.exchange-create-container {
  padding-bottom: 40px;
}

.page-title {
  margin: 20px 0;
  font-size: 24px;
  font-weight: 500;
}

.form-card {
  margin-bottom: 30px;
}

.form-content {
  margin-top: 30px;
}

.step-title {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
}

.my-products-list, .search-results {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.product-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.product-item.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.product-image {
  height: 150px;
  position: relative;
  overflow: hidden;
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
  background-color: #409eff;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.product-info {
  padding: 10px;
}

.product-name {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}

.product-price {
  font-size: 16px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 5px;
}

.product-condition {
  font-size: 12px;
  color: #909399;
}

.add-product-item {
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 210px;
  cursor: pointer;
  color: #909399;
  transition: all 0.3s;
}

.add-product-item:hover {
  color: #409eff;
  border-color: #409eff;
}

.add-product-item i {
  font-size: 28px;
  margin-bottom: 10px;
}

.selected-product-detail {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
}

.selected-product-detail h4 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
}

.product-detail-info {
  display: flex;
  gap: 20px;
}

.detail-image {
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 4px;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-content {
  flex: 1;
}

.detail-content h5 {
  font-size: 16px;
  margin-bottom: 10px;
}

.detail-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 10px;
}

.detail-condition, .detail-auth {
  margin-bottom: 5px;
  font-size: 14px;
}

.authenticated {
  color: #67c23a;
  font-weight: 500;
}

.requirement-form {
  margin-top: 15px;
}

.step-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.exchange-preview {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.exchange-products {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.product-card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.product-header {
  background: #f5f7fa;
  padding: 10px;
  text-align: center;
  font-weight: 500;
  border-bottom: 1px solid #eee;
}

.exchange-arrow {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.exchange-conditions-preview {
  padding: 15px;
  background: #fff;
  border-radius: 8px;
}

.exchange-conditions-preview h4 {
  margin-bottom: 15px;
}

.exchange-conditions-preview ul {
  list-style: none;
  padding: 0;
}

.exchange-conditions-preview li {
  margin-bottom: 8px;
}

.agreement {
  margin: 20px 0;
}

@media (max-width: 768px) {
  .my-products-list, .search-results {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .exchange-products {
    flex-direction: column;
    gap: 20px;
  }
  
  .exchange-arrow {
    width: 100%;
    flex-direction: row;
    height: 40px;
  }
  
  .product-detail-info {
    flex-direction: column;
  }
  
  .detail-image {
    width: 100%;
    height: 200px;
  }
}
</style> 