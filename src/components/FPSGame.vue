<template>
  <div class="fps-game" ref="gameContainer">
    <!-- 游戏画布 -->
    <canvas ref="gameCanvas"></canvas>

    <!-- 游戏 UI -->
    <div class="game-ui">
      <!-- 准星 -->
      <div class="crosshair">
        <div class="crosshair-line crosshair-top"></div>
        <div class="crosshair-line crosshair-bottom"></div>
        <div class="crosshair-line crosshair-left"></div>
        <div class="crosshair-line crosshair-right"></div>
        <div class="crosshair-center"></div>
      </div>

      <!-- 状态栏 -->
      <div class="status-bar">
        <div class="health-ammo">
          <div class="health">
            <div class="health-icon">❤️</div>
            <div class="health-value">{{ playerHealth }}</div>
          </div>
          <div class="ammo">
            <div class="ammo-icon">🔫</div>
            <div class="ammo-value">{{ currentAmmo }} / {{ totalAmmo }}</div>
          </div>
        </div>
        <div class="score">
          <div class="kills">击杀: {{ kills }}</div>
          <div class="deaths">死亡: {{ deaths }}</div>
        </div>
      </div>

      <!-- 击中提示 -->
      <div v-if="hitMarker" class="hit-marker">
        <div class="hit-line hit-line-1"></div>
        <div class="hit-line hit-line-2"></div>
        <div class="hit-line hit-line-3"></div>
        <div class="hit-line hit-line-4"></div>
      </div>

      <!-- 游戏消息 -->
      <div class="game-messages">
        <transition-group name="message">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message"
            :class="msg.type"
          >
            {{ msg.text }}
          </div>
        </transition-group>
      </div>

      <!-- 开始界面 -->
      <div v-if="!gameStarted" class="start-screen">
        <h1>CS: WEB STRIKE</h1>
        <p class="subtitle">网页版射击竞技游戏</p>
        <button @click="startGame" class="start-btn">开始游戏</button>
        <div class="controls-info">
          <h3>游戏操作</h3>
          <ul>
            <li><kbd>W A S D</kbd> - 移动</li>
            <li><kbd>鼠标</kbd> - 视角控制</li>
            <li><kbd>左键</kbd> - 射击</li>
            <li><kbd>R</kbd> - 换弹</li>
            <li><kbd>空格</kbd> - 跳跃</li>
            <li><kbd>Shift</kbd> - 奔跑</li>
            <li><kbd>ESC</kbd> - 暂停/退出</li>
          </ul>
        </div>
      </div>

      <!-- 暂停界面 -->
      <div v-if="isPaused && gameStarted" class="pause-screen">
        <h2>游戏暂停</h2>
        <button @click="resumeGame" class="resume-btn">继续游戏</button>
        <button @click="exitGame" class="exit-btn">退出游戏</button>
      </div>

      <!-- 死亡界面 -->
      <div v-if="isDead" class="death-screen">
        <h2>你被击败了</h2>
        <p>{{ deathMessage }}</p>
        <div class="respawn-timer">{{ respawnTimer }}秒后重生</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import axios from 'axios';

