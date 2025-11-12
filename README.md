# MVP - 自然语言驱动站点即时改造

这是一个安全的、功能保守的MVP项目，允许用户通过自然语言即时改造网站的显示层元素。

## 核心特性

- ✨ **自然语言交互**：用户用中文描述需求，系统自动解析并应用
- 🔒 **安全第一**：白名单机制、黑名单过滤、敏感信息脱敏
- ⏰ **会话隔离**：变更仅对当前会话生效，15分钟后自动恢复
- 🔄 **一键撤销**：支持一步撤销，快速恢复初始状态
- 📊 **审计日志**：完整记录所有操作，便于安全审查
- 🚫 **频率限制**：IP和会话级别的频控，自动封禁异常行为

## 允许的操作（仅3类）

### 1. 文案替换
- 主标题（#hero-title）
- 副标题（#sub-title）
- 文本长度限制：≤40字符

### 2. 主题色切换
- 蓝色（blue）：#4a90e2
- 绿色（green）：#10b981
- 琥珀色（amber）：#eab308

### 3. 组件显隐
- 促销条（.promo-banner）：显示/隐藏

## 技术栈

### 前端
- **框架**：Vue 3 (Composition API)
- **构建工具**：Vite 5
- **路由**：Vue Router 4
- **安全**：CSP、XSS防护、HTML实体转义

### 后端
- **运行时**：Node.js
- **框架**：Express 4
- **存储**：内存存储（Map）- 适配Vercel等无服务器环境
- **安全**：文本审查、DSL校验、频率限制、封禁机制

## 项目结构

```
app-project/
├── server/                      # 后端代码
│   ├── index.js                # 主服务入口，API路由
│   ├── intentParser.js         # 意图解析器（自然语言→DSL）
│   ├── securityValidator.js    # 安全校验器（文本审查+DSL策略）
│   ├── sessionManager.js       # 会话管理器（内存存储）
│   ├── rateLimiter.js          # 频率限制器（IP+会话）
│   └── auditLogger.js          # 审计日志器（内存存储+脱敏）
│
├── src/                         # 前端代码
│   ├── components/
│   │   └── TransformWidget.vue # 右下角交互浮窗
│   ├── views/
│   │   └── AdminPage.vue       # 管理端页面
│   ├── utils/
│   │   ├── transformExecutor.js # 前端执行器（安全DOM操作+TTL）
│   │   └── mvpApi.js           # API客户端
│   ├── router/
│   │   └── index.js            # 路由配置
│   ├── App.vue                 # 主应用组件（首页）
│   └── main.js                 # 入口文件
│
├── index.html                   # HTML模板（含CSP）
├── vite.config.js              # Vite配置（代理设置）
├── package.json                # 依赖配置
├── TEST_CASES.md               # 测试用例文档
└── README.md                   # 本文件
```

## API接口

### 用户端API

#### POST /api/mvp/compile
编译自然语言为DSL。

**请求**：
```json
{
  "text": "把主标题改成：周末狂欢",
  "session_id": "sess_xxx"
}
```

**响应**：
```json
{
  "request_id": "req_xxx",
  "status": "ok",
  "data": {
    "dsl": {
      "version": "0.1",
      "changes": [...]
    },
    "preview_patch": [...],
    "preview_hash": "xxx",
    "warnings": []
  }
}
```

#### POST /api/mvp/apply
应用变更。

**请求**：
```json
{
  "session_id": "sess_xxx",
  "dsl": {...},
  "preview_hash": "xxx"
}
```

#### POST /api/mvp/undo
撤销变更。

**请求**：
```json
{
  "session_id": "sess_xxx"
}
```

### 管理端API

#### GET /api/mvp/admin/audit
获取审计日志（最多200条）。

#### POST /api/mvp/admin/ban
封禁IP或会话。

**请求**：
```json
{
  "ip_or_session": "xxx"
}
```

#### POST /api/mvp/admin/unban
解封IP或会话。

## 运行项目

### 环境要求
- Node.js >= 16
- pnpm >= 8

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
# 同时启动前后端
pnpm run dev

