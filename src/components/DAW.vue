<template>
  <div class="daw-container">
    <header class="daw-header">
      <h1 @click="handleTitleClick" style="cursor: pointer;">🎵 ひなビタ♪音乐工作站 🎵</h1>
      <div class="header-controls">
        <button @click="saveProject" class="btn-save">💾 保存项目</button>
        <button @click="loadProject" class="btn-load">📂 加载项目</button>
        <button @click="newProject" class="btn-new">✨ 新建项目</button>
      </div>
    </header>

    <div class="daw-main">
      <div class="main-controls-container">
        <!-- 传输控制栏 -->
        <div class="transport-bar">
          <div class="transport-controls">
            <button @click="play" :disabled="isPlaying" class="btn-play">▶ 播放</button>
            <button @click="pause" :disabled="!isPlaying" class="btn-pause">⏸ 暂停</button>
            <button @click="stop" class="btn-stop">⏹ 停止</button>
            <button @click="record" :class="{'recording': isRecording}" class="btn-record">● 录音</button>
          </div>

          <div class="time-display">
            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <span class="separator">/</span>
            <span class="duration">{{ formatTime(duration) }}</span>
          </div>

          <div class="master-volume">
            <label>主音量</label>
            <input
              type="range"
              min="0"
              max="100"
              v-model="masterVolume"
              @input="updateMasterVolume"
              class="volume-slider"
            />
            <span class="volume-value">{{ masterVolume }}%</span>
          </div>

          <div class="tempo-control">
            <label>BPM</label>
            <input
              type="number"
              min="60"
              max="200"
              v-model="tempo"
              class="tempo-input"
            />
          </div>
        </div>

        <!-- 响度表 -->
        <VolumeMeter
          :audioContext="audioContext"
          :sourceNode="masterGainNode"
          :isPlaying="isPlaying"
        />
      </div>

      <!-- 音轨列表 -->
      <div class="tracks-container">
        <div class="tracks-header">
          <h2>音轨</h2>
          <button @click="addTrack" class="btn-add-track">+ 添加音轨</button>
        </div>

        <div class="tracks-list">
          <AudioTrack
            v-for="track in tracks"
            :key="track.id"
            :track="track"
            :currentTime="currentTime"
            :isPlaying="isPlaying"
            :duration="duration"
            @update-track="updateTrack"
            @delete-track="deleteTrack"
            @add-audio="addAudioToTrack"
          />
        </div>
      </div>

      <!-- 时间线 -->
      <div class="timeline-container">
        <canvas
          ref="timelineCanvas"
          class="timeline-canvas"
          @click="seekToPosition"
        ></canvas>
      </div>
    </div>

    <!-- 草泥马彩蛋 -->
    <div v-if="showAlpacaEasterEgg" class="alpaca-easter-egg">
      <div class="easter-egg-header">
        <span>🦙 奔跑的草泥马</span>
        <button @click="showAlpacaEasterEgg = false" class="close-btn">×</button>
      </div>
      <div class="easter-egg-content">
        <AlpacaEasterEgg />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import AudioTrack from './AudioTrack.vue';
import AlpacaEasterEgg from './AlpacaEasterEgg.vue';
import VolumeMeter from './VolumeMeter.vue';
import { EffectChain } from '../audio/effects/EffectChain.js';

// 状态管理
const tracks = ref([]);
const showAlpacaEasterEgg = ref(false);
let titleClickCount = 0;
let titleClickTimeout = null;
const isPlaying = ref(false);
const isPaused = ref(false);
const isRecording = ref(false);
const currentTime = ref(0);
const duration = ref(180); // 默认3分钟
const masterVolume = ref(80);
const tempo = ref(120);
const timelineCanvas = ref(null);

// Web Audio API
let audioContext = null;
let masterGainNode = null;
let animationFrameId = null;
let startTime = 0;
let pauseTime = 0;

// 初始化音频上下文
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    updateMasterVolume();
  }
};

// 播放控制
const play = () => {
  initAudioContext();

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  isPlaying.value = true;
  isPaused.value = false;
  startTime = audioContext.currentTime - currentTime.value;

  // 播放所有音轨
  tracks.value.forEach(track => {
    if (track.audioBuffer && !track.muted) {
      playTrack(track);
    }
  });

  updateTimeline();
};

const pause = () => {
  isPlaying.value = false;
  isPaused.value = true;
  pauseTime = currentTime.value;

  // 停止所有音轨
  tracks.value.forEach(track => {
    if (track.sourceNode) {
      track.sourceNode.stop();
      track.sourceNode = null;
    }
  });

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
};

