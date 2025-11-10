<template>
  <div class="demand-button" @click="handleClick">
    需求
  </div>

  <!-- 提示弹窗 -->
  <transition name="modal">
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <p>今日需求请求已结束</p>
        <button class="modal-close-btn" @click="closeModal">确定</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);

const handleClick = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
.demand-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 68px;
  height: 68px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  transition: all 0.3s ease;
  z-index: 9998;
  user-select: none;
}

.demand-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.5);
  background-color: #0069d9;
}

.demand-button:active {
  transform: scale(0.95);
}

/* 弹窗遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

/* 弹窗内容 */
.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 300px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content p {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.modal-close-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background-color: #0069d9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.modal-close-btn:active {
  transform: translateY(0);
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(-20px);
}

/* 响应式 */
@media (max-width: 768px) {
  .demand-button {
    width: 60px;
    height: 60px;
    font-size: 14px;
    bottom: 15px;
    right: 15px;
  }

  .modal-content {
    min-width: 260px;
    padding: 25px 30px;
  }

  .modal-content p {
    font-size: 16px;
  }
}
</style>
