<template>
  <div class="audio-track" :style="{ borderLeft: `4px solid ${track.color}` }">
    <div class="track-header">
      <div class="track-info">
        <input
          v-model="localTrack.name"
          @change="emitUpdate"
          class="track-name"
          placeholder="音轨名称"
        />
        <span class="track-status">
          {{ track.audioBuffer ? '✓ 已加载' : '○ 空' }}
        </span>
      </div>

      <div class="track-controls">
        <button
          @click="toggleMute"
          :class="{ active: localTrack.muted }"
          class="btn-control"
          title="静音"
        >
          {{ localTrack.muted ? '🔇' : '🔊' }}
        </button>

        <button
          @click="toggleSolo"
          :class="{ active: localTrack.solo }"
          class="btn-control"
          title="独奏"
        >
          S
        </button>

        <button
          @click="toggleLoop"
          :class="{ active: localTrack.loop }"
          class="btn-control"
          title="循环播放"
        >
          🔁
        </button>

        <div class="volume-control">
          <input
            type="range"
            min="0"
            max="100"
            v-model="localTrack.volume"
            @input="emitUpdate"
            class="track-volume"
          />
          <span class="volume-label">{{ localTrack.volume }}%</span>
        </div>

        <label class="btn-upload" title="上传音频">
          📁
          <input
            type="file"
            accept="audio/*"
            @change="handleFileUpload"
            style="display: none;"
          />
        </label>

        <button @click="deleteTrack" class="btn-delete" title="删除音轨">
          🗑
        </button>
      </div>
    </div>

    <!-- 效果器面板 -->
    <div v-if="track.audioBuffer" class="effects-panel">
      <div class="effects-header">
        <span class="effects-title">效果器</span>
        <div class="effects-actions">
          <button
            v-for="effectType in availableEffects"
            :key="effectType.type"
            @click="addEffect(effectType.type)"
            class="btn-add-effect"
            :title="effectType.description"
          >
            {{ effectType.icon }} {{ effectType.name }}
          </button>
        </div>
      </div>

      <div v-if="localTrack.effects && localTrack.effects.length > 0" class="effects-list">
        <EffectControls
          v-for="effect in localTrack.effects"
          :key="effect.id"
          :effect="effect"
          @update="handleEffectUpdate"
          @remove="removeEffect(effect.id)"
        />
      </div>
      <div v-else class="effects-empty">
        点击上方按钮添加效果器
      </div>
    </div>

    <!-- 编排控制面板 -->
    <div v-if="track.audioBuffer" class="arrangement-controls">
      <div class="control-group">
        <label>时间线位置</label>
        <input
          type="number"
          min="0"
          step="0.1"
          v-model.number="localTrack.startTime"
          @input="emitUpdate"
          class="control-input"
        />
        <span class="unit">秒</span>
      </div>

      <div class="control-group">
        <label>裁剪开始</label>
        <input
          type="number"
          min="0"
          :max="track.audioBuffer.duration"
          step="0.1"
          v-model.number="localTrack.trimStart"
          @input="emitUpdate"
          class="control-input"
        />
        <span class="unit">秒</span>
      </div>

      <div class="control-group">
        <label>裁剪结束</label>
        <input
          type="number"
          :min="localTrack.trimStart || 0"
          :max="track.audioBuffer.duration"
          step="0.1"
          :value="getTrimEnd()"
          @input="updateTrimEnd"
          class="control-input"
        />
        <span class="unit">秒</span>
      </div>

      <div class="control-group">
        <label>片段长度</label>
        <span class="info-value">{{ getClipDuration().toFixed(2) }}秒</span>
      </div>
    </div>

    <div class="track-content">
      <canvas
        ref="waveformCanvas"
        class="waveform-canvas"
        @mousedown="handleWaveformMouseDown"
        @mousemove="handleWaveformMouseMove"
        @mouseup="handleWaveformMouseUp"
        @mouseleave="handleWaveformMouseUp"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import EffectControls from './EffectControls.vue';
import { EffectFactory } from '../audio/effects/EffectFactory.js';

const props = defineProps({
  track: {
    type: Object,
    required: true
  },
  currentTime: {
    type: Number,
    default: 0
  },
  isPlaying: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 180
  }
});

const emit = defineEmits(['update-track', 'delete-track', 'add-audio']);

const localTrack = ref({ ...props.track });
const waveformCanvas = ref(null);

