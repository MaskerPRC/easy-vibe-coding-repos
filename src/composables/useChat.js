// 弹幕系统管理
import { ref, nextTick } from 'vue';

export function useChat(game, socket) {
  const chatMessages = ref([]);
  const chatInput = ref('');
  const chatMessagesEl = ref(null);

  // 发送弹幕
  function sendChat() {
    if (!chatInput.value.trim() || !game.value) return;

    socket.value.emit('chat:message', {
      gameId: game.value.id,
      message: chatInput.value
    });

    chatInput.value = '';
  }

  // 添加弹幕消息
  function addMessage(msg) {
    chatMessages.value.push(msg);

    // 自动滚动到底部
    nextTick(() => {
      if (chatMessagesEl.value) {
        chatMessagesEl.value.scrollTop = chatMessagesEl.value.scrollHeight;
      }
    });
  }

  // 清空弹幕
  function clearMessages() {
    chatMessages.value = [];
  }

  return {
    chatMessages,
    chatInput,
    chatMessagesEl,
    sendChat,
    addMessage,
    clearMessages
  };
}
