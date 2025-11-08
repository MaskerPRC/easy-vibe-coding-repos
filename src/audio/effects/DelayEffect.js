import { BaseEffect } from './BaseEffect.js';

/**
 * 延迟效果器
 * 使用 DelayNode 实现延迟/回声效果
 */
export class DelayEffect extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'delay', '延迟');

    // 创建节点
    this.delayNode = audioContext.createDelay(5.0); // 最大5秒延迟
    this.feedbackGain = audioContext.createGain();
    this.wetGain = audioContext.createGain();
    this.dryGain = audioContext.createGain();
    this.inputGain = audioContext.createGain();
    this.outputGain = audioContext.createGain();

    // 初始化参数
    this.params = {
      time: 375,      // 延迟时间 0-2000ms
      feedback: 30,   // 反馈量 0-100
      mix: 40         // 混合比 0-100
    };

    // 连接节点
    // 输入分成干湿两路
    this.inputGain.connect(this.dryGain);
    this.inputGain.connect(this.delayNode);

    // 延迟路径
    this.delayNode.connect(this.wetGain);
    this.delayNode.connect(this.feedbackGain);

    // 反馈回路
    this.feedbackGain.connect(this.delayNode);

    // 干湿信号混合
    this.dryGain.connect(this.outputGain);
    this.wetGain.connect(this.outputGain);

    this.nodes = [this.inputGain, this.outputGain];

    // 应用初始参数
    this.updateAllParams();
  }

  /**
   * 更新参数
   */
  updateParam(paramName, value) {
    this.params[paramName] = value;

    switch (paramName) {
      case 'time':
        // 延迟时间（毫秒转秒）
        const delayTime = value / 1000;
        this.delayNode.delayTime.setValueAtTime(
          delayTime,
          this.audioContext.currentTime
        );
        break;

      case 'feedback':
        // 反馈量（0-0.9，避免无限反馈）
        const feedbackAmount = (value / 100) * 0.9;
        this.feedbackGain.gain.setValueAtTime(
          feedbackAmount,
          this.audioContext.currentTime
        );
        break;

      case 'mix':
        // 干湿混合比
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
    this.updateParam('time', this.params.time);
    this.updateParam('feedback', this.params.feedback);
    this.updateParam('mix', this.params.mix);
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
   * 清除反馈缓冲（停止播放时调用）
   */
  clearBuffer() {
    // 断开并重新连接反馈回路来清除缓冲
    this.feedbackGain.disconnect();
    this.feedbackGain.connect(this.delayNode);
  }
}
