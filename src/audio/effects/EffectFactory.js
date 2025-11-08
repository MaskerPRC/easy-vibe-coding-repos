import { DistortionEffect } from './DistortionEffect.js';
import { ReverbEffect } from './ReverbEffect.js';
import { DelayEffect } from './DelayEffect.js';
import { EQEffect } from './EQEffect.js';

/**
 * 效果器工厂
 * 用于创建各种类型的效果器
 */
export class EffectFactory {
  /**
   * 创建效果器
   * @param {AudioContext} audioContext
   * @param {string} type 效果器类型
   * @returns {BaseEffect}
   */
  static createEffect(audioContext, type) {
    switch (type) {
      case 'distortion':
        return new DistortionEffect(audioContext);
      case 'reverb':
        return new ReverbEffect(audioContext);
      case 'delay':
        return new DelayEffect(audioContext);
      case 'eq':
        return new EQEffect(audioContext);
      default:
        throw new Error(`Unknown effect type: ${type}`);
    }
  }

  /**
   * 获取所有可用的效果器类型
   * @returns {Array}
   */
  static getAvailableEffects() {
    return [
      {
        type: 'distortion',
        name: '失真',
        description: '添加失真效果，使声音更加粗糙有力',
        icon: '🎸'
      },
      {
        type: 'reverb',
        name: '混响',
        description: '模拟房间混响效果，增加空间感',
        icon: '🏛️'
      },
      {
        type: 'delay',
        name: '延迟',
        description: '添加延迟回声效果',
        icon: '🔊'
      },
      {
        type: 'eq',
        name: '均衡器',
        description: '调整低中高频段的音量平衡',
        icon: '🎚️'
      }
    ];
  }

  /**
   * 从配置创建效果器
   * @param {AudioContext} audioContext
   * @param {Object} config
   * @returns {BaseEffect}
   */
  static createFromConfig(audioContext, config) {
    const effect = this.createEffect(audioContext, config.type);
    effect.loadConfig(config);
    return effect;
  }
}
