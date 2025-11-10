<template>
  <div class="collaborative-canvas">
    <div class="canvas-header">
      <h1>实时协作画布</h1>
      <div class="online-users">
        <span class="users-label">在线用户 ({{ onlineUsers.length }})</span>
        <div class="users-list">
          <span
            v-for="user in onlineUsers"
            :key="user.id"
            class="user-badge"
            :style="{ backgroundColor: user.color }"
            :title="user.name"
          >
            {{ user.name }}
          </span>
        </div>
      </div>
    </div>

    <div class="canvas-container">
      <!-- 工具栏 -->
      <div class="toolbar">
        <!-- 绘画工具选择 -->
        <div class="tool-section">
          <label>工具:</label>
          <div class="tool-buttons">
            <button
              @click="currentTool = 'pencil'"
              :class="{ active: currentTool === 'pencil' }"
              class="tool-btn"
              title="铅笔"
            >
              ✏️
            </button>
            <button
              @click="currentTool = 'eraser'"
              :class="{ active: currentTool === 'eraser' }"
              class="tool-btn"
              title="橡皮擦"
            >
              🧹
            </button>
            <button
              @click="currentTool = 'line'"
              :class="{ active: currentTool === 'line' }"
              class="tool-btn"
              title="直线"
            >
              📏
            </button>
            <button
              @click="currentTool = 'rectangle'"
              :class="{ active: currentTool === 'rectangle' }"
              class="tool-btn"
              title="矩形"
            >
              ▭
            </button>
            <button
              @click="currentTool = 'circle'"
              :class="{ active: currentTool === 'circle' }"
              class="tool-btn"
              title="圆形"
            >
              ⭕
            </button>
          </div>
        </div>

        <div class="tool-section">
          <label>颜色:</label>
          <input
            type="color"
            v-model="currentColor"
            class="color-picker"
            :disabled="currentTool === 'eraser'"
          />
          <!-- 快捷颜色 -->
          <div class="color-presets">
            <button
              v-for="color in colorPresets"
              :key="color"
              @click="currentColor = color"
              :style="{ backgroundColor: color }"
              class="color-preset-btn"
              :class="{ active: currentColor === color && currentTool !== 'eraser' }"
            ></button>
          </div>
        </div>

        <div class="tool-section">
          <label>大小:</label>
          <input
            type="range"
            v-model="lineWidth"
            min="1"
            max="30"
            class="size-slider"
          />
          <span class="size-value">{{ lineWidth }}px</span>
        </div>

        <div class="tool-section">
          <label>用户名:</label>
          <input
            type="text"
            v-model="userName"
            @change="updateUserName"
            placeholder="输入您的名字"
            class="name-input"
            maxlength="20"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="tool-section action-buttons">
          <button @click="undo" class="btn-action" :disabled="!canUndo" title="撤销">
            ↶
          </button>
          <button @click="redo" class="btn-action" :disabled="!canRedo" title="重做">
            ↷
          </button>
          <button @click="exportCanvas" class="btn-action" title="导出图片">
            💾
          </button>
          <button @click="toggleReplay" class="btn-action" :class="{ active: isReplaying }" title="回放轨迹">
            {{ isReplaying ? '⏸' : '▶️' }}
          </button>
          <button @click="clearCanvas" class="btn-clear" title="清空画布">
            🗑️
          </button>
        </div>

        <div class="connection-status" :class="{ connected: isConnected }">
          {{ isConnected ? '已连接' : '未连接' }}
        </div>
      </div>

      <!-- 画布 -->
      <div class="canvas-wrapper">
        <canvas
          ref="canvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="stopDrawing"
          class="drawing-canvas"
        ></canvas>

        <!-- 回放控制条 -->
        <div v-if="isReplaying" class="replay-controls">
          <button @click="stopReplay" class="replay-btn">停止回放</button>
          <div class="replay-progress">
            <div class="replay-bar" :style="{ width: replayProgress + '%' }"></div>
          </div>
          <span class="replay-info">回放进度: {{ Math.round(replayProgress) }}%</span>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="instructions">
        <p>🎨 选择工具在画布上绘制，所有用户的绘画会实时同步</p>
        <p>💡 使用撤销/重做按钮管理您的绘画，点击回放按钮查看绘画过程</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

