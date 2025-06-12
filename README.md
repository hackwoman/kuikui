# DuMall - 奢侈品电商平台

DuMall是一个基于Spring Boot 3.2和Vue 3开发的前后端分离奢侈品电商平台，专注于提供高端奢侈品的在线购物体验。

## 项目特点

- 🛍️ 精美的奢侈品展示和购物体验
- 🔒 完整的用户认证和授权系统
- 🛒 购物车和订单管理功能
- 💎 商品分类和搜索功能
- 🔄 商品交换功能

## 技术栈

### 后端
- Spring Boot 3.2
- Spring Security + JWT认证
- Spring Data JPA
- H2数据库（开发环境）
- Lombok

### 前端
- Vue 3
- Pinia状态管理
- Vue Router
- Element Plus UI框架
- Axios HTTP客户端

## 快速开始

### 前提条件
- JDK 17或更高版本
- Node.js 16或更高版本
- npm或yarn包管理器

### 运行后端
```bash
cd backend
./mvnw spring-boot:run
```

### 运行前端
```bash
cd frontend
npm install
npm run dev
```

## 构建项目

### 构建后端
```bash
cd backend
./mvnw clean package
```
构建完成后，JAR文件将位于`target/`目录下。

### 构建前端
```bash
cd frontend
npm run build
```
构建完成后，静态文件将位于`dist/`目录下。

## 部署

### 部署后端
```bash
java -jar target/dumall-0.0.1-SNAPSHOT.jar
```

### 部署前端
将`dist/`目录下的文件部署到Web服务器（如Nginx、Apache）中。

## 默认用户

系统预设了以下用户账号：

- 普通用户：用户名 `user`，密码 `password`
- 管理员：用户名 `admin`，密码 `admin123`

## 许可证

[MIT](LICENSE) 