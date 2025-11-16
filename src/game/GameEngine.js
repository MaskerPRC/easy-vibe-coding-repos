// 游戏核心引擎 - 管理Three.js场景和游戏逻辑
// 通过动态加载CDN版本的Three.js

let THREE = null;

// 动态加载Three.js
async function loadThreeJS() {
  if (THREE) return THREE;

  try {
    // 尝试从npm包导入
    THREE = await import('three');
    return THREE;
  } catch (e) {
    // 如果npm包不可用，从CDN加载
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
      script.onload = () => {
        THREE = window.THREE;
        resolve(THREE);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

export class GameEngine {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.player = null;
    this.enemies = [];
    this.bullets = [];
    this.particles = [];
    this.stars = [];
    this.THREE = null;

    // 游戏状态
    this.gameState = {
      score: 0,
      health: 100,
      level: 1,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      enemiesDestroyed: 0,
      combo: 0,
      lastKillTime: 0
    };

    // 控制状态
    this.keys = {};
    this.mousePosition = { x: 0, y: 0 };

    // 游戏配置
    this.config = {
      playerSpeed: 0.3,
      bulletSpeed: 1.2,
      enemySpeed: 0.05,
      spawnInterval: 2000,
      maxEnemies: 15,
      difficultyMultiplier: 1
    };

    this.lastSpawnTime = 0;
    this.animationId = null;
    this.clock = null;

    // 事件回调
    this.onStateChange = null;
    this.onGameOver = null;
  }

  // 初始化游戏
  async init() {
    // 加载Three.js
    this.THREE = await loadThreeJS();
    this.clock = new this.THREE.Clock();

    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLights();
    this.createPlayer();
    this.createStarfield();
    this.setupEventListeners();
    this.handleResize();
  }

  // 创建场景
  createScene() {
    this.scene = new this.THREE.Scene();
    this.scene.background = new this.THREE.Color(0x1A1A2E);
    this.scene.fog = new this.THREE.Fog(0x1A1A2E, 50, 150);
  }

  // 创建相机
  createCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new this.THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 15, 30);
    this.camera.lookAt(0, 0, 0);
  }

  // 创建渲染器
  createRenderer() {
    this.renderer = new this.THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = this.THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
  }

  // 创建光源
  createLights() {
    // 环境光
    const ambientLight = new this.THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    // 主光源
    const mainLight = new this.THREE.DirectionalLight(0x007BFF, 1);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    // 辅助光源
    const fillLight = new this.THREE.DirectionalLight(0x00C4FF, 0.3);
    fillLight.position.set(-10, 10, -10);
    this.scene.add(fillLight);

    // 点光源 - 添加氛围
    const pointLight = new this.THREE.PointLight(0x007BFF, 1, 100);
    pointLight.position.set(0, 10, 0);
    this.scene.add(pointLight);
  }

  // 创建玩家飞船
  createPlayer() {
    const group = new this.THREE.Group();

    // 主体
    const bodyGeometry = new this.THREE.ConeGeometry(1, 3, 6);
    const bodyMaterial = new this.THREE.MeshPhongMaterial({
      color: 0x007BFF,
      shininess: 100,
      emissive: 0x003366,
      emissiveIntensity: 0.3
    });
    const body = new this.THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // 机翼
    const wingGeometry = new this.THREE.BoxGeometry(4, 0.2, 1);
    const wingMaterial = new this.THREE.MeshPhongMaterial({
      color: 0x00C4FF,
      shininess: 80,
      emissive: 0x004466,
      emissiveIntensity: 0.2
    });
    const wings = new this.THREE.Mesh(wingGeometry, wingMaterial);
    wings.position.z = 0.5;
    group.add(wings);

    // 引擎发光效果
    const engineGeometry = new this.THREE.SphereGeometry(0.3, 8, 8);
    const engineMaterial = new this.THREE.MeshBasicMaterial({
      color: 0x00C4FF,
      transparent: true,
      opacity: 0.8
    });
    const engine = new this.THREE.Mesh(engineGeometry, engineMaterial);
    engine.position.z = 1.5;
    group.add(engine);

    // 护盾效果（半透明球体）
    const shieldGeometry = new this.THREE.SphereGeometry(2.5, 16, 16);
    const shieldMaterial = new this.THREE.MeshBasicMaterial({
      color: 0x00C4FF,
      transparent: true,
      opacity: 0.1,
      wireframe: true
    });
    this.shield = new this.THREE.Mesh(shieldGeometry, shieldMaterial);
    group.add(this.shield);

    group.position.set(0, 0, 0);
    group.castShadow = true;

    this.player = group;
    this.scene.add(this.player);
  }

  // 创建星空背景
  createStarfield() {
    const starGeometry = new this.THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 300;
      positions[i3 + 1] = (Math.random() - 0.5) * 300;
      positions[i3 + 2] = (Math.random() - 0.5) * 300 - 50;

      // 星星颜色变化
      const brightness = 0.5 + Math.random() * 0.5;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness + Math.random() * 0.2;
    }

    starGeometry.setAttribute('position', new this.THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new this.THREE.BufferAttribute(colors, 3));

    const starMaterial = new this.THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.starfield = new this.THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.starfield);
  }

  // 创建敌人
  createEnemy() {
    const group = new this.THREE.Group();

    // 随机敌人类型
    const type = Math.floor(Math.random() * 3);
    let geometry, material, speed, health;

    switch(type) {
      case 0: // 小型快速敌人
        geometry = new this.THREE.TetrahedronGeometry(1);
        material = new this.THREE.MeshPhongMaterial({
          color: 0xDC3545,
          shininess: 50,
          emissive: 0x660000,
          emissiveIntensity: 0.3
        });
        speed = 0.08 * this.config.difficultyMultiplier;
        health = 1;
        break;
      case 1: // 中型敌人
        geometry = new this.THREE.OctahedronGeometry(1.2);
        material = new this.THREE.MeshPhongMaterial({
          color: 0xFFC107,
          shininess: 60,
          emissive: 0x664400,
          emissiveIntensity: 0.3
        });
        speed = 0.05 * this.config.difficultyMultiplier;
        health = 2;
        break;
      default: // 大型慢速敌人
        geometry = new this.THREE.IcosahedronGeometry(1.5);
        material = new this.THREE.MeshPhongMaterial({
          color: 0x28A745,
          shininess: 70,
          emissive: 0x004400,
          emissiveIntensity: 0.3
        });
        speed = 0.03 * this.config.difficultyMultiplier;
        health = 3;
    }

    const mesh = new this.THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    group.add(mesh);

    // 敌人发光环
    const ringGeometry = new this.THREE.RingGeometry(1.8, 2, 6);
    const ringMaterial = new this.THREE.MeshBasicMaterial({
      color: material.color,
      transparent: true,
      opacity: 0.3,
      side: this.THREE.DoubleSide
    });
    const ring = new this.THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    // 随机生成位置
    const side = Math.floor(Math.random() * 4);
    let x, z;
    switch(side) {
      case 0: // 上
        x = (Math.random() - 0.5) * 40;
        z = -30;
        break;
      case 1: // 右
        x = 25;
        z = (Math.random() - 0.5) * 40;
        break;
      case 2: // 下
        x = (Math.random() - 0.5) * 40;
        z = 30;
        break;
      default: // 左
        x = -25;
        z = (Math.random() - 0.5) * 40;
    }

    group.position.set(x, 0, z);
    group.userData = { speed, health, type, rotationSpeed: Math.random() * 0.05 };

    this.scene.add(group);
    this.enemies.push(group);
  }

  // 创建子弹
  createBullet() {
    const geometry = new this.THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const material = new this.THREE.MeshBasicMaterial({
      color: 0x00C4FF,
      transparent: true,
      opacity: 0.9
    });
    const bullet = new this.THREE.Mesh(geometry, material);
    bullet.rotation.x = Math.PI / 2;

    // 子弹发光效果
    const glowGeometry = new this.THREE.SphereGeometry(0.3, 8, 8);
    const glowMaterial = new this.THREE.MeshBasicMaterial({
      color: 0x00C4FF,
      transparent: true,
      opacity: 0.5
    });
    const glow = new this.THREE.Mesh(glowGeometry, glowMaterial);
    bullet.add(glow);

    bullet.position.copy(this.player.position);
    bullet.position.z -= 2;

    // 计算子弹方向（朝向鼠标位置）
    const direction = new this.THREE.Vector3(
      this.mousePosition.x * 20,
      0,
      this.mousePosition.y * -15
    ).sub(this.player.position).normalize();

    bullet.userData = { direction };

    this.scene.add(bullet);
    this.bullets.push(bullet);
  }

  // 创建爆炸粒子效果
  createExplosion(position, color = 0xFFC107) {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const geometry = new this.THREE.SphereGeometry(0.1, 4, 4);
      const material = new this.THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1
      });
      const particle = new this.THREE.Mesh(geometry, material);
      particle.position.copy(position);

      const velocity = new this.THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      );

      particle.userData = {
        velocity,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02
      };

      this.scene.add(particle);
      this.particles.push(particle);
    }
  }

  // 设置事件监听
  setupEventListeners() {
    // 键盘事件
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space' && this.gameState.isPlaying && !this.gameState.isPaused) {
        this.createBullet();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // 鼠标移动
    this.container.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePosition.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mousePosition.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // 鼠标点击发射
    this.container.addEventListener('click', () => {
      if (this.gameState.isPlaying && !this.gameState.isPaused) {
        this.createBullet();
      }
    });

    // 窗口大小调整
    window.addEventListener('resize', () => this.handleResize());
  }

  // 处理窗口大小变化
  handleResize() {
    if (!this.container || !this.camera || !this.renderer) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // 更新玩家位置
  updatePlayer() {
    if (!this.player || !this.gameState.isPlaying || this.gameState.isPaused) return;

    const speed = this.config.playerSpeed;

    // WASD 或 方向键控制
    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      this.player.position.z -= speed;
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      this.player.position.z += speed;
    }
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      this.player.position.x -= speed;
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
      this.player.position.x += speed;
    }

    // 限制玩家移动范围
    this.player.position.x = Math.max(-20, Math.min(20, this.player.position.x));
    this.player.position.z = Math.max(-15, Math.min(15, this.player.position.z));

    // 飞船倾斜效果
    const targetRotationZ = (this.keys['KeyA'] || this.keys['ArrowLeft']) ? 0.3 :
                            (this.keys['KeyD'] || this.keys['ArrowRight']) ? -0.3 : 0;
    this.player.rotation.z += (targetRotationZ - this.player.rotation.z) * 0.1;

    // 护盾动画
    if (this.shield) {
      this.shield.rotation.y += 0.02;
      this.shield.rotation.x += 0.01;
    }
  }

  // 更新敌人
  updateEnemies() {
    if (!this.gameState.isPlaying || this.gameState.isPaused) return;

    // 生成新敌人
    const now = Date.now();
    if (now - this.lastSpawnTime > this.config.spawnInterval &&
        this.enemies.length < this.config.maxEnemies) {
      this.createEnemy();
      this.lastSpawnTime = now;
    }

    // 更新敌人位置
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // 朝向玩家移动
      const direction = new this.THREE.Vector3()
        .subVectors(this.player.position, enemy.position)
        .normalize();

      enemy.position.add(direction.multiplyScalar(enemy.userData.speed));
      enemy.rotation.y += enemy.userData.rotationSpeed;
      enemy.rotation.x += enemy.userData.rotationSpeed * 0.5;

      // 检测与玩家碰撞
      const distanceToPlayer = enemy.position.distanceTo(this.player.position);
      if (distanceToPlayer < 3) {
        this.createExplosion(enemy.position, 0xDC3545);
        this.scene.remove(enemy);
        this.enemies.splice(i, 1);
        this.takeDamage(20);
      }
    }
  }

  // 更新子弹
  updateBullets() {
    if (!this.gameState.isPlaying || this.gameState.isPaused) return;

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      const direction = bullet.userData.direction;

      bullet.position.add(direction.clone().multiplyScalar(this.config.bulletSpeed));

      // 子弹超出范围
      if (bullet.position.length() > 50) {
        this.scene.remove(bullet);
        this.bullets.splice(i, 1);
        continue;
      }

      // 检测子弹与敌人碰撞
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        const distance = bullet.position.distanceTo(enemy.position);

        if (distance < 2) {
          enemy.userData.health--;

          if (enemy.userData.health <= 0) {
            // 敌人被摧毁
            this.createExplosion(enemy.position, 0x28A745);
            this.scene.remove(enemy);
            this.enemies.splice(j, 1);
            this.addScore(enemy.userData.type);
          } else {
            // 敌人受伤
            this.createExplosion(bullet.position, 0xFFC107);
          }

          this.scene.remove(bullet);
          this.bullets.splice(i, 1);
          break;
        }
      }
    }
  }

  // 更新粒子效果
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];

      particle.position.add(particle.userData.velocity);
      particle.userData.life -= particle.userData.decay;
      particle.material.opacity = particle.userData.life;
      particle.scale.multiplyScalar(0.98);

      if (particle.userData.life <= 0) {
        this.scene.remove(particle);
        this.particles.splice(i, 1);
      }
    }
  }

  // 更新星空
  updateStarfield() {
    if (this.starfield) {
      this.starfield.rotation.z += 0.0002;
    }
  }

  // 添加分数
  addScore(enemyType) {
    const baseScore = (enemyType + 1) * 100;
    const now = Date.now();

    // 连击系统
    if (now - this.gameState.lastKillTime < 2000) {
      this.gameState.combo = Math.min(10, this.gameState.combo + 1);
    } else {
      this.gameState.combo = 1;
    }

    const comboMultiplier = 1 + (this.gameState.combo - 1) * 0.2;
    const finalScore = Math.floor(baseScore * comboMultiplier);

    this.gameState.score += finalScore;
    this.gameState.enemiesDestroyed++;
    this.gameState.lastKillTime = now;

    // 升级难度
    if (this.gameState.enemiesDestroyed % 10 === 0) {
      this.levelUp();
    }

    this.notifyStateChange();
  }

  // 升级
  levelUp() {
    this.gameState.level++;
    this.config.difficultyMultiplier = 1 + (this.gameState.level - 1) * 0.15;
    this.config.spawnInterval = Math.max(500, 2000 - this.gameState.level * 100);
    this.config.maxEnemies = Math.min(25, 15 + this.gameState.level);

    // 恢复一些生命值
    this.gameState.health = Math.min(100, this.gameState.health + 10);

    this.notifyStateChange();
  }

  // 受到伤害
  takeDamage(amount) {
    this.gameState.health -= amount;
    this.gameState.combo = 0;

    // 护盾闪烁效果
    if (this.shield) {
      this.shield.material.opacity = 0.5;
      setTimeout(() => {
        if (this.shield) this.shield.material.opacity = 0.1;
      }, 200);
    }

    if (this.gameState.health <= 0) {
      this.gameState.health = 0;
      this.gameOver();
    }

    this.notifyStateChange();
  }

  // 游戏结束
  gameOver() {
    this.gameState.isGameOver = true;
    this.gameState.isPlaying = false;

    // 玩家爆炸效果
    this.createExplosion(this.player.position, 0x007BFF);

    if (this.onGameOver) {
      this.onGameOver(this.gameState);
    }

    this.notifyStateChange();
  }

  // 通知状态变化
  notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.gameState });
    }
  }

  // 开始游戏
  start() {
    this.resetGame();
    this.gameState.isPlaying = true;
    this.gameState.isPaused = false;
    this.gameState.isGameOver = false;
    this.lastSpawnTime = Date.now();
    this.notifyStateChange();
    this.animate();
  }

  // 暂停/继续游戏
  togglePause() {
    if (!this.gameState.isPlaying) return;
    this.gameState.isPaused = !this.gameState.isPaused;
    this.notifyStateChange();
  }

  // 重置游戏
  resetGame() {
    // 清除敌人
    this.enemies.forEach(enemy => this.scene.remove(enemy));
    this.enemies = [];

    // 清除子弹
    this.bullets.forEach(bullet => this.scene.remove(bullet));
    this.bullets = [];

    // 清除粒子
    this.particles.forEach(particle => this.scene.remove(particle));
    this.particles = [];

    // 重置玩家位置
    if (this.player) {
      this.player.position.set(0, 0, 0);
      this.player.rotation.set(0, 0, 0);
    }

    // 重置游戏状态
    this.gameState = {
      score: 0,
      health: 100,
      level: 1,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      enemiesDestroyed: 0,
      combo: 0,
      lastKillTime: 0
    };

    // 重置配置
    this.config.difficultyMultiplier = 1;
    this.config.spawnInterval = 2000;
    this.config.maxEnemies = 15;

    this.notifyStateChange();
  }

  // 动画循环
  animate() {
    if (!this.gameState.isPlaying && !this.gameState.isPaused) {
      return;
    }

    this.animationId = requestAnimationFrame(() => this.animate());

    if (!this.gameState.isPaused) {
      this.updatePlayer();
      this.updateEnemies();
      this.updateBullets();
      this.updateParticles();
    }

    this.updateStarfield();
    this.renderer.render(this.scene, this.camera);
  }

  // 销毁游戏
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // 清理场景
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    this.renderer.dispose();

    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
