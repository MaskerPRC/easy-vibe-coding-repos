<template>
  <div class="board-container">
    <canvas
      ref="boardCanvas"
      @click="handleClick"
      @mousemove="handleHover"
      :width="canvasWidth"
      :height="canvasHeight"
      class="game-board"
    ></canvas>

    <!-- 冻结提示 -->
    <div v-if="isFrozen" class="frozen-overlay">
      <div class="frozen-text">
        <span class="frozen-icon">❄️</span>
        <span>被冻结中...</span>
        <span class="frozen-timer">{{ frozenRemaining }}秒</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/constants/board';

const props = defineProps({
  boardCanvas: Object,
  isFrozen: Boolean,
  frozenRemaining: Number,
  initBoard: Function,
  drawBoard: Function,
  handleBoardClick: Function,
  handleBoardHover: Function
});

const canvasWidth = CANVAS_WIDTH;
const canvasHeight = CANVAS_HEIGHT;

const handleClick = (e) => {
  props.handleBoardClick(e);
};

const handleHover = (e) => {
  props.handleBoardHover(e);
};

onMounted(() => {
  props.initBoard();
  props.drawBoard();
});

// 监听外部变化,重新绘制
watch(() => props.boardCanvas, () => {
  props.drawBoard();
}, { deep: true });
</script>

<style scoped>
.board-container {
  position: relative;
}

.game-board {
  border-radius: 10px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.frozen-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 100, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  backdrop-filter: blur(5px);
}

.frozen-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 24px;
  font-weight: 700;
}

.frozen-icon {
  font-size: 64px;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}
</style>
