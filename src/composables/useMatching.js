// 匹配系统管理
import { ref, onUnmounted } from 'vue';

export function useMatching(socket) {
  const isMatching = ref(false);
  const matchingTime = ref(0);
  const matchingTimer = ref(null);
  const selectedSkills = ref([]);

  // 开始匹配
  function startMatching(skills) {
    if (skills.length !== 3) return;

    selectedSkills.value = skills;
    isMatching.value = true;
    matchingTime.value = 0;

    socket.value.emit('match:quick', { selectedSkills: skills });

    matchingTimer.value = setInterval(() => {
      matchingTime.value++;
    }, 1000);
  }

  // 取消匹配
  function cancelMatching() {
    isMatching.value = false;
    if (matchingTimer.value) {
      clearInterval(matchingTimer.value);
    }
    selectedSkills.value = [];
  }

  // 清理定时器
  onUnmounted(() => {
    if (matchingTimer.value) {
      clearInterval(matchingTimer.value);
    }
  });

  return {
    isMatching,
    matchingTime,
    selectedSkills,
    startMatching,
    cancelMatching
  };
}
