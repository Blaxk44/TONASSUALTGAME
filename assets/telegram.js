// Telegram WebApp Integration

const TELEGRAM_CONFIG = {
    BOT_TOKEN: "8535275737:AAGfrBE6fGOG7tZPGZcqf7mmGD3f7IBqov4",
    ADMIN_ID: "6575412146",
    BOT_USERNAME: "ton_assault_game_bot"
};

class TelegramIntegration {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.initData = null;
        this.isReady = false;
    }
    
    initialize() {
        if (!this.tg) {
            console.error("❌ Telegram WebApp SDK not loaded");
            return false;
        }
        
        try {
            // Expand to full screen
            this.tg.expand();
            this.tg.enableClosingConfirmation();
            
            // Set theme colors
            this.tg.setHeaderColor('#0a0a1a');
            this.tg.setBackgroundColor('#0a0a1a');
            
            // Get user data
            this.initData = this.tg.initDataUnsafe;
            this.user = this.initData?.user;
            
            if (this.user) {
                console.log("✅ Telegram user authenticated:", this.user.id);
                this.isReady = true;
                
                // Initialize game database with user ID
                gameDB.setUserId(this.user.id.toString());
                
                // Process referral if exists
                this.processStartParam();
            } else {
                console.warn("⚠️ Telegram user not available, using guest mode");
                // Generate guest ID for testing
                const guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                gameDB.setUserId(guestId);
                this.isReady = true;
            }
            
            return true;
        } catch (error) {
            console.error("❌ Telegram initialization error:", error);
            return false;
        }
    }
    
    processStartParam() {
        const startParam = this.tg.initDataUnsafe?.start_param;
        if (startParam && this.user) {
            console.log("🔗 Start parameter found:", startParam);
            
            // Save referral data
            GAME_STATE.referralData = {
                referrerId: startParam,
                referredId: this.user.id.toString(),
                timestamp: new Date().toISOString()
            };
            
            // Process referral in database
            gameDB.processReferral(startParam, this.user.id.toString());
            
            return true;
        }
        return false;
    }
    
    getUser() {
        return this.user;
    }
    
    getUserId() {
        return this.user?.id?.toString() || null;
    }
    
    isAdmin() {
        const userId = this.getUserId();
        return userId === TELEGRAM_CONFIG.ADMIN_ID;
    }
    
    getReferralLink() {
        const userId = this.getUserId();
        if (!userId) return null;
        
        return `https://t.me/${TELEGRAM_CONFIG.BOT_USERNAME}?start=${userId}`;
    }
    
    sendDataToBot(data) {
        // This would send data to your bot backend
        console.log("📤 Sending data to bot:", data);
        
        // Example: Send via fetch API
        fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.ADMIN_ID,
                text: `Game Event: ${JSON.stringify(data)}`
            })
        }).catch(error => {
            console.error("❌ Error sending data to bot:", error);
        });
    }
    
    showAlert(message) {
        if (this.tg && this.tg.showAlert) {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    }
    
    showConfirm(message, callback) {
        if (this.tg && this.tg.showConfirm) {
            this.tg.showConfirm(message, callback);
        } else {
            if (confirm(message)) {
                callback(true);
            }
        }
    }
}

// Create global Telegram instance
const telegramApp = new TelegramIntegration();