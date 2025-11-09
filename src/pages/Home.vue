<template>
  <div class="matrix-container" ref="containerRef">
    <canvas ref="canvasRef"></canvas>

    <!-- 游戏入口按钮 -->
    <div class="game-entrance">
      <h1 class="game-title">王者荣耀</h1>
      <p class="game-subtitle">网页版MOBA游戏</p>
      <button class="play-btn" @click="goToGame">开始游戏</button>
    </div>

    <!-- FAB按钮组 - 右下角 -->
    <div class="fab-container fab-right-bottom">
      <button class="fab-btn fab-fullscreen" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
        <svg v-if="!isFullscreen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
        </svg>
      </button>
      <button class="fab-btn fab-theme" @click="toggleTheme" :title="isDarkTheme ? '切换到亮色主题' : '切换到暗色主题'">
        <svg v-if="isDarkTheme" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
      <button class="fab-btn fab-music" @click="toggleMusic" :title="isMusicPlaying ? '关闭音乐' : '开启音乐'">
        <svg v-if="isMusicPlaying" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      </button>
      <button class="fab-btn fab-help" @click="showHelp" title="帮助">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>
      <button class="fab-btn fab-settings" @click="showSettings" title="设置">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m0-12l-3-3m3 3l3-3M1 12h6m6 0h6m-12 0l-3 3m3-3l-3-3m18 3l-3 3m3-3l-3-3"></path>
        </svg>
      </button>
    </div>

    <!-- FAB按钮组 - 左上角 -->
    <div class="fab-container fab-left-top">
      <button class="fab-btn fab-small fab-pink" @click="showModal('achievement')" title="成就">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>
      </button>
      <button class="fab-btn fab-medium fab-cyan" @click="showModal('message')" title="消息">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
      <button class="fab-btn fab-large fab-gold" @click="showModal('rank')" title="排行榜">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 3v18h18"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
      </button>
    </div>

    <!-- FAB按钮组 - 右上角 -->
    <div class="fab-container fab-right-top">
      <button class="fab-btn fab-medium fab-teal" @click="showModal('shop')" title="商店">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </button>
      <button class="fab-btn fab-small fab-lime" @click="showModal('friend')" title="好友">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </button>
      <button class="fab-btn fab-large fab-indigo" @click="showModal('inventory')" title="背包">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      </button>
    </div>

    <!-- FAB按钮组 - 左下角 -->
    <div class="fab-container fab-left-bottom">
      <button class="fab-btn fab-large fab-amber" @click="showModal('quest')" title="任务">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </button>
      <button class="fab-btn fab-medium fab-rose" @click="showModal('gift')" title="礼物">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 12 20 22 4 22 4 12"></polyline>
          <rect x="2" y="7" width="20" height="5"></rect>
          <line x1="12" y1="22" x2="12" y2="7"></line>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
        </svg>
      </button>
      <button class="fab-btn fab-small fab-violet" @click="showModal('event')" title="活动">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>
    </div>

    <!-- FAB按钮组 - 顶部中间 -->
    <div class="fab-container fab-top-center">
      <button class="fab-btn fab-small fab-emerald" @click="showModal('hero')" title="英雄">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      </button>
      <button class="fab-btn fab-medium fab-sky" @click="showModal('team')" title="组队">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </button>
      <button class="fab-btn fab-small fab-fuchsia" @click="showModal('guild')" title="公会">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </button>
    </div>

    <!-- FAB按钮组 - 底部中间 -->
    <div class="fab-container fab-bottom-center">
      <button class="fab-btn fab-medium fab-orange" @click="showModal('battle')" title="战斗记录">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      </button>
      <button class="fab-btn fab-large fab-red" @click="showModal('live')" title="直播">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>
      <button class="fab-btn fab-small fab-yellow" @click="showModal('skin')" title="皮肤">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <polyline points="17 2 12 7 7 2"></polyline>
        </svg>
      </button>
    </div>

    <!-- FAB按钮组 - 左侧中间 -->
    <div class="fab-container fab-left-middle">
      <button class="fab-btn fab-large fab-purple" @click="showModal('vip')" title="VIP">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      </button>
      <button class="fab-btn fab-small fab-blue" @click="showModal('tutorial')" title="教程">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      </button>
      <button class="fab-btn fab-medium fab-green" @click="showModal('daily')" title="每日奖励">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
    </div>

    <!-- FAB按钮组 - 右侧中间 -->
    <div class="fab-container fab-right-middle">
      <button class="fab-btn fab-medium fab-slate" @click="showModal('stats')" title="数据统计">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      </button>
      <button class="fab-btn fab-large fab-coral" @click="showModal('share')" title="分享">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
      <button class="fab-btn fab-small fab-mint" @click="showModal('feedback')" title="反馈">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </button>
    </div>

    <!-- 通用模态框 -->
    <div v-if="currentModal" class="modal-overlay" @click="currentModal = null">
      <div class="modal-content" @click.stop>
        <h2>{{ modalContent.title }}</h2>
        <div class="modal-body" v-html="modalContent.content"></div>
        <button class="close-btn" @click="currentModal = null">关闭</button>
      </div>
    </div>

    <!-- 帮助对话框 -->
    <div v-if="isHelpVisible" class="modal-overlay" @click="isHelpVisible = false">
      <div class="modal-content" @click.stop>
        <h2>游戏帮助</h2>
        <ul>
          <li>点击"开始游戏"进入游戏</li>
          <li>使用鼠标点击移动英雄</li>
          <li>使用技能键（Q、W、E、R）释放技能</li>
          <li>击败敌人获得经验和金币</li>
          <li>摧毁敌方基地获得胜利</li>
        </ul>
        <button class="close-btn" @click="isHelpVisible = false">关闭</button>
      </div>
    </div>

    <!-- 设置对话框 -->
    <div v-if="isSettingsVisible" class="modal-overlay" @click="isSettingsVisible = false">
      <div class="modal-content" @click.stop>
        <h2>设置</h2>
        <div class="settings-item">
          <label>音乐音量</label>
          <input type="range" v-model="musicVolume" min="0" max="100" />
          <span>{{ musicVolume }}%</span>
        </div>
        <div class="settings-item">
          <label>音效音量</label>
          <input type="range" v-model="soundVolume" min="0" max="100" />
          <span>{{ soundVolume }}%</span>
        </div>
        <div class="settings-item">
          <label>画质</label>
          <select v-model="graphicsQuality">
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
        <button class="close-btn" @click="isSettingsVisible = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const canvasRef = ref(null);
