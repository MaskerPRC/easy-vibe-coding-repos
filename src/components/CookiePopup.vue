<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup-container cookie-popup" @click.stop>
      <div class="popup-header">
        <h3>🍪 Cookie 通知</h3>
        <button class="close-btn" @click="closePopup">×</button>
      </div>
      <div class="popup-body">
        <p>我们使用 Cookie 来改善您的浏览体验。继续使用本网站即表示您同意我们使用 Cookie。</p>
        <div class="cookie-details">
          <h4>我们使用以下类型的 Cookie：</h4>
          <ul>
            <li><strong>必要 Cookie：</strong>用于网站基本功能</li>
            <li><strong>分析 Cookie：</strong>帮助我们了解用户如何使用网站</li>
            <li><strong>营销 Cookie：</strong>用于个性化广告</li>
            <li><strong>社交媒体 Cookie：</strong>允许您分享内容</li>
          </ul>
        </div>
      </div>
      <div class="popup-footer">
        <button class="btn btn-accept" @click="acceptCookies">接受所有 Cookie</button>
        <button class="btn btn-reject" @click="closePopup">仅必要 Cookie</button>
        <button class="btn btn-settings" @click="showSettings">Cookie 设置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

// 反人类操作：关闭按钮不关闭
const closePopup = () => {
  alert('😈 哈哈！关闭按钮是假的！这个弹窗会一直存在！');
  // 不关闭弹窗
};

// "接受"按钮实际上拒绝
const acceptCookies = () => {
  alert('❌ 你以为接受了？其实你拒绝了所有 Cookie！');
  console.log('用户实际上拒绝了所有 Cookie');
  emit('close');
};

// "设置"按钮实际上接受全部
const showSettings = () => {
  alert('✅ Cookie 设置？不！你已经接受了所有 Cookie！');
  emit('close');
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.popup-container {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #999;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
}

.close-btn:hover {
  color: #333;
}

.popup-body {
  padding: 20px;
}

.popup-body p {
  margin: 0 0 15px 0;
  color: #555;
  line-height: 1.6;
}

.cookie-details {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

.cookie-details h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.cookie-details ul {
  margin: 0;
  padding-left: 20px;
}

.cookie-details li {
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.popup-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-accept {
  background: #28a745;
  color: white;
  flex: 1;
}

.btn-accept:hover {
  background: #218838;
}

.btn-reject {
  background: #6c757d;
  color: white;
  flex: 1;
}

.btn-reject:hover {
  background: #5a6268;
}

.btn-settings {
  background: #007bff;
  color: white;
  flex: 1;
}

.btn-settings:hover {
  background: #0056b3;
}
</style>
