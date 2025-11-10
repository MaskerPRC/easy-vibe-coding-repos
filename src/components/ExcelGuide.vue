<template>
  <div class="excel-guide">
    <div class="guide-header">
      <h2>📊 Excel 初学者学习指南</h2>
      <p class="subtitle">从零开始，掌握 Excel 的核心功能</p>
    </div>

    <div class="guide-content">
      <!-- 侧边栏导航 -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <button
            v-for="section in sections"
            :key="section.id"
            :class="['nav-item', { active: currentSection === section.id }]"
            @click="currentSection = section.id"
          >
            <span class="icon">{{ section.icon }}</span>
            <span class="text">{{ section.title }}</span>
          </button>
        </nav>

        <div class="progress-section">
          <h4>学习进度</h4>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="progress-text">{{ completedCount }}/{{ sections.length }} 章节已完成</p>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 章节1: Excel简介 -->
        <div v-if="currentSection === 'intro'" class="section">
          <h3>🎯 什么是 Excel？</h3>
          <div class="content-block">
            <p>Microsoft Excel 是一款强大的电子表格软件，广泛应用于数据处理、分析和可视化。</p>
            <div class="feature-grid">
              <div class="feature-card">
                <div class="feature-icon">📝</div>
                <h4>数据管理</h4>
                <p>高效管理和组织大量数据</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🧮</div>
                <h4>计算功能</h4>
                <p>强大的公式和函数系统</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📈</div>
                <h4>数据可视化</h4>
                <p>创建各种图表和图形</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🔍</div>
                <h4>数据分析</h4>
                <p>筛选、排序和透视表</p>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h4>Excel 的主要组成部分</h4>
            <ul class="styled-list">
              <li><strong>工作簿 (Workbook)：</strong>Excel 文件，可包含多个工作表</li>
              <li><strong>工作表 (Worksheet)：</strong>由行和列组成的表格</li>
              <li><strong>单元格 (Cell)：</strong>工作表中的最小单位，由列字母和行号标识（如 A1）</li>
              <li><strong>功能区 (Ribbon)：</strong>顶部的工具栏，包含各种命令和功能</li>
            </ul>
          </div>
        </div>

        <!-- 章节2: 基本操作 -->
        <div v-if="currentSection === 'basics'" class="section">
          <h3>⌨️ 基本操作</h3>

          <div class="content-block">
            <h4>1. 选择单元格</h4>
            <div class="tips-box">
              <p><strong>单个单元格：</strong>直接点击</p>
              <p><strong>连续区域：</strong>点击并拖动，或使用 Shift + 方向键</p>
              <p><strong>多个单元格：</strong>按住 Ctrl 键点击</p>
              <p><strong>整行/整列：</strong>点击行号或列字母</p>
            </div>
          </div>

          <div class="content-block">
            <h4>2. 输入数据</h4>
            <ul class="styled-list">
              <li>点击单元格后直接输入</li>
              <li>输入完成后按 <kbd>Enter</kbd> 移到下一行</li>
              <li>按 <kbd>Tab</kbd> 移到下一列</li>
              <li>按 <kbd>Esc</kbd> 取消输入</li>
            </ul>
          </div>

          <div class="content-block">
            <h4>3. 编辑数据</h4>
            <div class="tips-box">
              <p><strong>双击单元格</strong> 或按 <kbd>F2</kbd> 进入编辑模式</p>
              <p><strong>复制：</strong><kbd>Ctrl + C</kbd></p>
              <p><strong>粘贴：</strong><kbd>Ctrl + V</kbd></p>
              <p><strong>剪切：</strong><kbd>Ctrl + X</kbd></p>
              <p><strong>撤销：</strong><kbd>Ctrl + Z</kbd></p>
              <p><strong>重做：</strong><kbd>Ctrl + Y</kbd></p>
            </div>
          </div>

          <div class="content-block">
            <h4>4. 自动填充</h4>
            <p>Excel 的自动填充功能可以帮你快速填充数据：</p>
            <ul class="styled-list">
              <li>输入数字序列（如 1, 2），选中后拖动填充柄，自动生成 3, 4, 5...</li>
              <li>输入日期，拖动填充柄自动生成连续日期</li>
              <li>输入文本加数字（如"产品1"），拖动生成"产品2"、"产品3"...</li>
            </ul>
          </div>
        </div>

        <!-- 章节3: 公式和函数 -->
        <div v-if="currentSection === 'formulas'" class="section">
          <h3>🔢 公式和函数</h3>

          <div class="content-block">
            <h4>公式基础</h4>
            <p>所有公式都以 <kbd>=</kbd> 开头，例如：</p>
            <div class="code-example">
              <code>=A1+B1</code>  将 A1 和 B1 单元格的值相加
            </div>
            <div class="code-example">
              <code>=A1*B1</code>  将 A1 和 B1 单元格的值相乘
            </div>
          </div>

          <div class="content-block">
            <h4>常用运算符</h4>
            <div class="operator-grid">
              <div class="operator-item">
                <span class="op">+</span>
                <span>加法</span>
              </div>
              <div class="operator-item">
                <span class="op">-</span>
                <span>减法</span>
              </div>
              <div class="operator-item">
                <span class="op">*</span>
                <span>乘法</span>
              </div>
              <div class="operator-item">
                <span class="op">/</span>
                <span>除法</span>
              </div>
              <div class="operator-item">
                <span class="op">^</span>
                <span>幂运算</span>
              </div>
              <div class="operator-item">
                <span class="op">&</span>
                <span>连接文本</span>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h4>常用函数</h4>
            <div class="function-list">
              <div class="function-item">
                <div class="function-header">
                  <span class="function-name">SUM</span>
                  <span class="function-desc">求和</span>
                </div>
                <div class="function-example">
                  <code>=SUM(A1:A10)</code>
                  <p>计算 A1 到 A10 的总和</p>
                </div>
              </div>

              <div class="function-item">
                <div class="function-header">
                  <span class="function-name">AVERAGE</span>
                  <span class="function-desc">平均值</span>
                </div>
                <div class="function-example">
                  <code>=AVERAGE(A1:A10)</code>
                  <p>计算 A1 到 A10 的平均值</p>
                </div>
              </div>

              <div class="function-item">
                <div class="function-header">
                  <span class="function-name">COUNT</span>
                  <span class="function-desc">计数</span>
                </div>
                <div class="function-example">
                  <code>=COUNT(A1:A10)</code>
                  <p>计算包含数字的单元格数量</p>
                </div>
              </div>

              <div class="function-item">
                <div class="function-header">
                  <span class="function-name">MAX / MIN</span>
                  <span class="function-desc">最大/最小值</span>
                </div>
                <div class="function-example">
                  <code>=MAX(A1:A10)</code>
                  <p>返回最大值</p>
                </div>
              </div>

              <div class="function-item">
                <div class="function-header">
                  <span class="function-name">IF</span>
                  <span class="function-desc">条件判断</span>
                </div>
                <div class="function-example">
                  <code>=IF(A1>60,"及格","不及格")</code>
                  <p>如果 A1 大于 60 显示"及格"，否则显示"不及格"</p>
                </div>
              </div>

              <div class="function-item">
                <div class="function-header">
                  <span class="function-name">VLOOKUP</span>
                  <span class="function-desc">垂直查找</span>
                </div>
                <div class="function-example">
                  <code>=VLOOKUP(E1,A1:D10,3,0)</code>
                  <p>在 A1:D10 中查找 E1 的值，返回第3列的数据</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 章节4: 格式化 -->
        <div v-if="currentSection === 'formatting'" class="section">
          <h3>🎨 格式化</h3>

          <div class="content-block">
            <h4>1. 数字格式</h4>
            <ul class="styled-list">
              <li><strong>货币：</strong>￥1,234.56</li>
              <li><strong>百分比：</strong>45.5%</li>
              <li><strong>日期：</strong>2024-01-15 或 2024年1月15日</li>
              <li><strong>自定义：</strong>右键 → 设置单元格格式 → 自定义</li>
            </ul>
          </div>

          <div class="content-block">
            <h4>2. 字体和颜色</h4>
            <div class="format-grid">
              <div class="format-card">
                <span class="format-icon">🔤</span>
                <p>字体、大小、颜色</p>
              </div>
              <div class="format-card">
                <span class="format-icon"><strong>B</strong></span>
                <p>加粗 (Ctrl+B)</p>
              </div>
              <div class="format-card">
                <span class="format-icon"><em>I</em></span>
                <p>斜体 (Ctrl+I)</p>
              </div>
              <div class="format-card">
                <span class="format-icon"><u>U</u></span>
                <p>下划线 (Ctrl+U)</p>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h4>3. 单元格边框和填充</h4>
            <ul class="styled-list">
              <li>选中单元格 → 开始 → 边框 → 选择边框样式</li>
              <li>填充颜色：选中 → 填充颜色图标 → 选择颜色</li>
              <li>合并单元格：选中多个单元格 → 合并后居中</li>
            </ul>
          </div>

          <div class="content-block">
            <h4>4. 条件格式</h4>
            <p>根据单元格的值自动应用格式：</p>
            <ul class="styled-list">
              <li>突出显示单元格规则（大于、小于、等于）</li>
              <li>数据条：用条形图显示数值大小</li>
              <li>色阶：用颜色渐变显示数值大小</li>
              <li>图标集：用图标表示数值高低</li>
            </ul>
          </div>
        </div>

        <!-- 章节5: 图表 -->
        <div v-if="currentSection === 'charts'" class="section">
          <h3>📊 图表</h3>

          <div class="content-block">
            <h4>创建图表步骤</h4>
            <div class="steps-list">
              <div class="step-item">
                <span class="step-number">1</span>
                <div class="step-content">
                  <h5>选择数据</h5>
                  <p>选中要制作图表的数据区域</p>
                </div>
              </div>
              <div class="step-item">
                <span class="step-number">2</span>
                <div class="step-content">
                  <h5>插入图表</h5>
                  <p>插入 → 图表 → 选择图表类型</p>
                </div>
              </div>
              <div class="step-item">
                <span class="step-number">3</span>
                <div class="step-content">
                  <h5>自定义</h5>
                  <p>修改标题、颜色、标签等</p>
                </div>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h4>常用图表类型</h4>
            <div class="chart-grid">
              <div class="chart-card">
                <div class="chart-icon">📈</div>
                <h5>柱状图</h5>
                <p>比较不同类别的数据</p>
              </div>
              <div class="chart-card">
                <div class="chart-icon">📉</div>
                <h5>折线图</h5>
                <p>显示趋势和变化</p>
              </div>
              <div class="chart-card">
                <div class="chart-icon">🥧</div>
                <h5>饼图</h5>
                <p>显示各部分占比</p>
              </div>
              <div class="chart-card">
                <div class="chart-icon">📊</div>
                <h5>条形图</h5>
                <p>横向比较数据</p>
              </div>
              <div class="chart-card">
                <div class="chart-icon">⚫</div>
                <h5>散点图</h5>
                <p>显示两个变量的关系</p>
              </div>
              <div class="chart-card">
                <div class="chart-icon">📊</div>
                <h5>面积图</h5>
                <p>显示数量随时间的变化</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 章节6: 数据处理 -->
        <div v-if="currentSection === 'data'" class="section">
          <h3>🔍 数据处理</h3>

          <div class="content-block">
            <h4>1. 排序</h4>
            <ul class="styled-list">
              <li>选中数据区域 → 数据 → 排序</li>
              <li>快速排序：选中列 → 右键 → 排序（升序/降序）</li>
              <li>多列排序：可设置主要排序和次要排序条件</li>
            </ul>
          </div>

          <div class="content-block">
            <h4>2. 筛选</h4>
            <div class="tips-box">
              <p><strong>自动筛选：</strong>选中数据 → 数据 → 筛选（或 Ctrl+Shift+L）</p>
              <p>点击列标题的下拉箭头，可以：</p>
              <ul class="styled-list">
                <li>选择特定值进行筛选</li>
                <li>按颜色筛选</li>
                <li>按条件筛选（大于、小于、等于等）</li>
                <li>文本筛选（包含、开头为、结尾为等）</li>
              </ul>
            </div>
          </div>

          <div class="content-block">
            <h4>3. 删除重复项</h4>
            <p>选中数据 → 数据 → 删除重复项 → 选择要检查的列</p>
          </div>

          <div class="content-block">
            <h4>4. 数据验证</h4>
            <p>限制单元格中可以输入的数据类型：</p>
            <ul class="styled-list">
              <li>选中单元格 → 数据 → 数据验证</li>
              <li>可设置：整数、小数、日期、列表等</li>
              <li>可设置输入提示和错误提示</li>
            </ul>
          </div>

          <div class="content-block">
            <h4>5. 分列</h4>
            <p>将一列数据按分隔符拆分成多列：</p>
            <p>选中数据 → 数据 → 分列 → 选择分隔符（如逗号、空格等）</p>
          </div>
        </div>

        <!-- 章节7: 实用技巧 -->
        <div v-if="currentSection === 'tips'" class="section">
          <h3>💡 实用技巧</h3>

          <div class="content-block">
            <h4>1. 快捷键大全</h4>
            <div class="shortcut-grid">
              <div class="shortcut-item">
                <kbd>Ctrl + N</kbd>
                <span>新建工作簿</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + S</kbd>
                <span>保存</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + F</kbd>
                <span>查找</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + H</kbd>
                <span>替换</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + A</kbd>
                <span>全选</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + Home</kbd>
                <span>回到A1</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + End</kbd>
                <span>到最后单元格</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + Page Up/Down</kbd>
                <span>切换工作表</span>
              </div>
              <div class="shortcut-item">
                <kbd>Alt + =</kbd>
                <span>自动求和</span>
              </div>
              <div class="shortcut-item">
                <kbd>F4</kbd>
                <span>重复上一步/切换引用</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + D</kbd>
                <span>向下填充</span>
              </div>
              <div class="shortcut-item">
                <kbd>Ctrl + R</kbd>
                <span>向右填充</span>
              </div>
            </div>
          </div>

          <div class="content-block">
            <h4>2. 单元格引用</h4>
            <div class="reference-types">
              <div class="ref-item">
                <h5>相对引用: A1</h5>
                <p>复制公式时，引用会自动调整</p>
              </div>
              <div class="ref-item">
                <h5>绝对引用: $A$1</h5>
                <p>复制公式时，引用保持不变</p>
              </div>
              <div class="ref-item">
                <h5>混合引用: $A1 或 A$1</h5>
                <p>锁定行或列，另一个可以变化</p>
              </div>
            </div>
            <div class="tips-box">
              <p><strong>技巧：</strong>按 <kbd>F4</kbd> 可以快速切换引用类型</p>
            </div>
          </div>

          <div class="content-block">
            <h4>3. 冻结窗格</h4>
            <p>固定行或列，滚动时保持可见：</p>
            <ul class="styled-list">
              <li>冻结首行：视图 → 冻结窗格 → 冻结首行</li>
              <li>冻结首列：视图 → 冻结窗格 → 冻结首列</li>
              <li>自定义冻结：选中单元格 → 冻结窗格（会冻结该单元格上方和左侧）</li>
            </ul>
          </div>

          <div class="content-block">
            <h4>4. 名称管理器</h4>
            <p>为单元格或区域命名，方便在公式中使用：</p>
            <ul class="styled-list">
              <li>选中区域 → 名称框（左上角）输入名称</li>
              <li>在公式中可直接使用名称，如 =SUM(销售额)</li>
            </ul>
          </div>

          <div class="content-block">
            <h4>5. 批注和备注</h4>
            <ul class="styled-list">
              <li>右键单元格 → 插入批注/备注</li>
              <li>批注用于协作讨论</li>
              <li>备注用于添加说明信息</li>
            </ul>
          </div>
        </div>

        <!-- 章节8: 练习示例 -->
        <div v-if="currentSection === 'practice'" class="section">
          <h3>📝 练习示例</h3>

          <div class="content-block">
            <h4>练习1：创建个人预算表</h4>
            <div class="practice-box">
              <p><strong>目标：</strong>创建一个简单的月度预算表</p>
              <ol class="styled-list">
                <li>创建表头：项目、预算金额、实际支出、差额</li>
                <li>输入几项支出（如房租、餐饮、交通等）</li>
                <li>使用公式计算差额：=预算金额-实际支出</li>
                <li>使用 SUM 函数计算总计</li>
                <li>应用格式化美化表格</li>
                <li>使用条件格式：超支的项目标红</li>
              </ol>
            </div>
          </div>

          <div class="content-block">
            <h4>练习2：成绩统计表</h4>
            <div class="practice-box">
              <p><strong>目标：</strong>统计学生成绩并计算等级</p>
              <ol class="styled-list">
                <li>创建表头：姓名、语文、数学、英语、总分、平均分、等级</li>
                <li>输入几个学生的成绩数据</li>
                <li>使用公式计算总分和平均分</li>
                <li>使用 IF 函数判断等级：
                  <div class="code-example">
                    =IF(平均分>=90,"优秀",IF(平均分>=80,"良好",IF(平均分>=60,"及格","不及格")))
                  </div>
                </li>
                <li>使用 MAX、MIN、AVERAGE 函数统计全班成绩</li>
                <li>创建柱状图展示各科平均分</li>
              </ol>
            </div>
          </div>

          <div class="content-block">
            <h4>练习3：销售数据分析</h4>
            <div class="practice-box">
              <p><strong>目标：</strong>分析产品销售数据</p>
              <ol class="styled-list">
                <li>创建表头：日期、产品、数量、单价、金额</li>
                <li>输入多条销售记录</li>
                <li>使用公式计算金额：=数量*单价</li>
                <li>使用自动筛选查看特定产品的销售</li>
                <li>使用排序找出销售额最高的记录</li>
                <li>创建饼图显示各产品销售占比</li>
                <li>创建折线图显示销售趋势</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- 完成标记按钮 -->
        <div class="section-actions">
          <button
            class="complete-btn"
            @click="toggleComplete(currentSection)"
            :class="{ completed: completedSections.includes(currentSection) }"
          >
            {{ completedSections.includes(currentSection) ? '✓ 已完成' : '标记为已完成' }}
          </button>

          <div class="navigation-buttons">
            <button
              class="nav-btn prev"
              @click="previousSection"
              :disabled="currentSectionIndex === 0"
            >
              ← 上一章
            </button>
            <button
              class="nav-btn next"
              @click="nextSection"
              :disabled="currentSectionIndex === sections.length - 1"
            >
              下一章 →
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentSection = ref('intro');
const completedSections = ref([]);

