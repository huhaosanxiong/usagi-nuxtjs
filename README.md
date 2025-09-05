# Nuxt 4 待办事项管理应用

这是一个基于 Nuxt 4 的全栈待办事项管理应用，包含用户认证和完整的 CRUD 功能。

## 功能特性

### 用户功能
- ✅ 用户注册
- ✅ 用户登录
- ✅ JWT 认证
- ✅ 登出功能

### 待办事项功能
- ✅ 创建待办事项
- ✅ 查看待办事项列表
- ✅ 更新待办事项（标题、描述、状态、优先级、截止日期）
- ✅ 删除待办事项
- ✅ 状态切换（待处理、进行中、已完成）
- ✅ 优先级设置（低、中、高）
- ✅ 截止日期设置

### 界面特性
- ✅ 响应式设计
- ✅ 美观的 UI 界面
- ✅ 实时统计信息
- ✅ 状态和优先级标签

## 技术栈

### 前端
- Nuxt 4
- Vue 3
- Tailwind CSS
- DaisyUI
- Pinia (状态管理)

### 后端
- Nuxt API Routes
- MySQL
- JWT 认证
- bcryptjs (密码加密)

## 项目结构

```
├── app/
│   └── app.vue                 # 主应用组件
├── assets/
│   └── css/
│       ├── main.css           # 主要样式文件
│       └── custom.css         # 自定义样式
├── pages/
│   ├── dashboard.vue          # 仪表板页面
│   ├── login.vue              # 登录页面
│   └── register.vue           # 注册页面
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts  # 登录 API
│   │   │   └── register.post.ts # 注册 API
│   │   └── todos/
│   │       ├── index.ts       # 待办事项列表和创建 API
│   │       └── [id]/
│   │           ├── put.ts      # 更新待办事项 API
│   │           └── delete.ts   # 删除待办事项 API
│   └── plugins/
│       └── database.ts        # 数据库初始化插件
├── stores/
│   ├── auth.ts                # 认证状态管理
│   └── todos.ts               # 待办事项状态管理
├── types/
│   └── index.ts               # TypeScript 类型定义
├── utils/
│   ├── database.ts            # 数据库配置
│   └── models.ts              # 数据模型和操作
└── nuxt.config.ts             # Nuxt 配置文件
```

## 安装和运行

### 前置条件
- Node.js 18+
- MySQL 数据库
- npm 或 yarn

### 数据库设置

1. 创建 MySQL 数据库：
```sql
CREATE DATABASE nuxt_todo_app;
```

2. 数据库配置在 `utils/database.ts` 中，默认配置：
```typescript
export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nuxt_todo_app',
  // ...
})
```

根据您的 MySQL 配置修改这些参数。

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm run preview
```

## 使用说明

1. **注册账户**：首次使用需要注册一个新账户
2. **登录**：使用注册的用户名和密码登录
3. **创建待办事项**：在左侧表单中填写待办事项信息
4. **管理待办事项**：在右侧列表中可以查看、更新状态和删除待办事项

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 待办事项
- `GET /api/todos` - 获取待办事项列表
- `POST /api/todos` - 创建待办事项
- `PUT /api/todos/[id]` - 更新待办事项
- `DELETE /api/todos/[id]` - 删除待办事项

## 开发说明

### 状态管理
- 使用 Pinia 进行状态管理
- `auth.ts` 管理用户认证状态
- `todos.ts` 管理待办事项状态

### 数据库
- 使用 MySQL 作为数据库
- 自动创建表结构
- 包含用户表和待办事项表

### 样式
- 使用 Tailwind CSS 进行样式设计
- DaisyUI 提供组件样式
- 自定义 CSS 增强用户体验

## 许可证

MIT License
