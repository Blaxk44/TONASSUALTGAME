// Aliens Attack: Extreme - Core Game Logic

class AliensAttackGame {
    constructor() {
        this.player = {
            hp: 100,
            maxHp: 100,
            level: 1,
            ton: 0,
            energy: 0,
            adsWatched: 0,
            missionsDone: 0,
            aliensDestroyed: 0,
            referrals: 0,
            referralEarnings: 0,
            userId: null,
            isAdmin: false
        };
        
        this.enemy = {
            hp: 100,
            maxHp: 100,
            isMothership: false,
            level: 1
        };
        
        this.gameSettings = {
            damagePerHit: 0.15, // 15% damage per hit
            bossMultiplier: 10, // Boss has 10x HP
            baseBossHP: 1000,
            levelHPIncrease: 500,
            regularLevelHP: 100,
            regularHPIncrease: 50
        };
        
        this.rewards = {
            adsMilestone: {
                threshold: 400,
                reward: 0.15
            },
            missionsMilestone: {
                threshold: 1000,
                reward: 0.23
            },
            levelMilestone: {
                threshold: 25,
                reward: 0.25
            },
            referralInstant: 0.05,
            referralPassive: 0.10 // 10% of referrals' earnings
        };
        
        this.isAttacking = false;
        this.currentAdIndex = 0;
    }
    
    initialize() {
        console.log("🛸 Aliens Attack Game Initialized");
        this.loadPlayerData();
        this.generateEnemy();
    }
    
    async loadPlayerData() {
        if (telegramApp.isReady && gameDB) {
            const savedData = await gameDB.loadGameState();
            if (savedData) {
                this.player = { ...this.player, ...savedData };
                console.log("✅ Player data loaded:", this.player);
            }
            
            // Check if user is admin
            this.player.isAdmin = telegramApp.isAdmin();
        }
        
        this.updateUI();
    }
    
    async savePlayerData() {
        if (gameDB) {
            await gameDB.saveGameState({ player: this.player });
        }
    }
    
    generateEnemy() {
        const level = this.player.level;
        const isBossLevel = level % 5 === 0; // Every 5th level is a boss
        
        if (isBossLevel) {
            // ALIEN MOTHERSHIP - Boss enemy
            this.enemy.maxHp = this.gameSettings.baseBossHP + (level * this.gameSettings.levelHPIncrease);
            this.enemy.isMothership = true;
            console.log(`👾 Generated Mothership Level ${level}: ${this.enemy.maxHp} HP`);
        } else {
            // ALIEN DRONE - Regular enemy
            this.enemy.maxHp = this.gameSettings.regularLevelHP + (level * this.gameSettings.regularHPIncrease);
            this.enemy.isMothership = false;
            console.log(`👽 Generated Alien Drone Level ${level}: ${this.enemy.maxHp} HP`);
        }
        
        this.enemy.hp = this.enemy.maxHp;
        this.enemy.level = level;
        
        this.updateEnemyUI();
    }
    
    async attack() {
        if (this.isAttacking) return;
        
        this.isAttacking = true;
        
        try {
            // 1. Show ad (required for attack)
            const adWatched = await this.showAd();
            if (!adWatched) {
                this.showMessage("⚠️ Ad required to fire laser!", "error");
                this.isAttacking = false;
                return;
            }
            
            // 2. Player takes 15% damage
            const damageTaken = Math.floor(this.player.maxHp * this.gameSettings.damagePerHit);
            this.player.hp = Math.max(0, this.player.hp - damageTaken);
            
            // 3. Enemy takes 15% damage
            const damageDealt = Math.floor(this.enemy.hp * this.gameSettings.damagePerHit);
            this.enemy.hp = Math.max(0, this.enemy.hp - damageDealt);
            
            // 4. Increment ads watched
            this.player.adsWatched++;
            
            // 5. Check for defeat
            if (this.enemy.hp <= 0) {
                await this.defeatEnemy();
            }
            
            if (this.player.hp <= 0) {
                await this.playerDefeated();
            }
            
            // 6. Check for milestones
            await this.checkMilestones();
            
            // 7. Update UI and save
            this.updateUI();
            await this.savePlayerData();
            
            this.showMessage(`🔥 Laser fired! Alien took ${damageDealt} damage!`, "success");
            
        } catch (error) {
            console.error("❌ Attack error:", error);
            this.showMessage("❌ Attack failed!", "error");
        } finally {
            this.isAttacking = false;
        }
    }
    