const sections = [
  { id: 'intro', icon: '🎯', title: 'Excel 简介' },
  { id: 'basics', icon: '⌨️', title: '基本操作' },
  { id: 'formulas', icon: '🔢', title: '公式和函数' },
  { id: 'formatting', icon: '🎨', title: '格式化' },
  { id: 'charts', icon: '📊', title: '图表' },
  { id: 'data', icon: '🔍', title: '数据处理' },
  { id: 'tips', icon: '💡', title: '实用技巧' },
  { id: 'practice', icon: '📝', title: '练习示例' }
];

const currentSectionIndex = computed(() => {
  return sections.findIndex(s => s.id === currentSection.value);
});

const completedCount = computed(() => completedSections.value.length);

const progress = computed(() => {
  return Math.round((completedCount.value / sections.length) * 100);
});

const toggleComplete = (sectionId) => {
  const index = completedSections.value.indexOf(sectionId);
  if (index > -1) {
    completedSections.value.splice(index, 1);
  } else {
    completedSections.value.push(sectionId);
  }
};

const previousSection = () => {
  if (currentSectionIndex.value > 0) {
    currentSection.value = sections[currentSectionIndex.value - 1].id;
  }
};

const nextSection = () => {
  if (currentSectionIndex.value < sections.length - 1) {
    currentSection.value = sections[currentSectionIndex.value + 1].id;
  }
};
</script>

