<template>
  <div class="skeuomorphic-container">
    <!-- 桌面 -->
    <div class="desk">
      <!-- 电脑支架和屏幕 -->
      <div class="monitor-stand">
        <!-- 屏幕 -->
        <div class="monitor">
          <!-- 屏幕边框 -->
          <div class="monitor-bezel">
            <!-- 屏幕显示区域 -->
            <div class="screen">
              <iframe
                src="https://www.kfc.com.cn/"
                frameborder="0"
                class="website-frame"
                title="肯德基官网"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                loading="lazy"
              ></iframe>
            </div>
            <!-- 屏幕底部品牌标识 -->
            <div class="monitor-brand">MONITOR</div>
          </div>
        </div>

        <!-- 支架底座连接部分 -->
        <div class="stand-neck"></div>

        <!-- 支架底座 -->
        <div class="stand-base"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 组件加载完成
onMounted(() => {
  console.log('拟物风格电脑屏幕组件已加载');
});
</script>

<style scoped>
/* 容器 - 浅白色背景 */
.skeuomorphic-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  overflow: auto;
}

/* 桌面 */
.desk {
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: auto;
  background: linear-gradient(180deg, #8b7355 0%, #6b5644 100%);
  border-radius: 20px;
  padding: 80px 40px 40px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.1),
    inset 0 -2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 木纹效果 */
.desk::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
    );
  border-radius: 20px;
  pointer-events: none;
}

/* 显示器和支架组合 */
.monitor-stand {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 显示器主体 */
.monitor {
  position: relative;
  width: 90vw;
  max-width: 1200px;
  aspect-ratio: 16 / 9;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 20px;
  padding: 20px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 5px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.5);
  transform-style: preserve-3d;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 显示器边框 */
.monitor-bezel {
  width: 100%;
  height: 100%;
  background: #0a0a0a;
  border-radius: 15px;
  padding: 15px;
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.8),
    inset 0 2px 4px rgba(255, 255, 255, 0.05);
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 屏幕显示区域 */
.screen {
  flex: 1;
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    inset 0 0 30px rgba(0, 0, 0, 0.9),
    0 0 15px rgba(100, 150, 255, 0.1);
  position: relative;
}

/* 屏幕反光效果 */
.screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 1;
  border-radius: 8px 8px 0 0;
}

/* iframe 网站嵌入 */
.website-frame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #fff;
}

/* 显示器品牌标识 */
.monitor-brand {
  text-align: center;
  color: #666;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-top: 8px;
  text-transform: uppercase;
  font-family: 'Arial', sans-serif;
}

/* 支架颈部 */
.stand-neck {
  width: 50px;
  height: 80px;
  background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
  border-radius: 8px;
  margin-top: 10px;
  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.5);
  position: relative;
}

/* 支架颈部金属质感 */
.stand-neck::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: #555;
  border-radius: 2px;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.1),
    0 -1px 0 rgba(0, 0, 0, 0.3);
}

/* 支架底座 */
.stand-base {
  width: 280px;
  height: 30px;
  background: linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%);
  border-radius: 50px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.1),
    inset 0 -2px 5px rgba(0, 0, 0, 0.5);
  position: relative;
  margin-top: 5px;
}

/* 底座高光 */
.stand-base::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 20%;
  right: 20%;
  height: 8px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  );
  border-radius: 50px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .desk {
    padding: 60px 30px 30px;
  }

  .monitor {
    width: 85vw;
  }

  .stand-neck {
    width: 40px;
    height: 60px;
  }

  .stand-base {
    width: 220px;
    height: 25px;
  }
}

@media (max-width: 768px) {
  .skeuomorphic-container {
    padding: 20px 10px;
  }

  .desk {
    padding: 40px 20px 20px;
    border-radius: 15px;
  }

  .monitor {
    width: 88vw;
    padding: 15px;
    border-radius: 15px;
  }

  .monitor-bezel {
    padding: 10px;
    border-radius: 10px;
  }

  .screen {
    border-radius: 5px;
  }

  .stand-neck {
    width: 35px;
    height: 50px;
  }

  .stand-base {
    width: 180px;
    height: 20px;
  }

  .monitor-brand {
    font-size: 9px;
    margin-top: 5px;
  }
}

@media (max-width: 480px) {
  .desk {
    padding: 30px 15px 15px;
  }

  .monitor {
    width: 90vw;
    padding: 12px;
  }

  .stand-neck {
    width: 30px;
    height: 40px;
  }

  .stand-base {
    width: 150px;
    height: 18px;
  }
}
</style>