    async showAd() {
        // In production, this would show real ads
        // For now, simulate ad viewing
        
        return new Promise((resolve) => {
            this.showMessage("📺 Loading ad...", "info");
            
            // Simulate ad loading
            setTimeout(() => {
                this.showMessage("✅ Ad completed!", "success");
                resolve(true);
            }, 1500);
        });
    }
    
    async defeatEnemy() {
        this.player.aliensDestroyed++;
        
        if (this.enemy.isMothership) {
            // MOTHERSHIP DESTROYED - Big reward
            this.player.energy += 100;
            this.player.ton += 0.1;
            this.showMessage("🎉 MOTHERSHIP DESTROYED! Sector cleared!", "success");
            
            // Level up
            this.player.level++;
        } else {
            // DRONE DESTROYED - Regular reward
            this.player.energy += 20;
            this.showMessage("✅ Alien Drone destroyed!", "success");
        }
        
        // Generate new enemy
        this.generateEnemy();
    }
    
    async playerDefeated() {
        this.showMessage("💀 Your ship was destroyed! Shields recharging...", "error");
        
        // Restore HP and generate new enemy
        this.player.hp = this.player.maxHp;
        this.generateEnemy();
    }
    
    async checkMilestones() {
        // Check ads milestone (400 ads = 0.15 TON)
        if (this.player.adsWatched === this.rewards.adsMilestone.threshold) {
            this.player.ton += this.rewards.adsMilestone.reward;
            this.showMessage(`🏆 400 ads watched! You earned ${this.rewards.adsMilestone.reward} TON!`, "success");
        }
        
        // Check missions milestone (1000 missions = 0.23 TON)
        if (this.player.missionsDone >= this.rewards.missionsMilestone.threshold) {
            this.player.ton += this.rewards.missionsMilestone.reward;
            this.showMessage(`🏆 1000 missions completed! You earned ${this.rewards.missionsMilestone.reward} TON!`, "success");
        }
        
        // Check level milestone (25+ levels = 0.25 TON)
        if (this.player.level >= this.rewards.levelMilestone.threshold) {
            this.player.ton += this.rewards.levelMilestone.reward;
            this.showMessage(`🏆 Level 25 reached! You earned ${this.rewards.levelMilestone.reward} TON!`, "success");
        }
    }
    
    updateUI() {
        // Update player stats
        document.getElementById('userTon').textContent = this.player.ton.toFixed(2);
        document.getElementById('userEnergy').textContent = this.player.energy;
        document.getElementById('userLevel').textContent = this.player.level;
        document.getElementById('currentLevel').textContent = this.player.level;
        document.getElementById('aliensDestroyed').textContent = this.player.aliensDestroyed;
        document.getElementById('playerHp').textContent = this.player.hp;
        document.getElementById('adsWatched').textContent = this.player.adsWatched;
        document.getElementById('tasksDone').textContent = this.player.missionsDone;
        document.getElementById('referralCount').textContent = this.player.referrals;
        document.getElementById('referralEarnings').textContent = this.player.referralEarnings.toFixed(2);
        
        // Update enemy stats
        document.getElementById('enemyCurrentHp').textContent = this.enemy.hp;
        document.getElementById('enemyMaxHp').textContent = this.enemy.maxHp;
        const hpPercent = (this.enemy.hp / this.enemy.maxHp) * 100;
        document.getElementById('enemyHealthBar').style.width = `${hpPercent}%`;
        
        // Update enemy type
        const enemyElement = document.getElementById('enemy');
        if (this.enemy.isMothership) {
            enemyElement.className = 'enemy mothership';
            enemyElement.innerHTML = 'MOTHERSHIP<br>⚠️ BOSS';
        } else {
            enemyElement.className = 'enemy alien-drone';
            enemyElement.innerHTML = 'ALIEN DRONE';
        }
        
        // Update HP bar color
        const playerHpElement = document.getElementById('playerHp');
        const playerHpPercent = (this.player.hp / this.player.maxHp) * 100;
        if (playerHpPercent < 30) {
            playerHpElement.style.color = '#ff3333';
        } else if (playerHpPercent < 60) {
            playerHpElement.style.color = '#ffcc00';
        } else {
            playerHpElement.style.color = '#00c6ff';
        }
    }
    
