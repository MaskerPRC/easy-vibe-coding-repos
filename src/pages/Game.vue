<template>
  <div class="game-container">
    <canvas ref="gameCanvas" class="game-canvas"></canvas>

    <!-- 游戏UI -->
    <div class="game-ui" v-if="gameStarted">
      <!-- 血量和蓝量 -->
      <div class="player-stats">
        <div class="hero-info">
          <div class="hero-name">{{ playerHero.name }}</div>
          <div class="stat-bar hp-bar">
            <div class="bar-fill" :style="{ width: (playerHero.hp / playerHero.maxHp * 100) + '%' }"></div>
            <span class="bar-text">{{ Math.floor(playerHero.hp) }} / {{ playerHero.maxHp }}</span>
          </div>
          <div class="stat-bar mp-bar">
            <div class="bar-fill" :style="{ width: (playerHero.mp / playerHero.maxMp * 100) + '%' }"></div>
            <span class="bar-text">{{ Math.floor(playerHero.mp) }} / {{ playerHero.maxMp }}</span>
          </div>
        </div>
      </div>

      <!-- 技能栏 -->
      <div class="skill-bar">
        <div
          v-for="(skill, index) in playerHero.skills"
          :key="index"
          class="skill-btn"
          :class="{ 'on-cooldown': skill.currentCooldown > 0, 'no-mp': playerHero.mp < skill.mpCost }"
          @click="useSkill(index)"
        >
          <div class="skill-icon">{{ skill.icon }}</div>
          <div class="skill-key">{{ skill.key }}</div>
          <div v-if="skill.currentCooldown > 0" class="cooldown-text">
            {{ Math.ceil(skill.currentCooldown / 60) }}
          </div>
        </div>
      </div>

      <!-- 击杀信息 -->
      <div class="kill-feed">
        <div v-for="(msg, index) in killMessages" :key="index" class="kill-message">
          {{ msg }}
        </div>
      </div>

      <!-- 游戏状态 -->
      <div class="game-status">
        <div>击杀: {{ kills }}</div>
        <div>金币: {{ gold }}</div>
      </div>
    </div>

    <!-- 开始界面 -->
    <div v-else class="start-screen">
      <h1>王者荣耀</h1>
      <div class="hero-selection">
        <h2>选择你的英雄</h2>
        <div class="hero-list">
          <div
            v-for="hero in heroTemplates"
            :key="hero.id"
            class="hero-card"
            :class="{ 'selected': selectedHeroId === hero.id }"
            @click="selectedHeroId = hero.id"
          >
            <div class="hero-icon">{{ hero.icon }}</div>
            <div class="hero-name">{{ hero.name }}</div>
            <div class="hero-role">{{ hero.role }}</div>
          </div>
        </div>
      </div>
      <button class="start-btn" @click="startGame">开始游戏</button>
    </div>

    <!-- 游戏结束 -->
    <div v-if="gameOver" class="game-over">
      <h1>{{ victory ? '胜利!' : '失败!' }}</h1>
      <div class="stats">
        <p>击杀: {{ kills }}</p>
        <p>获得金币: {{ gold }}</p>
      </div>
      <button class="restart-btn" @click="restartGame">重新开始</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Game',
  data() {
    return {
      canvas: null,
      ctx: null,
      gameStarted: false,
      gameOver: false,
      victory: false,

      // 游戏对象
      playerHero: null,
      enemies: [],
      minions: [],
      towers: [],
      projectiles: [],

      // 游戏状态
      kills: 0,
      gold: 0,
      killMessages: [],

      // 英雄选择
      selectedHeroId: 1,

      // 控制
      keys: {},
      mouseX: 0,
      mouseY: 0,

      // 游戏循环
      animationId: null,
      lastTime: 0,

      // 地图尺寸
      mapWidth: 2000,
      mapHeight: 1400,
      cameraX: 0,
      cameraY: 0,

      // 英雄模板
      heroTemplates: [
        {
          id: 1,
          name: '剑圣',
          icon: '⚔️',
          role: '战士',
          maxHp: 800,
          maxMp: 400,
          atk: 100,
          def: 30,
          speed: 4,
          atkRange: 50,
          skills: [
            { name: '疾风斩', key: 'Q', icon: '💨', damage: 150, mpCost: 60, cooldown: 300, type: 'dash' },
            { name: '旋风斩', key: 'W', icon: '🌪️', damage: 200, mpCost: 80, cooldown: 420, type: 'aoe' },
            { name: '无双剑', key: 'E', icon: '⚡', damage: 300, mpCost: 100, cooldown: 600, type: 'ultimate' }
          ]
        },
        {
          id: 2,
          name: '法师',
          icon: '🔮',
          role: '法师',
          maxHp: 600,
          maxMp: 600,
          atk: 150,
          def: 20,
          speed: 3.5,
          atkRange: 200,
          skills: [
            { name: '火球术', key: 'Q', icon: '🔥', damage: 180, mpCost: 70, cooldown: 240, type: 'projectile' },
            { name: '冰冻', key: 'W', icon: '❄️', damage: 120, mpCost: 90, cooldown: 360, type: 'slow' },
            { name: '流星雨', key: 'E', icon: '☄️', damage: 400, mpCost: 150, cooldown: 720, type: 'ultimate_aoe' }
          ]
        },
        {
          id: 3,
          name: '射手',
          icon: '🏹',
          role: '射手',
          maxHp: 650,
          maxMp: 450,
          atk: 120,
          def: 25,
          speed: 3.8,
          atkRange: 250,
          skills: [
            { name: '穿云箭', key: 'Q', icon: '➡️', damage: 160, mpCost: 65, cooldown: 180, type: 'projectile' },
            { name: '闪避', key: 'W', icon: '💨', damage: 0, mpCost: 50, cooldown: 480, type: 'dash' },
            { name: '箭雨', key: 'E', icon: '🎯', damage: 350, mpCost: 120, cooldown: 660, type: 'ultimate' }
          ]
        }
      ]
    };
  },
  mounted() {
    this.initCanvas();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('click', this.handleClick);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('click', this.handleClick);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.gameCanvas;
      this.ctx = this.canvas.getContext('2d');
      this.handleResize();
    },

    handleResize() {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    },

    startGame() {
      const template = this.heroTemplates.find(h => h.id === this.selectedHeroId);

      // 创建玩家英雄
      this.playerHero = this.createHero(template, 200, 700, true);

      // 创建敌方英雄
      this.enemies = [
        this.createHero(this.heroTemplates[Math.floor(Math.random() * 3)], 1700, 700, false)
      ];

      // 创建防御塔
      this.createTowers();

      // 重置状态
      this.kills = 0;
      this.gold = 0;
      this.killMessages = [];
      this.gameOver = false;
      this.victory = false;
      this.gameStarted = true;

      // 开始游戏循环
      this.lastTime = performance.now();
      this.gameLoop();

      // 定期生成小兵
      this.spawnMinions();
    },

    createHero(template, x, y, isPlayer) {
      return {
        ...template,
        x,
        y,
        hp: template.maxHp,
        mp: template.maxMp,
        vx: 0,
        vy: 0,
        isPlayer,
        targetX: null,
        targetY: null,
        attackTarget: null,
        lastAttackTime: 0,
        attackCooldown: 60,
        skills: template.skills.map(s => ({ ...s, currentCooldown: 0 })),
        gold: 0
      };
    },

    createTowers() {
      // 己方防御塔
      this.towers.push(
        { x: 300, y: 500, hp: 3000, maxHp: 3000, team: 'blue', range: 300, damage: 80 },
        { x: 300, y: 900, hp: 3000, maxHp: 3000, team: 'blue', range: 300, damage: 80 },
        { x: 100, y: 700, hp: 5000, maxHp: 5000, team: 'blue', range: 350, damage: 100, isBase: true }
      );

      // 敌方防御塔
      this.towers.push(
        { x: 1700, y: 500, hp: 3000, maxHp: 3000, team: 'red', range: 300, damage: 80 },
        { x: 1700, y: 900, hp: 3000, maxHp: 3000, team: 'red', range: 300, damage: 80 },
        { x: 1900, y: 700, hp: 5000, maxHp: 5000, team: 'red', range: 350, damage: 100, isBase: true }
      );
    },

    spawnMinions() {
      const spawnInterval = setInterval(() => {
        if (!this.gameStarted || this.gameOver) {
          clearInterval(spawnInterval);
          return;
        }

        // 己方小兵
        for (let i = 0; i < 3; i++) {
          this.minions.push({
            x: 150,
            y: 650 + i * 50,
            hp: 300,
            maxHp: 300,
            atk: 30,
            speed: 2,
            team: 'blue',
            targetX: 1850,
            targetY: 700,
            lastAttackTime: 0
          });
        }

        // 敌方小兵
        for (let i = 0; i < 3; i++) {
          this.minions.push({
            x: 1850,
            y: 650 + i * 50,
            hp: 300,
            maxHp: 300,
            atk: 30,
            speed: 2,
            team: 'red',
            targetX: 150,
            targetY: 700,
            lastAttackTime: 0
          });
        }
      }, 10000);
    },

    gameLoop(currentTime = 0) {
      if (!this.gameStarted || this.gameOver) return;

      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      // 更新游戏逻辑
      this.updatePlayer();
      this.updateEnemies();
      this.updateMinions();
      this.updateTowers();
      this.updateProjectiles();
      this.updateCamera();

      // 渲染
      this.render();

      // 检查游戏结束
      this.checkGameOver();

      this.animationId = requestAnimationFrame(this.gameLoop);
    },

    updatePlayer() {
      if (!this.playerHero || this.playerHero.hp <= 0) return;

      // 移动
      let vx = 0, vy = 0;
      if (this.keys['w'] || this.keys['W']) vy -= 1;
      if (this.keys['s'] || this.keys['S']) vy += 1;
      if (this.keys['a'] || this.keys['A']) vx -= 1;
      if (this.keys['d'] || this.keys['D']) vx += 1;

      if (vx !== 0 || vy !== 0) {
        const length = Math.sqrt(vx * vx + vy * vy);
        vx /= length;
        vy /= length;
        this.playerHero.x += vx * this.playerHero.speed;
        this.playerHero.y += vy * this.playerHero.speed;

        // 限制在地图内
        this.playerHero.x = Math.max(50, Math.min(this.mapWidth - 50, this.playerHero.x));
        this.playerHero.y = Math.max(50, Math.min(this.mapHeight - 50, this.playerHero.y));
      }

      // 自动攻击
      this.autoAttack(this.playerHero, [...this.enemies, ...this.minions.filter(m => m.team === 'red'), ...this.towers.filter(t => t.team === 'red')]);

      // 技能冷却
      this.playerHero.skills.forEach(skill => {
        if (skill.currentCooldown > 0) {
          skill.currentCooldown--;
        }
      });

      // 回蓝
      this.playerHero.mp = Math.min(this.playerHero.maxMp, this.playerHero.mp + 0.5);
    },

    updateEnemies() {
      this.enemies.forEach((enemy, index) => {
        if (enemy.hp <= 0) {
          this.enemies.splice(index, 1);
          this.kills++;
          this.gold += 300;
          this.addKillMessage(`你击杀了 ${enemy.name}!`);

          // 重生敌人
          setTimeout(() => {
            if (this.gameStarted && !this.gameOver) {
              this.enemies.push(this.createHero(
                this.heroTemplates[Math.floor(Math.random() * 3)],
                1700, 700, false
              ));
            }
          }, 15000);
          return;
        }

        // AI逻辑
        this.updateEnemyAI(enemy);

        // 技能冷却
        enemy.skills.forEach(skill => {
          if (skill.currentCooldown > 0) skill.currentCooldown--;
        });

        // 回蓝
        enemy.mp = Math.min(enemy.maxMp, enemy.mp + 0.5);
      });
    },

    updateEnemyAI(enemy) {
      // 寻找目标
      const targets = [this.playerHero, ...this.minions.filter(m => m.team === 'blue'), ...this.towers.filter(t => t.team === 'blue')];
      let nearestTarget = null;
      let nearestDist = Infinity;

      targets.forEach(target => {
        if (target && target.hp > 0) {
          const dist = this.distance(enemy, target);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestTarget = target;
          }
        }
      });

      if (nearestTarget) {
        // 移动向目标
        if (nearestDist > enemy.atkRange) {
          const dx = nearestTarget.x - enemy.x;
          const dy = nearestTarget.y - enemy.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          enemy.x += (dx / length) * enemy.speed;
          enemy.y += (dy / length) * enemy.speed;
        }

        // 攻击
        this.autoAttack(enemy, [nearestTarget]);

        // 使用技能
        if (Math.random() < 0.02) {
          enemy.skills.forEach((skill, index) => {
            if (skill.currentCooldown === 0 && enemy.mp >= skill.mpCost && nearestDist < 300) {
              this.executeSkill(enemy, skill, nearestTarget.x, nearestTarget.y);
            }
          });
        }
      }
    },

    updateMinions() {
      this.minions.forEach((minion, index) => {
        if (minion.hp <= 0) {
          this.minions.splice(index, 1);
          if (minion.team === 'red') {
            this.gold += 20;
          }
          return;
        }

        // 寻找目标
        const enemies = minion.team === 'blue'
          ? [...this.enemies, ...this.minions.filter(m => m.team === 'red'), ...this.towers.filter(t => t.team === 'red')]
          : [this.playerHero, ...this.minions.filter(m => m.team === 'blue'), ...this.towers.filter(t => t.team === 'blue')];

        let target = null;
        let minDist = Infinity;

        enemies.forEach(e => {
          if (e && e.hp > 0) {
            const dist = this.distance(minion, e);
            if (dist < minDist) {
              minDist = dist;
              target = e;
            }
          }
        });

        if (target) {
          // 移动
          if (minDist > 50) {
            const dx = target.x - minion.x;
            const dy = target.y - minion.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            minion.x += (dx / length) * minion.speed;
            minion.y += (dy / length) * minion.speed;
          } else {
            // 攻击
            if (Date.now() - minion.lastAttackTime > 1000) {
              target.hp -= minion.atk;
              minion.lastAttackTime = Date.now();
            }
          }
        }
      });
    },

    updateTowers() {
      this.towers.forEach((tower, index) => {
        if (tower.hp <= 0) {
          this.towers.splice(index, 1);
          if (tower.team === 'red') {
            this.gold += 150;
            this.addKillMessage('你摧毁了敌方防御塔!');
          }
          return;
        }

        // 攻击范围内的敌人
        const enemies = tower.team === 'blue'
          ? [...this.enemies, ...this.minions.filter(m => m.team === 'red')]
          : [this.playerHero, ...this.minions.filter(m => m.team === 'blue')];

        enemies.forEach(enemy => {
          if (enemy && enemy.hp > 0 && this.distance(tower, enemy) < tower.range) {
            if (Date.now() - (tower.lastAttackTime || 0) > 2000) {
              enemy.hp -= tower.damage;
              tower.lastAttackTime = Date.now();

              // 创建塔攻击特效
              this.projectiles.push({
                x: tower.x,
                y: tower.y,
                targetX: enemy.x,
                targetY: enemy.y,
                speed: 15,
                damage: 0,
                type: 'tower',
                team: tower.team
              });
            }
          }
        });
      });
    },

    updateProjectiles() {
      this.projectiles.forEach((proj, index) => {
        const dx = proj.targetX - proj.x;
        const dy = proj.targetY - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < proj.speed) {
          this.projectiles.splice(index, 1);
        } else {
          proj.x += (dx / dist) * proj.speed;
          proj.y += (dy / dist) * proj.speed;
        }
      });
    },

    autoAttack(attacker, targets) {
      targets.forEach(target => {
        if (target && target.hp > 0 && this.distance(attacker, target) < attacker.atkRange) {
          const now = Date.now();
          if (now - attacker.lastAttackTime > attacker.attackCooldown * 16) {
            target.hp -= attacker.atk;
            attacker.lastAttackTime = now;

            // 创建攻击特效
            if (attacker.atkRange > 100) {
              this.projectiles.push({
                x: attacker.x,
                y: attacker.y,
                targetX: target.x,
                targetY: target.y,
                speed: 12,
                damage: 0,
                type: 'attack',
                team: attacker.isPlayer ? 'blue' : 'red'
              });
            }
          }
        }
      });
    },

    useSkill(index) {
      const skill = this.playerHero.skills[index];
      if (skill.currentCooldown > 0 || this.playerHero.mp < skill.mpCost) return;

      this.executeSkill(this.playerHero, skill, this.mouseX + this.cameraX, this.mouseY + this.cameraY);
    },

    executeSkill(hero, skill, targetX, targetY) {
      hero.mp -= skill.mpCost;
      skill.currentCooldown = skill.cooldown;

      const targets = hero.isPlayer
        ? [...this.enemies, ...this.minions.filter(m => m.team === 'red')]
        : [this.playerHero, ...this.minions.filter(m => m.team === 'blue')];

      switch (skill.type) {
        case 'projectile':
          this.projectiles.push({
            x: hero.x,
            y: hero.y,
            targetX,
            targetY,
            speed: 10,
            damage: skill.damage,
            type: 'skill',
            team: hero.isPlayer ? 'blue' : 'red',
            onHit: (target) => {
              target.hp -= skill.damage;
            }
          });
          break;

        case 'dash':
          const dx = targetX - hero.x;
          const dy = targetY - hero.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const dashDist = 150;
          hero.x += (dx / dist) * Math.min(dashDist, dist);
          hero.y += (dy / dist) * Math.min(dashDist, dist);

          // 对周围敌人造成伤害
          targets.forEach(t => {
            if (this.distance(hero, t) < 100) {
              t.hp -= skill.damage;
            }
          });
          break;

        case 'aoe':
        case 'ultimate':
        case 'ultimate_aoe':
          targets.forEach(t => {
            if (this.distance(hero, t) < 250) {
              t.hp -= skill.damage;
            }
          });
          break;
      }
    },

    updateCamera() {
      if (!this.playerHero) return;

      this.cameraX = this.playerHero.x - this.canvas.width / 2;
      this.cameraY = this.playerHero.y - this.canvas.height / 2;

      this.cameraX = Math.max(0, Math.min(this.mapWidth - this.canvas.width, this.cameraX));
      this.cameraY = Math.max(0, Math.min(this.mapHeight - this.canvas.height, this.cameraY));
    },

    render() {
      if (!this.ctx) return;

      // 清空画布
      this.ctx.fillStyle = '#1a1a2e';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // 绘制地图
      this.drawMap();

      // 绘制防御塔
      this.towers.forEach(tower => this.drawTower(tower));

      // 绘制小兵
      this.minions.forEach(minion => this.drawMinion(minion));

      // 绘制英雄
      if (this.playerHero && this.playerHero.hp > 0) {
        this.drawHero(this.playerHero);
      }
      this.enemies.forEach(enemy => {
        if (enemy.hp > 0) this.drawHero(enemy);
      });

      // 绘制投射物
      this.projectiles.forEach(proj => this.drawProjectile(proj));
    },

    drawMap() {
      // 绘制地图网格
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.lineWidth = 1;

      for (let x = 0; x < this.mapWidth; x += 100) {
        this.ctx.beginPath();
        this.ctx.moveTo(x - this.cameraX, 0);
        this.ctx.lineTo(x - this.cameraX, this.canvas.height);
        this.ctx.stroke();
      }

      for (let y = 0; y < this.mapHeight; y += 100) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y - this.cameraY);
        this.ctx.lineTo(this.canvas.width, y - this.cameraY);
        this.ctx.stroke();
      }

      // 绘制河道
      this.ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
      this.ctx.fillRect(0 - this.cameraX, 600 - this.cameraY, this.mapWidth, 200);
    },

    drawHero(hero) {
      const x = hero.x - this.cameraX;
      const y = hero.y - this.cameraY;

      // 绘制攻击范围（鼠标悬停时）
      if (hero.isPlayer) {
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y, hero.atkRange, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      // 绘制英雄
      this.ctx.font = '40px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(hero.icon, x, y + 10);

      // 绘制血条
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(x - 30, y - 40, 60, 6);
      this.ctx.fillStyle = hero.isPlayer ? '#00ff00' : '#ff0000';
      this.ctx.fillRect(x - 30, y - 40, 60 * (hero.hp / hero.maxHp), 6);

      // 绘制蓝条
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(x - 30, y - 32, 60, 4);
      this.ctx.fillStyle = '#0088ff';
      this.ctx.fillRect(x - 30, y - 32, 60 * (hero.mp / hero.maxMp), 4);

      // 绘制名字
      this.ctx.font = '12px Arial';
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText(hero.name, x, y - 45);
    },

    drawMinion(minion) {
      const x = minion.x - this.cameraX;
      const y = minion.y - this.cameraY;

      // 绘制小兵
      this.ctx.fillStyle = minion.team === 'blue' ? '#4444ff' : '#ff4444';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 12, 0, Math.PI * 2);
      this.ctx.fill();

      // 绘制血条
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(x - 15, y - 20, 30, 4);
      this.ctx.fillStyle = '#00ff00';
      this.ctx.fillRect(x - 15, y - 20, 30 * (minion.hp / minion.maxHp), 4);
    },

    drawTower(tower) {
      const x = tower.x - this.cameraX;
      const y = tower.y - this.cameraY;

      // 绘制防御塔
      this.ctx.fillStyle = tower.team === 'blue' ? '#4444ff' : '#ff4444';
      this.ctx.fillRect(x - 20, y - 40, 40, 60);

      // 绘制塔顶
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - 50);
      this.ctx.lineTo(x - 25, y - 40);
      this.ctx.lineTo(x + 25, y - 40);
      this.ctx.closePath();
      this.ctx.fill();

      // 绘制血条
      this.ctx.fillStyle = '#333';
      this.ctx.fillRect(x - 30, y - 60, 60, 8);
      this.ctx.fillStyle = '#00ff00';
      this.ctx.fillRect(x - 30, y - 60, 60 * (tower.hp / tower.maxHp), 8);

      // 绘制攻击范围
      if (tower.team === 'red') {
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(x, y, tower.range, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    },

    drawProjectile(proj) {
      const x = proj.x - this.cameraX;
      const y = proj.y - this.cameraY;

      this.ctx.fillStyle = proj.team === 'blue' ? '#4444ff' : '#ff4444';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, Math.PI * 2);
      this.ctx.fill();
    },

    checkGameOver() {
      // 检查己方基地
      const blueBase = this.towers.find(t => t.team === 'blue' && t.isBase);
      if (!blueBase || blueBase.hp <= 0) {
        this.gameOver = true;
        this.victory = false;
      }

      // 检查敌方基地
      const redBase = this.towers.find(t => t.team === 'red' && t.isBase);
      if (!redBase || redBase.hp <= 0) {
        this.gameOver = true;
        this.victory = true;
      }
    },

    addKillMessage(msg) {
      this.killMessages.unshift(msg);
      if (this.killMessages.length > 5) {
        this.killMessages.pop();
      }
      setTimeout(() => {
        const index = this.killMessages.indexOf(msg);
        if (index > -1) {
          this.killMessages.splice(index, 1);
        }
      }, 3000);
    },

    distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    },

    handleKeyDown(e) {
      this.keys[e.key] = true;

      // 技能快捷键
      if (this.gameStarted && !this.gameOver) {
        const keyMap = { 'q': 0, 'Q': 0, 'w': 1, 'W': 1, 'e': 2, 'E': 2 };
        if (keyMap[e.key] !== undefined) {
          this.useSkill(keyMap[e.key]);
        }
      }
    },

    handleKeyUp(e) {
      this.keys[e.key] = false;
    },

    handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },

    handleClick(e) {
      if (!this.gameStarted || this.gameOver) return;

      const worldX = e.clientX + this.cameraX;
      const worldY = e.clientY + this.cameraY;

      // 右键移动
      if (e.button === 2) {
        e.preventDefault();
        this.playerHero.targetX = worldX;
        this.playerHero.targetY = worldY;
      }
    },

    restartGame() {
      this.gameStarted = false;
      this.gameOver = false;
      this.enemies = [];
      this.minions = [];
      this.towers = [];
      this.projectiles = [];
    }
  }
};
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #000;
}