const containerRef = ref(null);
const isFullscreen = ref(false);
const isDarkTheme = ref(true);
const isMusicPlaying = ref(false);
const isHelpVisible = ref(false);
const isSettingsVisible = ref(false);
const musicVolume = ref(50);
const soundVolume = ref(70);
const graphicsQuality = ref('high');
const currentModal = ref(null);

// 模态框内容配置
const modalContents = {
  achievement: {
    title: '成就系统',
    content: '<ul><li>完成每日任务获得成就点</li><li>收集稀有成就解锁特殊奖励</li><li>展示你的荣誉勋章</li><li>成就等级越高，奖励越丰厚</li></ul>'
  },
  message: {
    title: '消息中心',
    content: '<ul><li>查看好友消息</li><li>接收系统通知</li><li>游戏邀请提醒</li><li>礼物接收记录</li></ul>'
  },
  rank: {
    title: '排行榜',
    content: '<ul><li>巅峰赛排名：冲击王者</li><li>战力排行：展示实力</li><li>英雄排行：专精英雄</li><li>赛季奖励：丰厚回馈</li></ul>'
  },
  shop: {
    title: '游戏商店',
    content: '<ul><li>限时特惠：超值优惠</li><li>英雄购买：解锁新英雄</li><li>皮肤商城：个性装扮</li><li>道具商店：提升实力</li></ul>'
  },
  friend: {
    title: '好友系统',
    content: '<ul><li>添加好友：扩展社交</li><li>组队开黑：默契配合</li><li>赠送体力：互帮互助</li><li>好友排名：友谊竞技</li></ul>'
  },
  inventory: {
    title: '背包',
    content: '<ul><li>道具管理：整理物品</li><li>装备强化：提升属性</li><li>材料合成：打造神装</li><li>宝箱开启：惊喜奖励</li></ul>'
  },
  quest: {
    title: '任务中心',
    content: '<ul><li>每日任务：完成获得奖励</li><li>周常任务：丰厚奖励</li><li>成就任务：长期目标</li><li>限时活动：特殊奖励</li></ul>'
  },
  gift: {
    title: '礼物中心',
    content: '<ul><li>领取每日礼包</li><li>接收好友赠礼</li><li>签到奖励</li><li>VIP专属礼包</li></ul>'
  },
  event: {
    title: '活动中心',
    content: '<ul><li>限时活动：把握机会</li><li>节日庆典：欢乐盛宴</li><li>赛季活动：丰厚奖励</li><li>特殊玩法：全新体验</li></ul>'
  },
  hero: {
    title: '英雄殿堂',
    content: '<ul><li>英雄图鉴：收集解锁</li><li>技能介绍：熟悉机制</li><li>出装推荐：战术搭配</li><li>英雄故事：背景设定</li></ul>'
  },
  team: {
    title: '组队大厅',
    content: '<ul><li>快速组队：寻找队友</li><li>语音开黑：畅快沟通</li><li>战术配合：默契合作</li><li>段位匹配：公平竞技</li></ul>'
  },
  guild: {
    title: '公会系统',
    content: '<ul><li>创建公会：招募成员</li><li>公会战：团队荣耀</li><li>公会福利：专属奖励</li><li>公会商店：兑换道具</li></ul>'
  },
  battle: {
    title: '战斗记录',
    content: '<ul><li>查看历史战绩</li><li>数据统计分析</li><li>MVP次数统计</li><li>胜率走势图</li></ul>'
  },
  live: {
    title: '直播中心',
    content: '<ul><li>观看高手直播</li><li>学习操作技巧</li><li>互动聊天</li><li>开启自己的直播</li></ul>'
  },
  skin: {
    title: '皮肤中心',
    content: '<ul><li>英雄皮肤：个性装扮</li><li>限定皮肤：稀有收藏</li><li>皮肤特效：炫酷展示</li><li>皮肤碎片：兑换系统</li></ul>'
  },
  vip: {
    title: 'VIP特权',
    content: '<ul><li>专属礼包：每日领取</li><li>经验加成：快速升级</li><li>金币加成：资源丰厚</li><li>优先匹配：减少等待</li></ul>'
  },
  tutorial: {
    title: '新手教程',
    content: '<ul><li>基础操作：快速上手</li><li>英雄介绍：了解定位</li><li>地图机制：战略要点</li><li>进阶技巧：提升技术</li></ul>'
  },
  daily: {
    title: '每日奖励',
    content: '<ul><li>签到奖励：每日领取</li><li>在线奖励：时长累计</li><li>任务奖励：完成目标</li><li>活跃度奖励：参与游戏</li></ul>'
  },
  stats: {
    title: '数据统计',
    content: '<ul><li>胜率统计：了解水平</li><li>英雄使用率：擅长英雄</li><li>KDA数据：战斗能力</li><li>排位进度：段位变化</li></ul>'
  },
  share: {
    title: '分享',
    content: '<ul><li>分享战绩：炫耀成就</li><li>邀请好友：获得奖励</li><li>社交平台：扩大影响</li><li>截图分享：精彩瞬间</li></ul>'
  },
  feedback: {
    title: '反馈建议',
    content: '<ul><li>游戏Bug反馈</li><li>功能建议</li><li>平衡性意见</li><li>联系客服</li></ul>'
  }
};

