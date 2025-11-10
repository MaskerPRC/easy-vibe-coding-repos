# 项目检测功能说明

## 功能概述

项目检测功能是一个全面的健康检查工具，用于检测 JSpspy 项目的运行状态和各个组件的健康状况。

## 功能特性

### 1. 前端状态检测
- **Vue 运行环境**: 检测 Vue 框架是否正常加载
- **JSpspy 核心引擎**: 检测 JSpspy 核心库是否可用
- **浏览器 API 支持**: 检测必要的浏览器 API（fetch, XHR, localStorage 等）

### 2. 后端连接检测
- **服务器健康检查**: 检测后端服务器是否运行正常
- **API 接口可用性**: 检测主要 API 端点是否可访问
- **数据存储功能**: 检测数据持久化功能是否正常

### 3. Hook 功能检测
- **Fetch Hook**: 检测 Fetch API 拦截功能状态
- **XHR Hook**: 检测 XMLHttpRequest 拦截功能状态
- **Storage Hook**: 检测本地存储拦截功能状态
- **Cookie Hook**: 检测 Cookie 拦截功能状态

### 4. 性能指标
- **响应时间**: 测量服务器响应速度
- **内存使用**: 显示当前内存使用情况
- **检测耗时**: 显示完整检测流程耗时

### 5. 详细日志
- 实时显示检测过程
- 记录所有检测步骤和结果
- 支持不同日志级别（info, success, warning, error）

## 使用方法

### 访问项目检测
1. 打开 JSpspy 应用（http://localhost:5173）
2. 点击顶部导航栏中的 "📊 项目检测" 按钮
3. 自动开始检测，或点击 "开始检测" 按钮手动触发

### 查看检测结果
- **整体状态**: 显示项目整体健康状况（正常/警告/错误）
- **分类检测**: 查看各个模块的详细检测结果
- **日志记录**: 查看详细的检测日志

### 状态指示
- ✅ (绿色) - 功能正常
- ⚠️ (黄色) - 警告，功能可能受限
- ❌ (红色) - 错误，功能不可用
- ⏳ (灰色) - 等待检测

## API 端点

### 后端检测 API
**端点**: `GET /api/project/detect`

**响应示例**:
```json
{
  "success": true,
  "timestamp": "2025-11-10T12:00:00.000Z",
  "server": {
    "status": "running",
    "port": 3002,
    "uptime": 3600,
    "memory": {...}
  },
  "data": {
    "totalRecords": 100,
    "maxRecords": 10000,
    "dataFileExists": true,
    "dataFilePath": "/app/app-project/server/spy-data.json"
  },
  "features": {
    "apiEndpoints": [...],
    "hooks": [...]
  },
  "health": {
    "status": "healthy",
    "checks": {...}
  }
}
```

## 文件变更

### 新增文件
- `src/components/ProjectDetector.vue` - 项目检测 UI 组件

### 修改文件
- `server/index.js` - 添加项目检测 API（`/api/project/detect`）
- `src/App.vue` - 集成项目检测视图切换功能

## 技术实现

### 前端技术
- Vue 3 Composition API
- Axios HTTP 客户端
- 响应式数据绑定
- 实时状态更新

### 后端技术
- Express.js 路由
- Node.js 性能监控 API
- 文件系统检查
- 健康状态评估

## 自动检测

项目检测组件会在加载后 500ms 自动执行一次检测，确保用户能立即看到项目状态。

## 响应式设计

支持桌面端和移动端显示：
- 桌面端：网格布局，多列显示
- 移动端：堆叠布局，单列显示

## 未来扩展

可能的功能扩展：
- [ ] 定期自动检测
- [ ] 历史检测记录
- [ ] 性能趋势图表
- [ ] 问题诊断建议
- [ ] 一键修复常见问题
