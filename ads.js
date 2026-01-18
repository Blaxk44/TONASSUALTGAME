// Ad Waterfall System for Aliens Attack

class AdWaterfallSystem {
    constructor() {
        this.adNetworks = [
            {
                name: 'montag',
                loaded: false,
                priority: 1,
                sdk: null
            },
            {
                name: 'adsaxium',
                loaded: false,
                priority: 2,
                sdk: null
            },
            {
                name: 'gigapub',
                loaded: false,
                priority: 3,
                sdk: null
            },
            {
                name: 'richads',
                loaded: false,
                priority: 4,
                sdk: null
            }
        ];
        
        this.currentNetworkIndex = 0;
        this.isAdShowing = false;
        this.adCallbacks = {
            onComplete: null,
            onError: null
        };
    }
    
    initialize() {
        console.log("📺 Initializing Ad Waterfall System");
        
        // Check if ad SDKs are loaded
        this.checkSDKs();
        
        // Set up network fallback order
        this.setupFallback();
        
        return this;
    }
    
    checkSDKs() {
        // Check for Montag
        if (typeof window.monetag !== 'undefined') {
            this.adNetworks[0].loaded = true;
            this.adNetworks[0].sdk = window.monetag;
            console.log("✅ Montag SDK loaded");
        }
        
        // Check for AdsAxium
        if (typeof window.adexium !== 'undefined') {
            this.adNetworks[1].loaded = true;
            this.adNetworks[1].sdk = window.adexium;
            console.log("✅ AdsAxium SDK loaded");
        }
        
        // Check for GigaPub
        if (typeof window.gigapub !== 'undefined') {
            this.adNetworks[2].loaded = true;
            this.adNetworks[2].sdk = window.gigapub;
            console.log("✅ GigaPub SDK loaded");
        }
        
        // Check for RichAds
        if (typeof window.richads !== 'undefined') {
            this.adNetworks[3].loaded = true;
            this.adNetworks[3].sdk = window.richads;
            console.log("✅ RichAds SDK loaded");
        }
    }
    
    setupFallback() {
        // Sort by priority
        this.adNetworks.sort((a, b) => a.priority - b.priority);
        
        // Filter to only loaded networks
        this.adNetworks = this.adNetworks.filter(network => network.loaded);
        
        if (this.adNetworks.length === 0) {
            console.warn("⚠️ No ad networks loaded!");
        } else {
            console.log(`📊 Ad networks ready: ${this.adNetworks.map(n => n.name).join(', ')}`);
        }
    }
    
    async showAd(onComplete, onError) {
        if (this.isAdShowing) {
            console.log("⚠️ Ad already showing");
            return false;
        }
        
        if (this.adNetworks.length === 0) {
            console.log("❌ No ad networks available");
            if (onError) onError("No ads available");
            return false;
        }
        
        this.adCallbacks.onComplete = onComplete;
        this.adCallbacks.onError = onError;
        this.isAdShowing = true;
        
        // Try networks in order
        return await this.tryNetwork(0);
    }
    
    async tryNetwork(index) {
        if (index >= this.adNetworks.length) {
            // All networks failed
            console.log("❌ All ad networks failed");
            this.isAdShowing = false;
            if (this.adCallbacks.onError) {
                this.adCallbacks.onError("All ad networks failed");
            }
            return false;
        }
        
        const network = this.adNetworks[index];
        console.log(`🔄 Trying ${network.name} (${index + 1}/${this.adNetworks.length})`);
        
        try {
            switch (network.name) {
                case 'montag':
                    return await this.showMontagAd(index);
                case 'adsaxium':
                    return await this.showAdsAxiumAd(index);
                case 'gigapub':
                    return await this.showGigaPubAd(index);
                case 'richads':
                    return await this.showRichAdsAd(index);
                default:
                    console.log(`⚠️ Unknown network: ${network.name}`);
                    return await this.tryNetwork(index + 1);
            }
        } catch (error) {
            console.log(`❌ ${network.name} failed:`, error);
            return await this.tryNetwork(index + 1);
        }
    }
    