// 可用的效果器列表
const availableEffects = EffectFactory.getAvailableEffects();

// 拖动状态
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartTime = ref(0);

// 更新本地音轨
watch(() => props.track, (newTrack) => {
  localTrack.value = {
    ...newTrack,
    startTime: newTrack.startTime !== undefined ? newTrack.startTime : 0,
    trimStart: newTrack.trimStart !== undefined ? newTrack.trimStart : 0,
    trimEnd: newTrack.trimEnd !== undefined ? newTrack.trimEnd : null,
    effects: newTrack.effects || []
  };
  drawWaveform();
}, { deep: true });

// 添加效果器
const addEffect = (type) => {
  if (!localTrack.value.effects) {
    localTrack.value.effects = [];
  }

  // 创建效果器配置（暂时只保存配置，实际音频节点在DAW中创建）
  const effectConfig = {
    id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: type,
    name: EffectFactory.getAvailableEffects().find(e => e.type === type)?.name || type,
    enabled: true,
    params: getDefaultParams(type)
  };

  localTrack.value.effects.push(effectConfig);
  emitUpdate();
};

// 获取默认参数
const getDefaultParams = (type) => {
  switch (type) {
    case 'distortion':
      return { drive: 50, tone: 50, level: 80 };
    case 'reverb':
      return { roomSize: 50, damping: 50, wetDry: 30 };
    case 'delay':
      return { time: 375, feedback: 30, mix: 40 };
    case 'eq':
      return { lowGain: 0, midGain: 0, highGain: 0, lowFreq: 250, midFreq: 1000, highFreq: 4000 };
    default:
      return {};
  }
};

// 移除效果器
const removeEffect = (effectId) => {
  if (localTrack.value.effects) {
    const index = localTrack.value.effects.findIndex(e => e.id === effectId);
    if (index !== -1) {
      localTrack.value.effects.splice(index, 1);
      emitUpdate();
    }
  }
};

// 更新效果器参数
const handleEffectUpdate = ({ effectId, paramName, value }) => {
  if (!localTrack.value.effects) return;

  const effect = localTrack.value.effects.find(e => e.id === effectId);
  if (!effect) return;

  if (paramName === 'enabled') {
    effect.enabled = value;
  } else {
    if (!effect.params) effect.params = {};
    effect.params[paramName] = value;
  }

  emitUpdate();
};

// 切换静音
const toggleMute = () => {
  localTrack.value.muted = !localTrack.value.muted;
  emitUpdate();
};

// 切换独奏
const toggleSolo = () => {
  localTrack.value.solo = !localTrack.value.solo;
  emitUpdate();
};

// 切换循环
const toggleLoop = () => {
  localTrack.value.loop = !localTrack.value.loop;
  emitUpdate();
};

// 删除音轨
const deleteTrack = () => {
  if (confirm(`确定要删除 "${localTrack.value.name}" 吗？`)) {
    emit('delete-track', localTrack.value.id);
  }
};

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('add-audio', localTrack.value.id, file);
  }
};

// 发送更新
const emitUpdate = () => {
  emit('update-track', localTrack.value);
};

// 获取trimEnd值（如果为null则返回音频总时长）
const getTrimEnd = () => {
  if (!props.track.audioBuffer) return 0;
  return localTrack.value.trimEnd !== null && localTrack.value.trimEnd !== undefined
    ? localTrack.value.trimEnd
    : props.track.audioBuffer.duration;
};

// 更新trimEnd值
const updateTrimEnd = (event) => {
  const value = parseFloat(event.target.value);
  localTrack.value.trimEnd = value;
  emitUpdate();
};

// 获取片段长度
const getClipDuration = () => {
  if (!props.track.audioBuffer) return 0;
  const trimStart = localTrack.value.trimStart || 0;
  const trimEnd = getTrimEnd();
  return trimEnd - trimStart;
};

