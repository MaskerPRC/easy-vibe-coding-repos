import { EffectFactory } from './EffectFactory.js';

/**
 * 效果链管理器
 * 管理一个音轨的所有效果器
 */
export class EffectChain {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.effects = []; // 效果器数组
    this.inputNode = audioContext.createGain();
    this.outputNode = audioContext.createGain();

    // 默认直接连接输入输出
    this.reconnect();
  }

  /**
   * 添加效果器
   * @param {string} type 效果器类型
   * @returns {BaseEffect}
   */
  addEffect(type) {
    const effect = EffectFactory.createEffect(this.audioContext, type);
    this.effects.push(effect);
    this.reconnect();
    return effect;
  }

  /**
   * 移除效果器
   * @param {string} effectId
   */
  removeEffect(effectId) {
    const index = this.effects.findIndex(e => e.id === effectId);
    if (index !== -1) {
      const effect = this.effects[index];
      effect.destroy();
      this.effects.splice(index, 1);
      this.reconnect();
    }
  }

  /**
   * 获取效果器
   * @param {string} effectId
   * @returns {BaseEffect}
   */
  getEffect(effectId) {
    return this.effects.find(e => e.id === effectId);
  }

  /**
   * 移动效果器位置
   * @param {string} effectId
   * @param {number} newIndex
   */
  moveEffect(effectId, newIndex) {
    const oldIndex = this.effects.findIndex(e => e.id === effectId);
    if (oldIndex !== -1 && newIndex >= 0 && newIndex < this.effects.length) {
      const effect = this.effects.splice(oldIndex, 1)[0];
      this.effects.splice(newIndex, 0, effect);
      this.reconnect();
    }
  }

  /**
   * 重新连接效果链
   */
  reconnect() {
    // 断开所有现有连接
    this.inputNode.disconnect();
    this.effects.forEach(effect => effect.disconnect());

    if (this.effects.length === 0) {
      // 没有效果器，直接连接输入输出
      this.inputNode.connect(this.outputNode);
    } else {
      // 连接输入到第一个效果器
      this.inputNode.connect(this.effects[0].nodes[0]);

      // 连接效果器链
      for (let i = 0; i < this.effects.length - 1; i++) {
        const currentOutput = this.effects[i].nodes[this.effects[i].nodes.length - 1];
        const nextInput = this.effects[i + 1].nodes[0];
        currentOutput.connect(nextInput);
      }

      // 连接最后一个效果器到输出
      const lastEffect = this.effects[this.effects.length - 1];
      const lastOutput = lastEffect.nodes[lastEffect.nodes.length - 1];
      lastOutput.connect(this.outputNode);
    }
  }

  /**
   * 获取输入节点
   */
  getInput() {
    return this.inputNode;
  }

  /**
   * 获取输出节点
   */
  getOutput() {
    return this.outputNode;
  }

  /**
   * 获取配置（用于保存）
   */
  getConfig() {
    return this.effects.map(effect => effect.getConfig());
  }

  /**
   * 从配置加载
   * @param {Array} configs
   */
  loadConfig(configs) {
    // 清除现有效果器
    this.effects.forEach(effect => effect.destroy());
    this.effects = [];

    // 加载效果器
    if (Array.isArray(configs)) {
      configs.forEach(config => {
        const effect = EffectFactory.createFromConfig(this.audioContext, config);
        this.effects.push(effect);
      });
    }

    this.reconnect();
  }

  /**
   * 清除所有效果器
   */
  clear() {
    this.effects.forEach(effect => effect.destroy());
    this.effects = [];
    this.reconnect();
  }

  /**
   * 销毁效果链
   */
  destroy() {
    this.clear();
    this.inputNode.disconnect();
    this.outputNode.disconnect();
  }
}