const stop = () => {
  isPlaying.value = false;
  isPaused.value = false;
  currentTime.value = 0;

  tracks.value.forEach(track => {
    if (track.sourceNode) {
      track.sourceNode.stop();
      track.sourceNode = null;
    }
  });

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  drawTimeline();
};

const record = async () => {
  if (!isRecording.value) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      isRecording.value = true;

      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // 创建新音轨并添加录音
        const newTrack = createNewTrack();
        newTrack.audioBuffer = audioBuffer;
        newTrack.name = `录音 ${new Date().toLocaleTimeString()}`;
        tracks.value.push(newTrack);

        stream.getTracks().forEach(track => track.stop());
        isRecording.value = false;
      };

      mediaRecorder.start();

      // 5秒后自动停止
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000);

    } catch (err) {
      console.error('无法访问麦克风:', err);
      alert('无法访问麦克风，请检查权限设置');
      isRecording.value = false;
    }
  }
};

// 音轨播放（支持时间线编排和循环播放）
const playTrack = (track) => {
  if (!track.audioBuffer || track.muted) return;

  const trackStartTime = track.startTime || 0;
  const trackTrimStart = track.trimStart || 0;
  const trackTrimEnd = track.trimEnd !== null ? track.trimEnd : track.audioBuffer.duration;
  const trackDuration = trackTrimEnd - trackTrimStart;
  const trackEndTime = trackStartTime + trackDuration;

  // 如果音轨设置为循环，则忽略时间范围限制
  if (!track.loop) {
    // 如果当前时间不在音频片段的播放范围内，则不播放
    if (currentTime.value < trackStartTime || currentTime.value >= trackEndTime) {
      return;
    }
  }

  // 初始化效果链
  if (!track.effectChain) {
    track.effectChain = new EffectChain(audioContext);
  }
  updateEffectChain(track);

  const source = audioContext.createBufferSource();
  source.buffer = track.audioBuffer;
  source.loop = track.loop || false; // 设置循环播放

  const gainNode = audioContext.createGain();
  gainNode.gain.value = track.volume / 100;

  // 音频信号流：source -> gainNode -> effectChain -> masterGainNode
  source.connect(gainNode);
  gainNode.connect(track.effectChain.getInput());
  track.effectChain.getOutput().connect(masterGainNode);

  if (track.loop) {
    // 循环模式：从头开始播放
    source.start(0);
  } else {
    // 计算从音频文件的哪个位置开始播放
    const offset = trackTrimStart + (currentTime.value - trackStartTime);
    // 计算播放持续时间
    const duration = trackEndTime - currentTime.value;
    // 在正确的时间开始播放，使用offset指定开始位置，duration指定持续时间
    source.start(0, offset, duration);
  }

  track.sourceNode = source;

  source.onended = () => {
    track.sourceNode = null;
  };
};

// 更新主音量
const updateMasterVolume = () => {
  if (masterGainNode) {
    masterGainNode.gain.value = masterVolume.value / 100;
  }
};

// 时间格式化
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 时间线更新
const updateTimeline = () => {
  if (!isPlaying.value) return;

  currentTime.value = audioContext.currentTime - startTime;

  if (currentTime.value >= duration.value) {
    stop();
    return;
  }

  drawTimeline();
  animationFrameId = requestAnimationFrame(updateTimeline);
};

// 绘制时间线
const drawTimeline = () => {
  if (!timelineCanvas.value) return;

  const canvas = timelineCanvas.value;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 绘制背景
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);

  // 绘制时间刻度
  ctx.strokeStyle = '#444';
  ctx.fillStyle = '#888';
  ctx.font = '10px Arial';

  const secondsPerPixel = duration.value / width;
  const markerInterval = 5; // 每5秒一个刻度

  for (let i = 0; i <= duration.value; i += markerInterval) {
    const x = (i / duration.value) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();

    ctx.fillText(formatTime(i), x + 2, 12);
  }

  // 绘制播放头
  const playheadX = (currentTime.value / duration.value) * width;
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(playheadX, 0);
  ctx.lineTo(playheadX, height);
  ctx.stroke();
  ctx.lineWidth = 1;
};

// 跳转到指定位置
const seekToPosition = (event) => {
  const canvas = timelineCanvas.value;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const newTime = (x / canvas.width) * duration.value;

  currentTime.value = Math.max(0, Math.min(newTime, duration.value));

  if (isPlaying.value) {
    pause();
    setTimeout(() => play(), 100);
  } else {
    drawTimeline();
  }
};

