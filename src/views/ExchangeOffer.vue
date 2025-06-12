<template>
  <div class="exchange-offer-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>提交交换申请</h2>
        </div>
      </template>
      
      <el-form :model="offerForm" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="选择您想要交换的商品" prop="productId">
          <el-select v-model="offerForm.productId" placeholder="选择商品" filterable>
            <el-option
              v-for="product in myProducts"
              :key="product.id"
              :label="product.name"
              :value="product.id">
              <div class="product-option">
                <img :src="product.image" class="product-image" />
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">¥{{ product.price }}</div>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="附加交易金额（可选）" prop="additionalAmount">
          <el-input-number v-model="offerForm.additionalAmount" :min="0" :precision="2" :step="100"></el-input-number>
        </el-form-item>
        
        <el-form-item label="留言" prop="message">
          <el-input type="textarea" v-model="offerForm.message" rows="4" placeholder="给对方留言..."></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitOffer" :loading="loading">提交交换申请</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { exchangeApi, productApi } from '@/api'

const route = useRoute()
const router = useRouter()
const exchangeId = route.params.id
const formRef = ref(null)
const loading = ref(false)
const myProducts = ref([])

const offerForm = reactive({
  productId: '',
  additionalAmount: 0,
  message: ''
})

const rules = {
  productId: [
    { required: true, message: '请选择要交换的商品', trigger: 'change' }
  ],
  additionalAmount: [
    { type: 'number', min: 0, message: '金额不能小于0', trigger: 'change' }
  ]
}

// 获取用户自己的商品列表
const fetchMyProducts = async () => {
  try {
    // 实际应用中，这里应该调用获取用户自己商品的API
    // 这里为了示例，我们假设有这样的API
    const response = await productApi.getMyProducts()
    myProducts.value = response
  } catch (error) {
    console.error('获取我的商品列表失败', error)
    ElMessage.error('获取商品列表失败，请稍后重试')
    
    // 为了演示，添加一些模拟数据
    myProducts.value = [
      { id: 1, name: '限量版球鞋 A', price: 1999, image: '/images/shoes1.jpg' },
      { id: 2, name: '奢侈品手表 B', price: 15999, image: '/images/watch1.jpg' },
      { id: 3, name: '名牌包包 C', price: 8999, image: '/images/bag1.jpg' }
    ]
  }
}

// 提交交换申请
const submitOffer = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    loading.value = true
    
    const offerData = {
      exchangeId: exchangeId,
      productId: offerForm.productId,
      additionalAmount: offerForm.additionalAmount,
      message: offerForm.message
    }
    
    await exchangeApi.offerExchange(exchangeId, offerData)
    
    ElMessage.success('交换申请已提交')
    router.push(`/exchange/${exchangeId}`)
  } catch (error) {
    console.error('提交交换申请失败', error)
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMyProducts()
})
</script>

<style scoped>
.exchange-offer-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-option {
  display: flex;
  align-items: center;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 4px;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 14px;
}

.product-price {
  font-size: 12px;
  color: #f56c6c;
}
</style> 