export default {
  name: 'CollaborativeCanvas',
  setup() {
    const canvas = ref(null);
    let ctx = null;
    let socket = null;

    const isDrawing = ref(false);
    const currentColor = ref('#000000');
    const lineWidth = ref(3);
    const currentTool = ref('pencil');
    const userName = ref(`用户${Math.floor(Math.random() * 1000)}`);
    const isConnected = ref(false);
    const onlineUsers = ref([]);

    // 撤销/重做相关
    const history = ref([]);
    const historyStep = ref(-1);
    const canUndo = computed(() => historyStep.value > 0);
    const canRedo = computed(() => historyStep.value < history.value.length - 1);

    // 回放相关
    const isReplaying = ref(false);
    const replayProgress = ref(0);
    let replayInterval = null;

    // 颜色预设
    const colorPresets = [
      '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
      '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
    ];

    // 存储其他用户的绘画状态
    const remotePaths = new Map();

    // 临时画布用于绘制形状预览
    let tempCanvas = null;
    let tempCtx = null;
    let startX = 0;
    let startY = 0;

    // 随机生成用户颜色
    const generateRandomColor = () => {
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B739', '#52B788', '#E63946', '#457B9D'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const userColor = ref(generateRandomColor());

    // 保存画布状态到历史记录
    const saveToHistory = () => {
      if (!canvas.value) return;

      // 移除当前步骤之后的所有历史记录
      history.value = history.value.slice(0, historyStep.value + 1);

      // 保存当前画布状态
      const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);
      history.value.push(imageData);
      historyStep.value++;

      // 限制历史记录数量，最多保存50步
      if (history.value.length > 50) {
        history.value.shift();
        historyStep.value--;
      }
    };

    // 撤销
    const undo = () => {
      if (!canUndo.value || !canvas.value) return;

      historyStep.value--;
      const imageData = history.value[historyStep.value];
      ctx.putImageData(imageData, 0, 0);
    };

    // 重做
    const redo = () => {
      if (!canRedo.value || !canvas.value) return;

      historyStep.value++;
      const imageData = history.value[historyStep.value];
      ctx.putImageData(imageData, 0, 0);
    };

    // 导出画布为图片
    const exportCanvas = () => {
      if (!canvas.value) return;

      const link = document.createElement('a');
      link.download = `画布_${new Date().getTime()}.png`;
      link.href = canvas.value.toDataURL();
      link.click();
    };

    // 切换回放模式
    const toggleReplay = () => {
      if (isReplaying.value) {
        stopReplay();
      } else {
        startReplay();
      }
    };

    // 开始回放
    const startReplay = () => {
      if (history.value.length === 0) return;

      isReplaying.value = true;
      replayProgress.value = 0;
      let step = 0;

      replayInterval = setInterval(() => {
        if (step >= history.value.length) {
          stopReplay();
          return;
        }

        const imageData = history.value[step];
        ctx.putImageData(imageData, 0, 0);

        step++;
        replayProgress.value = (step / history.value.length) * 100;
      }, 200); // 每200ms播放一帧
    };

    // 停止回放
    const stopReplay = () => {
      isReplaying.value = false;
      replayProgress.value = 0;
      if (replayInterval) {
        clearInterval(replayInterval);
        replayInterval = null;
      }

      // 恢复到最新状态
      if (history.value.length > 0) {
        const latestImageData = history.value[history.value.length - 1];
        ctx.putImageData(latestImageData, 0, 0);
      }
    };

    // 初始化画布
    const initCanvas = () => {
      if (!canvas.value) return;

      const container = canvas.value.parentElement;
      canvas.value.width = container.clientWidth - 40;
      canvas.value.height = window.innerHeight - 300;

      ctx = canvas.value.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // 创建临时画布
      tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.value.width;
      tempCanvas.height = canvas.value.height;
      tempCtx = tempCanvas.getContext('2d');

      // 保存初始空白状态
      saveToHistory();
    };

    // 初始化 Socket.IO 连接
    const initSocket = () => {
      // 连接到后端（通过 Vite 代理，Socket.IO 会自动处理）
      socket = io('http://localhost:3002', {
        transports: ['websocket', 'polling']
      });

      socket.on('connect', () => {
        console.log('Connected to server');
        isConnected.value = true;

        // 发送用户加入信息
        socket.emit('user-join', {
          color: userColor.value,
          name: userName.value
        });
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
        isConnected.value = false;
      });

      // 初始化画布数据（加载历史绘画）
      socket.on('canvas-init', (data) => {
        console.log('Canvas initialized with data:', data);

        // 绘制历史路径
        data.paths.forEach(path => {
          if (path.points && path.points.length > 1) {
            drawPath(path.points, path.color, path.lineWidth);
          }
        });

        // 更新在线用户列表
        onlineUsers.value = data.users;
      });

      // 新用户加入
      socket.on('user-joined', (user) => {
        console.log('User joined:', user);
        if (!onlineUsers.value.find(u => u.id === user.id)) {
          onlineUsers.value.push(user);
        }
      });

      // 用户离开
      socket.on('user-left', (data) => {
        console.log('User left:', data);
        onlineUsers.value = onlineUsers.value.filter(u => u.id !== data.id);
        remotePaths.delete(data.id);
      });

      // 接收其他用户的绘画开始
      socket.on('draw-start', (data) => {
        remotePaths.set(data.userId, {
          points: data.points,
          color: data.color,
          lineWidth: data.lineWidth
        });
      });

      // 接收其他用户的绘画移动
      socket.on('draw-move', (data) => {
        const path = remotePaths.get(data.userId);
        if (path) {
          const lastPoint = path.points[path.points.length - 1];
          drawLine(lastPoint.x, lastPoint.y, data.x, data.y, path.color, path.lineWidth);
          path.points.push({ x: data.x, y: data.y });
        }
      });

      // 接收其他用户的绘画结束
      socket.on('draw-end', (data) => {
        remotePaths.delete(data.userId);
      });

      // 画布被清空
      socket.on('canvas-cleared', () => {
        clearCanvasLocal();
      });
    };

    // 绘制路径
    const drawPath = (points, color, width) => {
      if (!ctx || points.length < 2) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      ctx.stroke();
    };

    // 绘制线条
    const drawLine = (x1, y1, x2, y2, color, width) => {
      if (!ctx) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // 获取鼠标在画布上的坐标
    const getMousePos = (e) => {
      const rect = canvas.value.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // 获取触摸在画布上的坐标
    const getTouchPos = (e) => {
      const rect = canvas.value.getBoundingClientRect();
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    };

    let lastX = 0;
    let lastY = 0;

    // 开始绘画
    const startDrawing = (e) => {
      if (isReplaying.value) return; // 回放时禁止绘画

      isDrawing.value = true;
      const pos = getMousePos(e);
      lastX = pos.x;
      lastY = pos.y;
      startX = pos.x;
      startY = pos.y;

      // 对于形状工具，保存当前画布状态到临时画布
      if (['line', 'rectangle', 'circle'].includes(currentTool.value)) {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas.value, 0, 0);
      }

      // 通知服务器
      if (socket) {
        const drawColor = currentTool.value === 'eraser' ? '#FFFFFF' : currentColor.value;
        socket.emit('draw-start', {
          x: pos.x,
          y: pos.y,
          color: drawColor,
          lineWidth: lineWidth.value,
          tool: currentTool.value
        });
      }
    };

    // 绘画中
    const draw = (e) => {
      if (!isDrawing.value || isReplaying.value) return;

      const pos = getMousePos(e);

      if (currentTool.value === 'pencil' || currentTool.value === 'eraser') {
        // 铅笔和橡皮擦：自由绘画
        const drawColor = currentTool.value === 'eraser' ? '#FFFFFF' : currentColor.value;
        drawLine(lastX, lastY, pos.x, pos.y, drawColor, lineWidth.value);

        // 通知服务器
        if (socket) {
          socket.emit('draw-move', {
            x: pos.x,
            y: pos.y
          });
        }

        lastX = pos.x;
        lastY = pos.y;
      } else {
        // 形状工具：显示预览
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        ctx.drawImage(tempCanvas, 0, 0);

        if (currentTool.value === 'line') {
          drawLine(startX, startY, pos.x, pos.y, currentColor.value, lineWidth.value);
        } else if (currentTool.value === 'rectangle') {
          drawRectangle(startX, startY, pos.x, pos.y, currentColor.value, lineWidth.value);
        } else if (currentTool.value === 'circle') {
          drawCircle(startX, startY, pos.x, pos.y, currentColor.value, lineWidth.value);
        }
      }
    };

    // 停止绘画
    const stopDrawing = () => {
      if (isDrawing.value) {
        isDrawing.value = false;

        // 保存画布状态到历史记录
        if (!isReplaying.value) {
          saveToHistory();
        }

        // 通知服务器
        if (socket) {
          socket.emit('draw-end');
        }
      }
    };

    // 绘制矩形
    const drawRectangle = (x1, y1, x2, y2, color, width) => {
      if (!ctx) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    };

    // 绘制圆形
    const drawCircle = (x1, y1, x2, y2, color, width) => {
      if (!ctx) return;

      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
      ctx.stroke();
    };

    // 触摸开始
    const handleTouchStart = (e) => {
      e.preventDefault();
      if (isReplaying.value) return;

      isDrawing.value = true;
      const pos = getTouchPos(e);
      lastX = pos.x;
      lastY = pos.y;
      startX = pos.x;
      startY = pos.y;

      // 对于形状工具，保存当前画布状态到临时画布
      if (['line', 'rectangle', 'circle'].includes(currentTool.value)) {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas.value, 0, 0);
      }

      if (socket) {
        const drawColor = currentTool.value === 'eraser' ? '#FFFFFF' : currentColor.value;
        socket.emit('draw-start', {
          x: pos.x,
          y: pos.y,
          color: drawColor,
          lineWidth: lineWidth.value,
          tool: currentTool.value
        });
      }
    };

    // 触摸移动
    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isDrawing.value || isReplaying.value) return;

      const pos = getTouchPos(e);

      if (currentTool.value === 'pencil' || currentTool.value === 'eraser') {
        const drawColor = currentTool.value === 'eraser' ? '#FFFFFF' : currentColor.value;
        drawLine(lastX, lastY, pos.x, pos.y, drawColor, lineWidth.value);

        if (socket) {
          socket.emit('draw-move', {
            x: pos.x,
            y: pos.y
          });
        }

        lastX = pos.x;
        lastY = pos.y;
      } else {
        // 形状工具预览
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        ctx.drawImage(tempCanvas, 0, 0);

        if (currentTool.value === 'line') {
          drawLine(startX, startY, pos.x, pos.y, currentColor.value, lineWidth.value);
        } else if (currentTool.value === 'rectangle') {
          drawRectangle(startX, startY, pos.x, pos.y, currentColor.value, lineWidth.value);
        } else if (currentTool.value === 'circle') {
          drawCircle(startX, startY, pos.x, pos.y, currentColor.value, lineWidth.value);
        }
      }
    };

    // 清空画布（本地）
    const clearCanvasLocal = () => {
      if (!ctx || !canvas.value) return;
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

      // 清空历史记录
      history.value = [];
      historyStep.value = -1;
      saveToHistory();
    };

    // 清空画布（广播）
    const clearCanvas = () => {
      if (socket) {
        socket.emit('clear-canvas');
      }
      clearCanvasLocal();
    };

    // 更新用户名
    const updateUserName = () => {
      if (socket && isConnected.value) {
        socket.emit('user-join', {
          color: userColor.value,
          name: userName.value
        });
      }
    };

    // 窗口大小改变时重新初始化画布
    const handleResize = () => {
      // 保存当前画布内容
      const imageData = ctx?.getImageData(0, 0, canvas.value?.width || 0, canvas.value?.height || 0);

      initCanvas();

      // 恢复画布内容
      if (imageData && ctx) {
        ctx.putImageData(imageData, 0, 0);
      }
    };

    onMounted(() => {
      initCanvas();
      initSocket();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      if (socket) {
        socket.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    });

    return {
      canvas,
      currentColor,
      currentTool,
      lineWidth,
      userName,
      isConnected,
      onlineUsers,
      colorPresets,
      canUndo,
      canRedo,
      isReplaying,
      replayProgress,
      startDrawing,
      draw,
      stopDrawing,
      handleTouchStart,
      handleTouchMove,
      clearCanvas,
      updateUserName,
      undo,
      redo,
      exportCanvas,
      toggleReplay,
      stopReplay
    };
  }
};
</script>