// 生成Never Gonna Give You Up旋律
const generateNeverGonnaGiveYouUpSound = () => {
  if (!audioContext) {
    initAudioContext();
  }

  // 创建一个包含经典旋律的音频片段
  const sampleRate = audioContext.sampleRate;
  const duration = 8; // 8秒的旋律循环
  const length = sampleRate * duration;
  const buffer = audioContext.createBuffer(2, length, sampleRate);

  // Never Gonna Give You Up 的经典旋律音符 (简化版)
  // 使用MIDI音符号转换为频率
  const noteToFreq = (note) => 440 * Math.pow(2, (note - 69) / 12);

  // 主旋律序列 (MIDI音符号)
  const melody = [
    { note: 69, duration: 0.25 }, // A4
    { note: 71, duration: 0.25 }, // B4
    { note: 73, duration: 0.25 }, // C#5
    { note: 71, duration: 0.25 }, // B4
    { note: 76, duration: 0.5 },  // E5
    { note: 76, duration: 0.5 },  // E5
    { note: 74, duration: 0.5 },  // D5
    { note: 69, duration: 0.25 }, // A4
    { note: 71, duration: 0.25 }, // B4
    { note: 73, duration: 0.25 }, // C#5
    { note: 71, duration: 0.25 }, // B4
    { note: 74, duration: 0.5 },  // D5
    { note: 74, duration: 0.5 },  // D5
    { note: 73, duration: 0.5 },  // C#5
    { note: 71, duration: 0.5 },  // B4
    { note: 69, duration: 0.25 }, // A4
    { note: 71, duration: 0.25 }, // B4
    { note: 73, duration: 0.25 }, // C#5
    { note: 71, duration: 0.25 }, // B4
    { note: 69, duration: 0.5 },  // A4
    { note: 76, duration: 0.5 },  // E5
    { note: 73, duration: 1.0 },  // C#5
    { note: 74, duration: 1.0 }   // D5
  ];

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    let currentTime = 0;

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;

      // 找到当前时间应该播放的音符
      let timeAccum = 0;
      let currentNote = melody[0];

      for (const note of melody) {
        if (t >= timeAccum && t < timeAccum + note.duration) {
          currentNote = note;
          break;
        }
        timeAccum += note.duration;
      }

      // 生成音符
      const freq = noteToFreq(currentNote.note);

      // ADSR包络
      const noteStartTime = t % currentNote.duration;
      const attack = 0.02;
      const decay = 0.1;
      const sustain = 0.7;
      const release = 0.1;

      let envelope = 1.0;
      if (noteStartTime < attack) {
        envelope = noteStartTime / attack;
      } else if (noteStartTime < attack + decay) {
        envelope = 1.0 - (1.0 - sustain) * ((noteStartTime - attack) / decay);
      } else if (noteStartTime > currentNote.duration - release) {
        envelope = sustain * ((currentNote.duration - noteStartTime) / release);
      } else {
        envelope = sustain;
      }

      // 合成音色：正弦波 + 谐波
      const sample = (
        Math.sin(2 * Math.PI * freq * t) * 0.6 +           // 基础音
        Math.sin(2 * Math.PI * freq * 2 * t) * 0.2 +       // 二次谐波
        Math.sin(2 * Math.PI * freq * 3 * t) * 0.1         // 三次谐波
      ) * envelope * 0.3; // 降低整体音量

      channelData[i] = sample;
    }
  }

  return buffer;
};

// 音轨管理
const createNewTrack = () => ({
  id: Date.now() + Math.random(),
  name: `音轨 ${tracks.value.length + 1}`,
  volume: 80,
  muted: false,
  solo: false,
  audioBuffer: null,
  sourceNode: null,
  color: `hsl(${Math.random() * 360}, 70%, 60%)`,
  startTime: 0,      // 音频片段在时间线上的开始时间
  trimStart: 0,      // 音频文件的裁剪起始位置
  trimEnd: null,     // 音频文件的裁剪结束位置（null表示使用完整长度）
  loop: false,       // 是否循环播放
  effects: [],       // 效果器配置数组
  effectChain: null  // 效果器链实例
});