export default {
  name: 'FPSGame',
  data() {
    return {
      // 游戏状态
      gameStarted: false,
      isPaused: false,
      isDead: false,
      deathMessage: '',
      respawnTimer: 5,

      // 玩家状态
      playerHealth: 100,
      currentAmmo: 30,
      totalAmmo: 90,
      kills: 0,
      deaths: 0,

      // UI 状态
      hitMarker: false,
      messages: [],
      messageIdCounter: 0,

      // Three.js 对象
      scene: null,
      camera: null,
      renderer: null,

      // 游戏对象
      enemies: [],
      bullets: [],

      // 控制
      keys: {},
      mouse: { x: 0, y: 0 },
      yaw: 0,
      pitch: 0,

      // 玩家移动
      velocity: new THREE.Vector3(),
      speed: 0.1,
      sprintSpeed: 0.15,
      jumpVelocity: 0.2,
      gravity: 0.01,
      isGrounded: true,

      // 射击
      canShoot: true,
      fireRate: 100, // 毫秒
      reloading: false,

      // 动画
      animationId: null,
    };
  },
  mounted() {
    this.setupEventListeners();
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    // 初始化游戏
    initGame() {
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87ceeb);
      this.scene.fog = new THREE.Fog(0x87ceeb, 0, 100);

      // 创建相机
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.y = 1.6; // 眼睛高度

      // 创建渲染器
      const canvas = this.$refs.gameCanvas;
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // 添加光源
      this.addLights();

      // 创建地图
      this.createMap();

      // 创建敌人
      this.createEnemies();

      // 开始游戏循环
      this.animate();

      // 获取游戏数据
      this.fetchGameData();
    },

    // 添加光源
    addLights() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      // 太阳光
      const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
      sunLight.position.set(50, 100, 50);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.far = 200;
      sunLight.shadow.camera.left = -50;
      sunLight.shadow.camera.right = 50;
      sunLight.shadow.camera.top = 50;
      sunLight.shadow.camera.bottom = -50;
      this.scene.add(sunLight);
    },

    // 创建地图
    createMap() {
      // 地面
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a5f3a,
        roughness: 0.8,
        metalness: 0.2
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      this.scene.add(ground);

      // 创建墙壁和掩体
      this.createWalls();
      this.createCover();

      // 添加天空盒效果
      const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
      const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x87ceeb,
        side: THREE.BackSide
      });
      const sky = new THREE.Mesh(skyGeometry, skyMaterial);
      this.scene.add(sky);
    },

    // 创建墙壁
    createWalls() {
      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.9
      });

      // 围墙
      const walls = [
        { pos: [0, 2, -40], size: [80, 4, 2] },  // 后墙
        { pos: [0, 2, 40], size: [80, 4, 2] },   // 前墙
        { pos: [-40, 2, 0], size: [2, 4, 80] },  // 左墙
        { pos: [40, 2, 0], size: [2, 4, 80] },   // 右墙
      ];

      walls.forEach(wall => {
        const geometry = new THREE.BoxGeometry(...wall.size);
        const mesh = new THREE.Mesh(geometry, wallMaterial);
        mesh.position.set(...wall.pos);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
      });
    },

    // 创建掩体
    createCover() {
      const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.8
      });

      // 随机放置掩体箱子
      const coverPositions = [
        [-15, 0.75, -15],
        [15, 0.75, -15],
        [-15, 0.75, 15],
        [15, 0.75, 15],
        [0, 0.75, 0],
        [-20, 0.75, 0],
        [20, 0.75, 0],
        [0, 0.75, -20],
        [0, 0.75, 20],
      ];

      coverPositions.forEach(pos => {
        const geometry = new THREE.BoxGeometry(2, 1.5, 2);
        const mesh = new THREE.Mesh(geometry, boxMaterial);
        mesh.position.set(...pos);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
      });
    },

    // 创建敌人
    createEnemies() {
      const enemyPositions = [
        [-20, 1, -20],
        [20, 1, -20],
        [-20, 1, 20],
        [20, 1, 20],
        [0, 1, -25],
      ];

      enemyPositions.forEach((pos, index) => {
        const enemy = this.createEnemy(pos);
        enemy.id = index;
        this.enemies.push(enemy);
        this.scene.add(enemy.group);
      });
    },

    // 创建单个敌人
    createEnemy(position) {
      const group = new THREE.Group();

      // 身体
      const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.4);
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.6;
      body.castShadow = true;
      group.add(body);

      // 头部
      const headGeometry = new THREE.SphereGeometry(0.3);
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffcccc });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.5;
      head.castShadow = true;
      group.add(head);

      group.position.set(...position);

      return {
        group,
        health: 100,
        alive: true,
        position: new THREE.Vector3(...position),
        lastMoveTime: Date.now(),
        moveDirection: new THREE.Vector3(),
      };
    },

    // 事件监听
    setupEventListeners() {
      window.addEventListener('resize', this.onWindowResize);
      document.addEventListener('keydown', this.onKeyDown);
      document.addEventListener('keyup', this.onKeyUp);
    },

    // 开始游戏
    startGame() {
      this.gameStarted = true;
      this.initGame();

      // 锁定鼠标
      this.$refs.gameContainer.requestPointerLock();

      // 监听鼠标
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('click', this.onMouseClick);

      this.showMessage('游戏开始！消灭所有敌人！', 'info');
    },

    // 继续游戏
    resumeGame() {
      this.isPaused = false;
      this.$refs.gameContainer.requestPointerLock();
      this.animate();
    },

    // 退出游戏
    exitGame() {
      this.gameStarted = false;
      this.isPaused = false;
      document.exitPointerLock();
      this.cleanup();
    },

    // 窗口大小改变
    onWindowResize() {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    },

    // 键盘按下
    onKeyDown(e) {
      this.keys[e.key.toLowerCase()] = true;

      // ESC 暂停
      if (e.key === 'Escape' && this.gameStarted && !this.isDead) {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
          document.exitPointerLock();
          cancelAnimationFrame(this.animationId);
        } else {
          this.$refs.gameContainer.requestPointerLock();
          this.animate();
        }
      }

      // R 换弹
      if (e.key.toLowerCase() === 'r' && !this.reloading && this.currentAmmo < 30) {
        this.reload();
      }
    },

    // 键盘松开
    onKeyUp(e) {
      this.keys[e.key.toLowerCase()] = false;
    },

    // 鼠标移动
    onMouseMove(e) {
      if (document.pointerLockElement === this.$refs.gameContainer) {
        const sensitivity = 0.002;
        this.yaw -= e.movementX * sensitivity;
        this.pitch -= e.movementY * sensitivity;
        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
      }
    },

    // 鼠标点击
    onMouseClick() {
      if (document.pointerLockElement === this.$refs.gameContainer) {
        this.shoot();
      }
    },

    // 射击
    shoot() {
      if (!this.canShoot || this.reloading || this.currentAmmo <= 0 || this.isDead) {
        return;
      }

      this.currentAmmo--;
      this.canShoot = false;
      setTimeout(() => {
        this.canShoot = true;
      }, this.fireRate);

      // 射线检测
      const raycaster = new THREE.Raycaster();
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(this.camera.quaternion);
      raycaster.set(this.camera.position, direction);

      // 检测敌人
      const enemyMeshes = this.enemies
        .filter(e => e.alive)
        .map(e => e.group.children)
        .flat();

      const intersects = raycaster.intersectObjects(enemyMeshes);

      if (intersects.length > 0) {
        // 击中敌人
        const hitEnemy = this.enemies.find(e =>
          e.group.children.includes(intersects[0].object)
        );

        if (hitEnemy) {
          const isHeadshot = intersects[0].object.geometry.type === 'SphereGeometry';
          const damage = isHeadshot ? 100 : 34;

          hitEnemy.health -= damage;
          this.showHitMarker();

          if (hitEnemy.health <= 0 && hitEnemy.alive) {
            hitEnemy.alive = false;
            this.scene.remove(hitEnemy.group);
            this.kills++;
            this.showMessage(
              isHeadshot ? '爆头击杀！+100' : '击杀！+100',
              'success'
            );

            // 检查是否全部消灭
            if (this.enemies.every(e => !e.alive)) {
              this.showMessage('胜利！所有敌人已被消灭！', 'success');
              setTimeout(() => {
                this.resetGame();
              }, 3000);
            }
          }
        }
      }
    },

    // 换弹
    reload() {
      if (this.totalAmmo > 0) {
        this.reloading = true;
        this.showMessage('换弹中...', 'info');

        setTimeout(() => {
          const needed = 30 - this.currentAmmo;
          const toReload = Math.min(needed, this.totalAmmo);
          this.currentAmmo += toReload;
          this.totalAmmo -= toReload;
          this.reloading = false;
          this.showMessage('换弹完成', 'info');
        }, 1500);
      }
    },

    // 显示击中标记
    showHitMarker() {
      this.hitMarker = true;
      setTimeout(() => {
        this.hitMarker = false;
      }, 100);
    },

    // 显示消息
    showMessage(text, type = 'info') {
      const id = this.messageIdCounter++;
      this.messages.push({ id, text, type });

      setTimeout(() => {
        const index = this.messages.findIndex(m => m.id === id);
        if (index > -1) {
          this.messages.splice(index, 1);
        }
      }, 3000);
    },

    // 玩家受伤
    takeDamage(damage) {
      this.playerHealth -= damage;
      if (this.playerHealth <= 0) {
        this.playerHealth = 0;
        this.die();
      }
    },

    // 玩家死亡
    die() {
      this.isDead = true;
      this.deaths++;
      this.deathMessage = '你被敌人击败了！';
      this.respawnTimer = 5;

      const interval = setInterval(() => {
        this.respawnTimer--;
        if (this.respawnTimer <= 0) {
          clearInterval(interval);
          this.respawn();
        }
      }, 1000);
    },

    // 重生
    respawn() {
      this.isDead = false;
      this.playerHealth = 100;
      this.currentAmmo = 30;
      this.totalAmmo = 90;
      this.camera.position.set(0, 1.6, 30);
      this.yaw = 0;
      this.pitch = 0;
      this.showMessage('已重生', 'info');
    },

    // 重置游戏
    resetGame() {
      // 清理现有敌人
      this.enemies.forEach(enemy => {
        this.scene.remove(enemy.group);
      });
      this.enemies = [];

      // 重置玩家状态
      this.playerHealth = 100;
      this.currentAmmo = 30;
      this.totalAmmo = 90;
      this.kills = 0;

      // 重新创建敌人
      this.createEnemies();

      this.showMessage('新一轮开始！', 'info');
    },

    // 更新玩家移动
    updatePlayerMovement() {
      if (this.isDead) return;

      // 计算移动方向
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.yaw
      );
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.yaw
      );

      const currentSpeed = this.keys['shift'] ? this.sprintSpeed : this.speed;

      // WASD 移动
      if (this.keys['w']) {
        this.camera.position.add(forward.multiplyScalar(currentSpeed));
      }
      if (this.keys['s']) {
        this.camera.position.add(forward.multiplyScalar(-currentSpeed));
      }
      if (this.keys['a']) {
        this.camera.position.add(right.multiplyScalar(-currentSpeed));
      }
      if (this.keys['d']) {
        this.camera.position.add(right.multiplyScalar(currentSpeed));
      }

      // 跳跃
      if (this.keys[' '] && this.isGrounded) {
        this.velocity.y = this.jumpVelocity;
        this.isGrounded = false;
      }

      // 重力
      if (!this.isGrounded) {
        this.velocity.y -= this.gravity;
      }

      this.camera.position.y += this.velocity.y;

      // 地面检测
      if (this.camera.position.y <= 1.6) {
        this.camera.position.y = 1.6;
        this.velocity.y = 0;
        this.isGrounded = true;
      }

      // 边界限制
      this.camera.position.x = Math.max(-38, Math.min(38, this.camera.position.x));
      this.camera.position.z = Math.max(-38, Math.min(38, this.camera.position.z));

      // 更新相机旋转
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.y = this.yaw;
      this.camera.rotation.x = this.pitch;
    },

    // 更新敌人 AI
    updateEnemies() {
      const now = Date.now();

      this.enemies.forEach(enemy => {
        if (!enemy.alive) return;

        // 简单的 AI：面向玩家并随机移动
        const toPlayer = new THREE.Vector3()
          .subVectors(this.camera.position, enemy.group.position)
          .normalize();

        enemy.group.lookAt(this.camera.position);

        // 随机移动
        if (now - enemy.lastMoveTime > 2000) {
          enemy.moveDirection.set(
            (Math.random() - 0.5) * 2,
            0,
            (Math.random() - 0.5) * 2
          ).normalize();
          enemy.lastMoveTime = now;
        }

        // 移动敌人
        enemy.group.position.add(enemy.moveDirection.clone().multiplyScalar(0.02));

        // 边界限制
        enemy.group.position.x = Math.max(-38, Math.min(38, enemy.group.position.x));
        enemy.group.position.z = Math.max(-38, Math.min(38, enemy.group.position.z));

        // 敌人攻击玩家
        const distance = this.camera.position.distanceTo(enemy.group.position);
        if (distance < 20 && Math.random() < 0.01) {
          this.takeDamage(5);
          if (this.playerHealth > 0) {
            this.showMessage('你受到了伤害！', 'danger');
          }
        }
      });
    },

    // 动画循环
    animate() {
      if (this.isPaused || !this.gameStarted) return;

      this.animationId = requestAnimationFrame(this.animate);

      this.updatePlayerMovement();
      this.updateEnemies();

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },

    // 获取游戏数据
    async fetchGameData() {
      try {
        const response = await axios.get('/api/fps/stats');
        // 可以在这里处理游戏统计数据
      } catch (error) {
        console.log('获取游戏数据失败');
      }
    },

    // 清理资源
    cleanup() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }

      if (this.scene) {
        this.scene.traverse(object => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }

      if (this.renderer) {
        this.renderer.dispose();
      }

      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('click', this.onMouseClick);
      document.removeEventListener('keydown', this.onKeyDown);
      document.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('resize', this.onWindowResize);
    },
  },
};
</script>

