import { BaseEffect } from './BaseEffect.js';

/**
 * EQ 均衡器效果器
 * 使用 BiquadFilterNode 实现三段均衡器（低频、中频、高频）
 */
export class EQEffect extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'eq', '均衡器');

    // 创建三个滤波器节点
    this.lowShelf = audioContext.createBiquadFilter();
    this.midPeak = audioContext.createBiquadFilter();
    this.highShelf = audioContext.createBiquadFilter();

    // 配置滤波器类型
    this.lowShelf.type = 'lowshelf';
    this.lowShelf.frequency.value = 250; // 低频切换点

    this.midPeak.type = 'peaking';
    this.midPeak.frequency.value = 1000; // 中频中心点
    this.midPeak.Q.value = 1; // Q值

    this.highShelf.type = 'highshelf';
    this.highShelf.frequency.value = 4000; // 高频切换点

    // 连接滤波器链
    this.lowShelf.connect(this.midPeak);
    this.midPeak.connect(this.highShelf);

    this.nodes = [this.lowShelf, this.highShelf];

    // 初始化参数（-12 到 +12 dB）
    this.params = {
      lowGain: 0,     // 低频增益 -12 到 +12
      midGain: 0,     // 中频增益 -12 到 +12
      highGain: 0,    // 高频增益 -12 到 +12
      lowFreq: 250,   // 低频切换频率 20-500 Hz
      midFreq: 1000,  // 中频中心频率 200-5000 Hz
      highFreq: 4000  // 高频切换频率 2000-16000 Hz
    };

    // 应用初始参数
    this.updateAllParams();
  }

  /**
   * 更新参数
   */
  updateParam(paramName, value) {
    this.params[paramName] = value;

    switch (paramName) {
      case 'lowGain':
        this.lowShelf.gain.setValueAtTime(
          value,
          this.audioContext.currentTime
        );
        break;

      case 'midGain':
        this.midPeak.gain.setValueAtTime(
          value,
          this.audioContext.currentTime
        );
        break;

      case 'highGain':
        this.highShelf.gain.setValueAtTime(
          value,
          this.audioContext.currentTime
        );
        break;

      case 'lowFreq':
        this.lowShelf.frequency.setValueAtTime(
          value,
          this.audioContext.currentTime
        );
        break;

      case 'midFreq':
        this.midPeak.frequency.setValueAtTime(
          value,
          this.audioContext.currentTime
        );
        break;

      case 'highFreq':
        this.highShelf.frequency.setValueAtTime(
          value,
          this.audioContext.currentTime
        );
        break;
    }
  }

  /**
   * 更新所有参数
   */
  updateAllParams() {
    this.updateParam('lowGain', this.params.lowGain);
    this.updateParam('midGain', this.params.midGain);
    this.updateParam('highGain', this.params.highGain);
    this.updateParam('lowFreq', this.params.lowFreq);
    this.updateParam('midFreq', this.params.midFreq);
    this.updateParam('highFreq', this.params.highFreq);
  }

  /**
   * 从配置恢复
   */
  loadConfig(config) {
    if (config.params) {
      Object.keys(config.params).forEach(key => {
        this.setParam(key, config.params[key]);
      });
    }
    this.enabled = config.enabled !== false;
  }

  /**
   * 重置所有频段到0
   */
  reset() {
    this.setParam('lowGain', 0);
    this.setParam('midGain', 0);
    this.setParam('highGain', 0);
  }
}
