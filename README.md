# Offer透透

一个现代化的Offer信息收集和展示系统，采用前后端分离架构，包含React前端应用和Go Gin后端API。

## 功能特性

- 🎯 用户友好的表单界面，收集Offer信息
- 📊 数据看板展示提交的信息
- 🔄 前后端数据交互
- 📝 后端使用logrus记录数据日志
- 🎨 基于Ant Design的现代化UI设计
- 🚀 React Router实现多页面路由
- 📱 响应式设计，支持移动端
- 🏪 Zustand状态管理
- ⚙️ 个人资料和设置页面

## 技术栈

### 前端
- **React 19.1.1** - 用户界面框架
- **Ant Design 5.x** - UI组件库
- **React Router 6.x** - 路由管理
- **Zustand** - 状态管理
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### 后端
- **Go 1.25.0** - 编程语言
- **Gin** - Web框架
- **Logrus** - 日志库

## 项目结构

```
moreOffer/
├── main.go                          # 后端Go Gin服务器
├── go.mod                           # Go模块依赖
├── react-front/
│   └── my-app/
│       ├── src/
│       │   ├── components/          # 可复用组件
│       │   │   └── Layout/          # 布局组件
│       │   ├── pages/               # 页面组件
│       │   │   ├── HomePage.tsx     # 首页
│       │   │   ├── DashboardPage.tsx # 数据看板
│       │   │   ├── ProfilePage.tsx  # 个人资料
│       │   │   └── SettingsPage.tsx # 设置页面
│       │   ├── store/               # 状态管理
│       │   │   └── useAppStore.ts   # Zustand store
│       │   ├── services/            # API服务
│       │   │   └── api.ts           # API接口
│       │   ├── types/               # TypeScript类型
│       │   │   └── index.ts         # 类型定义
│       │   ├── utils/               # 工具函数
│       │   │   └── routes.ts        # 路由配置
│       │   ├── App.tsx              # React主组件
│       │   └── App.css              # 全局样式
│       └── package.json             # 前端依赖
├── start_backend.bat                # 后端启动脚本
├── start_frontend.bat               # 前端启动脚本
└── README.md                        # 项目说明
```

## 快速开始

### 1. 启动后端服务

```bash

# 手动启动
cd D:\123\moreOffer
go run main.go
```

后端服务将在 `http://localhost:8080` 启动

### 2. 启动前端服务

```bash

# 手动启动
cd D:\123\moreOffer\react-front\my-app
npm run dev
```

前端应用将在 `http://localhost:5173` 启动

## 使用说明

1. 打开浏览器访问 `http://localhost:5173`
2. 在首页填写表单信息：
   - 当前Offer数量
   - 薪资区间（例如：15-25K）
   - 所在行业（例如：互联网、金融等）
3. 点击"提交数据"按钮
4. 系统将数据发送到后端API
5. 后端使用logrus记录数据到控制台
6. 前端自动跳转到数据看板界面
7. 在数据看板中可以查看提交的信息
8. 使用顶部导航栏可以访问不同页面：
   - **首页**: 填写Offer信息
   - **数据看板**: 查看提交的数据
   - **个人资料**: 管理个人信息
   - **设置**: 系统设置选项

## 页面功能

### 首页 (/)
- Offer信息填写表单
- 表单验证和提交
- 响应式设计

### 数据看板 (/dashboard)
- 展示提交的Offer数据
- 美观的统计卡片
- 数据可视化

## API接口

### POST /api/offer

提交Offer数据

**请求体：**
```json
{
  "offerCount": 3,
  "salaryRange": "15-25K",
  "industry": "互联网"
}
```

**响应：**
```json
{
  "message": "数据提交成功",
  "data": {
    "offerCount": 3,
    "salaryRange": "15-25K",
    "industry": "互联网"
  }
}
```

## 技术栈

### 后端
- Go 1.25.0
- Gin Web框架
- Logrus日志库

### 前端
- React 19.1.1
- Vite构建工具
- 现代CSS样式

## 开发说明

- 后端使用CORS中间件支持跨域请求
- 前端使用fetch API与后端通信
- 数据验证在前端和后端都有实现
- 响应式设计，支持移动端访问
