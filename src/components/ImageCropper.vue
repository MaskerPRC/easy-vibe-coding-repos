<template>
  <div class="image-cropper">
    <div class="header">
      <h1>图片裁剪工具</h1>
      <p class="subtitle">上传图片并选择裁剪区域</p>
    </div>

    <div class="container">
      <!-- 上传区域 -->
      <div class="upload-section" v-if="!imageLoaded">
        <div class="upload-box" @dragover.prevent @drop.prevent="handleDrop">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            style="display: none"
          />
          <div class="upload-content" @click="$refs.fileInput.click()">
            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="17 8 12 3 7 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="3" x2="12" y2="15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>点击或拖拽图片到此处</h3>
            <p>支持 JPG、PNG、GIF 等格式</p>
          </div>
        </div>
      </div>

      <!-- 裁剪区域 -->
      <div class="crop-section" v-else>
        <div class="canvas-container">
          <canvas
            ref="canvas"
            @mousedown="startCrop"
            @mousemove="updateCrop"
            @mouseup="endCrop"
            @mouseleave="endCrop"
          ></canvas>
        </div>

        <!-- 控制面板 -->
        <div class="controls">
          <div class="control-group">
            <label>裁剪宽度: {{ cropWidth }}px</label>
            <input
              type="range"
              v-model.number="cropWidth"
              min="50"
              :max="imageWidth"
              @input="updateCropFromInputs"
            />
          </div>

          <div class="control-group">
            <label>裁剪高度: {{ cropHeight }}px</label>
            <input
              type="range"
              v-model.number="cropHeight"
              min="50"
              :max="imageHeight"
              @input="updateCropFromInputs"
            />
          </div>

          <div class="control-group">
            <label>X 坐标: {{ cropX }}px</label>
            <input
              type="range"
              v-model.number="cropX"
              min="0"
              :max="maxCropX"
              @input="updateCropFromInputs"
            />
          </div>

          <div class="control-group">
            <label>Y 坐标: {{ cropY }}px</label>
            <input
              type="range"
              v-model.number="cropY"
              min="0"
              :max="maxCropY"
              @input="updateCropFromInputs"
            />
          </div>

          <div class="aspect-ratio-group">
            <label>宽高比:</label>
            <div class="aspect-buttons">
              <button @click="setAspectRatio(null)" :class="{ active: aspectRatio === null }">
                自由
              </button>
              <button @click="setAspectRatio(1)" :class="{ active: aspectRatio === 1 }">
                1:1
              </button>
              <button @click="setAspectRatio(16/9)" :class="{ active: aspectRatio === 16/9 }">
                16:9
              </button>
              <button @click="setAspectRatio(4/3)" :class="{ active: aspectRatio === 4/3 }">
                4:3
              </button>
            </div>
          </div>

          <div class="button-group">
            <button class="btn btn-primary" @click="cropImage">
              裁剪图片
            </button>
            <button class="btn btn-secondary" @click="resetCrop">
              重置裁剪
            </button>
            <button class="btn btn-secondary" @click="resetImage">
              重新上传
            </button>
          </div>
        </div>

        <!-- 预览区域 -->
        <div class="preview-section" v-if="croppedImageUrl">
          <h3>裁剪预览</h3>
          <div class="preview-box">
            <img :src="croppedImageUrl" alt="裁剪预览" />
          </div>
          <div class="preview-info">
            <p>尺寸: {{ croppedWidth }} × {{ croppedHeight }} px</p>
          </div>
          <div class="button-group">
            <button class="btn btn-success" @click="downloadImage">
              下载图片
            </button>
            <button class="btn btn-info" @click="saveToServer">
              保存到服务器
            </button>
          </div>
          <div v-if="saveMessage" class="save-message" :class="saveMessageType">
            {{ saveMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

// 状态
const imageLoaded = ref(false);
const canvas = ref(null);
const ctx = ref(null);
const fileInput = ref(null);

// 图片相关
const originalImage = ref(null);
const imageWidth = ref(0);
const imageHeight = ref(0);

// 裁剪区域
const cropX = ref(0);
const cropY = ref(0);
const cropWidth = ref(200);
const cropHeight = ref(200);
const isDragging = ref(false);
const dragMode = ref(''); // 'move', 'resize-tl', 'resize-tr', 'resize-bl', 'resize-br'
const dragStartX = ref(0);
const dragStartY = ref(0);
const aspectRatio = ref(null);

// 裁剪结果
const croppedImageUrl = ref('');
const croppedWidth = ref(0);
const croppedHeight = ref(0);

// 保存消息
const saveMessage = ref('');
const saveMessageType = ref('success');

// 计算属性
const maxCropX = computed(() => Math.max(0, imageWidth.value - cropWidth.value));
const maxCropY = computed(() => Math.max(0, imageHeight.value - cropHeight.value));

// 文件选择处理
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    loadImage(file);
  }
};

