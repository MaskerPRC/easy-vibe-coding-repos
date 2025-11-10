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
  padding: 10px 20px;
  background-color: white;
  color: black;
  border: 1px solid black;
  cursor: pointer;
  z-index: 10001;
  user-select: none;
  font-size: 16px;
}

.demand-button:hover {
  background-color: black;
  color: white;
}

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
}

.modal-content {
  background: white;
  border: 1px solid black;
  padding: 30px 40px;
  text-align: center;
  min-width: 300px;
}

.modal-content p {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: black;
}

.modal-close-btn {
  background-color: white;
  color: black;
  border: 1px solid black;
  padding: 10px 30px;
  font-size: 16px;
  cursor: pointer;
}

.modal-close-btn:hover {
  background-color: black;
  color: white;
}

@media (max-width: 768px) {
  .modal-content {
    min-width: 260px;
    padding: 25px 30px;
  }

  .modal-content p {
    font-size: 16px;
  }
}
</style>