const addTrack = () => {
  initAudioContext();

  const newTrack = createNewTrack();

  // 自动为新轨道添加Never Gonna Give You Up旋律并设置为循环播放
  newTrack.audioBuffer = generateNeverGonnaGiveYouUpSound();
  newTrack.name = `Never Gonna Give You Up ${tracks.value.length + 1}`;
  newTrack.loop = true; // 设置为循环播放
  newTrack.color = '#ff4757'; // 使用红色表示经典旋律

  tracks.value.push(newTrack);
};

const updateTrack = (updatedTrack) => {
  const index = tracks.value.findIndex(t => t.id === updatedTrack.id);
  if (index !== -1) {
    const oldTrack = tracks.value[index];
    tracks.value[index] = { ...updatedTrack, effectChain: oldTrack.effectChain };

    // 如果效果器配置发生变化，更新效果链
    if (updatedTrack.effects && oldTrack.effectChain) {
      updateEffectChain(tracks.value[index]);
    }
  }
};

// 更新音轨的效果链
const updateEffectChain = (track) => {
  if (!track.effectChain) {
    track.effectChain = new EffectChain(audioContext);
  }

  // 重新加载效果器配置
  track.effectChain.loadConfig(track.effects || []);
};

const deleteTrack = (trackId) => {
  const index = tracks.value.findIndex(t => t.id === trackId);
  if (index !== -1) {
    const track = tracks.value[index];
    if (track.sourceNode) {
      track.sourceNode.stop();
    }
    // 清理效果链
    if (track.effectChain) {
      track.effectChain.destroy();
    }
    tracks.value.splice(index, 1);
  }
};

const addAudioToTrack = async (trackId, file) => {
  initAudioContext();

  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const track = tracks.value.find(t => t.id === trackId);
    if (track) {
      track.audioBuffer = audioBuffer;
      track.name = file.name;
    }
  } catch (err) {
    console.error('音频解码失败:', err);
    alert('无法加载音频文件');
  }
};

// 项目管理
const saveProject = async () => {
  const project = {
    tracks: tracks.value.map(t => ({
      id: t.id,
      name: t.name,
      volume: t.volume,
      muted: t.muted,
      solo: t.solo,
      color: t.color,
      startTime: t.startTime,
      trimStart: t.trimStart,
      trimEnd: t.trimEnd,
      loop: t.loop,
      effects: t.effects || []
    })),
    tempo: tempo.value,
    masterVolume: masterVolume.value,
    duration: duration.value
  };

  try {
    const response = await fetch('/api/daw/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });

    if (response.ok) {
      alert('项目保存成功！');
    }
  } catch (err) {
    console.error('保存失败:', err);
  }
};

const loadProject = async () => {
  try {
    const response = await fetch('/api/daw/load');
    if (response.ok) {
      const project = await response.json();
      tracks.value = project.tracks.map(t => ({ ...createNewTrack(), ...t }));
      tempo.value = project.tempo;
      masterVolume.value = project.masterVolume;
      duration.value = project.duration;
      alert('项目加载成功！');
    }
  } catch (err) {
    console.error('加载失败:', err);
  }
};

const newProject = () => {
  if (confirm('创建新项目将清空当前所有音轨，是否继续？')) {
    tracks.value = [];
    currentTime.value = 0;
    tempo.value = 120;
    masterVolume.value = 80;
    stop();
  }
};

// 彩蛋触发机制
const handleTitleClick = () => {
  titleClickCount++;

  if (titleClickTimeout) {
    clearTimeout(titleClickTimeout);
  }

  if (titleClickCount >= 3) {
    showAlpacaEasterEgg.value = true;
    titleClickCount = 0;
  }

  titleClickTimeout = setTimeout(() => {
    titleClickCount = 0;
  }, 1000);
};

// 生命周期
onMounted(() => {
  // 初始化画布
  if (timelineCanvas.value) {
    timelineCanvas.value.width = timelineCanvas.value.offsetWidth;
    timelineCanvas.value.height = 50;
    drawTimeline();
  }

  // 添加一个示例音轨
  addTrack();

  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (timelineCanvas.value) {
      timelineCanvas.value.width = timelineCanvas.value.offsetWidth;
      drawTimeline();
    }
  });
});

onUnmounted(() => {
  stop();
  if (audioContext) {
    audioContext.close();
  }
});

watch(currentTime, () => {
  drawTimeline();
});
</script>

<style scoped>
.daw-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE5EC 50%, #E0F2F7 100%);
  color: #333;
  font-family: 'Hiragino Kaku Gothic Pro', 'Meiryo', 'Segoe UI', sans-serif;
}

