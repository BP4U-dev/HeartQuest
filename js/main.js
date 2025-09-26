// HeartQuest Main Application - 3D Engine and Core Functionality

// Global variables
let scene, camera, renderer, avatar, currentWorld = 'paradise';
let gameStats = {
    level: 1,
    xp: 0,
    coins: 1000,
    friends: 0,
    matches: 0
};

let avatarSettings = {
    gender: 'male',
    height: 1.75,
    build: 50,
    skinColor: '#f4c2a1',
    hairStyle: 'short',
    hairColor: '#8b4513',
    clothingStyle: 'casual'
};

// Loading screen management
function initializeApp() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingStatus = document.getElementById('loadingStatus');
    
    const loadingSteps = [
        { text: 'Initializing 3D Engine...', progress: 20 },
        { text: 'Creating Virtual Worlds...', progress: 40 },
        { text: 'Loading Avatar System...', progress: 60 },
        { text: 'Setting up Dating Platform...', progress: 80 },
        { text: 'Welcome to HeartQuest!', progress: 100 }
    ];

    let currentStep = 0;
    const loadingInterval = setInterval(() => {
        if (currentStep < loadingSteps.length) {
            loadingStatus.textContent = loadingSteps[currentStep].text;
            loadingProgress.style.width = loadingSteps[currentStep].progress + '%';
            currentStep++;
        } else {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    init3DScene();
                }, 500);
            }, 1000);
        }
    }, 800);
}

// Initialize 3D scene
function init3DScene() {
    try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB);

        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 2, 5);

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('sceneContainer').appendChild(renderer.domElement);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        // Create avatar and world
        createAvatar();
        createWorld(currentWorld);
        addControls();
        
        // Initialize game systems
        initializeGameSystems();
        
        // Start render loop
        animate();
        
        console.log('3D Scene initialized successfully');
    } catch (error) {
        console.error('Error initializing 3D scene:', error);
        showNotification('Error loading 3D graphics. Some features may not work properly.');
    }
}

// Initialize game systems
function initializeGameSystems() {
    // Load saved data
    loadGameData();
    
    // Initialize authentication system
    if (typeof AuthManager !== 'undefined') {
        window.authManager = new AuthManager();
    }
    
    // Initialize chat system
    if (typeof ChatManager !== 'undefined') {
        window.chatManager = new ChatManager();
    }
    
    // Update UI with loaded stats
    updateStatsDisplay();
}

