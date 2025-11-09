<template>
  <div class="wps-debug">
    <div class="header">
      <h1>🔧 WPS 集成调试面板</h1>
      <p class="subtitle">测试 WPS Office COM Bridge 功能</p>
    </div>

    <!-- 服务状态 -->
    <div class="section status-section">
      <h2>📊 服务状态</h2>
      <div class="status-cards">
        <div class="status-card" :class="bridgeStatus.status">
          <div class="status-icon">🔌</div>
          <div class="status-info">
            <h3>WPS Bridge</h3>
            <p>{{ bridgeStatus.message }}</p>
            <p v-if="bridgeStatus.pid" class="status-detail">PID: {{ bridgeStatus.pid }}</p>
          </div>
          <button @click="checkBridgeStatus" :disabled="loading">刷新</button>
          <button @click="restartBridgeService" :disabled="loading">重启</button>
        </div>

        <div class="status-card" :class="wpsStatus.status">
          <div class="status-icon">📄</div>
          <div class="status-info">
            <h3>WPS Office</h3>
            <p>{{ wpsStatus.message }}</p>
            <div v-if="wpsStatus.apps" class="app-status">
              <span v-if="wpsStatus.apps.word">✅ Word</span>
              <span v-if="wpsStatus.apps.excel">✅ Excel</span>
              <span v-if="wpsStatus.apps.powerpoint">✅ PowerPoint</span>
            </div>
          </div>
          <button @click="detectWPSInstallation" :disabled="loading">检测</button>
        </div>
      </div>
    </div>

    <!-- Word 功能测试 -->
    <div class="section">
      <h2>📝 Word 功能测试</h2>
      <div class="test-grid">
        <div class="test-item">
          <h3>插入文本</h3>
          <textarea v-model="wordTests.text" placeholder="输入要插入的文本"></textarea>
          <select v-model="wordTests.location">
            <option value="start">开头</option>
            <option value="end">末尾</option>
            <option value="replace">替换全部</option>
          </select>
          <button @click="testWordInsertText" :disabled="loading">执行</button>
        </div>

        <div class="test-item">
          <h3>查找替换</h3>
          <input v-model="wordTests.findText" placeholder="查找文本" />
          <input v-model="wordTests.replaceText" placeholder="替换为" />
          <label>
            <input type="checkbox" v-model="wordTests.matchCase" />
            区分大小写
          </label>
          <button @click="testWordFindReplace" :disabled="loading">执行</button>
        </div>

        <div class="test-item">
          <h3>段落格式</h3>
          <select v-model="wordTests.alignment">
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
            <option value="justify">两端对齐</option>
          </select>
          <label>
            行距: <input type="number" v-model.number="wordTests.lineSpacing" step="0.1" />
          </label>
          <button @click="testWordParagraphFormat" :disabled="loading">执行</button>
        </div>

        <div class="test-item">
          <h3>字体格式</h3>
          <label>
            <input type="checkbox" v-model="wordTests.bold" /> 粗体
          </label>
          <label>
            <input type="checkbox" v-model="wordTests.italic" /> 斜体
          </label>
          <label>
            字号: <input type="number" v-model.number="wordTests.fontSize" />
          </label>
          <label>
            颜色: <input type="color" v-model="wordTests.fontColor" />
          </label>
          <button @click="testWordFontFormat" :disabled="loading">执行</button>
        </div>

        <div class="test-item">
          <h3>插入表格</h3>
          <label>
            行数: <input type="number" v-model.number="wordTests.tableRows" min="1" />
          </label>
          <label>
            列数: <input type="number" v-model.number="wordTests.tableCols" min="1" />
          </label>
          <button @click="testWordInsertTable" :disabled="loading">执行</button>
        </div>

        <div class="test-item">
          <h3>应用标题样式</h3>
          <select v-model.number="wordTests.headingLevel">
            <option :value="1">标题 1</option>
            <option :value="2">标题 2</option>
            <option :value="3">标题 3</option>
            <option :value="4">标题 4</option>
            <option :value="5">标题 5</option>
          </select>
          <button @click="testWordApplyHeading" :disabled="loading">执行</button>
        </div>
      </div>
    </div>

    <!-- Excel 功能测试 -->
    <div class="section">
      <h2>📊 Excel 功能测试</h2>
      <div class="test-grid">
        <div class="test-item">
          <h3>读取单元格</h3>
          <input v-model="excelTests.cell" placeholder="单元格地址 (如 A1)" />
          <button @click="testExcelGetCell" :disabled="loading">读取</button>
          <p v-if="excelTests.cellValue" class="result">值: {{ excelTests.cellValue }}</p>
        </div>

        <div class="test-item">
          <h3>写入单元格</h3>
          <input v-model="excelTests.writeCell" placeholder="单元格地址 (如 B2)" />
          <input v-model="excelTests.writeValue" placeholder="要写入的值" />
          <button @click="testExcelSetCell" :disabled="loading">写入</button>
        </div>

        <div class="test-item">
          <h3>读取区域</h3>
          <input v-model="excelTests.range" placeholder="区域 (如 A1:C3)" />
          <button @click="testExcelGetRange" :disabled="loading">读取</button>
          <pre v-if="excelTests.rangeData" class="result">{{ excelTests.rangeData }}</pre>
        </div>
      </div>
    </div>

    <!-- PowerPoint 功能测试 -->
    <div class="section">
      <h2>🎨 PowerPoint 功能测试</h2>
      <div class="test-grid">
        <div class="test-item">
          <h3>获取信息</h3>
          <button @click="testPPTGetInfo" :disabled="loading">获取</button>
          <p v-if="pptTests.slideCount !== null" class="result">
            幻灯片数量: {{ pptTests.slideCount }}
          </p>
        </div>

        <div class="test-item">
          <h3>添加幻灯片</h3>
          <button @click="testPPTAddSlide" :disabled="loading">添加</button>
        </div>

        <div class="test-item">
          <h3>添加文本框</h3>
          <input v-model="pptTests.textboxContent" placeholder="文本内容" />
          <button @click="testPPTAddTextbox" :disabled="loading">添加</button>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" class="message" :class="message.type">
      {{ message.text }}
    </div>
  </div>
