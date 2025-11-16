<template>
  <div class="crash-card">
    <!-- 标题区域 -->
    <div class="card-header">
      <div class="header-left">
        <h2 class="crash-title">{{ crashData.title }}</h2>
        <div class="crash-meta">
          <span class="meta-year">{{ crashData.year }}</span>
          <span class="meta-separator">•</span>
          <span class="meta-os">{{ crashData.os }}</span>
        </div>
      </div>
      <div class="type-badge" :class="getBadgeClass(crashData.type)">
        {{ crashData.type }}
      </div>
    </div>

    <!-- 崩溃画面展示区 -->
    <div class="crash-screen-container">
      <div class="screen-wrapper">
        <!-- 根据类型渲染不同的SVG组件 -->
        <component :is="getScreenComponent()" v-bind="getScreenProps()" />
      </div>
    </div>

    <!-- 详细信息区域 -->
    <div class="crash-details">
      <!-- 设计信息 -->
      <div class="detail-section">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" stroke="#00FFCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          设计者
        </h3>
        <p class="section-content">{{ crashData.designer }}</p>
      </div>

      <!-- 灵感来源 -->
      <div class="detail-section">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2V7M10 7L7 4M10 7L13 4M4 18C4 15.7909 5.79086 14 8 14H12C14.2091 14 16 15.7909 16 18M14 6C14 8.20914 12.2091 10 10 10C7.79086 10 6 8.20914 6 6C6 3.79086 7.79086 2 10 2C12.2091 2 14 3.79086 14 6Z" stroke="#00FFCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          设计灵感
        </h3>
        <p class="section-content">{{ crashData.inspiration }}</p>
      </div>

      <!-- 技术细节 -->
      <div class="detail-section">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 7L2 10L6 13M14 7L18 10L14 13M11 3L9 17" stroke="#00FFCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          技术细节
        </h3>
        <p class="section-content">{{ crashData.technicalDetails }}</p>
      </div>

      <!-- 文化影响 -->
      <div class="detail-section">
        <h3 class="section-title">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#00FFCC" stroke-width="1.5"/>
            <path d="M2 10H18M10 2C12 4 13 7 13 10C13 13 12 16 10 18C8 16 7 13 7 10C7 7 8 4 10 2Z" stroke="#00FFCC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          文化影响
        </h3>
        <p class="section-content">{{ crashData.culturalImpact }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import WindowsBSOD from './WindowsBSOD.vue';
import MacOSKernelPanic from './MacOSKernelPanic.vue';
import UnixKernelPanic from './UnixKernelPanic.vue';

const props = defineProps({
  crashData: {
    type: Object,
    required: true
  }
});

// 获取屏幕组件
const getScreenComponent = () => {
  const osLower = props.crashData.os.toLowerCase();

  if (osLower.includes('windows')) {
    return WindowsBSOD;
  } else if (osLower.includes('mac') || osLower.includes('os x')) {
    return MacOSKernelPanic;
  } else if (osLower.includes('linux') || osLower.includes('bsd')) {
    return UnixKernelPanic;
  }

  return WindowsBSOD; // 默认
};

// 获取屏幕组件的props
const getScreenProps = () => {
  const osLower = props.crashData.os.toLowerCase();

  if (osLower.includes('windows')) {
    // 判断Windows版本
    if (osLower.includes('nt 3.1')) {
      return { version: 'nt' };
    } else if (osLower.includes('2000')) {
      return { version: '2000' };
    } else if (osLower.includes('8')) {
      return { version: '8' };
    } else if (osLower.includes('10') && osLower.includes('绿')) {
      return { version: 'green' };
    } else {
      return { version: '10' };
    }
  } else if (osLower.includes('mac') || osLower.includes('os x')) {
    // 判断macOS版本
    if (osLower.includes('10.0') || osLower.includes('10.1') || osLower.includes('10.2') ||
        osLower.includes('10.3') || osLower.includes('10.4') || osLower.includes('10.5') ||
        osLower.includes('10.6')) {
      return { version: 'early' };
    } else {
      return { version: 'lion' };
    }
  } else if (osLower.includes('linux')) {
    if (props.crashData.year >= 2010) {
      return { osType: 'linux', version: 'modern' };
    } else {
      return { osType: 'linux', version: 'classic' };
    }
  } else if (osLower.includes('freebsd')) {
    return { osType: 'freebsd' };
  } else if (osLower.includes('openbsd')) {
    return { osType: 'openbsd' };
  } else if (osLower.includes('netbsd')) {
    return { osType: 'netbsd' };
  }

  return {};
};

// 获取徽章样式类
const getBadgeClass = (type) => {
  return type.toLowerCase().replace(/\s+/g, '-');
};
</script>

<style scoped>
.crash-card {
  background: #1A2B42;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 48px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.crash-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 255, 204, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(0, 255, 204, 0.2);
}

.header-left {
  flex: 1;
}

.crash-title {
  color: #FFFFFF;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
}

.crash-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.meta-year {
  color: #00FFCC;
  font-weight: 600;
  font-size: 16px;
}

.meta-separator {
  color: #B0B0B0;
}

.meta-os {
  color: #E0E0E0;
}

.type-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.type-badge.bsod {
  background: rgba(0, 120, 215, 0.2);
  color: #0078D7;
  border: 1px solid #0078D7;
}

.type-badge.kernel-panic {
  background: rgba(255, 69, 58, 0.2);
  color: #FF453A;
  border: 1px solid #FF453A;
}

.crash-screen-container {
  margin-bottom: 40px;
  background: #000000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.screen-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.crash-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.detail-section {
  padding: 20px;
  background: rgba(0, 255, 204, 0.05);
  border-radius: 8px;
  border-left: 3px solid #00FFCC;
  transition: all 0.3s;
}

.detail-section:hover {
  background: rgba(0, 255, 204, 0.1);
  transform: translateX(4px);
}

.section-title {
  color: #00FFCC;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-content {
  color: #E0E0E0;
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
  text-align: justify;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .crash-card {
    padding: 20px;
    margin-bottom: 32px;
  }

  .card-header {
    flex-direction: column;
    gap: 16px;
  }

  .crash-title {
    font-size: 22px;
  }

  .crash-meta {
    font-size: 13px;
  }

  .meta-year {
    font-size: 15px;
  }

  .type-badge {
    align-self: flex-start;
  }

  .crash-screen-container {
    margin-bottom: 24px;
  }

  .crash-details {
    gap: 16px;
  }

  .detail-section {
    padding: 16px;
  }

  .section-title {
    font-size: 15px;
  }

  .section-content {
    font-size: 14px;
    line-height: 1.7;
  }
}

@media (max-width: 480px) {
  .crash-card {
    padding: 16px;
  }

  .crash-title {
    font-size: 20px;
  }
}
</style>
