# 音频效果器功能说明

本项目已成功实现了音轨效果器插槽功能，支持以下四种基本效果器：

## 功能特性

### 支持的效果器类型

1. **失真效果器 (Distortion)** 🎸
   - 强度 (Drive): 0-100
   - 音色 (Tone): 0-100
   - 电平 (Level): 0-100

2. **混响效果器 (Reverb)** 🏛️
   - 房间大小 (Room Size): 0-100
   - 阻尼 (Damping): 0-100
   - 混合 (Wet/Dry): 0-100

3. **延迟效果器 (Delay)** 🔊
   - 时间 (Time): 0-2000ms
   - 反馈 (Feedback): 0-100
   - 混合 (Mix): 0-100

4. **均衡器 (EQ)** 🎚️
   - 低频增益 (Low Gain): -12dB 到 +12dB
   - 中频增益 (Mid Gain): -12dB 到 +12dB
   - 高频增益 (High Gain): -12dB 到 +12dB

## 使用方法

### 1. 添加音轨
- 点击"添加音轨"按钮创建新音轨
- 或使用"📁"按钮上传音频文件

### 2. 添加效果器
- 在音轨的"效果器"面板中，点击对应的效果器按钮
- 支持的效果器：🎸 失真、🏛️ 混响、🔊 延迟、🎚️ 均衡器
- 每个音轨可以添加多个效果器，按照添加顺序形成效果链

### 3. 调整效果器参数
- 使用滑块调整各个参数
- 实时生效，无需重新播放
- 可以通过"ON/OFF"按钮启用或禁用效果器

### 4. 管理效果器
- 点击"×"按钮移除效果器
- 效果器按添加顺序串联处理音频信号

### 5. 保存和加载
- 效果器配置会随项目一起保存
- 加载项目时自动恢复效果器设置

## 技术实现

### 音频信号流
```
音频源 (AudioBufferSource)
  ↓
音量控制 (GainNode)
  ↓
效果链输入
  ↓
效果器1 → 效果器2 → 效果器3 → ...
  ↓
效果链输出
  ↓
主音量 (Master Gain)
  ↓
音频输出 (Destination)
```

### 文件结构
```
src/
├── audio/
│   └── effects/
│       ├── BaseEffect.js         # 效果器基类
│       ├── DistortionEffect.js   # 失真效果器
│       ├── ReverbEffect.js       # 混响效果器
│       ├── DelayEffect.js        # 延迟效果器
│       ├── EQEffect.js           # 均衡器
│       ├── EffectChain.js        # 效果链管理器
│       ├── EffectFactory.js      # 效果器工厂
│       └── index.js              # 导出模块
└── components/
    ├── EffectControls.vue        # 效果器控制UI
    ├── AudioTrack.vue            # 音轨组件（已更新）
    └── DAW.vue                   # DAW主组件（已更新）
```

### Web Audio API 使用

- **失真**: WaveShaperNode + 自定义失真曲线
- **混响**: ConvolverNode + 动态生成的冲激响应
- **延迟**: DelayNode + 反馈回路
- **均衡器**: BiquadFilterNode (Low Shelf + Peaking + High Shelf)

## 注意事项

1. 效果器会影响性能，建议不要在单个音轨上添加过多效果器
2. 某些效果器（如延迟）的反馈参数过高可能导致声音过大
3. 效果器参数调整实时生效，但需要在播放时才能听到效果
4. 项目保存时会保存效果器配置，但不会保存音频文件本身

## 开发说明

### 添加新的效果器

1. 在 `src/audio/effects/` 创建新的效果器类，继承 `BaseEffect`
2. 在 `EffectFactory.js` 中注册新效果器
3. 在 `EffectControls.vue` 中添加对应的参数控制UI

### 效果器类示例

```javascript
import { BaseEffect } from './BaseEffect.js';

export class MyEffect extends BaseEffect {
  constructor(audioContext) {
    super(audioContext, 'myeffect', '我的效果器');

    // 创建 Web Audio 节点
    this.myNode = audioContext.createXXX();
    this.nodes = [this.myNode];

    // 定义参数
    this.params = {
      param1: 50,
      param2: 0
    };

    this.updateAllParams();
  }

  updateParam(paramName, value) {
    // 更新参数逻辑
  }
}
```

## 测试建议

1. 上传一个音频文件到音轨
2. 添加失真效果器，调整强度参数
3. 播放音轨，听到失真效果
4. 添加混响效果器，调整房间大小
5. 保存项目，重新加载，验证效果器配置是否保留

## 已知限制

- 延迟效果器的反馈缓冲在停止播放时不会自动清除（已提供 clearBuffer 方法）
- 效果器参数调整在播放过程中可能有轻微延迟
- 不支持效果器的拖拽排序（可以通过删除重新添加调整顺序）

## 未来改进方向

- [ ] 添加更多效果器（压缩器、滤波器、合唱等）
- [ ] 支持效果器预设
- [ ] 效果器拖拽排序
- [ ] 效果器旁路（bypass）模式
- [ ] 效果器参数自动化（随时间变化）
- [ ] 可视化频谱分析
