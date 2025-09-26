// HeartQuest - Storage helpers
(function(){
    const Storage = {
        get(key, def=null){
            try { const v = localStorage.getItem(key); return v===null?def:JSON.parse(v); } catch(e){ return def; }
        },
        set(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} },
        del(key){ try { localStorage.removeItem(key); } catch(e){} },
        has(key){ try { return localStorage.getItem(key) !== null; } catch(e){ return false; } }
    };
    window.Store = Storage;
})();

// storage.js - Local Storage Management System
// Handles user preferences, avatar data, progress saving, and game state persistence

class StorageManager {
    constructor() {
        this.prefix = 'loveconnect_';
        this.version = '1.0';
        this.initializeStorage();
    }

    initializeStorage() {
        // Check if this is first time user
        if (!this.get('initialized')) {
            this.setupDefaultData();
            this.set('initialized', true);
            this.set('version', this.version);
        }
        
        // Check for version updates
        if (this.get('version') !== this.version) {
            this.migrateData();
            this.set('version', this.version);
        }
    }

    setupDefaultData() {
        const defaultData = {
            user: {
                userId: null,
                username: '',
                email: '',
                registrationDate: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                subscriptionTier: 0, // 0=Free, 1=Premium, 2=VIP
                virtualCoins: 1000,
                level: 1,
                experience: 0,
                totalPlayTime: 0
            },
            avatar: {
                gender: 'male',
                height: 1.75,
                skinColor: '#FDBCB4',
                hairStyle: 'short',
                hairColor: '#8B4513',
                clothingStyle: 'casual',
                accessories: [],
                lastUpdated: new Date().toISOString()
            },
            preferences: {
                theme: 'dark',
                notifications: true,
                sound: true,
                music: true,
                volume: 0.8,
                language: 'en',
                privacy: {
                    showOnline: true,
                    allowFriendRequests: true,
                    showLocation: true
                }
            },
            gameState: {
                currentWorld: 'paradise',
                unlockedWorlds: ['paradise'],
                currentLocation: { x: 0, y: 0, z: 0 },
                inventory: [],
                achievements: [],
                friends: [],
                blockedUsers: [],
                dateHistory: []
            },
            statistics: {
                worldsVisited: 1,
                datesCompleted: 0,
                messagesSet: 0,
                friendsMade: 0,
                homesBuilt: 0,
                petsOwned: 0
            }
        };

        Object.keys(defaultData).forEach(key => {
            this.set(key, defaultData[key]);
        });
    }