<style scoped>
.fps-game {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #000;
  cursor: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 准星 */
.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
}

.crosshair-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
}

.crosshair-top {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 8px;
}

.crosshair-bottom {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 8px;
}

.crosshair-left {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 2px;
}

.crosshair-right {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 2px;
}

.crosshair-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.5);
}

/* 状态栏 */
.status-bar {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: white;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.health-ammo {
  display: flex;
  gap: 30px;
}

.health, .ammo {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 24px;
}

.health-icon, .ammo-icon {
  font-size: 28px;
}

.score {
  display: flex;
  gap: 20px;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 18px;
}

/* 击中标记 */
.hit-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
}

.hit-line {
  position: absolute;
  width: 12px;
  height: 2px;
  background: white;
}

.hit-line-1 {
  top: 5px;
  left: 5px;
  transform: rotate(45deg);
}

.hit-line-2 {
  top: 5px;
  right: 5px;
  transform: rotate(-45deg);
}

.hit-line-3 {
  bottom: 5px;
  left: 5px;
  transform: rotate(-45deg);
}

.hit-line-4 {
  bottom: 5px;
  right: 5px;
  transform: rotate(45deg);
}

/* 游戏消息 */
.game-messages {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.message {
  padding: 12px 20px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.message.info {
  background: rgba(52, 152, 219, 0.9);
  color: white;
}

.message.success {
  background: rgba(46, 204, 113, 0.9);
  color: white;
}

.message.danger {
  background: rgba(231, 76, 60, 0.9);
  color: white;
}

.message-enter-active, .message-leave-active {
  transition: all 0.3s;
}

.message-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

/* 开始界面 */
.start-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  pointer-events: all;
}

.start-screen h1 {
  font-size: 72px;
  margin: 0;
  font-weight: 900;
  text-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  letter-spacing: 3px;
}

.subtitle {
  font-size: 24px;
  margin: 10px 0 40px;
  opacity: 0.9;
}

.start-btn {
  padding: 18px 60px;
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  pointer-events: all;
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.4);
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(245, 87, 108, 0.6);
}

.controls-info {
  margin-top: 50px;
  text-align: center;
}

.controls-info h3 {
  font-size: 28px;
  margin-bottom: 20px;
}

.controls-info ul {
  list-style: none;
  padding: 0;
  font-size: 18px;
  line-height: 2;
}

.controls-info li {
  margin: 5px 0;
}

kbd {
  display: inline-block;
  padding: 3px 10px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  min-width: 40px;
  text-align: center;
}

/* 暂停界面 */
.pause-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  pointer-events: all;
}

.pause-screen h2 {
  font-size: 48px;
  margin-bottom: 40px;
}

.resume-btn, .exit-btn {
  padding: 15px 50px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  pointer-events: all;
  margin: 10px;
}

.resume-btn {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.exit-btn {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
}

.resume-btn:hover, .exit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 死亡界面 */
.death-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(139, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.death-screen h2 {
  font-size: 60px;
  margin-bottom: 20px;
  text-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}

.death-screen p {
  font-size: 24px;
  margin-bottom: 30px;
}

.respawn-timer {
  font-size: 36px;
  font-weight: bold;
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}
</style>