// Add camera controls
function addControls() {
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;
    let keys = {};
    
    // Mouse controls
    document.addEventListener('mousedown', (event) => {
        if (event.target.closest('.ui-overlay')) return;
        isMouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (!isMouseDown || event.target.closest('.ui-overlay')) return;
        
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        
        // Rotate camera around avatar
        const radius = 5;
        const theta = deltaX * 0.01;
        const phi = deltaY * 0.01;
        
        camera.position.x = avatar.position.x + radius * Math.sin(theta);
        camera.position.z = avatar.position.z + radius * Math.cos(theta);
        camera.position.y = Math.max(1, camera.position.y - phi);
        
        camera.lookAt(avatar.position);
        
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        // Prevent movement if user is typing in an input
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        keys[event.code] = true;
        
        const speed = 0.2;
        const avatarPos = avatar.position;
        
        switch(event.code) {
            case 'KeyW':
                avatarPos.z -= speed;
                break;
            case 'KeyS':
                avatarPos.z += speed;
                break;
            case 'KeyA':
                avatarPos.x -= speed;
                break;
            case 'KeyD':
                avatarPos.x += speed;
                break;
            case 'Space':
                event.preventDefault();
                // Simple jump
                if (avatarPos.y <= 0.1) {
                    avatarPos.y = 2;
                    setTimeout(() => {
                        if (avatar && avatarPos.y > 0) avatarPos.y = 0;
                    }, 500);
                }
                break;
        }
        
        // Update camera to follow avatar
        camera.position.x = avatarPos.x;
        camera.position.z = avatarPos.z + 5;
        camera.lookAt(avatarPos);
    });
    
    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });

    // Mouse wheel zoom
    document.addEventListener('wheel', (event) => {
        if (event.target.closest('.ui-overlay')) return;
        
        event.preventDefault();
        const zoomSpeed = 0.1;
        const newZ = camera.position.z + event.deltaY * zoomSpeed * 0.01;
        camera.position.z = Math.max(2, Math.min(10, newZ));
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    try {
        // Animate world-specific elements
        animateWorldElements();

        // Animate avatar breathing effect
        if (avatar) {
            avatar.rotation.y = Math.sin(Date.now() * 0.001) * 0.05;
            const baseY = avatar.position.y || 0;
            if (baseY <= 0.1) {
                avatar.position.y = Math.sin(Date.now() * 0.002) * 0.02;
            }
        }

        renderer.render(scene, camera);
    } catch (error) {
        console.error('Animation error:', error);
    }
}

// Animate world-specific elements
function animateWorldElements() {
    if (currentWorld === 'underwater') {
        // Animate fish
        scene.traverse((child) => {
            if (child.userData && child.userData.speed && child.userData.direction !== undefined) {
                child.userData.direction += (Math.random() - 0.5) * 0.1;
                child.position.x += Math.cos(child.userData.direction) * child.userData.speed;
                child.position.z += Math.sin(child.userData.direction) * child.userData.speed;
                child.rotation.y = child.userData.direction;
                
                // Keep fish in bounds
                if (Math.abs(child.position.x) > 50) child.userData.direction += Math.PI;
                if (Math.abs(child.position.z) > 50) child.userData.direction += Math.PI;
            }
        });
    }

    if (currentWorld === 'mountain') {
        // Animate eagles
        scene.traverse((child) => {
            if (child.userData && child.userData.radius && child.userData.angle !== undefined) {
                child.userData.angle += child.userData.speed;
                child.position.x = Math.cos(child.userData.angle) * child.userData.radius;
                child.position.z = Math.sin(child.userData.angle) * child.userData.radius;
                child.rotation.y = child.userData.angle + Math.PI / 2;
            }
        });
    }
}

// UI Functions
function switchMode(mode, evt) {
    // Hide all panels
    const panels = ['avatarPanel', 'worldPanel', 'datingPanel', 'socialPanel', 'questPanel'];
    panels.forEach(panelId => {
        const panel = document.getElementById(panelId);
        if (panel) panel.style.display = 'none';
    });

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (evt && evt.target) {
        evt.target.classList.add('active');
    } else {
        // Find the nav item by text content
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.textContent.toLowerCase().includes(mode)) {
                item.classList.add('active');
            }
        });
    }

    // Show selected panel
    let panelToShow = null;
    switch(mode) {
        case 'avatar':
            panelToShow = 'avatarPanel';
            break;
        case 'world':
            panelToShow = 'worldPanel';
            break;
        case 'dating':
            panelToShow = 'datingPanel';
            loadMatches();
            break;
        case 'social':
            panelToShow = 'socialPanel';
            break;
        case 'adventure':
            panelToShow = 'questPanel';
            break;
        case 'home':
            showHomeBuilder();
            return;
    }
    
    if (panelToShow) {
        const panel = document.getElementById(panelToShow);
        if (panel) panel.style.display = 'block';
    }
}

// Social functions
function findMatches() {
    const matches = [
        { name: 'Emma', age: 24, interests: 'Adventure, Fantasy worlds', world: 'Fantasy Kingdom' },
        { name: 'Alex', age: 27, interests: 'Space exploration, Gaming', world: 'Space Station' },
        { name: 'Jordan', age: 25, interests: 'Ocean diving, Marine life', world: 'Underwater City' },
        { name: 'Sam', age: 26, interests: 'Mountain climbing, Nature', world: 'Mountain Peak' },
        { name: 'Riley', age: 23, interests: 'City life, Neon aesthetics', world: 'Neon City' }
    ];

    const randomMatch = matches[Math.floor(Math.random() * matches.length)];
    
    showNotification(`💕 New Match Found!\n${randomMatch.name}, ${randomMatch.age}\nInterests: ${randomMatch.interests}\nCurrently in: ${randomMatch.world}`);
    
    updateStats('matches', 1);
    updateStats('friends', 1);
}