    updateEnemyUI() {
        const enemyElement = document.getElementById('enemy');
        if (this.enemy.isMothership) {
            enemyElement.className = 'enemy mothership';
            enemyElement.innerHTML = 'MOTHERSHIP<br>⚠️ BOSS';
        } else {
            enemyElement.className = 'enemy alien-drone';
            enemyElement.innerHTML = 'ALIEN DRONE';
        }
    }
    
    showMessage(message, type = 'info') {
        const messageElement = document.getElementById('gameMessage');
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'message';
        }, 3000);
    }
    
    completeMission() {
        this.player.missionsDone++;
        this.player.energy += 50;
        this.showMessage("✅ Mission completed! +50 Energy", "success");
        this.savePlayerData();
        this.updateUI();
    }
    
    getReferralLink() {
        return telegramApp.getReferralLink();
    }
    
    copyReferralLink() {
        const link = this.getReferralLink();
        if (link) {
            navigator.clipboard.writeText(link).then(() => {
                this.showMessage("✅ Referral link copied!", "success");
            }).catch(() => {
                // Fallback for older browsers
                const input = document.createElement('input');
                input.value = link;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                this.showMessage("✅ Referral link copied!", "success");
            });
        }
    }
}

// Create global game instance
const aliensGame = new AliensAttackGame();

// UI Initialization Functions
function initializeGame() {
    // Initialize Telegram
    telegramApp.initialize();
    
    // Initialize game
    aliensGame.initialize();
    
    // Set up attack button
    const attackBtn = document.getElementById('attackBtn');
    if (attackBtn) {
        attackBtn.onclick = () => aliensGame.attack();
    }
    
    // Set up referral link
    const referralLink = document.getElementById('referralLink');
    if (referralLink && telegramApp.isReady) {
        const link = aliensGame.getReferralLink();
        if (link) {
            referralLink.value = link;
        }
    }
    
    // Create tabs based on user role
    createTabs();
    
    console.log("🎮 Game UI initialized");
}

function createTabs() {
    const tabsContainer = document.getElementById('tabsContainer');
    if (!tabsContainer) return;
    
    const tabs = [
        { id: 'gameTab', name: '🛸 Game', icon: '🛸' },
        { id: 'miningTab', name: '⛏️ Mining', icon: '⛏️' },
        { id: 'tasksTab', name: '✅ Missions', icon: '✅' },
        { id: 'withdrawTab', name: '💰 Withdraw', icon: '💰' },
        { id: 'referralsTab', name: '👥 Alliance', icon: '👥' }
    ];
    
    // Add admin tab if user is admin
    if (aliensGame.player.isAdmin) {
        tabs.push({ id: 'adminTab', name: '🚀 Command', icon: '🚀', isAdmin: true });
    }
    
    tabsContainer.innerHTML = '';
    tabs.forEach(tab => {
        const tabElement = document.createElement('div');
        tabElement.className = `tab ${tab.isAdmin ? 'admin-tab' : ''}`;
        tabElement.dataset.tab = tab.id;
        tabElement.innerHTML = `${tab.icon} ${tab.name}`;
        tabElement.onclick = () => switchTab(tab.id);
        tabsContainer.appendChild(tabElement);
    });
    
    // Set first tab as active
    if (tabsContainer.firstChild) {
        tabsContainer.firstChild.classList.add('active');
    }
}

function switchTab(tabId) {
    // Update tab classes
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        }
    });
    
    // Update content visibility
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
}

function initializeUI() {
    console.log("🎨 UI initialized");
}

// Make functions globally available
window.copyReferralLink = () => aliensGame.copyReferralLink();
window.completeMission = () => aliensGame.completeMission();
window.switchTab = switchTab;