.game-canvas {
  display: block;
}

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.player-stats {
  position: absolute;
  bottom: 120px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  min-width: 250px;
}

.hero-info {
  color: white;
}

.hero-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-bar {
  position: relative;
  height: 20px;
  background: #333;
  border-radius: 10px;
  margin-bottom: 8px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s;
  border-radius: 10px;
}

.hp-bar .bar-fill {
  background: linear-gradient(90deg, #ff4444, #ff6666);
}

.mp-bar .bar-fill {
  background: linear-gradient(90deg, #4444ff, #6666ff);
}

.bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px #000;
}

.skill-bar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  pointer-events: all;
}

.skill-btn {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #666;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.skill-btn:hover {
  border-color: #fff;
  transform: scale(1.1);
}

.skill-btn.on-cooldown {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(50, 50, 50, 0.8);
}

.skill-btn.no-mp {
  border-color: #ff0000;
}

.skill-icon {
  font-size: 32px;
  text-align: center;
  line-height: 45px;
}

.skill-key {
  position: absolute;
  bottom: 2px;
  right: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}

.cooldown-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 4px #000;
}

.kill-feed {
  position: absolute;
  top: 20px;
  right: 20px;
  max-width: 300px;
}

.kill-message {
  background: rgba(0, 0, 0, 0.8);
  color: #ffd700;
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 8px;
  font-weight: bold;
  animation: slideIn 0.3s;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.game-status {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.game-status div {
  margin-bottom: 5px;
}

.start-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}

.start-screen h1 {
  font-size: 72px;
  color: #ffd700;
  margin-bottom: 50px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

.hero-selection {
  background: rgba(0, 0, 0, 0.5);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 40px;
}

.hero-selection h2 {
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

.hero-list {
  display: flex;
  gap: 20px;
}

.hero-card {
  width: 150px;
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid transparent;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.hero-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.hero-card.selected {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.2);
}

.hero-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

.hero-card .hero-name {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.hero-role {
  color: #aaa;
  font-size: 14px;
}

.start-btn {
  padding: 15px 60px;
  font-size: 24px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  transition: all 0.3s;
  pointer-events: all;
}

.start-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
}

.game-over {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}

.game-over h1 {
  font-size: 80px;
  color: #ffd700;
  margin-bottom: 30px;
}

.stats {
  color: white;
  font-size: 24px;
  margin-bottom: 40px;
}

.stats p {
  margin: 10px 0;
}

.restart-btn {
  padding: 15px 50px;
  font-size: 20px;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  transition: all 0.3s;
  pointer-events: all;
}

.restart-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(76, 175, 80, 0.5);
}
</style>
