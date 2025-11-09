# WPS COM Bridge

WPS Office COM API 的 HTTP Bridge 服务。

## 功能特性

### Word 文档操作
- ✅ 获取文档内容
- ✅ 插入文本（开始/结束/替换）
- ✅ 查找与替换
- ✅ 段落格式化（对齐、行距、缩进）
- ✅ 字体格式（粗体、斜体、颜色、大小）
- ✅ 插入表格
- ✅ 标题样式 CRUD

### Excel 工作表操作
- ✅ 读取单元格/区域
- ✅ 写入单元格
- ✅ 读取单元格区域

### PowerPoint 幻灯片操作
- ✅ 获取演示文稿信息
- ✅ 添加幻灯片
- ✅ 添加文本框

## 安装

```bash
# 安装依赖
pip install -r requirements.txt
```

## 运行

```bash
# 启动 Flask 服务（端口 23334）
python app.py
```

## API 端点

### 健康检查
```
GET /health
```

### WPS 检测
```
GET /api/wps/detect
```

### Word API
```
GET  /api/wps/word/get-content          # 获取文档内容
POST /api/wps/word/insert-text          # 插入文本
POST /api/wps/word/find-replace         # 查找替换
POST /api/wps/word/format-paragraph     # 段落格式
POST /api/wps/word/format-font          # 字体格式
POST /api/wps/word/insert-table         # 插入表格
GET  /api/wps/word/heading-styles       # 获取标题样式
POST /api/wps/word/apply-heading        # 应用标题样式
```

### Excel API
```
POST /api/wps/excel/get-cell            # 读取单元格
POST /api/wps/excel/set-cell            # 写入单元格
POST /api/wps/excel/get-range           # 读取区域
```

### PowerPoint API
```
GET  /api/wps/powerpoint/get-info       # 获取信息
POST /api/wps/powerpoint/add-slide      # 添加幻灯片
POST /api/wps/powerpoint/add-textbox    # 添加文本框
```

## 技术架构

```
前端 (Vue/React)
    ↓ HTTP (localhost:5173/api/wps/*)
Express 后端 (localhost:3002)
    ↓ HTTP (localhost:23334)
Python Flask WPS Bridge
    ↓ COM API
WPS Office Desktop
```

## 注意事项

1. **Windows 专用** - 使用 COM API 需要 Windows 系统
2. **WPS 必须安装** - 需要安装 WPS Office（抢鲜版推荐）
3. **Python 环境** - 需要 Python 3.9+
4. **文档必须打开** - 操作前需要在 WPS 中打开对应文档