// 拖放处理
const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    loadImage(file);
  }
};

// 加载图片
const loadImage = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      originalImage.value = img;
      imageWidth.value = img.width;
      imageHeight.value = img.height;

      // 初始化裁剪区域（居中）
      const size = Math.min(img.width, img.height, 400);
      cropWidth.value = size;
      cropHeight.value = size;
      cropX.value = (img.width - size) / 2;
      cropY.value = (img.height - size) / 2;

      imageLoaded.value = true;

      nextTick(() => {
        initCanvas();
      });
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// 初始化画布
const initCanvas = () => {
  if (!canvas.value || !originalImage.value) return;

  const maxWidth = 800;
  const maxHeight = 600;
  let scale = 1;

  if (imageWidth.value > maxWidth || imageHeight.value > maxHeight) {
    scale = Math.min(maxWidth / imageWidth.value, maxHeight / imageHeight.value);
  }

  canvas.value.width = imageWidth.value * scale;
  canvas.value.height = imageHeight.value * scale;

  ctx.value = canvas.value.getContext('2d');
  drawCanvas();
};

// 绘制画布
const drawCanvas = () => {
  if (!ctx.value || !originalImage.value) return;

  const scale = canvas.value.width / imageWidth.value;

  // 清空画布
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // 绘制原图
  ctx.value.drawImage(originalImage.value, 0, 0, canvas.value.width, canvas.value.height);

  // 绘制遮罩
  ctx.value.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);

  // 清除裁剪区域的遮罩
  ctx.value.clearRect(
    cropX.value * scale,
    cropY.value * scale,
    cropWidth.value * scale,
    cropHeight.value * scale
  );

  // 重新绘制裁剪区域的图片
  ctx.value.drawImage(
    originalImage.value,
    cropX.value,
    cropY.value,
    cropWidth.value,
    cropHeight.value,
    cropX.value * scale,
    cropY.value * scale,
    cropWidth.value * scale,
    cropHeight.value * scale
  );

  // 绘制裁剪框
  ctx.value.strokeStyle = '#00ff00';
  ctx.value.lineWidth = 2;
  ctx.value.strokeRect(
    cropX.value * scale,
    cropY.value * scale,
    cropWidth.value * scale,
    cropHeight.value * scale
  );

  // 绘制控制点
  const handleSize = 8;
  ctx.value.fillStyle = '#00ff00';

  // 四个角的控制点
  const corners = [
    [cropX.value * scale, cropY.value * scale],
    [(cropX.value + cropWidth.value) * scale, cropY.value * scale],
    [cropX.value * scale, (cropY.value + cropHeight.value) * scale],
    [(cropX.value + cropWidth.value) * scale, (cropY.value + cropHeight.value) * scale],
  ];

  corners.forEach(([x, y]) => {
    ctx.value.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
  });
};

