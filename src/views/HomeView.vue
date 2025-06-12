<template>
  <div class="home-container">
    <!-- 奢侈品主视觉banner -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">奢华非凡 尽在DuMall</h1>
        <p class="hero-subtitle">探索精选奢侈品，缔造专属优雅</p>
        <el-button type="primary" class="hero-btn" @click="$router.push('/products')">立即探索</el-button>
      </div>
    </div>
    
    <!-- 品牌精选区域 -->
    <div class="brand-section">
      <h2 class="section-title">品牌精选</h2>
      <div class="brand-grid">
        <div class="brand-item" @click="$router.push('/products?category=1')">
          <div class="brand-image">
            <img src="https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg" alt="奢华手表">
          </div>
          <div class="brand-name">奢华手表</div>
        </div>
        <div class="brand-item" @click="$router.push('/products?category=2')">
          <div class="brand-image">
            <img src="https://images.pexels.com/photos/934673/pexels-photo-934673.jpeg" alt="设计师包袋">
          </div>
          <div class="brand-name">设计师包袋</div>
        </div>
        <div class="brand-item" @click="$router.push('/products?category=3')">
          <div class="brand-image">
            <img src="https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg" alt="精致珠宝">
          </div>
          <div class="brand-name">精致珠宝</div>
        </div>
        <div class="brand-item" @click="$router.push('/products?category=4')">
          <div class="brand-image">
            <img src="https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg" alt="高级成衣">
          </div>
          <div class="brand-name">高级成衣</div>
        </div>
      </div>
    </div>
    
    <!-- 热门分类区域 -->
    <div class="categories-section">
      <h2 class="section-title">热门分类</h2>
      <div class="categories-list">
        <el-row :gutter="20">
          <el-col 
            v-for="category in categories" 
            :key="category.id" 
            :xs="12" 
            :sm="8" 
            :md="6"
            :lg="4" 
            :xl="4"
          >
            <router-link :to="`/products?category=${category.id}`" class="category-card">
              <div class="category-name">{{ category.name }}</div>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </div>
    
    <!-- 新品上架区域 -->
    <div class="new-arrivals-section">
      <h2 class="section-title">新品上架</h2>
      <div class="products-grid">
        <el-row :gutter="24">
          <el-col 
            v-for="product in products" 
            :key="product.id"
            :xs="12" 
            :sm="8" 
            :md="6" 
            :lg="6" 
            :xl="6"
            class="product-column"
          >
            <ProductCard :product="product" />
          </el-col>
        </el-row>
      </div>
      
      <div class="view-more">
        <el-button plain @click="$router.push('/products')">查看更多</el-button>
      </div>
    </div>
    
    <!-- 品质保证区域 -->
    <div class="services-section">
      <div class="service-item">
        <i class="el-icon-check"></i>
        <div class="service-info">
          <h3>正品保证</h3>
          <p>所有商品均为正品，支持专柜验货</p>
        </div>
      </div>
      <div class="service-item">
        <i class="el-icon-time"></i>
        <div class="service-info">
          <h3>急速物流</h3>
          <p>支持当日发货，次日送达</p>
        </div>
      </div>
      <div class="service-item">
        <i class="el-icon-s-claim"></i>
        <div class="service-info">
          <h3>售后无忧</h3>
          <p>7天无理由退换，15天质量问题包退</p>
        </div>
      </div>
      <div class="service-item">
        <i class="el-icon-service"></i>
        <div class="service-info">
          <h3>专属服务</h3>
          <p>一对一专属顾问，提供专业咨询</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoryApi, productApi } from '@/api/index'
import ProductCard from '@/components/ProductCard.vue'

const categories = ref([])
const products = ref([])
const loading = ref(false)

// 获取分类列表
const fetchCategories = async () => {
  try {
    loading.value = true
    const response = await categoryApi.getCategories()
    categories.value = response
  } catch (error) {
    console.error('获取分类失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取最新产品列表
const fetchProducts = async () => {
  try {
    loading.value = true
    const params = {
      page: 0,
      size: 8,
      sort: 'createdAt,desc'
    }
    const response = await productApi.getProducts(params)
    products.value = response.content || []
  } catch (error) {
    console.error('获取产品失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 主视觉Banner样式 */
.hero-section {
  height: 500px;
  background: url('https://images.pexels.com/photos/1974503/pexels-photo-1974503.jpeg') no-repeat center center;
  background-size: cover;
  margin: 0 -20px 60px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 80px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 44px;
  color: #fff;
  margin-bottom: 16px;
  font-weight: 300;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 18px;
  color: #fff;
  margin-bottom: 30px;
  letter-spacing: 1px;
}

.hero-btn {
  height: 50px;
  padding: 0 40px;
  font-size: 16px;
  background: #fff;
  color: #000;
  border-color: #fff;
}

.hero-btn:hover {
  background: #000;
  color: #fff;
  border-color: #000;
}

/* 品牌精选区域 */
.brand-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 300;
  letter-spacing: 2px;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 1px;
  background: #000;
}

.brand-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.brand-item {
  cursor: pointer;
  transition: transform 0.3s;
}

.brand-item:hover {
  transform: translateY(-5px);
}

.brand-image {
  height: 200px;
  overflow: hidden;
  margin-bottom: 10px;
}

.brand-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.brand-item:hover .brand-image img {
  transform: scale(1.05);
}

.brand-name {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 1px;
}

/* 分类区域 */
.categories-section {
  margin-bottom: 60px;
}

.categories-list {
  margin-bottom: 30px;
}

.category-card {
  display: block;
  height: 80px;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  margin-bottom: 20px;
  transition: all 0.3s;
  border: 1px solid #eee;
}

.category-card:hover {
  background: #000;
  color: #fff;
}

.category-name {
  font-size: 16px;
  letter-spacing: 1px;
}

/* 产品区域 */
.new-arrivals-section {
  margin-bottom: 60px;
}

.products-grid {
  margin-bottom: 30px;
}

.product-column {
  margin-bottom: 30px;
}

.view-more {
  text-align: center;
  margin-top: 20px;
}

.view-more button {
  padding: 10px 40px;
  font-size: 16px;
  border-color: #000;
  color: #000;
}

.view-more button:hover {
  background: #000;
  color: #fff;
}

/* 服务区域 */
.services-section {
  display: flex;
  justify-content: space-between;
  margin: 60px 0;
  padding: 40px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.service-item {
  display: flex;
  align-items: center;
}

.service-item i {
  font-size: 30px;
  margin-right: 15px;
  color: #000;
}

.service-info h3 {
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: 500;
}

.service-info p {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .hero-section {
    height: 400px;
    padding: 0 30px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .brand-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .services-section {
    flex-direction: column;
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 300px;
  }
  
  .hero-title {
    font-size: 28px;
  }
}
</style> 