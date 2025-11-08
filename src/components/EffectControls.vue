<template>
  <div class="effect-controls">
    <div class="effect-header">
      <span class="effect-icon">{{ effectInfo.icon }}</span>
      <span class="effect-name">{{ effect.name }}</span>
      <div class="effect-actions">
        <button
          class="btn-toggle"
          :class="{ active: effect.enabled }"
          @click="toggleEnabled"
          title="启用/禁用"
        >
          {{ effect.enabled ? 'ON' : 'OFF' }}
        </button>
        <button class="btn-remove" @click="$emit('remove')" title="移除效果器">×</button>
      </div>
    </div>

    <!-- 失真效果器参数 -->
    <div v-if="effect.type === 'distortion'" class="effect-params">
      <div class="param">
        <label>强度 ({{ effect.params.drive }})</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="effect.params.drive"
          @input="updateParam('drive', $event.target.value)"
        />
      </div>
      <div class="param">
        <label>音色 ({{ effect.params.tone }})</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="effect.params.tone"
          @input="updateParam('tone', $event.target.value)"
        />
      </div>
      <div class="param">
        <label>电平 ({{ effect.params.level }})</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="effect.params.level"
          @input="updateParam('level', $event.target.value)"
        />
      </div>
    </div>

    <!-- 混响效果器参数 -->
    <div v-else-if="effect.type === 'reverb'" class="effect-params">
      <div class="param">
        <label>房间大小 ({{ effect.params.roomSize }})</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="effect.params.roomSize"
          @input="updateParam('roomSize', $event.target.value)"
        />
      </div>
      <div class="param">
        <label>阻尼 ({{ effect.params.damping }})</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="effect.params.damping"
          @input="updateParam('damping', $event.target.value)"
        />
      </div>
      <div class="param">
        <label>混合 ({{ effect.params.wetDry }})</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="effect.params.wetDry"
          @input="updateParam('wetDry', $event.target.value)"
        />
      </div>
    </div>

    <!-- 延迟效果器参数 -->
    <div v-else-if="effect.type === 'delay'" class="effect-params">
      <div class="param">
        <label>时间 ({{ effect.params.time }}ms)</label>
        <input
          type="range"
          min="0"
          max="2000"
          v-model.number="effect.params.time"
          @input="updateParam('time', $event.target.value)"
        />
      </div>
      <div class="param">
        <label>反馈 ({{ effect.params.feedback }})</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="effect.params.feedback"
          @input="updateParam('feedback', $event.target.value)"
        />
      </div>
      <div class="param">
        <label>混合 ({{ effect.params.mix }})</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="effect.params.mix"
          @input="updateParam('mix', $event.target.value)"
        />
      </div>
    </div>

    <!-- EQ效果器参数 -->
    <div v-else-if="effect.type === 'eq'" class="effect-params">
      <div class="param">
        <label>低频 ({{ effect.params.lowGain > 0 ? '+' : '' }}{{ effect.params.lowGain }}dB)</label>
        <input
          type="range"
          min="-12"
          max="12"
          step="0.5"
          v-model.number="effect.params.lowGain"
          @input="updateParam('lowGain', $event.target.value)"
        />
      </div>
      <div class="param">
        <label>中频 ({{ effect.params.midGain > 0 ? '+' : '' }}{{ effect.params.midGain }}dB)</label>
        <input
          type="range"
          min="-12"
          max="12"
          step="0.5"
          v-model.number="effect.params.midGain"
          @input="updateParam('midGain', $event.target.value)"
        />
      </div>
      <div class="param">
        <label>高频 ({{ effect.params.highGain > 0 ? '+' : '' }}{{ effect.params.highGain }}dB)</label>
        <input
          type="range"
          min="-12"
          max="12"
          step="0.5"
          v-model.number="effect.params.highGain"
          @input="updateParam('highGain', $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { EffectFactory } from '../audio/effects/EffectFactory.js';

export default {
  name: 'EffectControls',
  props: {
    effect: {
      type: Object,
      required: true
    }
  },
  emits: ['remove', 'update'],
  computed: {
    effectInfo() {
      const effects = EffectFactory.getAvailableEffects();
      return effects.find(e => e.type === this.effect.type) || {};
    }
  },
  methods: {
    updateParam(paramName, value) {
      this.$emit('update', {
        effectId: this.effect.id,
        paramName,
        value: parseFloat(value)
      });
    },
    toggleEnabled() {
      this.$emit('update', {
        effectId: this.effect.id,
        paramName: 'enabled',
        value: !this.effect.enabled
      });
    }
  }
};
</script>

<style scoped>
.effect-controls {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #444;
}

.effect-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #444;
}

.effect-icon {
  font-size: 20px;
}

.effect-name {
  flex: 1;
  font-weight: bold;
  color: #fff;
}

.effect-actions {
  display: flex;
  gap: 4px;
}

.btn-toggle {
  padding: 4px 12px;
  border: 1px solid #555;
  background: #333;
  color: #999;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-toggle.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.btn-toggle:hover {
  background: #444;
}

.btn-toggle.active:hover {
  background: #45a049;
}

.btn-remove {
  padding: 4px 10px;
  border: 1px solid #555;
  background: #333;
  color: #999;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #d32f2f;
  color: white;
  border-color: #d32f2f;
}

.effect-params {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.param {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.param label {
  font-size: 12px;
  color: #aaa;
}

.param input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #444;
  outline: none;
  -webkit-appearance: none;
}

.param input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2196F3;
  cursor: pointer;
  transition: background 0.2s;
}

.param input[type="range"]::-webkit-slider-thumb:hover {
  background: #1976D2;
}

.param input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2196F3;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}

.param input[type="range"]::-moz-range-thumb:hover {
  background: #1976D2;
}
</style>
