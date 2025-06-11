<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo">
        <router-link to="/">DuMall</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/category">分类</router-link>
        <router-link to="/cart">购物车</router-link>
        <router-link to="/profile">我的</router-link>
      </div>
      <div class="user-actions">
        <router-link v-if="!isLoggedIn" to="/login">登录</router-link>
        <router-link v-if="!isLoggedIn" to="/register">注册</router-link>
        <a v-if="isLoggedIn" @click="logout">退出登录</a>
      </div>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <p>© 2025 DuMall 电商平台 - 保留所有权利</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const router = useRouter()

const isLoggedIn = computed(() => userStore.isLoggedIn)

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #409eff;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: #333;
  text-decoration: none;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: #409eff;
}

.user-actions {
  display: flex;
  gap: 1rem;
}

.user-actions a {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
}

.app-content {
  flex: 1;
  padding: 2rem;
}

.app-footer {
  background-color: #f5f5f5;
  padding: 1.5rem;
  text-align: center;
  color: #666;
}
</style> 