import { BaseEffect } from './BaseEffect.js';

/**
 * 失真效果器
 * 使用 WaveShaperNode 实现失真效果
 */
export class DistortionEffect extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'distortion', '失真');

    // 创建节点
    this.waveShaperNode = audioContext.createWaveShaper();
    this.preGain = audioContext.createGain();
    this.postGain = audioContext.createGain();

    this.nodes = [this.preGain, this.waveShaperNode, this.postGain];

    // 初始化参数
    this.params = {
      drive: 50,      // 失真强度 0-100
      tone: 50,       // 音色 0-100
      level: 80       // 输出音量 0-100
    };

    // 连接节点
    this.preGain.connect(this.waveShaperNode);
    this.waveShaperNode.connect(this.postGain);

    // 应用初始参数
    this.updateAllParams();
  }

  /**
   * 生成失真曲线
   * @param {number} amount 失真量 (0-100)
   * @returns {Float32Array}
   */
  makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    const k = amount / 100 * 100; // 将0-100映射到0-100的失真系数

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }

    return curve;
  }

  /**
   * 更新参数
   */
  updateParam(paramName, value) {
    switch (paramName) {
      case 'drive':
        this.params.drive = value;
        // 更新前置增益和失真曲线
        const driveGain = 1 + (value / 100) * 4; // 1-5倍增益
        this.preGain.gain.setValueAtTime(driveGain, this.audioContext.currentTime);
        this.waveShaperNode.curve = this.makeDistortionCurve(value);
        break;

      case 'tone':
        this.params.tone = value;
        // tone参数影响失真曲线的形状
        this.waveShaperNode.curve = this.makeDistortionCurve(this.params.drive * (value / 100));
        break;

      case 'level':
        this.params.level = value;
        // 输出音量
        this.postGain.gain.setValueAtTime(value / 100, this.audioContext.currentTime);
        break;
    }
  }

  /**
   * 更新所有参数
   */
  updateAllParams() {
    this.updateParam('drive', this.params.drive);
    this.updateParam('tone', this.params.tone);
    this.updateParam('level', this.params.level);
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
}
