# JSpspy - JavaScript Spy Tool

这是一个强大的JavaScript API监控和拦截工具，用于跟踪和记录浏览器中的各种API调用。类似于JSpspy的功能，可以帮助开发者进行调试、安全测试和行为分析。

## 功能特性

### 核心功能

- **网络请求拦截**：监控Fetch API和XMLHttpRequest请求
- **存储操作监控**：跟踪LocalStorage和SessionStorage操作
- **Cookie监控**：记录所有Cookie的读写操作
- **控制台拦截**：捕获console.log/warn/error等输出
- **定时器监控**：跟踪setTimeout和setInterval调用
- **危险操作检测**：监控eval和Function构造器的使用

### UI特性

- **实时记录展示**：所有拦截的API调用实时显示
- **类型过滤**：按网络、存储、Cookie等类型筛选记录
- **搜索功能**：快速查找特定的API调用
- **统计面板**：显示Hook状态和记录统计
- **导出功能**：导出所有记录为JSON文件
- **测试工具**：内置测试按钮验证Hook功能

## 技术栈

### 前端
- Vue 3.3.4 - 渐进式JavaScript框架
- Vite 5.0.0 - 现代化构建工具
- 端口: 5173

### 后端
- Node.js + Express 4.18.2
- 端口: 3002
- 数据持久化: JSON文件存储

## 项目结构

```
app-project/
├── src/
│   ├── App.vue              # 主应用界面
│   ├── main.js              # 应用入口
│   └── utils/
│       └── jspspy.js        # Spy核心引擎
├── server/
│   ├── index.js             # Express服务器
│   └── spy-data.json        # Spy记录存储（自动生成）
├── package.json
├── vite.config.js
└── README.md
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
# 同时启动前端和后端
pnpm run dev

# 或者分别启动
pnpm run dev:frontend  # 前端: http://localhost:5173
pnpm run dev:backend   # 后端: http://localhost:3002
```

### 访问应用

打开浏览器访问：http://localhost:5173

## 使用指南

### 1. 启用Hook

在左侧控制面板中，点击开关启用需要监控的API：

- **Fetch API** - 监控现代fetch请求
- **XMLHttpRequest** - 监控传统AJAX请求
- **LocalStorage** - 监控本地存储操作
- **SessionStorage** - 监控会话存储操作
- **Cookie** - 监控Cookie操作
- **Console** - 拦截控制台输出
- **setTimeout/setInterval** - 监控定时器
- **eval/Function** - 检测危险操作

### 2. 查看记录

右侧记录面板会实时显示所有拦截的API调用，包括：

- 调用类型（网络/存储/Cookie等）
- 方法名称
- 详细参数和返回值
- 时间戳

### 3. 过滤和搜索

- 使用类型下拉框按类别筛选记录
- 在搜索框中输入关键词快速查找

### 4. 测试功能

点击底部测试按钮验证Hook功能：

- **测试Fetch** - 发送一个fetch请求
- **测试XHR** - 发送一个XMLHttpRequest请求
- **测试LocalStorage** - 执行存储操作
- **测试Cookie** - 读写Cookie
- **测试Console** - 输出控制台日志
- **测试Timer** - 创建定时器

### 5. 导出记录

点击顶部"导出记录"按钮，将所有spy记录下载为JSON文件。

### 6. 清空记录

点击"清空记录"按钮清除所有历史记录。

## API接口

### Spy API

- `GET /api/spy/records` - 获取所有spy记录
  - 参数: `type` (可选) - 按类型过滤
  - 参数: `limit` (可选) - 限制返回数量，默认1000

- `POST /api/spy/records` - 添加单条记录

- `POST /api/spy/records/batch` - 批量添加记录

- `DELETE /api/spy/records` - 清空所有记录

- `GET /api/spy/export` - 导出记录
  - 参数: `format` (可选) - 导出格式，默认json

- `GET /api/spy/stats` - 获取统计信息

- `POST /api/spy/save` - 手动保存记录到文件

### 通用API

- `GET /api/health` - 健康检查
- `GET /api/config` - 获取配置信息

## 编程式使用

### 在代码中使用JSpspy

```javascript
// 导入spy实例
import jspspy from './utils/jspspy.js';

// 启用特定hook
jspspy.enableHook('fetch');
jspspy.enableHook('localStorage');

// 启用所有hook
jspspy.enableAll();

// 禁用特定hook
jspspy.disableHook('console');

// 禁用所有hook
jspspy.disableAll();

// 获取记录
const records = jspspy.getRecords();

// 按类型获取记录
const networkRecords = jspspy.getRecords('network');

// 清空记录
jspspy.clearRecords();

// 导出记录
const jsonData = jspspy.exportRecords('json');

// 监听新记录
jspspy.addListener((record) => {
  console.log('新记录:', record);
});

// 获取hook状态
const status = jspspy.getStatus();
```

### 在浏览器控制台使用

JSpspy实例会自动挂载到window对象：

```javascript
// 全局访问
window.jspspy.enableAll();
window.jspspy.getRecords();
```

## 配置选项

### 最大记录数

默认最大记录数为10000条，可在`server/index.js`中修改：

```javascript
const MAX_RECORDS = 10000; // 修改此值
```

### 自动保存间隔

记录每5分钟自动保存一次，可在`server/index.js`中修改：

```javascript
setInterval(() => {
  if (spyRecords.length > 0) {
    saveSpyData();
  }
}, 5 * 60 * 1000); // 修改此值（毫秒）
```

## 安全说明

本工具设计用于：

- **开发调试** - 帮助开发者理解代码行为
- **安全测试** - 在授权范围内进行安全评估
- **教育目的** - 学习浏览器API工作原理

请勿用于：

- 未经授权的监控
- 恶意目的
- 侵犯隐私

## 注意事项

- Hook功能会影响性能，建议仅在开发环境使用
- 记录会占用内存，定期清理以避免内存溢出
- 某些网站可能有反调试机制，Hook可能失效
- 敏感数据（如密码、Token）会被记录，请注意安全

## 故障排除

### Hook不工作

1. 确保在页面加载前启用Hook
2. 检查是否有其他脚本冲突
3. 查看浏览器控制台是否有错误

### 记录丢失

1. 检查是否超过最大记录数限制
2. 确认后端服务正在运行
3. 检查数据文件是否有写入权限

### 性能问题

1. 减少启用的Hook数量
2. 定期清空记录
3. 增加最大记录数限制

## 开发

### 构建生产版本

```bash
pnpm run build
```

### 预览生产构建

```bash
pnpm run preview
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 致谢

本项目灵感来源于JSpspy，感谢原作者的贡献。
