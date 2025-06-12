import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

// 路由懒加载
const Home = () => import('../views/Home.vue')
const Category = () => import('../views/Category.vue')
const Detail = () => import('../views/Detail.vue')
const Cart = () => import('../views/Cart.vue')
const Profile = () => import('../views/Profile.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Exchange = () => import('../views/Exchange.vue')
const ExchangeDetail = () => import('../views/ExchangeDetail.vue')
const ExchangeCreate = () => import('../views/ExchangeCreate.vue')
const ExchangeOffer = () => import('../views/ExchangeOffer.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/category',
    name: 'Category',
    component: Category
  },
  {
    path: '/product/:id',
    name: 'Detail',
    component: Detail,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/exchange',
    name: 'Exchange',
    component: Exchange
  },
  {
    path: '/exchange/create',
    name: 'ExchangeCreate',
    component: ExchangeCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/exchange/:id',
    name: 'ExchangeDetail',
    component: ExchangeDetail,
    props: true
  },
  {
    path: '/exchange/:id/offer',
    name: 'ExchangeOffer',
    component: ExchangeOffer,
    meta: { requiresAuth: true },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } 
  // 仅限游客的页面（如登录、注册），登录用户会被重定向到首页
  else if (to.meta.guestOnly && userStore.isLoggedIn) {
    next({ name: 'Home' })
  } 
  else {
    next()
  }
})

export default router 