// 绘制波形（支持时间线编排）
const drawWaveform = async () => {
  await nextTick();

  if (!waveformCanvas.value) return;

  const canvas = waveformCanvas.value;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 绘制背景
  ctx.fillStyle = '#0f0f0f';
  ctx.fillRect(0, 0, width, height);

  // 绘制时间线网格
  const totalDuration = props.duration || 180;
  const pixelsPerSecond = width / totalDuration;
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1;
  for (let i = 0; i <= totalDuration; i += 5) {
    const x = i * pixelsPerSecond;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  if (!props.track.audioBuffer) {
    // 显示空状态
    ctx.fillStyle = '#444';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('点击 📁 上传音频文件', width / 2, height / 2);
    return;
  }

  // 计算音频片段在时间线上的位置
  const audioBuffer = props.track.audioBuffer;
  const trackStartTime = localTrack.value.startTime || 0;
  const trimStart = localTrack.value.trimStart || 0;
  const trimEnd = localTrack.value.trimEnd !== null && localTrack.value.trimEnd !== undefined
    ? localTrack.value.trimEnd
    : audioBuffer.duration;
  const clipDuration = trimEnd - trimStart;

  // 计算片段在画布上的位置和宽度
  const clipStartX = trackStartTime * pixelsPerSecond;
  const clipWidth = clipDuration * pixelsPerSecond;

  // 绘制音频片段背景
  ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
  ctx.fillRect(clipStartX, 0, clipWidth, height);

  // 绘制波形
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const trimStartSample = Math.floor(trimStart * sampleRate);
  const trimEndSample = Math.floor(trimEnd * sampleRate);
  const trimmedSamples = trimEndSample - trimStartSample;
  const samplesPerPixel = trimmedSamples / clipWidth;
  const amp = height / 2;

  ctx.fillStyle = props.track.color;
  ctx.strokeStyle = props.track.color;
  ctx.lineWidth = 1;

  for (let i = 0; i < clipWidth; i++) {
    let min = 1.0;
    let max = -1.0;

    const sampleStart = trimStartSample + Math.floor(i * samplesPerPixel);
    const sampleEnd = Math.min(sampleStart + Math.ceil(samplesPerPixel), trimEndSample);

    for (let j = sampleStart; j < sampleEnd; j++) {
      if (j < channelData.length) {
        const datum = channelData[j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
    }

    const x = clipStartX + i;
    const yMin = (1 + min) * amp;
    const yMax = (1 + max) * amp;

    ctx.fillRect(x, yMin, 1, yMax - yMin);
  }

  // 绘制片段边框
  ctx.strokeStyle = props.track.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(clipStartX, 0, clipWidth, height);

  // 绘制播放进度
  if (props.isPlaying && props.currentTime >= trackStartTime && props.currentTime < trackStartTime + clipDuration) {
    const playheadX = props.currentTime * pixelsPerSecond;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
  }
};

// 拖动事件处理
const handleWaveformMouseDown = (event) => {
  if (!props.track.audioBuffer || props.isPlaying) return;

  const canvas = waveformCanvas.value;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const totalDuration = props.duration || 180;
  const pixelsPerSecond = canvas.width / totalDuration;

  const trackStartTime = localTrack.value.startTime || 0;
  const trimStart = localTrack.value.trimStart || 0;
  const trimEnd = localTrack.value.trimEnd !== null && localTrack.value.trimEnd !== undefined
    ? localTrack.value.trimEnd
    : props.track.audioBuffer.duration;
  const clipDuration = trimEnd - trimStart;

  const clipStartX = trackStartTime * pixelsPerSecond;
  const clipEndX = clipStartX + clipDuration * pixelsPerSecond;

  // 检查是否点击在音频片段上
  if (x >= clipStartX && x <= clipEndX) {
    isDragging.value = true;
    dragStartX.value = x;
    dragStartTime.value = trackStartTime;
    canvas.style.cursor = 'grabbing';
  }
};

const handleWaveformMouseMove = (event) => {
  if (!isDragging.value || !props.track.audioBuffer) return;

  const canvas = waveformCanvas.value;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const totalDuration = props.duration || 180;
  const pixelsPerSecond = canvas.width / totalDuration;

  const deltaX = x - dragStartX.value;
  const deltaTime = deltaX / pixelsPerSecond;
  let newStartTime = dragStartTime.value + deltaTime;

  // 限制在合理范围内
  newStartTime = Math.max(0, Math.min(newStartTime, totalDuration - getClipDuration()));

  localTrack.value.startTime = newStartTime;
  drawWaveform();
};

const handleWaveformMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false;
    if (waveformCanvas.value) {
      waveformCanvas.value.style.cursor = 'grab';
    }
    emitUpdate();
  }
};

// 初始化
onMounted(() => {
  if (waveformCanvas.value) {
    waveformCanvas.value.width = waveformCanvas.value.offsetWidth;
    waveformCanvas.value.height = 80;
    drawWaveform();
  }

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (waveformCanvas.value) {
      waveformCanvas.value.width = waveformCanvas.value.offsetWidth;
      drawWaveform();
    }
  });
});

