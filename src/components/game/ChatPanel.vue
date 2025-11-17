<template>
  <div class="chat-panel">
    <h3>弹幕</h3>
    <div class="chat-messages" ref="chatMessagesEl">
      <div
        v-for="(msg, index) in chatMessages"
        :key="index"
        class="chat-message"
      >
        <span class="chat-user">{{ msg.username }}</span>
        <span class="chat-province">[{{ msg.province }}]</span>
        <span class="chat-text">{{ msg.message }}</span>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="chatInput"
        @keypress.enter="handleSendChat"
        placeholder="发送弹幕..."
        maxlength="50"
      />
      <button @click="handleSendChat" class="btn-send">发送</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  chatMessages: Array,
  chatInput: String,
  chatMessagesEl: Object,
  sendChat: Function
});

const emit = defineEmits(['update:chatInput']);

const handleSendChat = () => {
  props.sendChat();
};
</script>

<style scoped>
.chat-panel {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(50, 205, 50, 0.3);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-panel h3 {
  color: #32cd32;
  margin-bottom: 15px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 15px;
  max-height: 300px;
}

.chat-message {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.chat-user {
  color: #8a2be2;
  font-weight: 600;
}

.chat-province {
  color: #aaa;
  font-size: 12px;
}

.chat-text {
  color: #e0e0e0;
  margin-left: 8px;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 14px;
}

.chat-input input:focus {
  outline: none;
  border-color: #8a2be2;
}

.btn-send {
  padding: 10px 20px;
  background: linear-gradient(135deg, #32cd32, #228b22);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-send:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(50, 205, 50, 0.5);
}
</style>
