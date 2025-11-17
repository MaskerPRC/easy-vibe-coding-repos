// 游戏状态管理
import { ref, computed } from 'vue';

export function useGame() {
  const game = ref(null);
  const myColor = ref(null);
  const isSpectating = ref(false);
  const gameEndModal = ref(null);

  // 计算属性: 我的技能
  const mySkills = computed(() => {
    if (!game.value || !myColor.value) return null;
    return game.value.skills?.[myColor.value];
  });

  // 重置游戏状态
  function resetGame() {
    game.value = null;
    myColor.value = null;
    isSpectating.value = false;
    gameEndModal.value = null;
  }

  // 设置游戏数据
  function setGame(gameData, color = null) {
    game.value = gameData;
    if (color) {
      myColor.value = color;
    }
  }

  // 设置游戏结束
  function setGameEnd(data) {
    gameEndModal.value = data;
  }

  // 设置观战模式
  function setSpectating(value) {
    isSpectating.value = value;
  }

  return {
    game,
    myColor,
    isSpectating,
    gameEndModal,
    mySkills,
    resetGame,
    setGame,
    setGameEnd,
    setSpectating
  };
}