// 计算当前模态框内容
const modalContent = computed(() => {
  return currentModal.value ? modalContents[currentModal.value] : { title: '', content: '' };
});

const goToGame = () => {
  router.push('/game');
};

// 显示模态框
const showModal = (modalType) => {
  currentModal.value = modalType;
};

let animationId = null;
let columns = [];
let fontSize = 16;

// 字符集：包含数字、英文字母、日文片假名等
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

const initMatrix = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // 设置canvas尺寸为窗口大小
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 计算列数
    const columnCount = Math.floor(canvas.width / fontSize);

    // 初始化每列的y坐标
    columns = [];
    for (let i = 0; i < columnCount; i++) {
      columns[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
  };

  resize();
  window.addEventListener('resize', resize);

  const draw = () => {
    // 使用半透明黑色覆盖画布，产生拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置字体样式和颜色
    ctx.fillStyle = '#0F0'; // 绿色
    ctx.font = `${fontSize}px monospace`;

    // 绘制字符
    for (let i = 0; i < columns.length; i++) {
      // 随机选择一个字符
      const char = characters[Math.floor(Math.random() * characters.length)];

      // 绘制字符
      const x = i * fontSize;
      const y = columns[i] * fontSize;
      ctx.fillText(char, x, y);

      // 随机重置列，让字符从顶部重新开始
      if (y > canvas.height && Math.random() > 0.975) {
        columns[i] = 0;
      }

      // 向下移动
      columns[i]++;
    }

    animationId = requestAnimationFrame(draw);
  };

  // draw(); // 已停止字符流动动画

  return () => {
    window.removeEventListener('resize', resize);
  };
};

