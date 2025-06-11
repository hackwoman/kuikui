<template>
  <div class="profile-container container">
    <h1 class="page-title">个人中心</h1>
    
    <el-row :gutter="20">
      <!-- 侧边菜单 -->
      <el-col :md="6" :sm="24">
        <el-card class="menu-card">
          <div class="user-info">
            <div class="avatar">
              <el-avatar :size="64" icon="el-icon-user"></el-avatar>
            </div>
            <div class="username">{{ userStore.user.username }}</div>
          </div>
          
          <el-menu
            :default-active="activeMenu"
            class="profile-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="info">
              <i class="el-icon-user"></i>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="orders">
              <i class="el-icon-tickets"></i>
              <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="address">
              <i class="el-icon-location"></i>
              <span>收货地址</span>
            </el-menu-item>
            <el-menu-item index="security">
              <i class="el-icon-lock"></i>
              <span>账号安全</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      
      <!-- 主内容区 -->
      <el-col :md="18" :sm="24">
        <el-card class="content-card">
          <!-- 个人信息 -->
          <div v-if="activeMenu === 'info'" class="info-section">
            <h2 class="section-title">个人信息</h2>
            
            <el-form label-width="100px" class="user-form">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" disabled></el-input>
              </el-form-item>
              
              <el-form-item label="电子邮件">
                <el-input v-model="userInfo.email"></el-input>
              </el-form-item>
              
              <el-form-item label="手机号码">
                <el-input v-model="userInfo.phone"></el-input>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="updateUserInfo">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 我的订单 -->
          <div v-else-if="activeMenu === 'orders'" class="orders-section">
            <h2 class="section-title">我的订单</h2>
            
            <div v-if="orders.length === 0" class="empty-data">
              <el-empty description="暂无订单" />
            </div>
            
            <div v-else class="order-list">
              <div v-for="order in orders" :key="order.id" class="order-item">
                <div class="order-header">
                  <span class="order-number">订单号: {{ order.orderNumber }}</span>
                  <span class="order-time">下单时间: {{ formatDate(order.createdAt) }}</span>
                  <span class="order-status">{{ getOrderStatusText(order.status) }}</span>
                </div>
                
                <div class="order-products">
                  <div v-for="item in order.items" :key="item.id" class="order-product">
                    <div class="product-image">
                      <img :src="item.productImage" :alt="item.productName">
                    </div>
                    <div class="product-info">
                      <div class="product-name">{{ item.productName }}</div>
                      <div class="product-price">¥{{ item.price.toFixed(2) }} × {{ item.quantity }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="order-footer">
                  <div class="order-amount">
                    合计: <span class="amount">¥{{ order.totalAmount.toFixed(2) }}</span>
                  </div>
                  
                  <div class="order-actions">
                    <el-button 
                      v-if="order.status === 'PENDING'"
                      size="small" 
                      type="danger" 
                      @click="cancelOrder(order.id)"
                    >
                      取消订单
                    </el-button>
                    
                    <el-button 
                      v-if="order.status === 'DELIVERED'"
                      size="small" 
                      type="primary" 
                      @click="confirmReceived(order.id)"
                    >
                      确认收货
                    </el-button>
                    
                    <el-button 
                      size="small" 
                      @click="viewOrderDetail(order.id)"
                    >
                      查看详情
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 收货地址 -->
          <div v-else-if="activeMenu === 'address'" class="address-section">
            <h2 class="section-title">收货地址</h2>
            
            <div v-if="addresses.length === 0" class="empty-data">
              <el-empty description="暂无收货地址" />
            </div>
            
            <div v-else class="address-list">
              <el-card 
                v-for="address in addresses" 
                :key="address.id" 
                class="address-item"
                :class="{ 'is-default': address.isDefault }"
              >
                <div class="address-info">
                  <p><span class="recipient">{{ address.receiver }}</span> <span class="phone">{{ address.phoneNumber }}</span></p>
                  <p class="detail">{{ formatAddress(address) }}</p>
                  
                  <div v-if="address.isDefault" class="default-tag">默认地址</div>
                </div>
                
                <div class="address-actions">
                  <el-button 
                    type="text" 
                    @click="editAddress(address)"
                  >
                    编辑
                  </el-button>
                  
                  <el-button 
                    type="text" 
                    @click="deleteAddress(address.id)"
                  >
                    删除
                  </el-button>
                  
                  <el-button 
                    v-if="!address.isDefault" 
                    type="text" 
                    @click="setDefaultAddress(address.id)"
                  >
                    设为默认
                  </el-button>
                </div>
              </el-card>
            </div>
            
            <div class="add-address">
              <el-button type="primary" @click="showAddressDialog">新增收货地址</el-button>
            </div>
          </div>
          
          <!-- 账号安全 -->
          <div v-else-if="activeMenu === 'security'" class="security-section">
            <h2 class="section-title">账号安全</h2>
            
            <el-form label-width="100px" class="security-form">
              <el-form-item label="旧密码">
                <el-input v-model="passwordForm.oldPassword" type="password"></el-input>
              </el-form-item>
              
              <el-form-item label="新密码">
                <el-input v-model="passwordForm.newPassword" type="password"></el-input>
              </el-form-item>
              
              <el-form-item label="确认密码">
                <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="changePassword">修改密码</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 地址编辑对话框 -->
    <el-dialog
      v-model="addressDialog.visible"
      :title="addressDialog.isEdit ? '编辑收货地址' : '新增收货地址'"
      width="500px"
    >
      <el-form 
        :model="addressDialog.form" 
        label-width="80px"
        :rules="addressRules"
        ref="addressFormRef"
      >
        <el-form-item label="收货人" prop="receiver">
          <el-input v-model="addressDialog.form.receiver"></el-input>
        </el-form-item>
        
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="addressDialog.form.phoneNumber"></el-input>
        </el-form-item>
        
        <el-form-item label="省份" prop="province">
          <el-input v-model="addressDialog.form.province"></el-input>
        </el-form-item>
        
        <el-form-item label="城市" prop="city">
          <el-input v-model="addressDialog.form.city"></el-input>
        </el-form-item>
        
        <el-form-item label="区/县" prop="district">
          <el-input v-model="addressDialog.form.district"></el-input>
        </el-form-item>
        
        <el-form-item label="详细地址" prop="street">
          <el-input v-model="addressDialog.form.street"></el-input>
        </el-form-item>
        
        <el-form-item label="邮政编码" prop="postalCode">
          <el-input v-model="addressDialog.form.postalCode"></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="addressDialog.form.isDefault">设为默认收货地址</el-checkbox>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="addressDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

// 激活的菜单项
const activeMenu = ref('info')

// 用户信息
const userInfo = reactive({
  username: userStore.user?.username || '',
  email: userStore.user?.email || '',
  phone: ''
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 地址相关
const addresses = ref([])
const addressDialog = reactive({
  visible: false,
  isEdit: false,
  form: {
    id: null,
    receiver: '',
    phoneNumber: '',
    province: '',
    city: '',
    district: '',
    street: '',
    postalCode: '',
    isDefault: false
  }
})

// 地址表单验证规则
const addressRules = {
  receiver: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  province: [
    { required: true, message: '请输入省份', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  district: [
    { required: true, message: '请输入区/县', trigger: 'blur' }
  ],
  street: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
}

// 订单相关
const orders = ref([])

// 菜单选择处理
const handleMenuSelect = (index) => {
  activeMenu.value = index
  
  // 加载对应数据
  if (index === 'orders') {
    fetchOrders()
  } else if (index === 'address') {
    fetchAddresses()
  }
}

// 更新用户信息
const updateUserInfo = async () => {
  try {
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    console.error('更新个人信息失败:', error)
    ElMessage.error('更新个人信息失败')
  }
}

// 修改密码
const changePassword = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    ElMessage.warning('请填写完整的密码信息')
    return
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  
  try {
    // 这里应该调用API进行密码修改
    ElMessage.success('密码修改成功')
    
    // 清空表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    console.error('修改密码失败:', error)
    ElMessage.error('修改密码失败')
  }
}

// 获取订单列表
const fetchOrders = async () => {
  try {
    // 模拟订单数据
    orders.value = [
      {
        id: 1,
        orderNumber: 'ORD20230001',
        status: 'PENDING',
        createdAt: new Date(),
        totalAmount: 5999.00,
        items: [
          {
            id: 1,
            productName: '智能手机 Pro',
            productImage: 'https://picsum.photos/400/400?random=1',
            price: 5999.00,
            quantity: 1
          }
        ]
      },
      {
        id: 2,
        orderNumber: 'ORD20230002',
        status: 'DELIVERED',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7天前
        totalAmount: 1299.00,
        items: [
          {
            id: 2,
            productName: '智能手表',
            productImage: 'https://picsum.photos/400/400?random=8',
            price: 1299.00,
            quantity: 1
          }
        ]
      }
    ]
  } catch (error) {
    console.error('获取订单列表失败:', error)
    ElMessage.error('获取订单列表失败')
  }
}

// 获取地址列表
const fetchAddresses = async () => {
  try {
    // 模拟地址数据
    addresses.value = [
      {
        id: 1,
        receiver: '张三',
        phoneNumber: '13800138000',
        province: '北京市',
        city: '北京市',
        district: '海淀区',
        street: '中关村大街1号',
        postalCode: '100080',
        isDefault: true
      },
      {
        id: 2,
        receiver: '李四',
        phoneNumber: '13900139000',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        street: '张江高科技园区',
        postalCode: '201203',
        isDefault: false
      }
    ]
  } catch (error) {
    console.error('获取地址列表失败:', error)
    ElMessage.error('获取地址列表失败')
  }
}

// 新增地址对话框
const showAddressDialog = () => {
  addressDialog.isEdit = false
  addressDialog.form = {
    id: null,
    receiver: '',
    phoneNumber: '',
    province: '',
    city: '',
    district: '',
    street: '',
    postalCode: '',
    isDefault: false
  }
  addressDialog.visible = true
}

// 编辑地址
const editAddress = (address) => {
  addressDialog.isEdit = true
  addressDialog.form = { ...address }
  addressDialog.visible = true
}

// 保存地址
const saveAddress = async () => {
  try {
    // 这里应该调用API保存地址
    if (addressDialog.isEdit) {
      // 更新地址
      const index = addresses.value.findIndex(a => a.id === addressDialog.form.id)
      if (index !== -1) {
        addresses.value[index] = { ...addressDialog.form }
      }
      ElMessage.success('地址更新成功')
    } else {
      // 新增地址
      const newAddress = {
        ...addressDialog.form,
        id: Date.now() // 模拟ID
      }
      addresses.value.push(newAddress)
      ElMessage.success('地址添加成功')
    }
    
    // 如果设为默认地址，更新其他地址状态
    if (addressDialog.form.isDefault) {
      addresses.value.forEach(address => {
        if (address.id !== addressDialog.form.id) {
          address.isDefault = false
        }
      })
    }
    
    addressDialog.visible = false
  } catch (error) {
    console.error('保存地址失败:', error)
    ElMessage.error('保存地址失败')
  }
}

// 删除地址
const deleteAddress = async (addressId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个地址吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 这里应该调用API删除地址
    addresses.value = addresses.value.filter(a => a.id !== addressId)
    ElMessage.success('地址删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除地址失败:', error)
      ElMessage.error('删除地址失败')
    }
  }
}

// 设为默认地址
const setDefaultAddress = async (addressId) => {
  try {
    // 这里应该调用API设置默认地址
    addresses.value.forEach(address => {
      address.isDefault = address.id === addressId
    })
    ElMessage.success('已设为默认地址')
  } catch (error) {
    console.error('设置默认地址失败:', error)
    ElMessage.error('设置默认地址失败')
  }
}

// 取消订单
const cancelOrder = async (orderId) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消这个订单吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 这里应该调用API取消订单
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders.value[index].status = 'CANCELLED'
    }
    ElMessage.success('订单已取消')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消订单失败:', error)
      ElMessage.error('取消订单失败')
    }
  }
}