function startVirtualDate() {
    const dateLocations = [
        '🏖️ Sunset beach walk on Paradise Island',
        '🏙️ Rooftop dinner in Neon City',
        '🏰 Royal ball in Fantasy Kingdom',
        '🌌 Stargazing at Space Station',
        '🐠 Underwater garden tour',
        '🏔️ Mountain peak picnic with eagles'
    ];

    const randomDate = dateLocations[Math.floor(Math.random() * dateLocations.length)];
    showFloatingUI('Virtual Date Started!', `You're going on a ${randomDate}. Have fun exploring together! 💕`);
    
    updateStats('xp', 200);
}

function createFamily() {
    showFloatingUI('Family Planning', 'Build a virtual family with your partner! Choose your dream home, plan your future together, and create lasting memories in the metaverse. 👨‍👩‍👧‍👦✨');
}

function startNewQuest() {
    const quests = [
        '🏴‍☠️ Find the pirate treasure on Paradise Island',
        '🤖 Debug the central computer in Space Station',
        '🐉 Tame a wild dragon in Fantasy Kingdom',
        '🏗️ Build the tallest skyscraper in Neon City',
        '🔱 Discover Atlantis ruins underwater',
        '⛰️ Reach the summit before sunrise'
    ];

    const randomQuest = quests[Math.floor(Math.random() * quests.length)];
    showNotification(`⚔️ New Quest Available!\n${randomQuest}\n\nReward: 500 XP + Special Item`);
    
    updateStats('xp', 500);
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        const message = event.target.value.trim();
        if (message) {
            const chatContainer = document.getElementById('chatContainer');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message';
            messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
            chatContainer.appendChild(messageDiv);
            
            event.target.value = '';
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // Auto-reply after a delay
            setTimeout(() => {
                const replies = [
                    'That sounds amazing! 😊',
                    'I love exploring new worlds too! 🌍',
                    'Want to meet up at the Fantasy Castle? 🏰',
                    'Your avatar looks incredible! ✨',
                    'Ready for our next adventure? 🚀'
                ];
                
                const randomReply = replies[Math.floor(Math.random() * replies.length)];
                const replyDiv = document.createElement('div');
                replyDiv.className = 'chat-message';
                replyDiv.innerHTML = `<strong>Sarah:</strong> ${randomReply}`;
                chatContainer.appendChild(replyDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 1500);
        }
    }
}

function showHomeBuilder() {
    showFloatingUI('🏠 Dream Home Builder', 'Design your perfect virtual home! Choose from thousands of furniture items, customize every detail, and invite friends over for house parties. Coming in the full version! 🎉');
}

// Load matches for dating panel
function loadMatches() {
    const matchesContainer = document.getElementById('matchesContainer');
    if (!matchesContainer) return;
    
    const matches = [
        { name: 'Emma', age: 24, avatar: '👩', interests: 'Adventure, Fantasy worlds', compatibility: 87 },
        { name: 'Alex', age: 27, avatar: '👨', interests: 'Space exploration, Gaming', compatibility: 92 },
        { name: 'Jordan', age: 25, avatar: '🧑', interests: 'Ocean diving, Marine life', compatibility: 76 }
    ];
    
    matchesContainer.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="match-avatar">${match.avatar}</div>
            <div class="match-name">${match.name}, ${match.age}</div>
            <div class="match-details">${match.interests}</div>
            <div class="compatibility-bar">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${match.compatibility}%;"></div>
                </div>
                <small>${match.compatibility}% Compatible</small>
            </div>
            <div class="match-actions">
                <button class="btn-pass" onclick="passMatch('${match.name}')">❌ Pass</button>
                <button class="btn-like" onclick="likeMatch('${match.name}')">💖 Like</button>
            </div>
        </div>
    `).join('');
}

function findNewMatches() {
    showNotification('🔍 Searching for new matches...');
    setTimeout(() => {
        loadMatches();
        showNotification('✨ New matches found!');
    }, 1500);
}

function likeMatch(name) {
    showNotification(`💖 You liked ${name}! Waiting for their response...`);
    updateStats('matches', 1);
    
    // Simulate match after delay
    setTimeout(() => {
        if (Math.random() > 0.5) {
            showNotification(`🎉 It's a match with ${name}! Start chatting now!`);
            updateStats('friends', 1);
        } else {
            showNotification(`${name} is thinking about it...`);
        }
    }, 3000);
}

