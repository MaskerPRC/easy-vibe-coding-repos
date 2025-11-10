# 屏幕分享平台

一个基于 Vue 3 + Express 的多人实时屏幕分享平台。

## 功能特点

### 核心功能
- ✅ **使用 getDisplayMedia() API** - 标准的 Web API 获取屏幕内容
- ✅ **Canvas 图像转换** - 通过 Canvas 将视频流转换为图像数据
- ✅ **服务器上传** - 将截图上传到后端服务器
- ✅ **多用户支持** - 支持多个用户同时上传和查看截图
- ✅ **实时刷新** - 自动刷新显示其他用户上传的截图
- ✅ **响应式设计** - 支持桌面和移动设备

### 技术实现

#### 前端 (Vue 3)
- **getDisplayMedia()** - 请求屏幕捕获权限
- **Canvas API** - 将视频帧转换为图像
- **Base64 编码** - 将图像转换为可传输格式
- **Axios** - HTTP 请求库
- **自动刷新** - 每10秒自动获取最新截图

#### 后端 (Express)
- **RESTful API** - 标准的 REST 接口
- **内存存储** - 截图存储在内存中（最多100张）
- **CORS 支持** - 支持跨域请求
- **大文件支持** - 支持最大50MB的数据传输

## API 接口

### 1. 上传截图
```
POST /api/screenshots/upload
Content-Type: application/json

{
  "imageData": "data:image/png;base64,...",
  "username": "用户名"
}
```

### 2. 获取截图列表
```
GET /api/screenshots/list?limit=50&offset=0
```

### 3. 删除截图
```
DELETE /api/screenshots/:id
```

### 4. 清空所有截图
```
POST /api/screenshots/clear
```

### 5. 健康检查
```
GET /api/health
```

## 项目结构

```
app-project/
├── server/
│   └── index.js              # Express 后端服务器
├── src/
│   ├── components/
│   │   └── ScreenCapture.vue # 屏幕捕获组件
│   ├── App.vue               # 主应用组件
│   └── main.js               # 入口文件
├── index.html                # HTML 入口
├── vite.config.js            # Vite 配置
└── package.json              # 项目配置
```

## 运行项目

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动开发服务器
```bash
pnpm run dev
```

这将同时启动：
- 前端开发服务器：http://localhost:5173
- 后端 API 服务器：http://localhost:3002

### 3. 访问应用
在浏览器中打开：http://localhost:5173

## 使用说明

### 捕获屏幕
1. 在"输入你的名字"框中输入你的名字
2. 点击"📸 捕获屏幕"按钮
3. 在浏览器弹出的对话框中选择要分享的屏幕/窗口/标签页
4. 点击"分享"按钮
5. 截图将自动上传并显示在页面中

### 查看截图
- 所有用户上传的截图会以网格形式展示
- 点击任意截图可以全屏查看
- 页面每10秒自动刷新，展示最新上传的截图

### 管理截图
- 点击截图右上角的 🔍 图标查看大图
- 点击 ✕ 图标删除单张截图
- 点击"🗑️ 清空全部"按钮删除所有截图
- 点击"🔄 刷新"按钮手动刷新列表

## 浏览器兼容性

此应用需要浏览器支持 `getDisplayMedia()` API：

- ✅ Chrome/Edge 72+
- ✅ Firefox 66+
- ✅ Safari 13+
- ✅ Opera 60+

**注意**：出于安全考虑，`getDisplayMedia()` 只能在 HTTPS 或 localhost 环境下使用。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **后端框架**: Express 4
- **HTTP 客户端**: Axios
- **进程管理**: Concurrently
- **样式**: 原生 CSS (Scoped)

## 配置说明

### 端口配置
- 前端端口: `5173` (在 vite.config.js 中配置)
- 后端端口: `3002` (在 server/index.js 中配置)

### 代理配置
前端通过 Vite 代理访问后端 API：
```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:3002',
    changeOrigin: true
  }
}
```

### 截图限制
- 最大存储数量: 100 张
- 图片质量: 0.8 (PNG 格式)
- 最大上传大小: 50MB
- 理想分辨率: 1920x1080

## 注意事项

1. **HTTPS 要求**: 在生产环境中，必须使用 HTTPS 才能使用屏幕捕获功能
2. **内存存储**: 截图存储在服务器内存中，重启服务器后会丢失
3. **性能考虑**: 大量高分辨率截图会占用较多内存
4. **隐私保护**: 用户应注意不要分享包含敏感信息的屏幕内容

## 开发计划

- [ ] 添加截图持久化存储（数据库/文件系统）
- [ ] 添加用户认证和权限管理
- [ ] 支持截图标注和编辑
- [ ] 添加实时通知功能
- [ ] 支持截图下载
- [ ] 添加截图搜索和过滤

## 许可证

仅供学习和开发使用。
