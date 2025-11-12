<template>
  <div class="rolex-container">
    <canvas
      ref="canvas"
      :width="canvasSize"
      :height="canvasSize"
      class="rolex-canvas"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
const canvasSize = 800; // 画布尺寸
let gl = null;
let animationId = null;

// WebGL着色器程序
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_hours;
  uniform float u_minutes;
  uniform float u_seconds;

  // 颜色常量
  const vec3 COLOR_GOLD = vec3(0.769, 0.624, 0.376); // #C49F60 劳力士金色
  const vec3 COLOR_SILVER = vec3(0.627, 0.627, 0.627); // #A0A0A0 银灰色
  const vec3 COLOR_BG = vec3(0.102, 0.102, 0.102); // #1A1A1A 深黑色
  const vec3 COLOR_TEXT = vec3(0.878, 0.878, 0.878); // #E0E0E0 文字颜色
  const vec3 COLOR_BLACK = vec3(0.0, 0.0, 0.0);
  const vec3 COLOR_WHITE = vec3(1.0, 1.0, 1.0);

  // 圆形SDF
  float circle(vec2 p, float r) {
    return length(p) - r;
  }

  // 线段SDF
  float line(vec2 p, vec2 a, vec2 b, float thickness) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - thickness;
  }

  // 矩形SDF
  float rect(vec2 p, vec2 size) {
    vec2 d = abs(p) - size;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  // 旋转函数
  vec2 rotate(vec2 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
  }

  // 平滑最小值
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  // 绘制表盘外框（金色）
  float watchCase(vec2 p) {
    float outer = circle(p, 0.85);
    float inner = circle(p, 0.78);
    return max(outer, -inner);
  }

  // 绘制表盘表面（深色带光泽）
  float watchFace(vec2 p) {
    return circle(p, 0.78);
  }

  // 绘制刻度
  float watchMarks(vec2 p) {
    float d = 10.0;

    for (int i = 0; i < 60; i++) {
      float angle = float(i) * 6.283185 / 60.0;
      vec2 rotP = rotate(p, -angle);

      // 小时刻度（粗）
      if (mod(float(i), 5.0) == 0.0) {
        float mark = rect(rotP - vec2(0.0, 0.68), vec2(0.015, 0.06));
        d = min(d, mark);
      } else {
        // 分钟刻度（细）
        float mark = rect(rotP - vec2(0.0, 0.72), vec2(0.008, 0.03));
        d = min(d, mark);
      }
    }

    return d;
  }

  // 绘制时针
  float hourHand(vec2 p, float hours) {
    float angle = (hours / 12.0) * 6.283185 - 1.5708;
    vec2 rotP = rotate(p, -angle);

    // 时针形状（梯形）
    float hand = rect(rotP - vec2(0.0, 0.25), vec2(0.025, 0.25));
    float tip = rect(rotP - vec2(0.0, 0.48), vec2(0.015, 0.02));

    return min(hand, tip);
  }

  // 绘制分针
  float minuteHand(vec2 p, float minutes) {
    float angle = (minutes / 60.0) * 6.283185 - 1.5708;
    vec2 rotP = rotate(p, -angle);

    float hand = rect(rotP - vec2(0.0, 0.35), vec2(0.02, 0.35));
    float tip = rect(rotP - vec2(0.0, 0.68), vec2(0.01, 0.02));

    return min(hand, tip);
  }

  // 绘制秒针
  float secondHand(vec2 p, float seconds) {
    float angle = (seconds / 60.0) * 6.283185 - 1.5708;
    vec2 rotP = rotate(p, -angle);

    // 秒针主体（细长）
    float hand = rect(rotP - vec2(0.0, 0.4), vec2(0.008, 0.4));
    // 秒针尾部
    float tail = rect(rotP - vec2(0.0, -0.1), vec2(0.008, 0.1));

    return min(hand, tail);
  }

  // 中心点装饰
  float centerDot(vec2 p) {
    float outer = circle(p, 0.05);
    float inner = circle(p, 0.03);
    return min(outer, max(circle(p, 0.04), -inner));
  }

  // 添加光泽效果
  float glossEffect(vec2 p, float radius) {
    vec2 lightPos = vec2(-0.3, 0.4);
    float dist = length(p - lightPos);
    return smoothstep(radius, radius * 0.3, dist);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    uv *= 1.2;

    vec3 color = COLOR_BG;

    // 表盘面（带太阳纹理效果）
    float face = watchFace(uv);
    if (face < 0.0) {
      float angle = atan(uv.y, uv.x);
      float sunburst = sin(angle * 50.0) * 0.02 + 0.98;
      vec3 faceColor = mix(vec3(0.05), vec3(0.08), sunburst);

      // 添加径向渐变
      float radialGrad = length(uv) / 0.78;
      faceColor *= mix(1.1, 0.8, radialGrad);

      // 玻璃光泽
      float gloss = glossEffect(uv, 0.8);
      faceColor += vec3(gloss * 0.15);

      color = faceColor;
    }

    // 外框（金色）
    float caseD = watchCase(uv);
    if (caseD < 0.0) {
      float caseGrad = smoothstep(-0.01, 0.01, caseD);
      vec3 goldColor = COLOR_GOLD;
      // 金属光泽
      float metalGloss = glossEffect(uv, 0.85) * 0.4;
      goldColor += vec3(metalGloss);
      color = mix(goldColor, color, caseGrad);
    }

    // 刻度（金色和银色混合）
    float marks = watchMarks(uv);
    if (marks < 0.0) {
      float markGrad = smoothstep(-0.002, 0.002, marks);
      vec3 markColor = mix(COLOR_GOLD, COLOR_SILVER, 0.3);
      color = mix(markColor, color, markGrad);
    }

    // 时针（金色带阴影）
    float hHand = hourHand(uv, u_hours);
    if (hHand < 0.0) {
      float handGrad = smoothstep(-0.003, 0.003, hHand);
      vec3 handColor = COLOR_GOLD * 0.9;
      // 内部高光
      if (hHand < -0.015) {
        handColor += vec3(0.1);
      }
      color = mix(handColor, color, handGrad);
    }

    // 分针（银灰色）
    float mHand = minuteHand(uv, u_minutes);
    if (mHand < 0.0) {
      float handGrad = smoothstep(-0.003, 0.003, mHand);
      vec3 handColor = COLOR_SILVER;
      if (mHand < -0.012) {
        handColor += vec3(0.15);
      }
      color = mix(handColor, color, handGrad);
    }

    // 秒针（金色，带红色点缀）
    float sHand = secondHand(uv, u_seconds);
    if (sHand < 0.0) {
      float handGrad = smoothstep(-0.001, 0.001, sHand);
      vec3 handColor = mix(COLOR_GOLD, vec3(0.8, 0.2, 0.1), 0.3);
      color = mix(handColor, color, handGrad);
    }

    // 中心点（金色）
    float center = centerDot(uv);
    if (center < 0.0) {
      float centerGrad = smoothstep(-0.002, 0.002, center);
      vec3 centerColor = COLOR_GOLD;
      // 中心高光
      if (circle(uv, 0.03) < 0.0) {
        centerColor += vec3(0.3);
      }
      color = mix(centerColor, color, centerGrad);
    }

    // 抗锯齿处理
    color = pow(color, vec3(0.9545)); // 伽马校正

    gl_FragColor = vec4(color, 1.0);
  }
`;

// 编译着色器
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('着色器编译错误:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// 创建程序
function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('程序链接错误:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

// 初始化WebGL
function initWebGL() {
  const canvasEl = canvas.value;
  gl = canvasEl.getContext('webgl') || canvasEl.getContext('experimental-webgl');

  if (!gl) {
    console.error('WebGL不支持');
    return;
  }

  // 编译着色器
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) return;

  // 创建程序
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) return;

  // 设置顶点数据（全屏四边形）
  const positions = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // 获取属性和统一变量位置
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const hoursLocation = gl.getUniformLocation(program, 'u_hours');
  const minutesLocation = gl.getUniformLocation(program, 'u_minutes');
  const secondsLocation = gl.getUniformLocation(program, 'u_seconds');

  // 渲染函数
  function render() {
    // 获取当前时间
    const now = new Date();
    const hours = now.getHours() % 12 + now.getMinutes() / 60;
    const minutes = now.getMinutes() + now.getSeconds() / 60;
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

    // 清空画布
    gl.viewport(0, 0, canvasEl.width, canvasEl.height);
    gl.clearColor(0.102, 0.102, 0.102, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 使用程序
    gl.useProgram(program);

    // 设置属性
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 设置统一变量
    gl.uniform2f(resolutionLocation, canvasEl.width, canvasEl.height);
    gl.uniform1f(timeLocation, performance.now() / 1000);
    gl.uniform1f(hoursLocation, hours);
    gl.uniform1f(minutesLocation, minutes);
    gl.uniform1f(secondsLocation, seconds);

    // 绘制
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // 继续动画
    animationId = requestAnimationFrame(render);
  }

  // 开始渲染
  render();
}

// 生命周期钩子
onMounted(() => {
  initWebGL();
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.rolex-container {
  min-height: 100vh;
  background: #1A1A1A;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.rolex-canvas {
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  height: 800px;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  filter: drop-shadow(0 20px 60px rgba(196, 159, 96, 0.3));
  transition: transform 0.3s ease;
}

.rolex-canvas:hover {
  transform: scale(1.02);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .rolex-canvas {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
}

@media (max-width: 480px) {
  .rolex-container {
    padding: 10px;
  }
}
</style>