</template>

<script>
import WPSService from '../services/wps/index.js';

export default {
  name: 'WPSDebug',
  data() {
    return {
      loading: false,
      message: null,
      bridgeStatus: {
        status: 'unknown',
        message: '未检查',
        pid: null
      },
      wpsStatus: {
        status: 'unknown',
        message: '未检测',
        apps: null
      },
      wordTests: {
        text: '这是测试文本\n',
        location: 'end',
        findText: '',
        replaceText: '',
        matchCase: false,
        alignment: 'left',
        lineSpacing: 1.5,
        bold: false,
        italic: false,
        fontSize: 12,
        fontColor: '#000000',
        tableRows: 3,
        tableCols: 3,
        headingLevel: 1
      },
      excelTests: {
        cell: 'A1',
        cellValue: null,
        writeCell: 'B2',
        writeValue: '测试数据',
        range: 'A1:C3',
        rangeData: null
      },
      pptTests: {
        slideCount: null,
        textboxContent: '测试文本框'
      }
    };
  },
  mounted() {
    this.checkBridgeStatus();
    this.detectWPSInstallation();
  },
  methods: {
    showMessage(text, type = 'success') {
      this.message = { text, type };
      setTimeout(() => {
        this.message = null;
      }, 3000);
    },

    async checkBridgeStatus() {
      try {
        const data = await WPSService.checkBridgeHealth();
        this.bridgeStatus = {
          status: 'online',
          message: '服务运行中',
          pid: data.pid
        };
        this.showMessage('WPS Bridge 服务正常', 'success');
      } catch (error) {
        this.bridgeStatus = {
          status: 'offline',
          message: error.message,
          pid: null
        };
        this.showMessage('WPS Bridge 服务不可用', 'error');
      }
    },

    async restartBridgeService() {
      try {
        this.loading = true;
        await WPSService.restartBridge();
        this.showMessage('服务重启中...', 'info');
        setTimeout(() => this.checkBridgeStatus(), 3000);
      } catch (error) {
        this.showMessage(`重启失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async detectWPSInstallation() {
      try {
        const data = await WPSService.detectWPS();
        this.wpsStatus = {
          status: data.installed ? 'online' : 'offline',
          message: data.installed ? '已安装' : '未安装',
          apps: data.applications
        };
      } catch (error) {
        this.wpsStatus = {
          status: 'error',
          message: error.message,
          apps: null
        };
      }
    },

    // Word 测试方法
    async testWordInsertText() {
      try {
        this.loading = true;
        await WPSService.word.insertText(this.wordTests.text, this.wordTests.location);
        this.showMessage('文本插入成功', 'success');
      } catch (error) {
        this.showMessage(`插入失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async testWordFindReplace() {
      try {
        this.loading = true;
        const result = await WPSService.word.findReplace(
          this.wordTests.findText,
          this.wordTests.replaceText,
          this.wordTests.matchCase
        );
        this.showMessage(`替换成功，共 ${result.replacedCount} 处`, 'success');
      } catch (error) {
        this.showMessage(`替换失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async testWordParagraphFormat() {
      try {
        this.loading = true;
        await WPSService.word.formatParagraph({
          alignment: this.wordTests.alignment,
          lineSpacing: this.wordTests.lineSpacing
        });
        this.showMessage('段落格式设置成功', 'success');
      } catch (error) {
        this.showMessage(`设置失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async testWordFontFormat() {
      try {
        this.loading = true;
        await WPSService.word.formatFont({
          bold: this.wordTests.bold,
          italic: this.wordTests.italic,
          size: this.wordTests.fontSize,
          color: this.wordTests.fontColor
        });
        this.showMessage('字体格式设置成功', 'success');
      } catch (error) {
        this.showMessage(`设置失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async testWordInsertTable() {
      try {
        this.loading = true;
        await WPSService.word.insertTable(
          this.wordTests.tableRows,
          this.wordTests.tableCols
        );
        this.showMessage('表格插入成功', 'success');
      } catch (error) {
        this.showMessage(`插入失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async testWordApplyHeading() {
      try {
        this.loading = true;
        await WPSService.word.applyHeading(this.wordTests.headingLevel);
        this.showMessage('标题样式应用成功', 'success');
      } catch (error) {
        this.showMessage(`应用失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    // Excel 测试方法
    async testExcelGetCell() {
      try {
        this.loading = true;
        const result = await WPSService.excel.getCell(this.excelTests.cell);
        this.excelTests.cellValue = result.value;
        this.showMessage('读取成功', 'success');
      } catch (error) {
        this.showMessage(`读取失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async testExcelSetCell() {
      try {
        this.loading = true;
        await WPSService.excel.setCell(
          this.excelTests.writeCell,
          this.excelTests.writeValue
        );
        this.showMessage('写入成功', 'success');
      } catch (error) {
        this.showMessage(`写入失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async testExcelGetRange() {
      try {
        this.loading = true;
        const result = await WPSService.excel.getRange(this.excelTests.range);
        this.excelTests.rangeData = JSON.stringify(result.values, null, 2);
        this.showMessage('读取成功', 'success');
      } catch (error) {
        this.showMessage(`读取失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    // PowerPoint 测试方法
    async testPPTGetInfo() {
      try {
        this.loading = true;
        const result = await WPSService.powerpoint.getInfo();
        this.pptTests.slideCount = result.slideCount;
        this.showMessage('获取信息成功', 'success');
      } catch (error) {
        this.showMessage(`获取失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async testPPTAddSlide() {
      try {
        this.loading = true;
        await WPSService.powerpoint.addSlide();
        this.showMessage('幻灯片添加成功', 'success');
      } catch (error) {
        this.showMessage(`添加失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async testPPTAddTextbox() {
      try {
        this.loading = true;
        await WPSService.powerpoint.addTextbox(this.pptTests.textboxContent);
        this.showMessage('文本框添加成功', 'success');
      } catch (error) {
        this.showMessage(`添加失败: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.wps-debug {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 14px;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section h2 {
  color: #34495e;
  margin-bottom: 20px;
  font-size: 18px;
}

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 6px;
  border: 2px solid #ecf0f1;
}

.status-card.online {
  border-color: #27ae60;
  background: #f0fff4;
}

.status-card.offline {
  border-color: #e74c3c;
  background: #fff5f5;
}

.status-icon {
  font-size: 32px;
}

.status-info {
  flex: 1;
}

.status-info h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #2c3e50;
}

.status-info p {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}

.status-detail {
  font-size: 12px;
  color: #95a5a6;
}

.app-status {
  display: flex;
  gap: 10px;
  margin-top: 5px;
  font-size: 12px;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.test-item {
  border: 1px solid #e1e8ed;
  border-radius: 6px;
  padding: 15px;
  background: #fafafa;
}

.test-item h3 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #2c3e50;
}

.test-item input,
.test-item select,
.test-item textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.test-item textarea {
  min-height: 80px;
  resize: vertical;
}

.test-item label {
  display: block;
  margin-bottom: 10px;
  font-size: 13px;
}

.test-item label input[type="checkbox"] {
  width: auto;
  margin-right: 5px;
}

.test-item label input[type="number"],
.test-item label input[type="color"] {
  width: auto;
  margin-left: 5px;
}

.test-item button {
  width: 100%;
  padding: 8px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-top: 5px;
}

.test-item button:hover:not(:disabled) {
  background: #2980b9;
}

.test-item button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.status-card button {
  width: auto;
  padding: 6px 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.status-card button:hover:not(:disabled) {
  background: #2980b9;
}

.result {
  margin-top: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  font-size: 12px;
  color: #27ae60;
}

pre.result {
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

.message.success {
  background: #27ae60;
}

.message.error {
  background: #e74c3c;
}

.message.info {
  background: #3498db;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
