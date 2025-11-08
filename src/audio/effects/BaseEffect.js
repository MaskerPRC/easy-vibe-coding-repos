/**
 * 基础效果器类
 * 所有效果器都继承自此类
 */
export class BaseEffect {
  constructor(audioContext, type, name) {
    this.audioContext = audioContext;
    this.type = type;
    this.name = name;
    this.id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.enabled = true;
    this.nodes = []; // Web Audio 节点数组
    this.params = {}; // 效果器参数
  }

  /**
   * 连接输入输出
   * @param {AudioNode} input 输入节点
   * @param {AudioNode} output 输出节点
   */
  connect(input, output) {
    if (this.nodes.length === 0) {
      // 如果没有节点，直接连接输入输出
      input.connect(output);
      return;
    }

    // 连接输入到第一个节点
    input.connect(this.nodes[0]);

    // 连接中间节点
    for (let i = 0; i < this.nodes.length - 1; i++) {
      this.nodes[i].connect(this.nodes[i + 1]);
    }

    // 连接最后一个节点到输出
    this.nodes[this.nodes.length - 1].connect(output);
  }

  /**
   * 断开所有连接
   */
  disconnect() {
    this.nodes.forEach(node => {
      try {
        node.disconnect();
      } catch (e) {
        // 忽略已经断开的节点
      }
    });
  }

  /**
   * 启用/禁用效果器
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * 更新参数
   * @param {string} paramName 参数名
   * @param {number} value 参数值
   */
  setParam(paramName, value) {
    if (this.params.hasOwnProperty(paramName)) {
      this.params[paramName] = value;
      this.updateParam(paramName, value);
    }
  }

  /**
   * 子类需要实现的方法：更新参数
   */
  updateParam(paramName, value) {
    // 子类实现
  }

  /**
   * 获取效果器配置（用于保存）
   */
  getConfig() {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
      enabled: this.enabled,
      params: { ...this.params }
    };
  }

  /**
   * 销毁效果器
   */
  destroy() {
    this.disconnect();
    this.nodes = [];
  }
}