const toggleFullscreen = () => {
  const container = containerRef.value;
  if (!container) return;

  if (!document.fullscreenElement) {
    container.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(err => {
      console.error('无法进入全屏模式:', err);
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    });
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// 主题切换
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  const container = containerRef.value;
  if (container) {
    if (isDarkTheme.value) {
      container.style.backgroundColor = '#000';
      container.style.filter = 'none';
    } else {
      container.style.backgroundColor = '#f0f0f0';
      container.style.filter = 'invert(1) hue-rotate(180deg)';
    }
  }
};

// 音乐开关
const toggleMusic = () => {
  isMusicPlaying.value = !isMusicPlaying.value;
  if (isMusicPlaying.value) {
    console.log('音乐已开启');
    // 这里可以添加实际的音乐播放逻辑
  } else {
    console.log('音乐已关闭');
    // 这里可以添加实际的音乐停止逻辑
  }
};

// 显示帮助
const showHelp = () => {
  isHelpVisible.value = true;
};

// 显示设置
const showSettings = () => {
  isSettingsVisible.value = true;
};

onMounted(() => {
  const cleanup = initMatrix();
  document.addEventListener('fullscreenchange', handleFullscreenChange);

  onUnmounted(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (cleanup) {
      cleanup();
    }
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });
});
</script>

<style scoped>
.matrix-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  margin: 0;
  padding: 0;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* FAB按钮容器 */
.fab-container {
  position: fixed;
  display: flex;
  gap: 15px;
  z-index: 1000;
}

/* 右下角 */
.fab-right-bottom {
  bottom: 30px;
  right: 30px;
  flex-direction: column;
  display: none; /* 隐藏右下角按钮组 */
}

/* 左上角 */
.fab-left-top {
  top: 30px;
  left: 30px;
  flex-direction: column;
}

/* 右上角 */
.fab-right-top {
  top: 30px;
  right: 30px;
  flex-direction: column;
}

/* 左下角 */
.fab-left-bottom {
  bottom: 30px;
  left: 30px;
  flex-direction: column;
}

/* 顶部中间 */
.fab-top-center {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: row;
}

/* 底部中间 */
.fab-bottom-center {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: row;
}

/* 左侧中间 */
.fab-left-middle {
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  flex-direction: column;
}

/* 右侧中间 */
.fab-right-middle {
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  flex-direction: column;
}

/* FAB按钮基础样式 */
.fab-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.fab-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.fab-btn:hover::before {
  width: 100%;
  height: 100%;
}

.fab-btn:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.fab-btn:active {
  transform: scale(0.95);
}

.fab-btn svg {
  width: 24px;
  height: 24px;
  position: relative;
  z-index: 1;
}

/* 按钮大小变体 */
.fab-small {
  width: 40px;
  height: 40px;
}

.fab-medium {
  width: 56px;
  height: 56px;
}

.fab-large {
  width: 70px;
  height: 70px;
}

/* 全屏按钮 - 绿色 */
.fab-fullscreen {
  background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
  color: #fff;
  animation: pulse-green 2s ease-in-out infinite;
}

.fab-fullscreen:hover {
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.6);
}

@keyframes pulse-green {
  0%, 100% {
    box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(0, 255, 0, 0.6);
  }
}