// 开始裁剪
const startCrop = (event) => {
  const rect = canvas.value.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width * canvas.value.width;
  const y = (event.clientY - rect.top) / rect.height * canvas.value.height;

  const scale = canvas.value.width / imageWidth.value;
  const handleSize = 8;

  // 检查是否点击了控制点
  const corners = [
    { x: cropX.value * scale, y: cropY.value * scale, mode: 'resize-tl' },
    { x: (cropX.value + cropWidth.value) * scale, y: cropY.value * scale, mode: 'resize-tr' },
    { x: cropX.value * scale, y: (cropY.value + cropHeight.value) * scale, mode: 'resize-bl' },
    { x: (cropX.value + cropWidth.value) * scale, y: (cropY.value + cropHeight.value) * scale, mode: 'resize-br' },
  ];

  for (const corner of corners) {
    if (Math.abs(x - corner.x) <= handleSize && Math.abs(y - corner.y) <= handleSize) {
      isDragging.value = true;
      dragMode.value = corner.mode;
      dragStartX.value = x;
      dragStartY.value = y;
      return;
    }
  }

  // 检查是否在裁剪区域内
  if (
    x >= cropX.value * scale &&
    x <= (cropX.value + cropWidth.value) * scale &&
    y >= cropY.value * scale &&
    y <= (cropY.value + cropHeight.value) * scale
  ) {
    isDragging.value = true;
    dragMode.value = 'move';
    dragStartX.value = x;
    dragStartY.value = y;
  }
};

// 更新裁剪
const updateCrop = (event) => {
  if (!isDragging.value) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width * canvas.value.width;
  const y = (event.clientY - rect.top) / rect.height * canvas.value.height;

  const scale = canvas.value.width / imageWidth.value;
  const dx = (x - dragStartX.value) / scale;
  const dy = (y - dragStartY.value) / scale;

  if (dragMode.value === 'move') {
    cropX.value = Math.max(0, Math.min(imageWidth.value - cropWidth.value, cropX.value + dx));
    cropY.value = Math.max(0, Math.min(imageHeight.value - cropHeight.value, cropY.value + dy));
  } else if (dragMode.value.startsWith('resize-')) {
    const corner = dragMode.value.split('-')[1];

    if (corner === 'tl') {
      const newX = Math.max(0, Math.min(cropX.value + cropWidth.value - 50, cropX.value + dx));
      const newY = Math.max(0, Math.min(cropY.value + cropHeight.value - 50, cropY.value + dy));
      cropWidth.value = cropWidth.value - (newX - cropX.value);
      cropHeight.value = cropHeight.value - (newY - cropY.value);
      cropX.value = newX;
      cropY.value = newY;
    } else if (corner === 'tr') {
      const newWidth = Math.max(50, Math.min(imageWidth.value - cropX.value, cropWidth.value + dx));
      const newY = Math.max(0, Math.min(cropY.value + cropHeight.value - 50, cropY.value + dy));
      cropWidth.value = newWidth;
      cropHeight.value = cropHeight.value - (newY - cropY.value);
      cropY.value = newY;
    } else if (corner === 'bl') {
      const newX = Math.max(0, Math.min(cropX.value + cropWidth.value - 50, cropX.value + dx));
      const newHeight = Math.max(50, Math.min(imageHeight.value - cropY.value, cropHeight.value + dy));
      cropWidth.value = cropWidth.value - (newX - cropX.value);
      cropHeight.value = newHeight;
      cropX.value = newX;
    } else if (corner === 'br') {
      cropWidth.value = Math.max(50, Math.min(imageWidth.value - cropX.value, cropWidth.value + dx));
      cropHeight.value = Math.max(50, Math.min(imageHeight.value - cropY.value, cropHeight.value + dy));
    }

    // 应用宽高比约束
    if (aspectRatio.value) {
      if (corner === 'tl' || corner === 'br') {
        cropHeight.value = cropWidth.value / aspectRatio.value;
      } else {
        cropWidth.value = cropHeight.value * aspectRatio.value;
      }
    }
  }

  dragStartX.value = x;
  dragStartY.value = y;

  drawCanvas();
};

// 结束裁剪
const endCrop = () => {
  isDragging.value = false;
  dragMode.value = '';
};

// 从输入更新裁剪
const updateCropFromInputs = () => {
  cropX.value = Math.max(0, Math.min(maxCropX.value, cropX.value));
  cropY.value = Math.max(0, Math.min(maxCropY.value, cropY.value));
  drawCanvas();
};

// 设置宽高比
const setAspectRatio = (ratio) => {
  aspectRatio.value = ratio;
  if (ratio) {
    cropHeight.value = Math.round(cropWidth.value / ratio);
    if (cropHeight.value > imageHeight.value) {
      cropHeight.value = imageHeight.value;
      cropWidth.value = Math.round(cropHeight.value * ratio);
    }
    updateCropFromInputs();
  }
};