// 监听播放状态
watch(() => [props.currentTime, props.isPlaying], () => {
  drawWaveform();
});
</script>

<style scoped>
.audio-track {
  background: linear-gradient(135deg, #FFFFFF 0%, #FFF9FC 100%);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(255, 182, 217, 0.3);
  margin-bottom: 15px;
}

.audio-track:hover {
  box-shadow: 0 6px 20px rgba(255, 182, 217, 0.5);
  transform: translateY(-2px);
}

.track-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #FFE5EC 0%, #FFF0F5 100%);
  border-bottom: 2px solid #FFB6D9;
}

.track-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.track-name {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #FF69B4;
  font-size: 16px;
  font-weight: 700;
  padding: 5px 10px;
  outline: none;
  transition: all 0.3s;
  min-width: 150px;
}

.track-name:hover,
.track-name:focus {
  border-bottom-color: #FF69B4;
  background: rgba(255, 105, 180, 0.1);
}

.track-status {
  font-size: 12px;
  color: #FF69B4;
  padding: 5px 12px;
  background: white;
  border-radius: 15px;
  font-weight: 600;
  border: 2px solid #FFB6D9;
}

.track-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-control {
  padding: 8px 12px;
  background: white;
  border: 2px solid #FFB6D9;
  border-radius: 12px;
  color: #FF69B4;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 36px;
}

.btn-control:hover {
  background: linear-gradient(135deg, #FFB6D9 0%, #FF69B4 100%);
  border-color: #FF69B4;
  color: white;
  transform: scale(1.05);
}

.btn-control.active {
  background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
  border-color: #FF1493;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 20, 147, 0.4);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.track-volume {
  width: 100px;
}

.volume-label {
  font-size: 12px;
  color: #FF69B4;
  font-weight: 600;
  min-width: 40px;
}

.btn-upload {
  padding: 8px 12px;
  background: linear-gradient(135deg, #98FB98 0%, #32CD32 100%);
  border: 2px solid #32CD32;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  box-shadow: 0 3px 10px rgba(50, 205, 50, 0.3);
}

.btn-upload:hover {
  background: linear-gradient(135deg, #90EE90 0%, #228B22 100%);
  border-color: #228B22;
  transform: scale(1.08);
  box-shadow: 0 5px 15px rgba(50, 205, 50, 0.5);
}

.btn-delete {
  padding: 8px 12px;
  background: white;
  border: 2px solid #FFB6D9;
  border-radius: 12px;
  color: #FF69B4;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 36px;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
  border-color: #FF1493;
  color: white;
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(255, 20, 147, 0.4);
}

.track-content {
  padding: 15px;
}

.waveform-canvas {
  width: 100%;
  height: 80px;
  cursor: grab;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFF9FC 0%, #FFE5EC 100%);
  border: 2px solid #FFB6D9;
}

.waveform-canvas:active {
  cursor: grabbing;
}

.arrangement-controls {
  padding: 15px;
  background: #1a1a1a;
  border-top: 1px solid #2a2a2a;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-size: 12px;
  color: #888;
  min-width: 80px;
}

.control-input {
  width: 80px;
  padding: 6px 10px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  font-size: 13px;
  text-align: center;
}

.control-input:focus {
  outline: none;
  border-color: #667eea;
}

.unit {
  font-size: 12px;
  color: #666;
}

.info-value {
  font-size: 13px;
  color: #667eea;
  font-weight: 600;
  padding: 6px 10px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 4px;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: #2a2a2a;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  background: #764ba2;
}

input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
  background: #764ba2;
}

.effects-panel {
  padding: 15px;
  background: #1a1a1a;
  border-top: 1px solid #2a2a2a;
  border-bottom: 1px solid #2a2a2a;
}

.effects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.effects-title {
  font-size: 14px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.effects-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-add-effect {
  padding: 6px 12px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #aaa;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-add-effect:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: translateY(-1px);
}

.effects-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.effects-empty {
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 13px;
  font-style: italic;
  background: #0f0f0f;
  border-radius: 6px;
  border: 1px dashed #333;
}
</style>
