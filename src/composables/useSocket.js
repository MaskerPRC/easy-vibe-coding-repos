// WebSocket 连接管理
import { ref, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

export function useSocket() {
  const socket = ref(null);
  const userInfo = ref(null);
  const stats = ref({ onlineUsers: 0, activeGames: 0, queueLength: 0 });

  // 连接 Socket
  function connect() {
    socket.value = io('http://localhost:3002');

    socket.value.on('connect', () => {
      console.log('WebSocket 连接成功');

      // 尝试从 localStorage 恢复用户名
      const savedUsername = localStorage.getItem('gomoku_username');
      socket.value.emit('user:connect', { username: savedUsername });
    });

    socket.value.on('user:info', (info) => {
      userInfo.value = info;
      // 保存用户名到 localStorage
      localStorage.setItem('gomoku_username', info.username);
    });

    socket.value.on('stats:update', (newStats) => {
      stats.value = newStats;
    });
  }

  // 断开连接
  function disconnect() {
    if (socket.value) {
      socket.value.disconnect();
    }
  }

  // 组件卸载时自动断开
  onUnmounted(() => {
    disconnect();
  });

  return {
    socket,
    userInfo,
    stats,
    connect,
    disconnect
  };
}
