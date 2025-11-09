# 主题系统使用指南

## 概述

本项目实现了一个完整的主题系统，支持亮色、暗色和自动三种模式，具有平滑的过渡动画和用户偏好保存功能。

## 功能特性

- ✅ 支持亮色/暗色/自动三种主题模式
- ✅ 平滑的主题切换过渡动画
- ✅ 用户偏好保存到 localStorage
- ✅ 完整的 CSS 变量颜色系统
- ✅ 自动模式根据系统主题自动切换
- ✅ 固定在右上角的主题切换按钮
- ✅ 响应式设计，支持移动端

## 文件结构

```
src/
├── composables/
│   └── useTheme.js          # 主题管理核心逻辑
├── components/
│   └── ThemeToggle.vue      # 主题切换按钮组件
└── App.vue                  # 全局样式和 CSS 变量定义
```

## 使用方法

### 1. 在组件中使用主题

```vue
<script setup>
import { useTheme } from '@/composables/useTheme';

const { themeMode, effectiveTheme, setThemeMode, THEME_MODES } = useTheme();

// 获取当前主题模式
console.log(themeMode.value); // 'light' | 'dark' | 'auto'

// 获取实际应用的主题（自动模式下会根据系统主题解析）
console.log(effectiveTheme.value); // 'light' | 'dark'

// 设置主题模式
setThemeMode(THEME_MODES.DARK);
</script>
```

### 2. 在样式中使用 CSS 变量

```vue
<style scoped>
.my-component {
  background: var(--theme-bg-primary);
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-border-primary);
}

.my-card {
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-card-border);
  box-shadow: var(--theme-shadow-md);
}

.my-button {
  background: var(--theme-primary);
  color: white;
}

.my-input {
  background: var(--theme-input-bg);
  border: 1px solid var(--theme-input-border);
  color: var(--theme-input-text);
}

.my-input:focus {
  border-color: var(--theme-input-border-focus);
}
</style>
```

### 3. 使用预定义的工具类

项目提供了一些预定义的工具类，可以直接使用：

```vue
<template>
  <!-- 卡片样式 -->
  <div class="card">
    <h2>卡片标题</h2>
    <p>卡片内容</p>
  </div>

  <!-- 主按钮样式 -->
  <button class="button-primary">点击我</button>

  <!-- 输入框样式 -->
  <input class="input" type="text" placeholder="请输入内容" />
</template>
```

## 可用的 CSS 变量

### 主色调
- `--theme-primary`: 主色
- `--theme-primary-dark`: 深色主色
- `--theme-primary-light`: 浅色主色

### 背景色
- `--theme-bg-primary`: 主背景色
- `--theme-bg-secondary`: 次要背景色
- `--theme-bg-tertiary`: 第三级背景色

### 文字颜色
- `--theme-text-primary`: 主文字颜色
- `--theme-text-secondary`: 次要文字颜色
- `--theme-text-tertiary`: 第三级文字颜色

### 边框颜色
- `--theme-border-primary`: 主边框颜色
- `--theme-border-secondary`: 次要边框颜色

### 阴影
- `--theme-shadow-sm`: 小阴影
- `--theme-shadow-md`: 中等阴影
- `--theme-shadow-lg`: 大阴影

### 状态颜色
- `--theme-success`: 成功状态
- `--theme-warning`: 警告状态
- `--theme-error`: 错误状态
- `--theme-info`: 信息状态

### 卡片样式
- `--theme-card-bg`: 卡片背景色
- `--theme-card-border`: 卡片边框色

### 输入框样式
- `--theme-input-bg`: 输入框背景色
- `--theme-input-border`: 输入框边框色
- `--theme-input-border-focus`: 输入框聚焦边框色
- `--theme-input-text`: 输入框文字颜色
- `--theme-input-placeholder`: 输入框占位符颜色

## API 参考

### useTheme()

返回主题相关的状态和方法：

#### 状态

- `themeMode`: 当前主题模式 ('light' | 'dark' | 'auto')
- `effectiveTheme`: 实际应用的主题 ('light' | 'dark')
- `systemPreference`: 系统主题偏好 ('light' | 'dark')

