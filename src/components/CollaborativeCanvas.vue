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
          >
            {{ user.name }}
          </span>
        </div>
      </div>
    </div>

    <div class="canvas-container">
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="tool-section">
          <label>颜色:</label>
          <input
            type="color"
            v-model="currentColor"
            class="color-picker"
          />
        </div>

        <div class="tool-section">
          <label>笔刷大小:</label>
          <input
            type="range"
            v-model="lineWidth"
            min="1"
            max="20"
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

        <button @click="clearCanvas" class="btn-clear">
          清空画布
        </button>

        <div class="connection-status" :class="{ connected: isConnected }">
          {{ isConnected ? '已连接' : '未连接' }}
        </div>
      </div>

      <!-- 画布 -->
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

      <!-- 使用说明 -->
      <div class="instructions">
        <p>在画布上移动鼠标或触摸屏幕开始绘画</p>
        <p>所有用户的绘画会实时同步显示</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
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
    const userName = ref(`用户${Math.floor(Math.random() * 1000)}`);
    const isConnected = ref(false);
    const onlineUsers = ref([]);

    // 存储其他用户的绘画状态
    const remotePaths = new Map();

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

    // 初始化画布
    const initCanvas = () => {
      if (!canvas.value) return;

      const container = canvas.value.parentElement;
      canvas.value.width = container.clientWidth - 40;
      canvas.value.height = window.innerHeight - 250;

      ctx = canvas.value.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
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
      isDrawing.value = true;
      const pos = getMousePos(e);
      lastX = pos.x;
      lastY = pos.y;

      // 通知服务器
      if (socket) {
        socket.emit('draw-start', {
          x: pos.x,
          y: pos.y,
          color: currentColor.value,
          lineWidth: lineWidth.value
        });
      }
    };

    // 绘画中
    const draw = (e) => {
      if (!isDrawing.value) return;

      const pos = getMousePos(e);

      // 在本地画布绘制
      drawLine(lastX, lastY, pos.x, pos.y, currentColor.value, lineWidth.value);

      // 通知服务器
      if (socket) {
        socket.emit('draw-move', {
          x: pos.x,
          y: pos.y
        });
      }

      lastX = pos.x;
      lastY = pos.y;
    };

    // 停止绘画
    const stopDrawing = () => {
      if (isDrawing.value) {
        isDrawing.value = false;

        // 通知服务器
        if (socket) {
          socket.emit('draw-end');
        }
      }
    };

    // 触摸开始
    const handleTouchStart = (e) => {
      e.preventDefault();
      isDrawing.value = true;
      const pos = getTouchPos(e);
      lastX = pos.x;
      lastY = pos.y;

      if (socket) {
        socket.emit('draw-start', {
          x: pos.x,
          y: pos.y,
          color: currentColor.value,
          lineWidth: lineWidth.value
        });
      }
    };

    // 触摸移动
    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isDrawing.value) return;

      const pos = getTouchPos(e);
      drawLine(lastX, lastY, pos.x, pos.y, currentColor.value, lineWidth.value);

      if (socket) {
        socket.emit('draw-move', {
          x: pos.x,
          y: pos.y
        });
      }

      lastX = pos.x;
      lastY = pos.y;
    };

    // 清空画布（本地）
    const clearCanvasLocal = () => {
      if (!ctx || !canvas.value) return;
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
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
      lineWidth,
      userName,
      isConnected,
      onlineUsers,
      startDrawing,
      draw,
      stopDrawing,
      handleTouchStart,
      handleTouchMove,
      clearCanvas,
      updateUserName
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
  gap: 20px;
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

.color-picker {
  width: 50px;
  height: 35px;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.size-slider {
  width: 120px;
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
  width: 150px;
}

.name-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-clear {
  padding: 8px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-clear:hover {
  background: #c0392b;
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

.drawing-canvas {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  cursor: crosshair;
  touch-action: none;
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
    gap: 10px;
  }

  .tool-section {
    font-size: 12px;
  }

  .name-input {
    width: 100px;
  }
}
</style>
