# WPS COM Bridge Service

Python Flask 服务，提供 HTTP API 接口用于操作 WPS Office (Word, Excel, PowerPoint)。

## 功能特性

### WPS Word
- 获取文档内容
- 插入文本（开始/结束/替换）
- 查找与替换
- 段落格式化（对齐、行距、缩进）
- 字体格式化（名称、大小、粗体、斜体、颜色）
- 插入表格

### WPS Excel
- 读取单元格
- 写入单元格
- 读取区域

### WPS PowerPoint
- 获取幻灯片信息
- 添加幻灯片
- 添加文本框

## 安装

```bash
cd packages/wps-bridge
pip install -r requirements.txt
```

## 运行

```bash
python app.py
```

服务将在 `http://localhost:23334` 启动。

## API 端点

### 基础端点

- `GET /health` - 健康检查
- `GET /api/wps/check` - 检查 WPS 应用是否可用

### Word 端点

- `GET /api/wps/word/get-content` - 获取文档内容
- `POST /api/wps/word/insert-text` - 插入文本
- `POST /api/wps/word/find-replace` - 查找替换
- `POST /api/wps/word/format-paragraph` - 格式化段落
- `POST /api/wps/word/format-font` - 格式化字体
- `POST /api/wps/word/insert-table` - 插入表格

### Excel 端点

- `POST /api/wps/excel/read-cell` - 读取单元格
- `POST /api/wps/excel/write-cell` - 写入单元格
- `POST /api/wps/excel/read-range` - 读取区域

### PowerPoint 端点

- `GET /api/wps/powerpoint/get-slides` - 获取幻灯片信息
- `POST /api/wps/powerpoint/add-slide` - 添加幻灯片
- `POST /api/wps/powerpoint/add-textbox` - 添加文本框

## 环境要求

- Python 3.9+
- WPS Office (Windows)
- Windows 操作系统
