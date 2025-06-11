// 导航控制
function navigateTo(page) {
  const iframe = document.getElementById('app-frame');
  iframe.src = `pages/${page}.html`;
  
  // 更新导航栏激活状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');
}

// 飞入购物车动画
function addToCartAnimation(event, targetElement) {
  const animatedDot = document.createElement('div');
  animatedDot.classList.add('add-to-cart-animation');
  
  // 起始位置（按钮位置）
  const buttonRect = event.target.getBoundingClientRect();
  animatedDot.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
  animatedDot.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
  
  document.body.appendChild(animatedDot);
  
  // 目标位置（购物车图标位置）
  const cartIcon = document.querySelector(targetElement);
  const cartRect = cartIcon.getBoundingClientRect();
  const cartX = cartRect.left + cartRect.width / 2;
  const cartY = cartRect.top + cartRect.height / 2;
  
  // 动画
  anime({
    targets: animatedDot,
    left: cartX,
    top: cartY,
    scale: {
      value: [1, 0.5],
      duration: 400,
    },
    opacity: {
      value: [1, 0],
      duration: 400,
    },
    duration: 500,
    easing: 'easeOutQuad',
    complete: function() {
      document.body.removeChild(animatedDot);
      
      // 购物车图标动画
      anime({
        targets: cartIcon,
        scale: [1.3, 1],
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
  });
}

// 无限滚动加载
function setupInfiniteScroll(containerSelector, loadMoreCallback) {
  const container = document.querySelector(containerSelector);
  let isLoading = false;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    
    // 当滚动到接近底部时
    if (scrollTop + windowHeight > documentHeight - 200 && !isLoading) {
      isLoading = true;
      
      // 显示加载状态
      const loadingSpinner = document.createElement('div');
      loadingSpinner.classList.add('loading-spinner');
      container.appendChild(loadingSpinner);
      
      // 模拟加载延迟
      setTimeout(() => {
        // 加载更多内容
        loadMoreCallback();
        
        // 移除加载状态
        container.removeChild(loadingSpinner);
        isLoading = false;
      }, 1000);
    }
  });
}

// 3D商品预览功能
function init3DPreview(containerId) {
  const container = document.getElementById(containerId);
  
  // 这里会实际集成一个3D库（例如Three.js），但为了原型演示，我们使用简单的旋转图片模拟
  let isDragging = false;
  let startX = 0;
  let currentRotation = 0;
  
  // 获取产品图片元素
  const productImg = container.querySelector('img');
  
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    container.style.cursor = 'grabbing';
  });
  
  window.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
  });
  
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    startX = e.clientX;
    
    currentRotation += deltaX * 0.5;
    productImg.style.transform = `rotateY(${currentRotation}deg)`;
  });
  
  // 触摸设备支持
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });
  
  window.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    startX = e.touches[0].clientX;
    
    currentRotation += deltaX * 0.5;
    productImg.style.transform = `rotateY(${currentRotation}deg)`;
  });
}

// 深色模式切换
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  
  // 保存用户偏好
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

// 检查用户深色模式偏好
function checkDarkModePreference() {
  const savedDarkMode = localStorage.getItem('darkMode');
  
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
  }
  
  // 也检查系统偏好
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && savedDarkMode === null) {
    document.body.classList.add('dark-mode');
  }
}

// 页面加载时运行
document.addEventListener('DOMContentLoaded', function() {
  checkDarkModePreference();
  
  // 初始化导航栏
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
  document.querySelector(`.nav-item[data-page="${currentPage}"]`)?.classList.add('active');
  
  // 监听来自父页面的主题切换消息
  window.addEventListener('message', function(event) {
    if (event.data) {
      if (event.data.mode === 'dark') {
        document.body.classList.add('dark-mode');
      } else if (event.data.mode === 'light') {
        document.body.classList.remove('dark-mode');
      }
    }
  });
});

// 轮播图功能
function initCarousel(carouselId, interval = 3000) {
  const carousel = document.getElementById(carouselId);
  const slides = carousel.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  let currentSlide = 0;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }
  
  // 初始显示第一张
  showSlide(0);
  
  // 自动轮播
  setInterval(nextSlide, interval);
}