/* 主题按钮 - 蓝色 */
.fab-theme {
  background: linear-gradient(135deg, #00bfff 0%, #0080ff 100%);
  color: #fff;
  animation: rotate-slow 10s linear infinite;
}

.fab-theme:hover {
  box-shadow: 0 0 30px rgba(0, 191, 255, 0.6);
  animation: rotate-fast 1s linear infinite;
}

@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate-fast {
  from {
    transform: rotate(0deg) scale(1.1);
  }
  to {
    transform: rotate(360deg) scale(1.1);
  }
}

/* 音乐按钮 - 紫色 */
.fab-music {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  color: #fff;
  animation: bounce 2s ease-in-out infinite;
}

.fab-music:hover {
  box-shadow: 0 0 30px rgba(155, 89, 182, 0.6);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 帮助按钮 - 橙色 */
.fab-help {
  background: linear-gradient(135deg, #ff9500 0%, #ff6500 100%);
  color: #fff;
  animation: shake 3s ease-in-out infinite;
}

.fab-help:hover {
  box-shadow: 0 0 30px rgba(255, 149, 0, 0.6);
}

@keyframes shake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

/* 设置按钮 - 红色 */
.fab-settings {
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
  color: #fff;
  animation: pulse-red 2s ease-in-out infinite;
}

.fab-settings:hover {
  box-shadow: 0 0 30px rgba(255, 71, 87, 0.6);
  animation: spin 1s linear infinite;
}

@keyframes pulse-red {
  0%, 100% {
    box-shadow: 0 4px 8px rgba(255, 71, 87, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.6);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg) scale(1.1);
  }
  to {
    transform: rotate(360deg) scale(1.1);
  }
}

/* 新增颜色样式 */
/* 粉色 */
.fab-pink {
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: #fff;
}

.fab-pink:hover {
  box-shadow: 0 0 30px rgba(255, 105, 180, 0.6);
}

/* 青色 */
.fab-cyan {
  background: linear-gradient(135deg, #00ffff 0%, #00cccc 100%);
  color: #fff;
}

.fab-cyan:hover {
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
}

/* 金色 */
.fab-gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #333;
}

.fab-gold:hover {
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
}

/* 青绿色 */
.fab-teal {
  background: linear-gradient(135deg, #20b2aa 0%, #008b8b 100%);
  color: #fff;
}

.fab-teal:hover {
  box-shadow: 0 0 30px rgba(32, 178, 170, 0.6);
}

/* 青柠色 */
.fab-lime {
  background: linear-gradient(135deg, #00ff00 0%, #32cd32 100%);
  color: #fff;
}

.fab-lime:hover {
  box-shadow: 0 0 30px rgba(50, 205, 50, 0.6);
}

/* 靛蓝色 */
.fab-indigo {
  background: linear-gradient(135deg, #4b0082 0%, #6a0dad 100%);
  color: #fff;
}

.fab-indigo:hover {
  box-shadow: 0 0 30px rgba(75, 0, 130, 0.6);
}

/* 琥珀色 */
.fab-amber {
  background: linear-gradient(135deg, #ffbf00 0%, #ff8c00 100%);
  color: #fff;
}

.fab-amber:hover {
  box-shadow: 0 0 30px rgba(255, 191, 0, 0.6);
}

/* 玫瑰色 */
.fab-rose {
  background: linear-gradient(135deg, #ff007f 0%, #e91e63 100%);
  color: #fff;
}

.fab-rose:hover {
  box-shadow: 0 0 30px rgba(255, 0, 127, 0.6);
}

/* 紫罗兰色 */
.fab-violet {
  background: linear-gradient(135deg, #8a2be2 0%, #9370db 100%);
  color: #fff;
}

.fab-violet:hover {
  box-shadow: 0 0 30px rgba(138, 43, 226, 0.6);
}

/* 翡翠绿 */
.fab-emerald {
  background: linear-gradient(135deg, #50c878 0%, #2e8b57 100%);
  color: #fff;
}

.fab-emerald:hover {
  box-shadow: 0 0 30px rgba(80, 200, 120, 0.6);
}

/* 天空蓝 */
.fab-sky {
  background: linear-gradient(135deg, #87ceeb 0%, #4682b4 100%);
  color: #fff;
}

.fab-sky:hover {
  box-shadow: 0 0 30px rgba(135, 206, 235, 0.6);
}

/* 紫红色 */
.fab-fuchsia {
  background: linear-gradient(135deg, #ff00ff 0%, #c71585 100%);
  color: #fff;
}

.fab-fuchsia:hover {
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.6);
}

/* 红色 */
.fab-red {
  background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
  color: #fff;
}

.fab-red:hover {
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.6);
}

/* 黄色 */
.fab-yellow {
  background: linear-gradient(135deg, #ffff00 0%, #ffd700 100%);
  color: #333;
}

.fab-yellow:hover {
  box-shadow: 0 0 30px rgba(255, 255, 0, 0.6);
}

/* 紫色 */
.fab-purple {
  background: linear-gradient(135deg, #800080 0%, #9932cc 100%);
  color: #fff;
}

.fab-purple:hover {
  box-shadow: 0 0 30px rgba(128, 0, 128, 0.6);
}

/* 蓝色 */
.fab-blue {
  background: linear-gradient(135deg, #0000ff 0%, #0047ab 100%);
  color: #fff;
}

.fab-blue:hover {
  box-shadow: 0 0 30px rgba(0, 0, 255, 0.6);
}

/* 绿色 */
.fab-green {
  background: linear-gradient(135deg, #008000 0%, #006400 100%);
  color: #fff;
}

.fab-green:hover {
  box-shadow: 0 0 30px rgba(0, 128, 0, 0.6);
}

/* 石板色 */
.fab-slate {
  background: linear-gradient(135deg, #708090 0%, #2f4f4f 100%);
  color: #fff;
}

.fab-slate:hover {
  box-shadow: 0 0 30px rgba(112, 128, 144, 0.6);
}

/* 珊瑚色 */
.fab-coral {
  background: linear-gradient(135deg, #ff7f50 0%, #ff6347 100%);
  color: #fff;
}

.fab-coral:hover {
  box-shadow: 0 0 30px rgba(255, 127, 80, 0.6);
}

/* 薄荷色 */
.fab-mint {
  background: linear-gradient(135deg, #98ff98 0%, #00fa9a 100%);
  color: #333;
}

.fab-mint:hover {
  box-shadow: 0 0 30px rgba(152, 255, 152, 0.6);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(50, 50, 50, 0.95) 100%);
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 215, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content h2 {
  color: #ffd700;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 28px;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.modal-content ul {
  color: #fff;
  list-style-position: inside;
  line-height: 1.8;
  margin-bottom: 30px;
}

.modal-content li {
  margin-bottom: 10px;
  color: #0F0;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.modal-body {
  color: #fff;
  line-height: 1.8;
  margin-bottom: 30px;
}

.modal-body ul {
  list-style-position: inside;
  padding-left: 0;
}

.modal-body li {
  margin-bottom: 10px;
}

.settings-item {
  margin-bottom: 20px;
  color: #fff;
}

.settings-item label {
  display: block;
  margin-bottom: 8px;
  color: #ffd700;
  font-weight: bold;
}

.settings-item input[type="range"] {
  width: 100%;
  margin-right: 10px;
}

.settings-item select {
  width: 100%;
  padding: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #ffd700;
  color: #fff;
  border-radius: 5px;
}

.settings-item span {
  color: #0F0;
  font-weight: bold;
}

.close-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: none;
  border-radius: 10px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 215, 0, 0.5);
}

.game-entrance {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 999;
}

.game-title {
  font-size: 72px;
  color: #ffd700;
  margin-bottom: 20px;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
               0 0 60px rgba(255, 215, 0, 0.5);
  font-weight: bold;
  letter-spacing: 10px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.6),
                 0 0 40px rgba(255, 215, 0, 0.4);
  }
  to {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.9),
                 0 0 60px rgba(255, 215, 0, 0.6),
                 0 0 90px rgba(255, 215, 0, 0.3);
  }
}

.game-subtitle {
  font-size: 24px;
  color: #0F0;
  margin-bottom: 40px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
  letter-spacing: 5px;
}

.play-btn {
  padding: 20px 60px;
  font-size: 28px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: 3px solid #ffa500;
  border-radius: 50px;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
  letter-spacing: 3px;
  text-transform: uppercase;
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.6),
              0 0 40px rgba(255, 215, 0, 0.4);
  background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
}

.play-btn:active {
  transform: scale(1.05);
}

/* ==================== 移动端响应式优化 ==================== */

/* 平板和小屏设备 (≤768px) */
@media screen and (max-width: 768px) {
  /* 游戏入口优化 */
  .game-title {
    font-size: clamp(32px, 10vw, 72px);
    letter-spacing: 5px;
    margin-bottom: 15px;
  }

  .game-subtitle {
    font-size: clamp(16px, 4vw, 24px);
    letter-spacing: 2px;
    margin-bottom: 30px;
  }

  .play-btn {
    padding: 15px 40px;
    font-size: clamp(20px, 5vw, 28px);
    letter-spacing: 2px;
  }

  /* FAB按钮容器位置调整 */
  .fab-left-top,
  .fab-right-top,
  .fab-left-bottom,
  .fab-left-middle,
  .fab-right-middle {
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
  }

  .fab-right-bottom {
    bottom: 15px;
    right: 15px;
  }

  .fab-top-center {
    top: 15px;
  }

  .fab-bottom-center {
    bottom: 15px;
  }

  .fab-left-middle,
  .fab-right-middle {
    gap: 10px;
  }

  /* FAB按钮大小优化 - 增大触摸区域 */
  .fab-btn {
    width: 48px;
    height: 48px;
  }

  .fab-small {
    width: 44px;
    height: 44px;
  }

  .fab-medium {
    width: 48px;
    height: 48px;
  }

  .fab-large {
    width: 52px;
    height: 52px;
  }

  .fab-container {
    gap: 10px;
  }

  /* 模态框优化 */
  .modal-content {
    padding: 25px 20px;
    max-width: 90%;
    width: 90%;
    margin: 0 20px;
  }

  .modal-content h2 {
    font-size: clamp(20px, 6vw, 28px);
    margin-bottom: 15px;
  }

  .modal-content ul,
  .modal-body {
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .close-btn {
    padding: 12px;
    font-size: 14px;
  }

  .settings-item {
    margin-bottom: 15px;
  }

  .settings-item label {
    font-size: 14px;
  }
}

/* 手机小屏设备 (≤480px) */
@media screen and (max-width: 480px) {
  /* 进一步缩小标题 */
  .game-title {
    font-size: clamp(28px, 8vw, 48px);
    letter-spacing: 3px;
    margin-bottom: 10px;
  }

  .game-subtitle {
    font-size: clamp(14px, 3.5vw, 18px);
    letter-spacing: 1px;
    margin-bottom: 20px;
  }

  .play-btn {
    padding: 12px 30px;
    font-size: clamp(18px, 4.5vw, 22px);
    letter-spacing: 1px;
  }

  /* FAB按钮进一步优化 */
  .fab-container {
    gap: 8px;
  }

  .fab-btn {
    width: 44px;
    height: 44px;
  }

  .fab-small {
    width: 40px;
    height: 40px;
  }

  .fab-medium {
    width: 44px;
    height: 44px;
  }

  .fab-large {
    width: 48px;
    height: 48px;
  }

  .fab-btn svg {
    width: 20px;
    height: 20px;
  }

  .fab-small svg {
    width: 16px;
    height: 16px;
  }

  .fab-large svg {
    width: 24px;
    height: 24px;
  }

  /* FAB容器边距优化 */
  .fab-left-top {
    top: 10px;
    left: 10px;
  }

  .fab-right-top {
    top: 10px;
    right: 10px;
  }

  .fab-left-bottom {
    bottom: 10px;
    left: 10px;
  }

  .fab-right-bottom {
    bottom: 10px;
    right: 10px;
  }

  .fab-top-center {
    top: 10px;
  }

  .fab-bottom-center {
    bottom: 10px;
  }

  .fab-left-middle {
    left: 10px;
  }

  .fab-right-middle {
    right: 10px;
  }

  /* 模态框进一步优化 */
  .modal-content {
    padding: 20px 15px;
    max-width: 95%;
    width: 95%;
    margin: 0 10px;
    border-radius: 15px;
  }

  .modal-content h2 {
    font-size: clamp(18px, 5vw, 24px);
    margin-bottom: 12px;
  }

  .modal-content ul,
  .modal-body {
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 15px;
  }

  .modal-content li {
    margin-bottom: 8px;
    font-size: 13px;
  }

  .close-btn {
    padding: 10px;
    font-size: 13px;
  }

  .settings-item {
    margin-bottom: 12px;
  }

  .settings-item label {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .settings-item select {
    padding: 6px;
    font-size: 13px;
  }
}

/* 横屏优化 (高度较小的设备) */
@media screen and (max-height: 500px) and (orientation: landscape) {
  .game-title {
    font-size: clamp(24px, 6vh, 40px);
    margin-bottom: 8px;
  }

  .game-subtitle {
    font-size: clamp(12px, 3vh, 16px);
    margin-bottom: 15px;
  }

  .play-btn {
    padding: 10px 25px;
    font-size: clamp(16px, 4vh, 20px);
  }

  .fab-container {
    gap: 6px;
  }

  .fab-btn {
    width: 40px;
    height: 40px;
  }

  .modal-content {
    max-height: 80vh;
    overflow-y: auto;
    padding: 15px;
  }
}

/* 触摸设备优化 - 增大点击区域 */
@media (hover: none) and (pointer: coarse) {
  .fab-btn {
    min-width: 44px;
    min-height: 44px;
  }

  .play-btn {
    min-height: 44px;
  }

  .close-btn {
    min-height: 44px;
  }
}
</style>