// 裁剪图片
const cropImage = () => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = cropWidth.value;
  tempCanvas.height = cropHeight.value;
  const tempCtx = tempCanvas.getContext('2d');

  tempCtx.drawImage(
    originalImage.value,
    cropX.value,
    cropY.value,
    cropWidth.value,
    cropHeight.value,
    0,
    0,
    cropWidth.value,
    cropHeight.value
  );

  croppedImageUrl.value = tempCanvas.toDataURL('image/png');
  croppedWidth.value = cropWidth.value;
  croppedHeight.value = cropHeight.value;
};

// 重置裁剪
const resetCrop = () => {
  const size = Math.min(imageWidth.value, imageHeight.value, 400);
  cropWidth.value = size;
  cropHeight.value = size;
  cropX.value = (imageWidth.value - size) / 2;
  cropY.value = (imageHeight.value - size) / 2;
  aspectRatio.value = null;
  croppedImageUrl.value = '';
  drawCanvas();
};

// 重新上传
const resetImage = () => {
  imageLoaded.value = false;
  originalImage.value = null;
  croppedImageUrl.value = '';
  saveMessage.value = '';
};

// 下载图片
const downloadImage = () => {
  const link = document.createElement('a');
  link.download = `cropped_image_${Date.now()}.png`;
  link.href = croppedImageUrl.value;
  link.click();
};

// 保存到服务器
const saveToServer = async () => {
  try {
    const response = await fetch('/api/image-crop/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: croppedImageUrl.value,
        width: croppedWidth.value,
        height: croppedHeight.value,
        timestamp: Date.now(),
      }),
    });

    const data = await response.json();

    if (data.success) {
      saveMessage.value = '图片保存成功！';
      saveMessageType.value = 'success';
    } else {
      saveMessage.value = '保存失败: ' + (data.error || '未知错误');
      saveMessageType.value = 'error';
    }
  } catch (error) {
    saveMessage.value = '保存失败: ' + error.message;
    saveMessageType.value = 'error';
  }

  setTimeout(() => {
    saveMessage.value = '';
  }, 3000);
};
</script>

<style scoped>
.image-cropper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 上传区域 */
.upload-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.upload-box {
  background: white;
  border-radius: 20px;
  padding: 60px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.upload-box:hover {
  transform: translateY(-5px);
}

.upload-content {
  text-align: center;
  cursor: pointer;
}

.upload-icon {
  width: 100px;
  height: 100px;
  color: #667eea;
  margin-bottom: 20px;
}

.upload-content h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.upload-content p {
  font-size: 16px;
  color: #666;
}

/* 裁剪区域 */
.crop-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.canvas-container {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

canvas {
  max-width: 100%;
  cursor: crosshair;
  border-radius: 10px;
}

/* 控制面板 */
.controls {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.control-group {
  margin-bottom: 25px;
}

.control-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #667eea;
  cursor: pointer;
  border-radius: 50%;
}

.control-group input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #667eea;
  cursor: pointer;
  border-radius: 50%;
  border: none;
}

.aspect-ratio-group {
  margin-bottom: 25px;
}

.aspect-ratio-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.aspect-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.aspect-buttons button {
  padding: 10px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.aspect-buttons button:hover {
  background: #e0e0e0;
}

.aspect-buttons button.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(56, 239, 125, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
}

/* 预览区域 */
.preview-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  grid-column: span 2;
  margin-top: 30px;
}

.preview-section h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.preview-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 20px;
}

.preview-box img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-info {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.save-message {
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

.save-message.success {
  background: #d4edda;
  color: #155724;
}

.save-message.error {
  background: #f8d7da;
  color: #721c24;
}

/* 响应式设计 */
@media (max-width: 968px) {
  .crop-section {
    grid-template-columns: 1fr;
  }

  .preview-section {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 32px;
  }

  .upload-box {
    padding: 40px 20px;
  }

  .upload-icon {
    width: 60px;
    height: 60px;
  }
}
</style>
