<template>
  <div class="app">
    <!-- 主界面 -->
    <HomeView
      v-if="currentView === 'home'"
      :userInfo="userInfo"
      :stats="stats"
      @start-match="showSkillSelection = true"
      @spectate="handleSpectate"
      @history="handleHistory"
    />

    <!-- 技能选择弹窗 -->
    <SkillSelectionModal
      :showSkillSelection="showSkillSelection"
      :selectedSkills="selectedSkills"
      @update:showSkillSelection="showSkillSelection = $event"
      @update:selectedSkills="selectedSkills = $event"
      @start-matching="handleStartMatching"
    />

    <!-- 匹配等待 -->
    <MatchingView
      v-if="isMatching"
      :matchingTime="matchingTime"
      @cancel-matching="handleCancelMatching"
    />

    <!-- 游戏界面 -->
    <GameView
      v-if="currentView === 'game'"
      :game="game"
      :myColor="myColor"
    >
      <template #board>
        <GameBoard
          :boardCanvas="boardCanvas"
          :isFrozen="isFrozen"
          :frozenRemaining="frozenRemaining"
          :initBoard="initBoard"
          :drawBoard="drawBoard"
          :handleBoardClick="(e) => handleBoardClick(e, socket, selectingSkillTarget)"
          :handleBoardHover="handleBoardHover"
        />
      </template>
      <template #skills>
        <SkillsPanel
          :mySkills="mySkills"
          :canUseSkill="canUseSkill"
          :isSkillOnCooldown="isSkillOnCooldown"
          :useSkill="(skillName) => useSkill(skillName, socket)"
        />
      </template>
      <template #chat>
        <ChatPanel
          :chatMessages="chatMessages"
          :chatInput="chatInput"
          :chatMessagesEl="chatMessagesEl"
          :sendChat="sendChat"
          @update:chatInput="chatInput = $event"
        />
      </template>
    </GameView>

    <!-- 观战列表 -->
    <SpectateView
      v-if="currentView === 'spectate'"
      :gamesList="gamesList"
      @back="currentView = 'home'"
      @spectate-game="handleSpectateGame"
    />

    <!-- 历史对局 -->
    <HistoryView
      v-if="currentView === 'history'"
      :historyList="historyList"
      @back="currentView = 'home'"
      @view-history="handleViewHistory"
    />

    <!-- 游戏结束弹窗 -->
    <GameEndModal
      :gameEndModal="gameEndModal"
      :myColor="myColor"
      @back-to-home="handleBackToHome"
    />

    <!-- 随机事件提示 -->
    <RandomEventNotification :show="randomEventNotif" />

    <!-- 技能释放特效 -->
    <SkillEffect :skillEffect="skillEffect" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

// 导入组件
import HomeView from './components/views/HomeView.vue';
import MatchingView from './components/views/MatchingView.vue';
import GameView from './components/views/GameView.vue';
import SpectateView from './components/views/SpectateView.vue';
import HistoryView from './components/views/HistoryView.vue';
import GameBoard from './components/game/GameBoard.vue';
import SkillsPanel from './components/game/SkillsPanel.vue';
import ChatPanel from './components/game/ChatPanel.vue';
import SkillSelectionModal from './components/modals/SkillSelectionModal.vue';
import GameEndModal from './components/modals/GameEndModal.vue';
import RandomEventNotification from './components/effects/RandomEventNotification.vue';
import SkillEffect from './components/effects/SkillEffect.vue';

// 导入 Composables
import { useSocket } from './composables/useSocket';
import { useMatching } from './composables/useMatching';
import { useGame } from './composables/useGame';
import { useSkills } from './composables/useSkills';
import { useBoard } from './composables/useBoard';
import { useChat } from './composables/useChat';

// ============ 状态管理 ============
const currentView = ref('home'); // home, game, spectate, history
const showSkillSelection = ref(false);
const selectedSkills = ref([]);
const randomEventNotif = ref(false);
const gamesList = ref([]);
const historyList = ref([]);