<style scoped>
.excel-guide {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: #e0e0e0;
}

.guide-header {
  padding: 30px;
  background: linear-gradient(135deg, #1e7e34 0%, #28a745 100%);
  text-align: center;
  border-bottom: 3px solid #28a745;
}

.guide-header h2 {
  margin: 0;
  font-size: 32px;
  color: white;
  font-weight: 700;
}

.subtitle {
  margin: 10px 0 0 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.guide-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  background: #2d2d2d;
  border-right: 1px solid #444;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.nav-menu {
  padding: 20px 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 8px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  color: #999;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.nav-item:hover {
  background: #333;
  border-color: #28a745;
  color: #e0e0e0;
}

.nav-item.active {
  background: linear-gradient(135deg, #1e7e34 0%, #28a745 100%);
  border-color: #28a745;
  color: white;
  font-weight: 600;
}

.nav-item .icon {
  font-size: 20px;
}

.nav-item .text {
  flex: 1;
}

/* 进度部分 */
.progress-section {
  padding: 20px;
  margin-top: auto;
  border-top: 1px solid #444;
}

.progress-section h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #999;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #1a1a1a;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1e7e34 0%, #28a745 100%);
  transition: width 0.3s;
}

.progress-text {
  margin: 0;
  font-size: 13px;
  color: #999;
  text-align: center;
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.section h3 {
  margin: 0 0 25px 0;
  font-size: 28px;
  color: #28a745;
  padding-bottom: 15px;
  border-bottom: 2px solid #28a745;
}

.content-block {
  margin-bottom: 30px;
  padding: 20px;
  background: #2d2d2d;
  border-radius: 10px;
  border: 1px solid #444;
}

.content-block h4 {
  margin: 0 0 15px 0;
  font-size: 20px;
  color: #28a745;
}

.content-block p {
  margin: 0 0 10px 0;
  line-height: 1.6;
  color: #ccc;
}

/* 功能卡片网格 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.feature-card {
  padding: 20px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #28a745;
}

.feature-icon {
  font-size: 36px;
  margin-bottom: 10px;
}

.feature-card h4 {
  margin: 10px 0 5px 0;
  font-size: 16px;
  color: #28a745;
}

.feature-card p {
  margin: 0;
  font-size: 13px;
  color: #999;
}

/* 列表样式 */
.styled-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.styled-list li {
  padding: 10px 0 10px 30px;
  position: relative;
  line-height: 1.6;
  color: #ccc;
}

.styled-list li::before {
  content: "▸";
  position: absolute;
  left: 10px;
  color: #28a745;
  font-weight: bold;
}

/* 提示框 */
.tips-box {
  padding: 15px;
  background: #1a1a1a;
  border-left: 4px solid #28a745;
  border-radius: 5px;
}

.tips-box p {
  margin: 8px 0;
}

/* 代码示例 */
.code-example {
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  margin: 10px 0;
}

.code-example code {
  color: #28a745;
  font-size: 14px;
}

/* 运算符网格 */
.operator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.operator-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
}

.operator-item .op {
  font-size: 28px;
  font-weight: bold;
  color: #28a745;
  margin-bottom: 8px;
}

.operator-item span:last-child {
  font-size: 13px;
  color: #999;
}

/* 函数列表 */
.function-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.function-item {
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
}

.function-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.function-name {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  color: #28a745;
}

.function-desc {
  color: #999;
  font-size: 14px;
}

.function-example code {
  display: block;
  padding: 10px;
  background: #2d2d2d;
  border-radius: 5px;
  color: #28a745;
  margin-bottom: 8px;
}

.function-example p {
  margin: 0;
  font-size: 13px;
  color: #999;
}

/* 格式化网格 */
.format-grid,
.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.format-card,
.chart-card {
  padding: 20px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  text-align: center;
}

.format-icon,
.chart-icon {
  font-size: 32px;
  margin-bottom: 10px;
  display: block;
}

.chart-card h5 {
  margin: 10px 0 5px 0;
  color: #28a745;
}

.chart-card p {
  margin: 0;
  font-size: 13px;
  color: #999;
}

/* 步骤列表 */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.step-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #1a1a1a;
  border-radius: 8px;
}