function passMatch(name) {
    showNotification(`👋 Passed on ${name}`);
    loadMatches(); // Reload with new matches
}

// Stats management
function updateStats(stat, value) {
    gameStats[stat] = Math.max(0, gameStats[stat] + value);
    
    // Level up logic
    if (stat === 'xp') {
        const newLevel = Math.floor(gameStats.xp / 1000) + 1;
        if (newLevel > gameStats.level) {
            gameStats.level = newLevel;
            gameStats.coins += 500; // Bonus coins for leveling up
            showNotification(`🎉 Level Up! You are now level ${gameStats.level}!\n+500 V-Coins bonus!`);
        }
    }
    
    updateStatsDisplay();
    saveGameData();
}

function updateStatsDisplay() {
    const elements = {
        levelStat: gameStats.level,
        xpStat: gameStats.xp.toLocaleString(),
        coinsStat: gameStats.coins.toLocaleString(),
        friendsStat: gameStats.friends,
        matchesStat: gameStats.matches
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Data persistence
function saveGameData() {
    try {
        const saveData = {
            gameStats,
            avatarSettings,
            currentWorld,
            timestamp: Date.now()
        };
        localStorage.setItem('heartquest_save', JSON.stringify(saveData));
    } catch (error) {
        console.error('Error saving game data:', error);
    }
}

function loadGameData() {
    try {
        const saveData = localStorage.getItem('heartquest_save');
        if (saveData) {
            const parsed = JSON.parse(saveData);
            gameStats = { ...gameStats, ...parsed.gameStats };
            avatarSettings = { ...avatarSettings, ...parsed.avatarSettings };
            currentWorld = parsed.currentWorld || 'paradise';
            
            // Update UI with loaded avatar settings
            updateAvatarUI();
        }
    } catch (error) {
        console.error('Error loading game data:', error);
    }
}

function updateAvatarUI() {
    const elements = {
        'avatarGender': avatarSettings.gender,
        'avatarHeight': avatarSettings.height,
        'avatarBuild': avatarSettings.build,
        'skinColor': avatarSettings.skinColor,
        'hairStyle': avatarSettings.hairStyle,
        'hairColor': avatarSettings.hairColor,
        'clothingStyle': avatarSettings.clothingStyle
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
            if (id === 'avatarHeight') {
                document.getElementById('heightValue').textContent = value + 'm';
            }
            if (id === 'avatarBuild') {
                const buildTypes = ['Slim', 'Athletic', 'Muscular'];
                const buildIndex = Math.floor(value / 34);
                document.getElementById('buildValue').textContent = buildTypes[buildIndex] || 'Athletic';
            }
        }
    });
}

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function showFloatingUI(title, content) {
    const existingUI = document.querySelector('.floating-ui');
    if (existingUI) existingUI.remove();
    
    const floatingUI = document.createElement('div');
    floatingUI.className = 'floating-ui';
    floatingUI.innerHTML = `
        <h2 style="margin-bottom: 15px; color: #CD5C5C;">${title}</h2>
        <p style="margin-bottom: 20px; line-height: 1.6;">${content}</p>
        <button class="btn btn-primary" onclick="this.parentElement.remove()">Got it!</button>
    `;
    document.body.appendChild(floatingUI);
}

function hideInfoPanel() {
    const infoPanel = document.getElementById('infoPanel');
    if (infoPanel) {
        infoPanel.style.opacity = '0';
        setTimeout(() => {
            infoPanel.style.display = 'none';
        }, 500);
    }
}

// Authentication helpers
function showLogin() {
    if (window.authManager) {
        window.authManager.showLogin();
    } else {
        showNotification('Authentication system loading...');
    }
}

function showRegister() {
    if (window.authManager) {
        window.authManager.showRegister();
    } else {
        showNotification('Authentication system loading...');
    }
}

// Window resize handler
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Initialize the application
window.addEventListener('load', () => {
    initializeApp();
});

// Error handling for unhandled errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showNotification('An unexpected error occurred. Please refresh the page.');
});

// Export functions for other modules
window.HeartQuest = {
    updateStats,
    showNotification,
    gameStats,
    avatarSettings,
    currentWorld,
    scene,
    camera,
    renderer,
    avatar
};