// ============ Composables 初始化 ============
const { socket, userInfo, stats, connect } = useSocket();
const { isMatching, matchingTime, startMatching, cancelMatching } = useMatching(socket);
const { game, myColor, isSpectating, gameEndModal, mySkills, resetGame, setGame, setGameEnd, setSpectating } = useGame();
const { selectingSkillTarget, skillEffect, canUseSkill, isSkillOnCooldown, useSkill, showSkillEffect } = useSkills(game, myColor, mySkills, isSpectating);
const { boardCanvas, hoverPos, isFrozen, frozenRemaining, initBoard, drawBoard, handleBoardClick, handleBoardHover, startFrozenTimer } = useBoard(game, myColor, isSpectating);
const { chatMessages, chatInput, chatMessagesEl, sendChat, addMessage, clearMessages } = useChat(game, socket);

// ============ Socket 事件监听 ============
function setupSocketListeners() {
  if (!socket.value) return;

  // 匹配事件
  socket.value.on('match:waiting', () => {
    console.log('等待匹配...');
  });

  socket.value.on('match:found', (data) => {
    console.log('匹配成功!', data);
    isMatching.value = false;

    setGame(data.game, data.color);
    currentView.value = 'game';
    showSkillSelection.value = false;

    nextTick(() => {
      initBoard();
      drawBoard();
    });
  });

  // 游戏更新事件
  socket.value.on('game:update', (updatedGame) => {
    setGame(updatedGame);
    drawBoard();

    // 检查是否被冻结
    if (updatedGame.frozenUntil && Date.now() < updatedGame.frozenUntil) {
      startFrozenTimer(updatedGame.frozenUntil);
    }
  });

  // 技能使用事件
  socket.value.on('game:skill-used', ({ playerColor, skillName, game: updatedGame }) => {
    setGame(updatedGame);
    showSkillEffect(skillName);
    drawBoard();
  });

  // 随机事件
  socket.value.on('game:random-event', ({ row, col, color }) => {
    randomEventNotif.value = true;
    setTimeout(() => {
      randomEventNotif.value = false;
    }, 2000);
    drawBoard();
  });

  // 游戏结束事件
  socket.value.on('game:end', (data) => {
    setGame(data.game);
    setGameEnd(data);
    drawBoard();
  });

  // 错误事件
  socket.value.on('game:error', (error) => {
    alert(error.message);
  });

  // 弹幕事件
  socket.value.on('chat:message', (msg) => {
    addMessage(msg);
  });

  // 观战列表事件
  socket.value.on('games:list', (list) => {
    gamesList.value = list;
  });

  // 历史列表事件
  socket.value.on('history:list', (list) => {
    historyList.value = list;
  });

  // 观战加入事件
  socket.value.on('spectate:joined', (data) => {
    setGame(data.game);
    setSpectating(true);
    currentView.value = 'game';

    nextTick(() => {
      initBoard();
      drawBoard();
    });
  });
}

// ============ 事件处理 ============
function handleStartMatching() {
  startMatching(selectedSkills.value);
}

function handleCancelMatching() {
  cancelMatching();
  selectedSkills.value = [];
  showSkillSelection.value = false;
}

function handleSpectate() {
  currentView.value = 'spectate';
}

function handleHistory() {
  currentView.value = 'history';
}

function handleSpectateGame(gameId) {
  socket.value.emit('spectate:join', { gameId });
}

function handleViewHistory(gameId) {
  // TODO: 实现回放功能
  alert('回放功能开发中...');
}

function handleBackToHome() {
  resetGame();
  setGameEnd(null);
  setSpectating(false);
  currentView.value = 'home';
  clearMessages();
  selectedSkills.value = [];
}

// ============ 视图切换监听 ============
watch(() => currentView.value, (newView) => {
  if (newView === 'spectate') {
    socket.value.emit('games:list');

    // 定期刷新列表
    const interval = setInterval(() => {
      if (currentView.value === 'spectate') {
        socket.value.emit('games:list');
      } else {
        clearInterval(interval);
      }
    }, 3000);
  } else if (newView === 'history') {
    socket.value.emit('history:list');
  }
});

// ============ 生命周期 ============
onMounted(() => {
  connect();
  setupSocketListeners();
});
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: radial-gradient(circle at top, #333333, #1a1a1a);
  color: #e0e0e0;
  position: relative;
}
</style>
