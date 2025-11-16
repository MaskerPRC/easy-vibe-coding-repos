<template>
  <svg :width="width" :height="height" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
    <!-- 背景渐变 -->
    <defs>
      <radialGradient id="macBackground" cx="50%" cy="50%">
        <stop offset="0%" style="stop-color:#4A4A4A;stop-opacity:0.95" />
        <stop offset="100%" style="stop-color:#2A2A2A;stop-opacity:0.98" />
      </radialGradient>
    </defs>

    <rect width="800" height="600" fill="url(#macBackground)" />

    <!-- 半透明遮罩 -->
    <rect width="800" height="600" fill="#000000" opacity="0.75" />

    <!-- 电源符号 -->
    <g transform="translate(400, 180)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0.9" />
      <line x1="0" y1="-40" x2="0" y2="-10" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.9" />
    </g>

    <!-- 多语言消息 -->
    <g v-if="version === 'early'">
      <!-- 英文 -->
      <text x="400" y="280" fill="#FFFFFF" font-family="'Lucida Grande', 'Helvetica', sans-serif"
            font-size="18" text-anchor="middle" opacity="0.95">
        You need to restart your computer.
      </text>
      <text x="400" y="305" fill="#FFFFFF" font-family="'Lucida Grande', 'Helvetica', sans-serif"
            font-size="18" text-anchor="middle" opacity="0.95">
        Hold down the Power button for several seconds or press the Restart button.
      </text>

      <!-- 法文 -->
      <text x="400" y="345" fill="#DDDDDD" font-family="'Lucida Grande', 'Helvetica', sans-serif"
            font-size="14" text-anchor="middle" opacity="0.85">
        Vous devez redémarrer votre ordinateur.
      </text>

      <!-- 德文 -->
      <text x="400" y="370" fill="#DDDDDD" font-family="'Lucida Grande', 'Helvetica', sans-serif"
            font-size="14" text-anchor="middle" opacity="0.85">
        Sie müssen Ihren Computer neu starten.
      </text>

      <!-- 日文 -->
      <text x="400" y="395" fill="#DDDDDD" font-family="'Hiragino Sans', 'Helvetica', sans-serif"
            font-size="14" text-anchor="middle" opacity="0.85">
        コンピュータを再起動する必要があります。
      </text>

      <!-- 中文 -->
      <text x="400" y="420" fill="#DDDDDD" font-family="'PingFang SC', 'Helvetica', sans-serif"
            font-size="14" text-anchor="middle" opacity="0.85">
        您需要重新启动计算机。
      </text>
    </g>

    <!-- Lion及之后版本 -->
    <g v-else>
      <!-- 主要消息 - 英文 -->
      <text x="400" y="280" fill="#FFFFFF" font-family="'Helvetica Neue', 'Helvetica', sans-serif"
            font-size="20" text-anchor="middle" font-weight="300" opacity="0.95">
        You need to restart your computer.
      </text>
      <text x="400" y="310" fill="#FFFFFF" font-family="'Helvetica Neue', 'Helvetica', sans-serif"
            font-size="20" text-anchor="middle" font-weight="300" opacity="0.95">
        Hold down the Power button until it turns off,
      </text>
      <text x="400" y="340" fill="#FFFFFF" font-family="'Helvetica Neue', 'Helvetica', sans-serif"
            font-size="20" text-anchor="middle" font-weight="300" opacity="0.95">
        then press the Power button again.
      </text>

      <!-- 其他语言 -->
      <text x="400" y="380" fill="#CCCCCC" font-family="'Helvetica Neue', sans-serif"
            font-size="13" text-anchor="middle" opacity="0.8">
        Vous devez redémarrer votre ordinateur. Maintenez le bouton de démarrage enfoncé...
      </text>
      <text x="400" y="400" fill="#CCCCCC" font-family="'Helvetica Neue', sans-serif"
            font-size="13" text-anchor="middle" opacity="0.8">
        Sie müssen Ihren Computer neu starten. Halten Sie den Einschaltknopf...
      </text>
      <text x="400" y="420" fill="#CCCCCC" font-family="'Hiragino Sans', sans-serif"
            font-size="13" text-anchor="middle" opacity="0.8">
        コンピュータを再起動する必要があります。電源ボタンを...
      </text>
      <text x="400" y="440" fill="#CCCCCC" font-family="'PingFang SC', sans-serif"
            font-size="13" text-anchor="middle" opacity="0.8">
        您需要重新启动电脑。请按住电源按钮直到电脑关机...
      </text>
      <text x="400" y="460" fill="#CCCCCC" font-family="'Apple SD Gothic Neo', sans-serif"
            font-size="13" text-anchor="middle" opacity="0.8">
        컴퓨터를 다시 시작해야 합니다. 전원 버튼을 길게 누르십시오...
      </text>
    </g>
  </svg>
</template>

<script setup>
const props = defineProps({
  version: {
    type: String,
    default: 'lion', // 'early' (10.0-10.6), 'lion' (10.7+)
    validator: (value) => ['early', 'lion'].includes(value)
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
</script>
