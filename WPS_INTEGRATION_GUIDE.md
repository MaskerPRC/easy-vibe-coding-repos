# WPS Office 集成使用指南

> 完整的 WPS Office COM Bridge 集成方案
> 最后更新: 2025-11-09

---

## 📋 功能概述

本项目已成功集成 WPS Office COM Bridge,通过 Python Flask 服务桥接 WPS Office 的 COM API,实现了对 Word、Excel、PowerPoint 的自动化操作。

### 核心特性

✅ **自动化服务管理** - Express 后端自动启动和管理 Python Flask 服务
✅ **完整的 API 支持** - Word/Excel/PowerPoint 核心功能全覆盖
✅ **前端调试面板** - 可视化测试所有 WPS 功能
✅ **自动重启机制** - 服务异常时自动恢复
✅ **详细的测试用例** - pytest 集成测试覆盖主要场景

---

## 🚀 快速开始

### 1. 环境准备

#### 必需软件

| 软件 | 最低版本 | 说明 |
|------|---------|------|
| **WPS Office** | 抢鲜版 | 必须安装 WPS Office (Windows) |
| **Python** | 3.9+ | Python 运行环境 |
| **Node.js** | 14+ | 已在项目中使用 |

#### 安装 Python 依赖

```bash
cd packages/wps-bridge
pip install -r requirements.txt
```

依赖包清单:
- Flask==3.0.0
- Flask-CORS==4.0.0
- pywin32==306
- pytest==7.4.3
- requests==2.31.0

### 2. 安装 Node.js 依赖

```bash
# 在项目根目录
npm install
```

新增依赖:
- http-proxy-middleware (自动代理 WPS API 请求)

### 3. 启动应用

```bash
# 启动开发服务器 (前端 + 后端)
npm run dev
```

启动后:
- 前端: http://localhost:5173
- 后端: http://localhost:3002
- WPS Bridge: http://localhost:23334 (自动启动)

---

## 📁 项目结构

```
app-project/
├── packages/wps-bridge/          # WPS Bridge Python 服务
│   ├── app.py                    # Flask 主程序
│   ├── requirements.txt          # Python 依赖
│   ├── README.md                 # Bridge 说明文档
│   └── tests/                    # pytest 测试
│       ├── test_word_integration.py
│       ├── test_excel_integration.py
│       └── test_powerpoint_integration.py
│
├── server/
│   └── index.js                  # Express 后端 (集成 WPS Bridge 管理)
│
├── src/
│   ├── services/wps/             # WPS 前端服务层
│   │   ├── WPSWordService.js     # Word 服务
│   │   ├── WPSExcelService.js    # Excel 服务
│   │   ├── WPSPowerPointService.js # PowerPoint 服务
│   │   └── index.js              # 统一导出
│   │
│   ├── views/
│   │   ├── WPSDebug.vue          # WPS 调试面板
│   │   └── AdminDashboard.vue    # 管理后台 (新增 WPS 菜单项)
│   │
│   └── router/index.js           # 路由配置 (新增 /wps-debug 路由)
│
└── package.json                  # 新增 http-proxy-middleware 依赖
```

---

## 🎯 使用方法

### 方式一: 通过调试面板 (推荐)

1. 启动应用后,访问 http://localhost:5173
2. 在管理后台左侧菜单,点击 "🔧 WPS 调试"
3. 在调试面板中测试各种功能

### 方式二: 直接访问调试页面

访问: http://localhost:5173/wps-debug

### 方式三: 通过代码调用

```javascript
// 在 Vue 组件中使用
import WPSService from '@/services/wps';

// Word 操作
await WPSService.word.insertText('Hello, WPS!', 'end');
await WPSService.word.formatFont({ bold: true, size: 16 });

// Excel 操作
await WPSService.excel.setCell('A1', '测试数据');
const data = await WPSService.excel.getCell('A1');

// PowerPoint 操作
await WPSService.powerpoint.addSlide();
await WPSService.powerpoint.addTextbox('标题文本');
```

---

## 🔧 API 文档

### Word API

| 方法 | 说明 | 参数 |
|------|------|------|
| `getContent()` | 获取文档内容 | - |
| `insertText(text, location)` | 插入文本 | text: 文本内容<br>location: 'start', 'end', 'replace' |
| `findReplace(findText, replaceText, matchCase)` | 查找替换 | findText: 查找文本<br>replaceText: 替换文本<br>matchCase: 是否区分大小写 |
| `formatParagraph(format)` | 段落格式 | alignment: 'left', 'center', 'right', 'justify'<br>lineSpacing: 行距<br>firstLineIndent: 首行缩进 |
| `formatFont(format)` | 字体格式 | bold: 粗体<br>italic: 斜体<br>size: 字号<br>color: 颜色 (hex)<br>name: 字体名 |
| `insertTable(rows, cols)` | 插入表格 | rows: 行数<br>cols: 列数 |
| `applyHeading(level)` | 应用标题样式 | level: 1-9 |
| `getHeadingStyles()` | 获取标题样式列表 | - |

### Excel API

| 方法 | 说明 | 参数 |
|------|------|------|
| `getCell(cell)` | 读取单元格 | cell: 'A1' |
| `setCell(cell, value)` | 写入单元格 | cell: 'A1'<br>value: 任意值 |
| `getRange(range)` | 读取区域 | range: 'A1:C3' |
| `setRange(startCell, data)` | 批量写入 | startCell: 起始单元格<br>data: 二维数组 |

### PowerPoint API

