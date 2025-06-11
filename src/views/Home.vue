<template>
  <div class="home-container">
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="400px">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <img :src="item.imageUrl" :alt="item.title" class="banner-image">
        </el-carousel-item>
      </el-carousel>
    </div>
    
    <!-- 分类快捷入口 -->
    <div class="category-section container">
      <h2 class="section-title">热门分类</h2>
      <div class="category-list">
        <div class="category-item" v-for="category in categories" :key="category.id">
          <router-link :to="`/category?id=${category.id}`">
            <div class="category-icon">
              <i class="el-icon-shopping-bag"></i>
            </div>
            <div class="category-name">{{ category.name }}</div>
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- 推荐商品 -->
    <div class="featured-section container">
      <h2 class="section-title">推荐商品</h2>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="product in featuredProducts" :key="product.id" class="product-col">
          <product-card :product="product" />
        </el-col>
      </el-row>
    </div>
    
    <!-- 新品上架 -->
    <div class="new-products-section container">
      <h2 class="section-title">新品上架</h2>
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :lg="4" v-for="product in newProducts" :key="product.id" class="product-col">
          <product-card :product="product" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/product'

const productStore = useProductStore()

const categories = ref([])
const featuredProducts = ref([])
const newProducts = ref([])
const banners = ref([
  { id: 1, title: '夏季大促', imageUrl: 'https://picsum.photos/1200/400?random=1' },
  { id: 2, title: '新品发布', imageUrl: 'https://picsum.photos/1200/400?random=2' },
  { id: 3, title: '限时折扣', imageUrl: 'https://picsum.photos/1200/400?random=3' }
])

onMounted(async () => {
  try {
    // 获取分类
    const categoriesData = await productStore.fetchCategories()
    categories.value = categoriesData
    
    // 获取推荐商品
    const featuredData = await productStore.fetchProducts({ featured: true, limit: 6 })
    featuredProducts.value = featuredData
    
    // 获取新品
    const newProductsData = await productStore.fetchProducts({ sort: 'createdAt,desc', limit: 6 })
    newProducts.value = newProductsData
  } catch (error) {
    console.error('加载首页数据失败:', error)
  }
})
</script>

<style scoped>
.home-container {
  padding-bottom: 40px;
}

.banner-section {
  margin-bottom: 30px;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-section, .featured-section, .new-products-section {
  margin-bottom: 40px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 -10px;
}

.category-item {
  flex: 0 0 calc(20% - 20px);
  margin: 10px;
  text-align: center;
}

.category-item a {
  display: block;
  color: #333;
  text-decoration: none;
  transition: transform 0.3s;
}

.category-item a:hover {
  transform: translateY(-5px);
}

.category-icon {
  width: 60px;
  height: 60px;
  background-color: #f2f6fc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  font-size: 24px;
  color: #409eff;
}

.category-name {
  font-size: 14px;
}

.product-col {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .category-item {
    flex: 0 0 calc(33.33% - 20px);
  }
}

@media (max-width: 576px) {
  .category-item {
    flex: 0 0 calc(50% - 20px);
  }
}
</style> 