    // Core storage methods
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serializedValue);
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (item === null) return defaultValue;
            return JSON.parse(item);
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }

    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }

    // User data management
    saveUserData(userData) {
        const currentUser = this.get('user', {});
        const updatedUser = { ...currentUser, ...userData };
        updatedUser.lastUpdated = new Date().toISOString();
        return this.set('user', updatedUser);
    }

    getUserData() {
        return this.get('user', {});
    }

    // Avatar data management
    saveAvatarData(avatarData) {
        const currentAvatar = this.get('avatar', {});
        const updatedAvatar = { ...currentAvatar, ...avatarData };
        updatedAvatar.lastUpdated = new Date().toISOString();
        return this.set('avatar', updatedAvatar);
    }

    getAvatarData() {
        return this.get('avatar', {});
    }

    // Game state management
    saveGameState(gameStateData) {
        const currentState = this.get('gameState', {});
        const updatedState = { ...currentState, ...gameStateData };
        return this.set('gameState', updatedState);
    }

    getGameState() {
        return this.get('gameState', {});
    }

    // Preferences management
    savePreferences(preferences) {
        const currentPrefs = this.get('preferences', {});
        const updatedPrefs = { ...currentPrefs, ...preferences };
        return this.set('preferences', updatedPrefs);
    }

    getPreferences() {
        return this.get('preferences', {});
    }

    // Statistics tracking
    updateStatistic(statName, value) {
        const stats = this.get('statistics', {});
        if (typeof value === 'number') {
            stats[statName] = (stats[statName] || 0) + value;
        } else {
            stats[statName] = value;
        }
        return this.set('statistics', stats);
    }

    getStatistics() {
        return this.get('statistics', {});
    }

    // Inventory management
    addToInventory(item) {
        const gameState = this.getGameState();
        if (!gameState.inventory) gameState.inventory = [];
        
        const existingItem = gameState.inventory.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
        } else {
            gameState.inventory.push({
                ...item,
                dateAcquired: new Date().toISOString()
            });
        }
        
        return this.saveGameState(gameState);
    }

    removeFromInventory(itemId, quantity = 1) {
        const gameState = this.getGameState();
        if (!gameState.inventory) return false;
        
        const itemIndex = gameState.inventory.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return false;
        
        const item = gameState.inventory[itemIndex];
        if (item.quantity && item.quantity > quantity) {
            item.quantity -= quantity;
        } else {
            gameState.inventory.splice(itemIndex, 1);
        }
        
        return this.saveGameState(gameState);
    }

    // Achievement system
    unlockAchievement(achievementId) {
        const gameState = this.getGameState();
        if (!gameState.achievements) gameState.achievements = [];
        
        if (!gameState.achievements.find(a => a.id === achievementId)) {
            gameState.achievements.push({
                id: achievementId,
                unlockedDate: new Date().toISOString()
            });
            return this.saveGameState(gameState);
        }
        return false;
    }

    // Friends management
    addFriend(friendData) {
        const gameState = this.getGameState();
        if (!gameState.friends) gameState.friends = [];
        
        if (!gameState.friends.find(f => f.id === friendData.id)) {
            gameState.friends.push({
                ...friendData,
                addedDate: new Date().toISOString()
            });
            return this.saveGameState(gameState);
        }
        return false;
    }

    removeFriend(friendId) {
        const gameState = this.getGameState();
        if (!gameState.friends) return false;
        
        const friendIndex = gameState.friends.findIndex(f => f.id === friendId);
        if (friendIndex !== -1) {
            gameState.friends.splice(friendIndex, 1);
            return this.saveGameState(gameState);
        }
        return false;
    }

    // Date history tracking
    saveDateHistory(dateData) {
        const gameState = this.getGameState();
        if (!gameState.dateHistory) gameState.dateHistory = [];
        
        gameState.dateHistory.push({
            ...dateData,
            date: new Date().toISOString()
        });
        
        // Keep only last 50 dates
        if (gameState.dateHistory.length > 50) {
            gameState.dateHistory = gameState.dateHistory.slice(-50);
        }
        
        return this.saveGameState(gameState);
    }

    // World progress
    unlockWorld(worldId) {
        const gameState = this.getGameState();
        if (!gameState.unlockedWorlds) gameState.unlockedWorlds = ['paradise'];
        
        if (!gameState.unlockedWorlds.includes(worldId)) {
            gameState.unlockedWorlds.push(worldId);
            return this.saveGameState(gameState);
        }
        return false;
    }

    // Data migration for version updates
    migrateData() {
        const currentVersion = this.get('version', '1.0');
        console.log(`Migrating data from version ${currentVersion} to ${this.version}`);
        
        // Add migration logic here as needed
        // Example:
        // if (currentVersion === '1.0') {
        //     // Migrate from 1.0 to 1.1
        // }
    }

    // Export/Import functionality
    exportData() {
        const allData = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                const cleanKey = key.replace(this.prefix, '');
                allData[cleanKey] = this.get(cleanKey);
            }
        });
        
        return {
            version: this.version,
            exportDate: new Date().toISOString(),
            data: allData
        };
    }

    importData(importedData) {
        if (!importedData.data || !importedData.version) {
            throw new Error('Invalid import data format');
        }
        
        try {
            // Clear existing data
            this.clear();
            
            // Import all data
            Object.keys(importedData.data).forEach(key => {
                this.set(key, importedData.data[key]);
            });
            
            // Update version
            this.set('version', this.version);
            
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }

    // Storage usage information
    getStorageInfo() {
        let totalSize = 0;
        let itemCount = 0;
        
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                totalSize += localStorage[key].length;
                itemCount++;
            }
        });
        
        return {
            totalSize: totalSize,
            itemCount: itemCount,
            sizeInKB: (totalSize / 1024).toFixed(2),
            maxSize: 5120, // 5MB typical localStorage limit
            usagePercentage: ((totalSize / (5120 * 1024)) * 100).toFixed(2)
        };
    }

    // Cleanup old data
    cleanup() {
        const cutoffDate = new Date();
        cutoffDate.setDays(cutoffDate.getDate() - 30); // 30 days ago
        
        // Clean up old date history
        const gameState = this.getGameState();
        if (gameState.dateHistory) {
            gameState.dateHistory = gameState.dateHistory.filter(
                date => new Date(date.date) > cutoffDate
            );
            this.saveGameState(gameState);
        }
        
        console.log('Storage cleanup completed');
    }
}

// Export singleton instance
const storage = new StorageManager();
export default storage;