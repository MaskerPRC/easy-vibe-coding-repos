# 应用项目

这是一个基础的 Vue + Vite 应用项目，包含前端和后端，可以通过控制平台自动修改代码。

## 技术栈

### 前端
- Vue 3
- Vite
- 端口: 5173

### 后端
- Node.js
- Express
- 端口: 3002

## 项目结构

```
app-project/
├── src/              # 前端源代码
│   ├── App.vue
│   └── main.js
├── server/           # 后端源代码
│   └── index.js
├── package.json
├── vite.config.js
```

## 开发

### 本地开发

```bash
# 同时启动前端和后端
npm run dev

# 或者分别启动
npm run dev:frontend  # 前端：http://localhost:5173
npm run dev:backend   # 后端：http://localhost:3002
```

### API 接口

- `GET /api/health` - 健康检查
- `GET /api/data` - 获取数据
- `POST /api/data` - 更新数据
- `GET /api/config` - 获取配置

## Docker

```bash
docker-compose up app-project
```

## 数学挑战机制

本项目配置了代码提交前的数学验证机制。每次提交代码前需要回答一道大学专业数学题。

### 设置方法

1. 初始化Git仓库（如果还没有）：
```bash
git init
```

2. 安装Git Hooks：
```bash
npm run setup-hooks
```

3. 测试数学挑战：
```bash
node scripts/math-challenge.js
```

详细说明请查看 [MATH_CHALLENGE.md](./MATH_CHALLENGE.md)

## 注意事项

- 此项目必须是一个 git 仓库（Claude Code 的要求）
- 代码可以通过控制平台自动修改
- 运行在 dev 模式，支持热更新
- 前端通过 Vite 代理访问后端 API
- 提交代码前需要回答数学题（pre-commit hook）