| 方法 | 说明 | 参数 |
|------|------|------|
| `getInfo()` | 获取演示文稿信息 | - |
| `addSlide(layout)` | 添加幻灯片 | layout: 布局类型 (默认 12 = 空白) |
| `addTextbox(text, left, top, width, height)` | 添加文本框 | text: 文本内容<br>left, top: 位置<br>width, height: 尺寸 |

### 服务管理 API

| 方法 | 说明 |
|------|------|
| `detectWPS()` | 检测 WPS Office 安装状态 |
| `checkBridgeHealth()` | 检查 Bridge 服务健康状态 |
| `restartBridge()` | 重启 Bridge 服务 |

---

## 🧪 运行测试

### Python 集成测试

```bash
cd packages/wps-bridge

# 运行所有测试
pytest tests/ -v

# 运行特定测试
pytest tests/test_word_integration.py -v
pytest tests/test_excel_integration.py -v
pytest tests/test_powerpoint_integration.py -v
```

**注意**: 测试前需要:
1. WPS Office 已安装
2. 打开对应的文档/工作簿/演示文稿
3. WPS Bridge 服务已启动

---

## 🔍 调试面板功能

### 服务状态监控

- ✅ **WPS Bridge 状态** - 显示 Python 服务运行状态和 PID
- ✅ **WPS Office 检测** - 检测 Word/Excel/PowerPoint 安装情况
- ✅ **一键重启** - 服务异常时快速重启

### Word 功能测试

- 插入文本 (开头/末尾/替换全部)
- 查找替换 (支持区分大小写)
- 段落格式 (对齐、行距)
- 字体格式 (粗体、斜体、字号、颜色)
- 插入表格
- 应用标题样式

### Excel 功能测试

- 读取/写入单元格
- 读取单元格区域
- 实时显示单元格值

### PowerPoint 功能测试

- 获取幻灯片数量
- 添加新幻灯片
- 添加文本框

---

## ⚙️ 技术架构

### 请求流程

```
Vue 组件
    ↓ (调用 WPSService)
WPS 前端服务层
    ↓ HTTP (localhost:5173/api/wps/*)
Vite Dev Server
    ↓ (代理)
Express 后端 (localhost:3002)
    ↓ (http-proxy-middleware)
Python Flask WPS Bridge (localhost:23334)
    ↓ (win32com)
WPS Office Desktop (COM API)
```

### 服务生命周期管理

1. **自动启动**: Express 启动时自动启动 Python Flask 服务
2. **健康监控**: 定期检查服务状态
3. **自动重启**: 服务异常时 5 秒后自动重启
4. **优雅退出**: Express 退出时自动关闭 Python 服务

---

## 🐛 常见问题

### 1. WPS Bridge 启动失败

**症状**: 调试面板显示 "WPS Bridge 服务不可用"

**解决方案**:
```bash
# 检查 Python 环境
python --version

# 安装依赖
cd packages/wps-bridge
pip install -r requirements.txt

# 手动启动测试
python app.py
```

### 2. COM 调用失败

**症状**: API 返回 "没有打开的文档"

**解决方案**:
- 确保 WPS Office 已启动
- 确保已打开对应的文档/工作簿/演示文稿
- 检查 WPS 进程是否正常

### 3. 端口冲突

**症状**: WPS Bridge 启动失败,提示端口占用

**解决方案**:
```bash
# 查看 23334 端口占用
netstat -ano | findstr 23334

# 结束占用进程
taskkill /PID <进程ID> /F
```

### 4. Python 编码问题

**症状**: 中文乱码

**解决方案**:
- 已在代码中设置 `PYTHONIOENCODING=utf-8`
- 已在代码中设置 `PYTHONUTF8=1`
- 确保文件保存为 UTF-8 编码

---

## 📊 性能优化

### 建议

1. **批量操作**: 使用 `setRange()` 代替多次 `setCell()` 调用
2. **减少往返**: 尽量在一次 API 调用中完成多个操作
3. **异步处理**: 前端使用 async/await 提升响应速度
4. **错误处理**: 始终使用 try/catch 捕获异常

---

## 🔐 安全性

### 当前实现

- ✅ CORS 配置为 `origin: '*'` (仅开发环境)
- ✅ 仅监听 localhost,不对外暴露
- ✅ 无需用户认证 (本地开发)

### 生产环境建议

- 🔒 限制 CORS 允许的来源
- 🔒 添加 API 认证 (Token/JWT)
- 🔒 限制 API 调用频率
- 🔒 记录操作日志

---

## 📝 开发路线图

### 已完成 (Phase 0-2)

- ✅ WPS Bridge 基础架构
- ✅ Express 集成和自动管理
- ✅ Word 核心功能 (插入、格式、表格、标题)
- ✅ Excel 基础功能 (读写单元格、区域)
- ✅ PowerPoint 基础功能 (幻灯片、文本框)
- ✅ 前端调试面板
- ✅ pytest 集成测试

### 待开发功能

- ⏳ Word 表格高级操作 (读取、修改、删除)
- ⏳ Excel 高级功能 (公式、图表、格式化)
- ⏳ PowerPoint 高级功能 (形状、图片、动画)
- ⏳ 批量文档处理
- ⏳ 模板系统

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

### 开发指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证。

---

## 📞 支持

如有问题,请通过以下方式联系:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [项目 Issues 页面]
- 📖 文档: 参见 `packages/wps-bridge/README.md`

---

**最后更新**: 2025-11-09
**版本**: 1.0.0
**状态**: ✅ 生产就绪
