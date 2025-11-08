import { BaseEffect } from './BaseEffect.js';

/**
 * 混响效果器
 * 使用 ConvolverNode 实现混响效果
 */
export class ReverbEffect extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'reverb', '混响');

    // 创建节点
    this.convolverNode = audioContext.createConvolver();
    this.dryGain = audioContext.createGain();
    this.wetGain = audioContext.createGain();
    this.inputGain = audioContext.createGain();
    this.outputGain = audioContext.createGain();

    // 初始化参数
    this.params = {
      roomSize: 50,   // 房间大小 0-100
      damping: 50,    // 阻尼 0-100
      wetDry: 30      // 干湿混合比 0-100 (0=全干, 100=全湿)
    };

    // 连接节点 - 使用并联的干湿信号
    this.inputGain.connect(this.dryGain);
    this.inputGain.connect(this.convolverNode);
    this.convolverNode.connect(this.wetGain);
    this.dryGain.connect(this.outputGain);
    this.wetGain.connect(this.outputGain);

    this.nodes = [this.inputGain, this.outputGain];

    // 生成初始冲击响应
    this.updateImpulseResponse();
  }

  /**
   * 生成冲击响应
   * @param {number} duration 持续时间（秒）
   * @param {number} decay 衰减系数
   */
  generateImpulseResponse(duration, decay) {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    const leftChannel = impulse.getChannelData(0);
    const rightChannel = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      // 指数衰减
      const n = i / length;
      const envelope = Math.exp(-n * decay);

      // 添加随机噪声并应用包络
      leftChannel[i] = (Math.random() * 2 - 1) * envelope;
      rightChannel[i] = (Math.random() * 2 - 1) * envelope;
    }

    return impulse;
  }

  /**
   * 更新冲击响应
   */
  updateImpulseResponse() {
    const roomSize = this.params.roomSize / 100;
    const damping = this.params.damping / 100;

    // roomSize 影响持续时间 (0.5-4秒)
    const duration = 0.5 + roomSize * 3.5;

    // damping 影响衰减速度 (3-15)
    const decay = 3 + (1 - damping) * 12;

    this.convolverNode.buffer = this.generateImpulseResponse(duration, decay);
  }

  /**
   * 更新参数
   */
  updateParam(paramName, value) {
    this.params[paramName] = value;

    switch (paramName) {
      case 'roomSize':
      case 'damping':
        // 这些参数需要重新生成冲击响应
        this.updateImpulseResponse();
        break;

      case 'wetDry':
        // 更新干湿混合比
        const wet = value / 100;
        const dry = 1 - wet;
        this.wetGain.gain.setValueAtTime(wet, this.audioContext.currentTime);
        this.dryGain.gain.setValueAtTime(dry, this.audioContext.currentTime);
        break;
    }
  }

  /**
   * 更新所有参数
   */
  updateAllParams() {
    this.updateImpulseResponse();
    this.updateParam('wetDry', this.params.wetDry);
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