// 确认收货
const confirmReceived = async (orderId) => {
  try {
    await ElMessageBox.confirm(
      '确认已收到商品?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    // 这里应该调用API确认收货
    const index = orders.value.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders.value[index].status = 'COMPLETED'
    }
    ElMessage.success('确认收货成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('确认收货失败:', error)
      ElMessage.error('确认收货失败')
    }
  }
}

// 查看订单详情
const viewOrderDetail = (orderId) => {
  // 这里可以跳转到订单详情页面
  console.log('查看订单详情:', orderId)
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 格式化地址
const formatAddress = (address) => {
  return `${address.province} ${address.city} ${address.district} ${address.street} ${address.postalCode || ''}`
}

// 获取订单状态文本
const getOrderStatusText = (status) => {
  const statusMap = {
    'PENDING': '待发货',
    'PROCESSING': '处理中',
    'SHIPPED': '已发货',
    'DELIVERED': '配送中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  }
  return statusMap[status] || status
}

// 页面初始化
onMounted(() => {
  // 加载默认数据
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    // 可以跳转到登录页面
  }
})
</script>

<style scoped>
.profile-container {
  padding: 20px 0 40px;
}

.page-title {
  margin: 20px 0;
  font-size: 24px;
  font-weight: 500;
}

.menu-card, .content-card {
  margin-bottom: 20px;
}

.user-info {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.avatar {
  margin-bottom: 10px;
}

.username {
  font-size: 16px;
  font-weight: 500;
}

.profile-menu {
  border-right: none;
}

.section-title {
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.user-form, .security-form {
  max-width: 500px;
}

.empty-data {
  padding: 40px 0;
  text-align: center;
}

/* 订单样式 */
.order-item {
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
}

.order-header {
  background-color: #f8f8f8;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.order-status {
  color: #409eff;
  font-weight: 500;
}

.order-products {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.order-product {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.order-product:last-child {
  margin-bottom: 0;
}

.order-product .product-image {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
  margin-right: 10px;
}

.order-product .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-product .product-info {
  flex: 1;
}

.order-product .product-name {
  margin-bottom: 5px;
}

.order-product .product-price {
  color: #999;
  font-size: 13px;
}

.order-footer {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-amount .amount {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}

/* 地址样式 */
.address-list {
  margin-bottom: 20px;
}

.address-item {
  margin-bottom: 15px;
  position: relative;
}

.address-item.is-default {
  border-color: #409eff;
}

.address-info {
  padding-right: 100px;
}

.address-info p {
  margin: 5px 0;
}

.recipient {
  font-weight: 500;
  margin-right: 10px;
}

.default-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #409eff;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.address-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.add-address {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-header > span {
    margin-bottom: 5px;
  }
  
  .order-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-amount {
    margin-bottom: 10px;
  }
}
</style> 