    async showMontagAd(fallbackIndex) {
        return new Promise((resolve, reject) => {
            // Montag implementation
            console.log("📢 Showing Montag ad");
            
            // Simulate ad completion
            setTimeout(() => {
                console.log("✅ Montag ad completed");
                this.isAdShowing = false;
                if (this.adCallbacks.onComplete) {
                    this.adCallbacks.onComplete();
                }
                resolve(true);
            }, 2000);
            
            // Fallback on timeout
            setTimeout(() => {
                console.log("⏰ Montag ad timeout, trying next network");
                this.tryNetwork(fallbackIndex + 1).then(resolve).catch(reject);
            }, 5000);
        });
    }
    
    async showAdsAxiumAd(fallbackIndex) {
        return new Promise((resolve, reject) => {
            console.log("📢 Showing AdsAxium ad");
            
            setTimeout(() => {
                console.log("✅ AdsAxium ad completed");
                this.isAdShowing = false;
                if (this.adCallbacks.onComplete) {
                    this.adCallbacks.onComplete();
                }
                resolve(true);
            }, 2000);
            
            setTimeout(() => {
                console.log("⏰ AdsAxium ad timeout");
                this.tryNetwork(fallbackIndex + 1).then(resolve).catch(reject);
            }, 5000);
        });
    }
    
    async showGigaPubAd(fallbackIndex) {
        return new Promise((resolve, reject) => {
            console.log("📢 Showing GigaPub ad");
            
            setTimeout(() => {
                console.log("✅ GigaPub ad completed");
                this.isAdShowing = false;
                if (this.adCallbacks.onComplete) {
                    this.adCallbacks.onComplete();
                }
                resolve(true);
            }, 2000);
            
            setTimeout(() => {
                console.log("⏰ GigaPub ad timeout");
                this.tryNetwork(fallbackIndex + 1).then(resolve).catch(reject);
            }, 5000);
        });
    }
    
    async showRichAdsAd(fallbackIndex) {
        return new Promise((resolve, reject) => {
            console.log("📢 Showing RichAds ad");
            
            setTimeout(() => {
                console.log("✅ RichAds ad completed");
                this.isAdShowing = false;
                if (this.adCallbacks.onComplete) {
                    this.adCallbacks.onComplete();
                }
                resolve(true);
            }, 2000);
            
            setTimeout(() => {
                console.log("⏰ RichAds ad timeout");
                this.isAdShowing = false;
                if (this.adCallbacks.onError) {
                    this.adCallbacks.onError("RichAds ad timeout");
                }
                resolve(false);
            }, 5000);
        });
    }
    
    // Simulated ad for testing (no real SDK required)
    async showTestAd() {
        return new Promise((resolve) => {
            console.log("🧪 Showing test ad");
            
            // Show loading message
            if (typeof showMessage === 'function') {
                showMessage("📺 Loading test ad...", "info");
            }
            
            setTimeout(() => {
                console.log("✅ Test ad completed");
                if (typeof showMessage === 'function') {
                    showMessage("✅ Test ad completed!", "success");
                }
                resolve(true);
            }, 1500);
        });
    }
    
    getAvailableNetworks() {
        return this.adNetworks.filter(n => n.loaded).map(n => n.name);
    }
    
    getStats() {
        return {
            totalNetworks: 4,
            loadedNetworks: this.adNetworks.length,
            availableNetworks: this.getAvailableNetworks(),
            currentPriority: this.currentNetworkIndex
        };
    }
}

// Create global ad system instance
const adSystem = new AdWaterfallSystem();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    adSystem.initialize();
    
    // Override game's showAd method to use waterfall
    if (aliensGame) {
        aliensGame.showAd = async function() {
            return await adSystem.showAd(
                () => {
                    // On complete
                    if (typeof this.showMessage === 'function') {
                        this.showMessage("✅ Ad completed! Firing laser...", "success");
                    }
                },
                (error) => {
                    // On error
                    if (typeof this.showMessage === 'function') {
                        this.showMessage(`❌ Ad error: ${error}`, "error");
                    }
                }
            );
        };
    }
});