# 或分别启动
pnpm run dev:frontend  # 前端: http://localhost:5173
pnpm run dev:backend   # 后端: http://localhost:3002
```

### 生产构建
```bash
pnpm run build
```

### 预览生产版本
```bash
pnpm run preview
```

## 使用示例

### 1. 修改主标题
在右下角浮窗输入：
```
把主标题改成：双十一狂欢节
```

### 2. 切换主题色
```
主题色改为绿色
```

### 3. 隐藏促销条
```
隐藏促销条
```

### 4. 组合示例
先修改标题：
```
把主标题改成：新年快乐
```
应用后，再切换主题：
```
主题色改为琥珀色
```

## 安全机制

### 1. 文本审查
- **危险命令词黑名单**：`reboot`, `shutdown`, `rm -rf`, `<script>`, `eval`, etc.
- **敏感信息脱敏**：手机号、邮箱、身份证号、API Key → `***`
- **违规内容过滤**：暴力、色情、仇恨、非法等关键词

### 2. DSL策略校验
- **白名单选择器**：仅允许 `#hero-title`, `#sub-title`, `.promo-banner`, `:root`, `body`
- **白名单操作**：仅允许 `set_text`, `set_style_var`, `toggle`
- **白名单值域**：颜色仅限 `blue`, `green`, `amber`
- **长度限制**：文本 ≤40字符，单次变更 ≤5项

### 3. 前端防护
- **HTML实体转义**：所有用户输入通过 `textContent` 设置，不使用 `innerHTML`
- **CSP策略**：禁止外部脚本、内联事件处理器
- **禁止eval**：不使用 `eval()` 或 `new Function()`

### 4. 频率控制
- **IP限制**：10次/分钟
- **会话限制**：6次/分钟
- **自动封禁**：超限后自动封禁60分钟

### 5. 会话隔离
- **TTL**：15分钟后自动恢复
- **localStorage**：仅存储当前会话变更
- **定期检查**：每分钟检查一次过期

## 管理端

访问：http://localhost:5173/admin

功能：
- 📊 实时统计（总请求、拒绝、错误）
- 📜 审计日志查看（过滤、详情）
- 🚫 封禁/解封操作

**注意**：MVP版本没有身份验证，生产环境需添加认证。

## 测试

详细测试用例请参考 [TEST_CASES.md](./TEST_CASES.md)

### 必过测试（9项）
1. ✅ 规则命中拒绝（危险命令、敏感信息）
2. ✅ 越权选择器拒绝
3. ✅ 值域越界拒绝
4. ✅ 长度越界拒绝
5. ✅ 撤销功能
6. ✅ 过期恢复（15分钟TTL）
7. ✅ 频控机制（IP+会话）
8. ✅ 完整功能流程
9. ✅ 管理端功能

## 限制与非目标（MVP不支持）

- ❌ 任意HTML/CSS注入
- ❌ 外部资源加载
- ❌ 新组件生成
- ❌ 布局重排
- ❌ 后端数据读写
- ❌ 多语言切换
- ❌ 用户登录
- ❌ 变更历史（仅支持一步撤销）
- ❌ 分享功能
- ❌ 持久化存储（数据在内存中，重启清空）

## 部署说明

### Vercel/Netlify等平台
由于使用内存存储，适合无服务器环境部署。但需注意：
- 审计日志和会话数据在重启后清空
- 频率限制计数器在重启后重置
- 建议添加外部日志服务（如：Sentry、LogRocket）

### 传统服务器
可以直接部署，但建议：
- 使用PM2等进程管理器
- 配置Nginx反向代理
- 启用HTTPS

## 监控指标

系统自动记录以下指标：
- 总请求数
- 请求类型分布（compile/apply/undo）
- 状态分布（success/error/rejected）
- 最近1小时的错误和拒绝数
- 封禁数量

访问管理端查看实时统计。

## 许可证

本项目为演示项目，仅供学习参考。

## 联系方式

如有问题，请提交Issue或联系开发团队。