// 模拟数据加载函数
function loadMoreProducts(containerId, category = 'all') {
  const container = document.getElementById(containerId);
  
  // 模拟商品数据
  const products = [
    {
      id: 1,
      name: '耐克 Air Jordan 1 "Chicago"',
      price: '¥3,599',
      sales: '2.5万人付款',
      image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      verified: true
    },
    {
      id: 2,
      name: 'Adidas Yeezy Boost 350 V2',
      price: '¥2,899',
      sales: '1.8万人付款',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      verified: true
    },
    {
      id: 3,
      name: '匡威 Chuck 70 高帮',
      price: '¥739',
      sales: '3.2万人付款',
      image: 'https://images.unsplash.com/photo-1607522370275-f14c93dd7fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      verified: true
    },
    {
      id: 4,
      name: 'Supreme Box Logo 卫衣',
      price: '¥8,999',
      sales: '2,423人付款',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      verified: true
    }
  ];
  
  // 创建商品卡片HTML
  let html = '';
  products.forEach(product => {
    html += `
      <div class="product-card" data-product-id="${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <div class="p-2">
          <h3 class="text-sm font-semibold">${product.name}</h3>
          <div class="flex justify-between items-center mt-1">
            <span class="text-sm font-bold">${product.price}</span>
            <span class="text-xs text-gray-500">${product.sales}</span>
          </div>
          ${product.verified ? '<div class="verification-badge"><i class="fas fa-check-circle mr-1"></i>正品保障</div>' : ''}
        </div>
      </div>
    `;
  });
  
  // 添加到容器
  container.insertAdjacentHTML('beforeend', html);
  
  // 添加点击事件
  const newCards = container.querySelectorAll('.product-card:not([data-initialized])');
  newCards.forEach(card => {
    card.setAttribute('data-initialized', 'true');
    card.addEventListener('click', () => {
      window.location.href = `detail.html?id=${card.dataset.productId}`;
    });
  });
}

// 模拟加载社区动态
function loadMorePosts(containerId) {
  const container = document.getElementById(containerId);
  
  // 模拟社区动态数据
  const posts = [
    {
      id: 1,
      username: '潮流玩家',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: '刚入手的AJ1芝加哥也太帅了吧！鉴定过了，纯正原厂，大家感受一下这质感🔥',
      images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'],
      likes: 328,
      comments: 42
    },
    {
      id: 2,
      username: '球鞋控',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: '今天发售的Yeezy抢到了！限量款，全球只有5000双，手慢无！',
      images: [
        'https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      ],
      likes: 156,
      comments: 23
    }
  ];
  
  // 创建社区动态HTML
  let html = '';
  posts.forEach(post => {
    let imagesHtml = '';
    
    if (post.images.length === 1) {
      imagesHtml = `<img src="${post.images[0]}" class="w-full rounded-lg mt-2">`;
    } else if (post.images.length > 1) {
      imagesHtml = '<div class="grid grid-cols-2 gap-2 mt-2">';
      post.images.forEach(img => {
        imagesHtml += `<img src="${img}" class="w-full rounded-lg">`;
      });
      imagesHtml += '</div>';
    }
    
    html += `
      <div class="post-card">
        <div class="user-info">
          <img src="${post.avatar}" class="user-avatar">
          <div>
            <div class="font-semibold">${post.username}</div>
            <div class="text-xs text-gray-500">刚刚发布</div>
          </div>
        </div>
        <p>${post.content}</p>
        ${imagesHtml}
        <div class="interaction-bar">
          <div>
            <i class="far fa-heart mr-1"></i> ${post.likes}
            <i class="far fa-comment ml-4 mr-1"></i> ${post.comments}
          </div>
          <div>
            <i class="far fa-share-square"></i>
          </div>
        </div>
      </div>
    `;
  });
  
  // 添加到容器
  container.insertAdjacentHTML('beforeend', html);
} 