.step-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #28a745;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
}

.step-content h5 {
  margin: 0 0 5px 0;
  color: #28a745;
}

.step-content p {
  margin: 0;
  color: #999;
}

/* 快捷键网格 */
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 15px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
}

kbd {
  padding: 4px 8px;
  background: #2d2d2d;
  border: 1px solid #555;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #28a745;
}

.shortcut-item span {
  color: #999;
  font-size: 13px;
}

/* 引用类型 */
.reference-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.ref-item {
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
}

.ref-item h5 {
  margin: 0 0 8px 0;
  color: #28a745;
  font-family: 'Courier New', monospace;
}

.ref-item p {
  margin: 0;
  font-size: 13px;
  color: #999;
}

/* 练习框 */
.practice-box {
  padding: 20px;
  background: #1a1a1a;
  border: 2px solid #28a745;
  border-radius: 8px;
  margin-top: 15px;
}

.practice-box p strong {
  color: #28a745;
}

.practice-box ol {
  margin: 15px 0 0 20px;
  color: #ccc;
}

.practice-box ol li {
  margin-bottom: 10px;
  line-height: 1.6;
}

/* 章节操作按钮 */
.section-actions {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.complete-btn {
  padding: 12px 30px;
  background: #1a1a1a;
  color: #28a745;
  border: 2px solid #28a745;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.complete-btn:hover {
  background: #28a745;
  color: white;
}

.complete-btn.completed {
  background: #28a745;
  color: white;
}

.navigation-buttons {
  display: flex;
  gap: 15px;
}

.nav-btn {
  padding: 12px 24px;
  background: #2d2d2d;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover:not(:disabled) {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式 */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }

  .main-content {
    padding: 20px;
  }

  .feature-grid,
  .format-grid,
  .chart-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .guide-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #444;
  }

  .nav-menu {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }

  .nav-item {
    min-width: 150px;
    margin-right: 8px;
    margin-bottom: 0;
  }

  .progress-section {
    display: none;
  }

  .section-actions {
    flex-direction: column;
    gap: 15px;
  }

  .navigation-buttons {
    width: 100%;
  }

  .nav-btn {
    flex: 1;
  }
}
</style>
