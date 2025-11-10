# 多人博客平台 - 配置指南

## 项目概述

这是一个基于 Express + MongoDB + Vue 3 的多人博客平台，支持：

- ✅ 用户注册和登录（JWT 认证）
- ✅ 多角色权限管理（普通用户、作者、管理员）
- ✅ 文章发布和管理（CRUD 操作）
- ✅ 评论系统
- ✅ 文章分类和标签
- ✅ 点赞功能
- ✅ 实时浏览量统计

## 安装依赖

首先需要安装 MongoDB 相关依赖：

```bash
pnpm add mongoose bcryptjs jsonwebtoken
```

## MongoDB 配置

### 方案 1: 使用本地 MongoDB（推荐）

1. 安装 MongoDB Community Edition
   - 访问：https://www.mongodb.com/try/download/community
   - 下载并安装适合你操作系统的版本

2. 启动 MongoDB 服务

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # 开机自启
```

**macOS:**
```bash
brew services start mongodb-community
```

**Windows:**
- MongoDB 安装后会自动作为服务运行
- 或者在服务管理器中启动 MongoDB 服务

3. 验证 MongoDB 是否运行
```bash
mongosh
# 如果成功连接，说明 MongoDB 正在运行
```

### 方案 2: 使用 Docker 运行 MongoDB

如果你已经安装了 Docker，可以快速启动 MongoDB：

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

### 方案 3: 使用 MongoDB Atlas（云数据库）

1. 访问 https://www.mongodb.com/cloud/atlas
2. 创建免费账户和集群
3. 获取连接字符串
4. 在项目根目录创建 `.env` 文件：

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-platform
JWT_SECRET=your-super-secret-key-change-this
```

## 环境变量配置

在项目根目录创建 `.env` 文件（可选）：

```env
# MongoDB 连接字符串（默认: mongodb://localhost:27017/blog-platform）
MONGODB_URI=mongodb://localhost:27017/blog-platform

# JWT 密钥（建议修改）
JWT_SECRET=your-secret-key-change-in-production

# 服务器端口（默认: 3002）
PORT=3002
```

## 启动项目

项目已经在运行中，后端服务器会自动重启并加载博客系统。

如果需要手动启动：

```bash
# 开发模式（前端 + 后端）
pnpm run dev

# 只启动前端
pnpm run dev:frontend

# 只启动后端
pnpm run dev:backend
```

## 访问博客平台

1. 打开浏览器访问：http://localhost:5173
2. 点击顶部导航栏的"📝 博客平台"标签页
3. 注册一个账户（选择"作者"角色以便发布文章）

## 功能说明

### 用户角色

- **普通用户（user）**: 可以浏览文章、点赞、发表评论
- **作者（author）**: 拥有普通用户权限，还可以发布和管理自己的文章
- **管理员（admin）**: 可以管理所有用户的文章和评论

### 文章管理

1. **创建文章**: 点击右上角"写文章"按钮（需要作者或管理员权限）
2. **编辑文章**: 在文章详情页点击"编辑"按钮（只能编辑自己的文章）
3. **删除文章**: 在文章详情页点击"删除"按钮（只能删除自己的文章）
4. **草稿功能**: 创建文章时勾选"保存为草稿"，文章不会公开显示

### 分类和标签

- 在创建文章时可以选择分类（如：技术、生活、随笔等）
- 可以添加多个标签，用逗号分隔（如：JavaScript, Vue, 前端）
- 在侧边栏点击分类可以筛选文章

### 评论系统

- 登录后可以在文章详情页发表评论
- 评论作者和管理员可以删除评论
- 支持实时评论列表更新

### 点赞功能

- 登录后可以点赞文章
- 再次点击可以取消点赞
- 点赞数会实时更新

## API 接口文档

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新个人信息

### 文章接口

- `GET /api/posts` - 获取文章列表（支持分页和筛选）
- `GET /api/posts/:id` - 获取单篇文章
- `POST /api/posts` - 创建文章（需要认证 + 作者权限）
- `PUT /api/posts/:id` - 更新文章（需要认证 + 所有权）
- `DELETE /api/posts/:id` - 删除文章（需要认证 + 所有权）
- `POST /api/posts/:id/like` - 点赞/取消点赞（需要认证）

### 评论接口

- `GET /api/comments/post/:postId` - 获取文章的所有评论
- `POST /api/comments` - 创建评论（需要认证）
- `PUT /api/comments/:id` - 更新评论（需要认证 + 所有权）
- `DELETE /api/comments/:id` - 删除评论（需要认证 + 所有权）

## 文件结构

```
app-project/
├── server/
│   ├── models/              # 数据库模型
│   │   ├── User.js         # 用户模型
│   │   ├── Post.js         # 文章模型
│   │   └── Comment.js      # 评论模型
│   ├── routes/             # API 路由
│   │   ├── auth.js         # 认证路由
│   │   ├── posts.js        # 文章路由
│   │   └── comments.js     # 评论路由
│   ├── middleware/         # 中间件
│   │   └── auth.js         # 认证中间件
│   └── index.js            # 服务器入口
├── src/
│   ├── components/
│   │   └── BlogPlatform.vue  # 博客平台组件
│   └── App.vue             # 主应用组件
└── BLOG_SETUP.md           # 本文档
```

## 常见问题

### 1. MongoDB 连接失败

**错误信息**: `MongoDB 连接失败: connect ECONNREFUSED 127.0.0.1:27017`

**解决方案**:
- 确认 MongoDB 服务正在运行
- 检查防火墙是否阻止了 27017 端口
- 尝试使用 `mongosh` 命令测试连接

### 2. 无法注册/登录

**可能原因**:
- MongoDB 未连接
- 网络请求被拦截

**解决方案**:
- 检查浏览器控制台的错误信息
- 确认后端服务正在运行
- 查看后端日志

### 3. 博客功能不可用

服务器启动日志会显示 MongoDB 连接状态：
- ✅ `MongoDB 连接成功` - 博客功能可用
- ❌ `MongoDB 连接失败` - 博客功能不可用，但其他功能正常

## 开发建议

### 创建测试账户

```bash
# 使用 mongosh 创建管理员账户
mongosh

use blog-platform

db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$...",  # 需要使用 bcrypt 加密
  role: "admin",
  createdAt: new Date()
})
```

### 清空测试数据

```bash
mongosh

use blog-platform

# 清空所有文章
db.posts.deleteMany({})

# 清空所有评论
db.comments.deleteMany({})

# 清空所有用户（慎用）
db.users.deleteMany({})
```

## 安全建议

1. **生产环境必须修改 JWT_SECRET**
2. **使用 HTTPS 传输敏感数据**
3. **定期备份 MongoDB 数据库**
4. **启用 MongoDB 访问控制（用户名/密码）**
5. **设置合理的 CORS 策略**

## 下一步开发

可以考虑添加以下功能：

- [ ] 富文本编辑器（Markdown 或 WYSIWYG）
- [ ] 图片上传功能
- [ ] 文章搜索功能
- [ ] 用户个人主页
- [ ] 关注/粉丝系统
- [ ] 文章收藏功能
- [ ] 邮件通知
- [ ] RSS 订阅
- [ ] SEO 优化

## 技术栈

- **前端**: Vue 3 + Vite
- **后端**: Node.js + Express
- **数据库**: MongoDB + Mongoose
- **认证**: JWT + bcryptjs
- **实时通信**: Socket.IO（已有，可用于实时通知）

## 支持

如有问题，请查看：
- 浏览器控制台（前端错误）
- 终端日志（后端错误）
- MongoDB 日志

祝使用愉快！