<style scoped>
.collaborative-canvas {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.canvas-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.online-users {
  display: flex;
  align-items: center;
  gap: 10px;
}

.users-label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.users-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.user-badge {
  padding: 4px 12px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.user-badge:hover {
  transform: scale(1.1);
}

.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
}

.toolbar {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tool-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-section label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.tool-buttons {
  display: flex;
  gap: 6px;
}

.tool-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-btn:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.tool-btn.active {
  background: #667eea;
  border-color: #667eea;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.color-picker {
  width: 50px;
  height: 35px;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.color-picker:hover:not(:disabled) {
  transform: scale(1.05);
}

.color-picker:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.color-presets {
  display: flex;
  gap: 6px;
}

.color-preset-btn {
  width: 28px;
  height: 28px;
  border: 2px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.color-preset-btn:hover {
  transform: scale(1.15);
}

.color-preset-btn.active {
  border-width: 3px;
  border-color: #667eea;
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.5);
}

.size-slider {
  width: 100px;
}

.size-value {
  font-weight: 600;
  color: #667eea;
  min-width: 40px;
}

.name-input {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 120px;
  transition: border-color 0.3s;
}

.name-input:focus {
  outline: none;
  border-color: #667eea;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s;
  min-width: 40px;
}

.btn-action:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.btn-action:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-action.active {
  background: #27ae60;
}

.btn-clear {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s;
}

.btn-clear:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

.connection-status {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: #e74c3c;
  color: white;
  margin-left: auto;
}

.connection-status.connected {
  background: #27ae60;
}

.canvas-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.drawing-canvas {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  cursor: crosshair;
  touch-action: none;
  flex: 1;
}

.replay-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 400px;
  z-index: 10;
}

.replay-btn {
  padding: 8px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.3s;
}

.replay-btn:hover {
  background: #c0392b;
}

.replay-progress {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  overflow: hidden;
}

.replay-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.2s;
}

.replay-info {
  color: white;
  font-size: 14px;
  font-weight: 600;
  min-width: 100px;
}

.instructions {
  text-align: center;
  color: white;
  margin-top: 15px;
  font-size: 14px;
}

.instructions p {
  margin: 5px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .canvas-header h1 {
    font-size: 20px;
  }

  .toolbar {
    gap: 8px;
    padding: 10px 15px;
  }

  .tool-section {
    font-size: 12px;
  }

  .tool-btn {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }

  .name-input {
    width: 100px;
  }

  .replay-controls {
    min-width: 300px;
    padding: 10px 15px;
  }

  .color-presets {
    display: none;
  }
}
</style>