.daw-header {
  background: linear-gradient(135deg, #FFB6D9 0%, #FF69B4 50%, #FFD700 100%);
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 25px rgba(255, 105, 180, 0.4);
  border-bottom: 3px solid #FF69B4;
}

.daw-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(255, 20, 147, 0.5);
}

.header-controls {
  display: flex;
  gap: 10px;
}

.header-controls button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255,255,255,0.9);
  color: #FF69B4;
  box-shadow: 0 3px 10px rgba(255, 105, 180, 0.3);
}

.header-controls button:hover {
  background: white;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 15px rgba(255, 105, 180, 0.5);
}

.daw-main {
  padding: 20px;
}

.main-controls-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-start;
}

.transport-bar {
  background: linear-gradient(135deg, #FFF0F5 0%, #FFE5EC 100%);
  border-radius: 20px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 0 6px 20px rgba(255, 182, 217, 0.4);
  border: 3px solid #FFB6D9;
  flex: 1;
}

@media (max-width: 1200px) {
  .main-controls-container {
    flex-direction: column;
  }
}

.transport-controls {
  display: flex;
  gap: 10px;
}

.transport-controls button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
}

.btn-play {
  background: linear-gradient(135deg, #98FB98 0%, #32CD32 100%);
  box-shadow: 0 4px 12px rgba(50, 205, 50, 0.4);
}

.btn-play:hover:not(:disabled) {
  background: linear-gradient(135deg, #90EE90 0%, #228B22 100%);
  transform: scale(1.08);
  box-shadow: 0 6px 18px rgba(50, 205, 50, 0.6);
}

.btn-pause {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.btn-pause:hover:not(:disabled) {
  background: linear-gradient(135deg, #FFC700 0%, #FF8C00 100%);
  transform: scale(1.08);
  box-shadow: 0 6px 18px rgba(255, 215, 0, 0.6);
}

.btn-stop {
  background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
  box-shadow: 0 4px 12px rgba(255, 20, 147, 0.4);
}

.btn-stop:hover {
  background: linear-gradient(135deg, #FF50A0 0%, #DC143C 100%);
  transform: scale(1.08);
  box-shadow: 0 6px 18px rgba(255, 20, 147, 0.6);
}

.btn-record {
  background: linear-gradient(135deg, #FF6B9D 0%, #C6426E 100%);
  box-shadow: 0 4px 12px rgba(198, 66, 110, 0.4);
}

.btn-record:hover {
  background: linear-gradient(135deg, #FF5A8C 0%, #B0305D 100%);
  transform: scale(1.08);
  box-shadow: 0 6px 18px rgba(198, 66, 110, 0.6);
}

.btn-record.recording {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.transport-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.time-display {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 24px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  min-width: 150px;
}

.separator {
  color: #666;
}

.duration {
  color: #888;
}

.master-volume {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.master-volume label {
  font-size: 14px;
  color: #FF69B4;
  font-weight: 600;
  min-width: 60px;
}

.volume-slider {
  flex: 1;
  max-width: 200px;
}

.volume-value {
  font-weight: 700;
  min-width: 45px;
  color: #FF69B4;
}

.tempo-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tempo-control label {
  font-size: 14px;
  color: #FF69B4;
  font-weight: 600;
}

.tempo-input {
  width: 70px;
  padding: 8px;
  background: white;
  border: 2px solid #FFB6D9;
  border-radius: 10px;
  color: #FF69B4;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.tracks-container {
  background: linear-gradient(135deg, #FFFFFF 0%, #FFF0F5 100%);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 6px 20px rgba(255, 182, 217, 0.4);
  border: 3px solid #FFB6D9;
}

.tracks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tracks-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #FF69B4;
  text-shadow: 1px 1px 2px rgba(255, 105, 180, 0.2);
}

.btn-add-track {
  padding: 10px 20px;
  background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(70, 130, 180, 0.4);
}

.btn-add-track:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 18px rgba(70, 130, 180, 0.6);
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.timeline-container {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

.timeline-canvas {
  width: 100%;
  height: 50px;
  cursor: pointer;
  border-radius: 8px;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: #2a2a2a;
  border-radius: 3px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
}

/* 草泥马彩蛋样式 */
.alpaca-easter-egg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  overflow: hidden;
  animation: easterEggAppear 0.3s ease-out;
}

@keyframes easterEggAppear {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.easter-egg-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.easter-egg-content {
  width: 100%;
  height: calc(100% - 50px);
  overflow: hidden;
}
</style>
