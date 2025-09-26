// HeartQuest - Utilities
(function(){
    const Utils = {
        qs(sel, root=document){ return root.querySelector(sel); },
        qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); },
        on(el, ev, fn, opts){ el && el.addEventListener && el.addEventListener(ev, fn, opts); },
        off(el, ev, fn, opts){ el && el.removeEventListener && el.removeEventListener(ev, fn, opts); },
        debounce(fn, wait=200){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; },
        uuid(){ return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16)}); },
        fmt(n){ try{ return Number(n).toLocaleString(); } catch(e){ return n; } },
        tryJSON(str, def=null){ try{ return JSON.parse(str); } catch(e){ return def; } },
        clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
    };

    // PWA: register service worker if present
    (function registerSW(){
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function(){
                navigator.serviceWorker.register('/service-worker.js').catch(()=>{});
            });
        }
    })();

    window.Utils = Utils;
})();

// utils.js - Common Utility Functions
// Helper functions, validators, formatters, and shared utilities

class Utils {
    // Validation utilities
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateUsername(username) {
        // 3-20 characters, alphanumeric and underscore only
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    static validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    static validateAge(age) {
        return age >= 18 && age <= 120;
    }

    // String utilities
    static capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    static capitalizeWords(str) {
        if (!str) return '';
        return str.split(' ').map(word => this.capitalizeFirst(word)).join(' ');
    }

    static truncateText(text, maxLength, suffix = '...') {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    }

    static generateUsername(firstName, lastName) {
        const base = (firstName + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
        const random = Math.floor(Math.random() * 999) + 1;
        return base + random;
    }

    // Number utilities
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Date and time utilities
    static formatDate(date) {
        if (!(date instanceof Date)) date = new Date(date);
        return date.toLocaleDateString();
    }

    static formatTime(date) {
        if (!(date instanceof Date)) date = new Date(date);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    static formatDateTime(date) {
        if (!(date instanceof Date)) date = new Date(date);
        return `${this.formatDate(date)} ${this.formatTime(date)}`;
    }

    static timeAgo(date) {
        if (!(date instanceof Date)) date = new Date(date);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (let interval in intervals) {
            const count = Math.floor(seconds / intervals[interval]);
            if (count >= 1) {
                return `${count} ${interval}${count !== 1 ? 's' : ''} ago`;
            }
        }

        return 'Just now';
    }

    static isToday(date) {
        if (!(date instanceof Date)) date = new Date(date);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    // Color utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }

    static getContrastColor(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        if (!rgb) return '#000000';
        
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }

    // Array utilities
    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    static getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static removeDuplicates(array, key = null) {
        if (key) {
            return array.filter((item, index, arr) => 
                arr.findIndex(i => i[key] === item[key]) === index
            );
        }
        return [...new Set(array)];
    }

    // Object utilities
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        Object.keys(obj).forEach(key => {
            cloned[key] = this.deepClone(obj[key]);
        });
        return cloned;
    }

    static merge(target, source) {
        const result = { ...target };
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.merge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        });
        return result;
    }

    static isEmpty(obj) {
        if (obj === null || obj === undefined) return true;
        if (Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        if (typeof obj === 'string') return obj.trim().length === 0;
        return false;
    }

    // DOM utilities
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'innerHTML') {
                element.innerHTML = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    }

    static addEventListeners(element, events) {
        Object.keys(events).forEach(event => {
            element.addEventListener(event, events[event]);
        });
    }

    static removeEventListeners(element, events) {
        Object.keys(events).forEach(event => {
            element.removeEventListener(event, events[event]);
        });
    }

    // Animation utilities
    static animateValue(start, end, duration, callback, easing = 'linear') {
        const startTime = performance.now();
        const change = end - start;

        const easingFunctions = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };

        const easingFunction = easingFunctions[easing] || easingFunctions.linear;

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFunction(progress);
            const currentValue = start + change * easedProgress;

            callback(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    // Local storage utilities
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to storage:', error);
            return false;
        }
    }

    static loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Failed to load from storage:', error);
            return defaultValue;
        }
    }

    // URL and query parameter utilities
    static getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    static setUrlParameter(name, value) {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    }

    static removeUrlParameter(name) {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.pushState({}, '', url);
    }

    // Device detection
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isTablet() {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    }

    static isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }

    static getTouchSupport() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Performance utilities
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function executedFunction(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Image utilities
    static loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    static resizeImage(file, maxWidth, maxHeight, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    // Game-specific utilities
    static calculateCompatibility(user1, user2) {
        let score = 0;
        const maxScore = 100;

        // Age compatibility (20 points max)
        const ageDiff = Math.abs(user1.age - user2.age);
        score += Math.max(0, 20 - ageDiff * 2);

        // Interest compatibility (30 points max)
        if (user1.interests && user2.interests) {
            const commonInterests = user1.interests.filter(interest => 
                user2.interests.includes(interest)
            ).length;
            const totalInterests = new Set([...user1.interests, ...user2.interests]).size;
            score += (commonInterests / totalInterests) * 30;
        }

        // Location compatibility (20 points max)
        if (user1.location && user2.location) {
            const distance = this.calculateDistance(user1.location, user2.location);
            score += Math.max(0, 20 - distance / 10); // Reduce score based on distance
        }

        // Activity level compatibility (15 points max)
        if (user1.activityLevel && user2.activityLevel) {
            const activityDiff = Math.abs(user1.activityLevel - user2.activityLevel);
            score += Math.max(0, 15 - activityDiff * 3);
        }

        // Random factor (15 points max)
        score += Math.random() * 15;

        return Math.min(Math.round(score), maxScore);
    }

    static calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    static generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static formatCurrency(amount, currency = 'coins') {
        const formatted = this.formatNumber(amount);
        const symbols = {
            coins: '🪙',
            gems: '💎',
            hearts: '❤️',
            dollars: '$'
        };
        return `${symbols[currency] || ''} ${formatted}`;
    }

    // Error handling
    static handleError(error, context = '') {
        console.error(`Error ${context}:`, error);
        
        // You might want to send this to an error tracking service
        // ErrorTracker.log(error, context);
        
        return {
            success: false,
            error: error.message || 'An unknown error occurred',
            context
        };
    }

    static createSuccessResponse(data = null, message = 'Success') {
        return {
            success: true,
            data,
            message
        };
    }

    // Network utilities
    static async fetchWithTimeout(url, options = {}, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    static isOnline() {
        return navigator.onLine;
    }
}

export default Utils;