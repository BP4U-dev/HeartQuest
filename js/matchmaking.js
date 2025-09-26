// matching.js - Dating Algorithm & Compatibility System
// Handles matchmaking, compatibility scoring, and dating mechanics

import Utils from './utils.js';
import storage from './storage.js';

class MatchingSystem {
    constructor() {
        this.compatibilityWeights = {
            age: 0.15,
            interests: 0.25,
            personality: 0.20,
            location: 0.10,
            activityLevel: 0.15,
            appearance: 0.10,
            random: 0.05
        };
        
// matching.js - Dating Algorithm & Compatibility System
// Handles matchmaking, compatibility scoring, and dating mechanics

import Utils from './utils.js';
import storage from './storage.js';

class MatchingSystem {
    constructor() {
        this.compatibilityWeights = {
            age: 0.15,
            interests: 0.25,
            personality: 0.20,
            location: 0.10,
            activityLevel: 0.15,
            appearance: 0.10,
            random: 0.05
        };
        
        this.personalityTypes = [
            'adventurous', 'artistic', 'intellectual', 'social', 'romantic', 
            'athletic', 'spiritual', 'humorous', 'ambitious', 'caring'
        ];
        
        this.interests = [
            'music', 'movies', 'books', 'travel', 'cooking', 'sports', 
            'art', 'photography', 'gaming', 'dancing', 'hiking', 'fitness'
        ];
        
        this.activityLevels = {
            low: 1,
            moderate: 2,
            high: 3,
            very_high: 4
        };
    }

    // Main matchmaking function
    async findMatches(userId, options = {}) {
        try {
            const currentUser = await this.getCurrentUser(userId);
            if (!currentUser) {
                throw new Error('User not found');
            }

            const {
                maxResults = 10,
                minCompatibility = 60,
                ageRange = { min: 18, max: 99 },
                maxDistance = 50,
                preferredWorlds = [],
                excludeBlocked = true
            } = options;

            // Get potential matches
            const potentialMatches = await this.getPotentialMatches(currentUser, {
                ageRange,
                maxDistance,
                preferredWorlds,
                excludeBlocked
            });

            // Calculate compatibility scores
            const scoredMatches = potentialMatches.map(match => ({
                ...match,
                compatibility: this.calculateCompatibility(currentUser, match),
                reasons: this.getCompatibilityReasons(currentUser, match)
            }));

            // Filter by minimum compatibility and sort by score
            const filteredMatches = scoredMatches
                .filter(match => match.compatibility >= minCompatibility)
                .sort((a, b) => b.compatibility - a.compatibility)
                .slice(0, maxResults);

            // Add match metadata
            return filteredMatches.map(match => ({
                ...match,
                matchDate: new Date().toISOString(),
                viewed: false,
                liked: null // null = not decided, true = liked, false = passed
            }));

        } catch (error) {
            return Utils.handleError(error, 'findMatches');
        }
    }

    // Calculate compatibility between two users
    calculateCompatibility(user1, user2) {
        let totalScore = 0;

        // Age compatibility
        const ageScore = this.calculateAgeCompatibility(user1.age, user2.age);
        totalScore += ageScore * this.compatibilityWeights.age;

        // Interest compatibility
        const interestScore = this.calculateInterestCompatibility(
            user1.interests || [], 
            user2.interests || []
        );
        totalScore += interestScore * this.compatibilityWeights.interests;

        // Personality compatibility
        const personalityScore = this.calculatePersonalityCompatibility(
            user1.personality || [], 
            user2.personality || []
        );
        totalScore += personalityScore * this.compatibilityWeights.personality;

        // Location compatibility (virtual world proximity)
        const locationScore = this.calculateLocationCompatibility(
            user1.currentLocation || { x: 0, y: 0, z: 0 },
            user2.currentLocation || { x: 0, y: 0, z: 0 }
        );
        totalScore += locationScore * this.compatibilityWeights.location;

        // Activity level compatibility
        const activityScore = this.calculateActivityCompatibility(
            user1.activityLevel || 2,
            user2.activityLevel || 2
        );
        totalScore += activityScore * this.compatibilityWeights.activityLevel;

        // Appearance preference compatibility
        const appearanceScore = this.calculateAppearanceCompatibility(user1, user2);
        totalScore += appearanceScore * this.compatibilityWeights.appearance;

        // Random factor for variety
        const randomScore = Math.random() * 100;
        totalScore += randomScore * this.compatibilityWeights.random;

        return Math.round(Math.min(totalScore, 100));
    }

    calculateAgeCompatibility(age1, age2) {
        const ageDiff = Math.abs(age1 - age2);
        
        // Optimal age difference is 0-5 years
        if (ageDiff <= 2) return 100;
        if (ageDiff <= 5) return 90;
        if (ageDiff <= 10) return 70;
        if (ageDiff <= 15) return 50;
        if (ageDiff <= 20) return 30;
        return 10;
    }

    calculateInterestCompatibility(interests1, interests2) {
        if (interests1.length === 0 || interests2.length === 0) return 50;
        
        const commonInterests = interests1.filter(interest => 
            interests2.includes(interest)
        );
        
        const totalUniqueInterests = new Set([...interests1, ...interests2]).size;
        const commonRatio = commonInterests.length / Math.max(interests1.length, interests2.length);
        
        return Math.round(commonRatio * 100);
    }

    calculatePersonalityCompatibility(personality1, personality2) {
        if (personality1.length === 0 || personality2.length === 0) return 50;
        
        // Some personality types complement each other
        const complementaryPairs = [
            ['adventurous', 'social'],
            ['artistic', 'intellectual'],
            ['romantic', 'caring'],
            ['ambitious', 'supportive'],
            ['humorous', 'social']
        ];
        
        let score = 0;
        const commonTraits = personality1.filter(trait => personality2.includes(trait));
        
        // Bonus for common traits
        score += (commonTraits.length / Math.max(personality1.length, personality2.length)) * 60;
        
        // Bonus for complementary traits
        for (const pair of complementaryPairs) {
            if ((personality1.includes(pair[0]) && personality2.includes(pair[1])) ||
                (personality1.includes(pair[1]) && personality2.includes(pair[0]))) {
                score += 20;
            }
        }
        
        return Math.min(Math.round(score), 100);
    }

    calculateLocationCompatibility(location1, location2) {
        const distance = Utils.calculateDistance(location1, location2);
        
        // Closer virtual proximity increases compatibility
        if (distance <= 10) return 100;
        if (distance <= 25) return 80;
        if (distance <= 50) return 60;
        if (distance <= 100) return 40;
        return 20;
    }

    calculateActivityCompatibility(activity1, activity2) {
        const activityDiff = Math.abs(activity1 - activity2);
        
        if (activityDiff === 0) return 100;
        if (activityDiff === 1) return 80;
        if (activityDiff === 2) return 50;
        return 20;
    }

    calculateAppearanceCompatibility(user1, user2) {
        // This is a simplified version - in reality, this would be based on stated preferences
        let score = 50; // Base score
        
        const avatar1 = user1.avatar || {};
        const avatar2 = user2.avatar || {};
        const preferences1 = user1.preferences || {};
        
        // Height preference compatibility
        if (preferences1.heightPreference) {
            const heightDiff = Math.abs((avatar1.height || 1.75) - (avatar2.height || 1.75));
            if (heightDiff <= 0.1) score += 20;
            else if (heightDiff <= 0.2) score += 10;
        }
        
        // Style preference compatibility
        if (preferences1.stylePreference && preferences1.stylePreference === avatar2.clothingStyle) {
            score += 30;
        }
        
        return Math.min(Math.round(score), 100);
    }

    getCompatibilityReasons(user1, user2) {
        const reasons = [];
        
        // Check each compatibility factor
        const ageScore = this.calculateAgeCompatibility(user1.age, user2.age);
        if (ageScore >= 80) reasons.push('Similar age');
        
        const interestScore = this.calculateInterestCompatibility(
            user1.interests || [], user2.interests || []
        );
        if (interestScore >= 60) reasons.push('Shared interests');
        
        const personalityScore = this.calculatePersonalityCompatibility(
            user1.personality || [], user2.personality || []
        );
        if (personalityScore >= 70) reasons.push('Compatible personalities');
        
        const locationScore = this.calculateLocationCompatibility(
            user1.currentLocation || { x: 0, y: 0, z: 0 },
            user2.currentLocation || { x: 0, y: 0, z: 0 }
        );
        if (locationScore >= 80) reasons.push('Close virtual proximity');
        
        const activityScore = this.calculateActivityCompatibility(
            user1.activityLevel || 2, user2.activityLevel || 2
        );
        if (activityScore >= 80) reasons.push('Similar activity levels');
        
        return reasons;
    }

    // Get potential matches based on filters
    async getPotentialMatches(currentUser, filters) {
        // In a real implementation, this would query your backend
        // For now, we'll simulate with mock data
        const mockUsers = this.generateMockUsers(50);
        
        return mockUsers.filter(user => {
            // Don't match with self
            if (user.id === currentUser.id) return false;
            
            // Age filter
            if (user.age < filters.ageRange.min || user.age > filters.ageRange.max) return false;
            
            // Distance filter (virtual world distance)
            const distance = Utils.calculateDistance(
                currentUser.currentLocation || { x: 0, y: 0, z: 0 },
                user.currentLocation || { x: 0, y: 0, z: 0 }
            );
            if (distance > filters.maxDistance) return false;
            
            // World preference filter
            if (filters.preferredWorlds.length > 0 && 
                !filters.preferredWorlds.includes(user.currentWorld)) return false;
            
            // Exclude blocked users
            if (filters.excludeBlocked) {
                const gameState = storage.getGameState();
                if (gameState.blockedUsers && gameState.blockedUsers.includes(user.id)) return false;
            }
            
            return true;
        });
    }

    // Generate mock users for testing
    generateMockUsers(count) {
        const mockUsers = [];
        const names = ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Henry'];
        const worlds = ['paradise', 'neon-city', 'fantasy', 'space-station'];
        
        for (let i = 0; i < count; i++) {
            mockUsers.push({
                id: Utils.generateUniqueId(),
                username: `${Utils.getRandomElement(names)}_${i}`,
                age: Utils.randomInt(18, 45),
                interests: Utils.shuffleArray(this.interests).slice(0, Utils.randomInt(3, 8)),
                personality: Utils.shuffleArray(this.personalityTypes).slice(0, Utils.randomInt(2, 5)),
                activityLevel: Utils.randomInt(1, 4),
                currentWorld: Utils.getRandomElement(worlds),
                currentLocation: {
                    x: Utils.randomBetween(-50, 50),
                    y: Utils.randomBetween(-50, 50),
                    z: Utils.randomBetween(-50, 50)
                },
                avatar: {
                    gender: Utils.getRandomElement(['male', 'female', 'non-binary']),
                    height: Utils.randomBetween(1.5, 2.0),
                    hairColor: Utils.getRandomElement(['#8B4513', '#FFD700', '#000000', '#FF0000']),
                    clothingStyle: Utils.getRandomElement(['casual', 'formal', 'artistic', 'sporty'])
                },
                isOnline: Math.random() > 0.3,
                lastSeen: new Date(Date.now() - Utils.randomInt(0, 86400000)).toISOString()
            });
        }
        
        return mockUsers;
    }

    // Handle user interactions with matches
    async handleMatchInteraction(userId, matchId, action) {
        try {
            const actions = ['like', 'pass', 'super_like', 'report'];
            if (!actions.includes(action)) {
                throw new Error('Invalid action');
            }
            
            const interaction = {
                userId,
                matchId,
                action,
                timestamp: new Date().toISOString()
            };
            
            // Save interaction to storage
            const gameState = storage.getGameState();
            if (!gameState.matchInteractions) gameState.matchInteractions = [];
            gameState.matchInteractions.push(interaction);
            storage.saveGameState(gameState);
            
            // Check for mutual likes (matches)
            if (action === 'like' || action === 'super_like') {
                const mutualMatch = await this.checkForMutualMatch(userId, matchId);
                if (mutualMatch) {
                    await this.createMatch(userId, matchId);
                    return { success: true, mutualMatch: true, interaction };
                }
            }
            
            return { success: true, mutualMatch: false, interaction };
            
        } catch (error) {
            return Utils.handleError(error, 'handleMatchInteraction');
        }
    }

    async checkForMutualMatch(userId, matchId) {
        const gameState = storage.getGameState();
        const interactions = gameState.matchInteractions || [];
        
        // Check if the other user has liked this user
        return interactions.some(interaction => 
            interaction.userId === matchId && 
            interaction.matchId === userId && 
            (interaction.action === 'like' || interaction.action === 'super_like')
        );
    }

    async createMatch(userId1, userId2) {
        const gameState = storage.getGameState();
        if (!gameState.matches) gameState.matches = [];
        
        const match = {
            id: Utils.generateUniqueId(),
            users: [userId1, userId2],
            createdDate: new Date().toISOString(),
            status: 'active',
            lastActivity: new Date().toISOString(),
            messages: []
        };
        
        gameState.matches.push(match);
        storage.saveGameState(gameState);
        
        // Update statistics
        storage.updateStatistic('matchesMade', 1);
        
        return match;
    }

    // Dating activity suggestions
    generateDateIdeas(user1, user2, currentWorld) {
        const commonInterests = (user1.interests || []).filter(interest => 
            (user2.interests || []).includes(interest)
        );
        
        const dateIdeas = {
            paradise: [
                'Beach sunset walk',
                'Underwater exploration',
                'Tropical fruit tasting',
                'Beach volleyball match',
                'Sunset yacht cruise'
            ],
            'neon-city': [
                'Rooftop dining with city views',
                'Virtual reality arcade',
                'Neon light photography tour',
                'Cyberpunk fashion shopping',
                'High-tech cooking class'
            ],
            fantasy: [
                'Dragon riding adventure',
                'Magic potion brewing class',
                'Enchanted forest picnic',
                'Castle exploration',
                'Medieval feast'
            ],
            'space-station': [
                'Zero-gravity dancing',
                'Planet viewing from observation deck',
                'Space cuisine tasting',
                'Asteroid field exploration',
                'Holodeck romantic simulation'
            ]
        };
        
        const worldIdeas = dateIdeas[currentWorld] || dateIdeas.paradise;
        const suggestions = Utils.shuffleArray(worldIdeas).slice(0, 3);
        
        // Add interest-based suggestions
        if (commonInterests.includes('music')) {
            suggestions.push('Virtual concert experience');
        }
        if (commonInterests.includes('art')) {
            suggestions.push('Collaborative art creation');
        }
        if (commonInterests.includes('cooking')) {
            suggestions.push('Couples cooking challenge');
        }
        
        return suggestions;
    }

    // Advanced matching algorithms
    async findAdvancedMatches(userId, algorithm = 'standard') {
        const algorithms = {
            standard: this.standardMatching,
            personality: this.personalityBasedMatching,
            activity: this.activityBasedMatching,
            location: this.locationBasedMatching,
            ml: this.machineLearningMatching // Placeholder for future ML implementation
        };
        
        const matchingFunction = algorithms[algorithm] || algorithms.standard;
        return await matchingFunction.call(this, userId);
    }

    async personalityBasedMatching(userId) {
        const currentUser = await this.getCurrentUser(userId);
        const potentialMatches = await this.getPotentialMatches(currentUser, {
            ageRange: { min: 18, max: 99 },
            maxDistance: 100,
            excludeBlocked: true
        });
        
        // Focus heavily on personality compatibility
        const personalityWeights = {
            ...this.compatibilityWeights,
            personality: 0.5,
            interests: 0.3,
            age: 0.1,
            location: 0.05,
            activityLevel: 0.05
        };
        
        return potentialMatches.map(match => ({
            ...match,
            compatibility: this.calculatePersonalityCompatibility(
                currentUser.personality || [],
                match.personality || []
            )
        })).sort((a, b) => b.compatibility - a.compatibility);
    }

    // Placeholder for current user retrieval
    async getCurrentUser(userId) {
        // In real implementation, this would fetch from your backend
        const userData = storage.getUserData();
        const gameState = storage.getGameState();
        const avatarData = storage.getAvatarData();
        
        return {
            id: userId,
            ...userData,
            ...gameState,
            avatar: avatarData,
            currentLocation: gameState.currentLocation || { x: 0, y: 0, z: 0 }
        };
    }
}

// Export singleton instance
const matchingSystem = new MatchingSystem();
export default matchingSystem;