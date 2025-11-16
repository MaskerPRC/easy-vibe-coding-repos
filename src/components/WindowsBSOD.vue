<template>
  <svg :width="width" :height="height" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
    <!-- 背景 -->
    <rect width="800" height="600" :fill="backgroundColor" />

    <!-- Windows NT 3.1 / 2000 风格 BSOD -->
    <g v-if="version === 'nt' || version === '2000'">
      <text x="40" y="40" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="16" font-weight="bold">
        *** STOP: 0x0000000A (0x00000000, 0x00000002, 0x00000000, 0x804E47B7)
      </text>
      <text x="40" y="70" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="14">
        IRQL_NOT_LESS_OR_EQUAL
      </text>

      <text x="40" y="120" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        *** Address 804E47B7 base at 80400000, DateStamp 3b7d8410 - ntoskrnl.exe
      </text>

      <text x="40" y="170" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        If this is the first time you've seen this Stop error screen,
      </text>
      <text x="40" y="190" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        restart your computer. If this screen appears again, follow
      </text>
      <text x="40" y="210" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        these steps:
      </text>

      <text x="40" y="250" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        Check to make sure any new hardware or software is properly installed.
      </text>
      <text x="40" y="270" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        If this is a new installation, ask your hardware or software manufacturer
      </text>
      <text x="40" y="290" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        for any Windows updates you might need.
      </text>

      <text x="40" y="330" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        If problems continue, disable or remove any newly installed hardware
      </text>
      <text x="40" y="350" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        or software. Disable BIOS memory options such as caching or shadowing.
      </text>
      <text x="40" y="370" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        If you need to use Safe Mode to remove or disable components, restart
      </text>
      <text x="40" y="390" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        your computer, press F8 to select Advanced Startup Options, and then
      </text>
      <text x="40" y="410" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        select Safe Mode.
      </text>

      <text x="40" y="450" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        Technical information:
      </text>
      <text x="40" y="480" fill="#FFFFFF" font-family="'Courier New', monospace" font-size="12">
        *** STOP: 0x0000000A (0x00000000,0x00000002,0x00000000,0x804E47B7)
      </text>
    </g>

    <!-- Windows 8/10 风格 BSOD -->
    <g v-else-if="version === '8' || version === '10'">
      <!-- 悲伤表情 -->
      <text x="350" y="180" fill="#FFFFFF" font-family="'Segoe UI', sans-serif" font-size="120">
        :(
      </text>

      <!-- 错误信息 -->
      <text x="150" y="280" fill="#FFFFFF" font-family="'Segoe UI', sans-serif" font-size="24">
        你的电脑遇到问题，需要重新启动。
      </text>
      <text x="150" y="320" fill="#FFFFFF" font-family="'Segoe UI', sans-serif" font-size="18">
        我们只收集某些错误信息，然后你可以重新启动。
      </text>

      <!-- 进度 -->
      <text x="150" y="370" fill="#FFFFFF" font-family="'Segoe UI', sans-serif" font-size="18">
        {{ completionPercentage }}% 完成
      </text>

      <!-- 错误代码 -->
      <text x="150" y="440" fill="#FFFFFF" font-family="'Segoe UI', sans-serif" font-size="14">
        有关此问题的详细信息和可能的解决方法，请访问
      </text>
      <text x="150" y="465" fill="#FFFFFF" font-family="'Segoe UI', sans-serif" font-size="14">
        https://www.windows.com/stopcode
      </text>

      <text x="150" y="510" fill="#FFFFFF" font-family="'Segoe UI', sans-serif" font-size="14">
        如果致电支持人员，请向他们提供以下信息:
      </text>
      <text x="150" y="535" fill="#FFFFFF" font-family="'Segoe UI', sans-serif" font-size="14">
        终止代码: DRIVER_IRQL_NOT_LESS_OR_EQUAL
      </text>

      <!-- QR码占位符 -->
      <rect x="630" y="470" width="120" height="120" fill="#FFFFFF" />
      <text x="640" y="545" fill="#0078D7" font-family="'Segoe UI', sans-serif" font-size="10">
        QR CODE
      </text>
    </g>
  </svg>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  version: {
    type: String,
    default: '2000', // 'nt', '2000', '8', '10'
    validator: (value) => ['nt', '2000', '8', '10', 'green'].includes(value)
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  }
});

const completionPercentage = ref(0);

// 根据版本选择背景颜色
const backgroundColor = computed(() => {
  if (props.version === 'green') {
    return '#00AA00'; // Windows Insider 绿屏
  } else if (props.version === '8' || props.version === '10') {
    return '#0078D7'; // Windows 8/10 浅蓝色
  } else {
    return '#0000AA'; // 经典深蓝色
  }
});

// 模拟进度增加（仅用于Windows 8/10）
if (props.version === '8' || props.version === '10') {
  const interval = setInterval(() => {
    if (completionPercentage.value < 100) {
      completionPercentage.value += 1;
    } else {
      clearInterval(interval);
    }
  }, 100);
}
</script>