#### 计算属性

- `isLight`: 当前是否为亮色主题
- `isDark`: 当前是否为暗色主题
- `isAuto`: 当前是否为自动模式

#### 方法

- `setThemeMode(mode)`: 设置主题模式
- `cycleTheme()`: 循环切换主题模式（亮色 → 暗色 → 自动 → 亮色）
- `initTheme()`: 初始化主题（通常在 App.vue 中调用）

#### 常量

- `THEME_MODES.LIGHT`: 亮色模式
- `THEME_MODES.DARK`: 暗色模式
- `THEME_MODES.AUTO`: 自动模式

## 自定义主题

如果需要自定义主题颜色，可以在 `App.vue` 的 `<style>` 部分修改 CSS 变量：

```css
/* 在 App.vue 中修改 */
:root,
.theme-light {
  --theme-primary: #your-color;
  /* 修改其他变量... */
}

.theme-dark {
  --theme-primary: #your-dark-color;
  /* 修改其他变量... */
}
```

## 主题切换动画

所有颜色相关的 CSS 属性都会有 0.3 秒的平滑过渡动画，使用 `cubic-bezier(0.4, 0, 0.2, 1)` 缓动函数。

如果需要禁用某个元素的过渡动画：

```css
.no-transition {
  transition: none !important;
}
```

## localStorage 存储

用户的主题偏好会自动保存到 localStorage 中，键名为 `app-theme-preference`。

在下次访问时会自动加载保存的主题偏好。

## 浏览器兼容性

- 现代浏览器（Chrome、Firefox、Safari、Edge）完全支持
- 使用了 `matchMedia` API 监听系统主题变化
- CSS 变量和过渡动画在所有现代浏览器中都能正常工作
- 对于不支持的旧版浏览器，会降级到亮色主题

## 示例：创建一个使用主题的页面

```vue
<template>
  <div class="demo-page">
    <div class="card">
      <h1>欢迎使用主题系统</h1>
      <p>当前主题: {{ effectiveTheme }}</p>
      <p>主题模式: {{ themeMode }}</p>

      <div class="buttons">
        <button class="button-primary" @click="setThemeMode(THEME_MODES.LIGHT)">
          亮色主题
        </button>
        <button class="button-primary" @click="setThemeMode(THEME_MODES.DARK)">
          暗色主题
        </button>
        <button class="button-primary" @click="setThemeMode(THEME_MODES.AUTO)">
          自动模式
        </button>
      </div>

      <input class="input" type="text" placeholder="输入一些文字试试" />
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme';

const { themeMode, effectiveTheme, setThemeMode, THEME_MODES } = useTheme();
</script>

<style scoped>
.demo-page {
  padding: 40px;
  min-height: 100vh;
  background: var(--theme-bg-secondary);
}

.card {
  max-width: 600px;
  margin: 0 auto;
}

.buttons {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.input {
  width: 100%;
  margin-top: 20px;
}
</style>
```

## 故障排除

### 主题不切换

1. 检查是否在 `App.vue` 中正确初始化了主题
2. 确保浏览器控制台没有错误
3. 检查 localStorage 是否被禁用

### 样式没有应用

1. 确保使用了正确的 CSS 变量名
2. 检查元素是否被其他样式覆盖
3. 使用浏览器开发者工具检查计算后的样式

### 自动模式不工作

1. 检查浏览器是否支持 `matchMedia` API
2. 确保操作系统设置了主题偏好
3. 检查浏览器控制台是否有警告信息

## 最佳实践

1. **始终使用 CSS 变量**：不要硬编码颜色值，始终使用提供的 CSS 变量
2. **合理使用过渡动画**：对于频繁变化的元素，可以选择性禁用过渡
3. **测试两种主题**：确保在亮色和暗色主题下都能正常显示
4. **保持一致性**：使用统一的颜色变量，保持设计一致性
5. **移动端适配**：确保主题切换按钮在移动端也能正常使用

## 未来改进

- [ ] 支持自定义颜色主题
- [ ] 提供更多预设主题
- [ ] 支持主题配置导入/导出
- [ ] 添加主题预览功能
- [ ] 支持渐变色主题
