/**
 * HeartQuest - Main Babylon.js Integration
 * Connects 3D engine with HTML UI
 */

// Global variables
let avatarCreator = null;
let worldBuilder = null;
let cameraController = null;

/**
 * Initialize the entire 3D system
 */
async function initializeHeartQuest() {
    console.log('🚀 Initializing HeartQuest 3D System...');
    
    // Show loading screen
    showLoadingScreen();
    
    try {
        // Initialize scene manager
        const initialized = await window.sceneManager.initialize('renderCanvas');
        
        if (!initialized) {
            throw new Error('Failed to initialize scene manager');
        }
        
        const scene = window.sceneManager.getScene();
        const camera = window.sceneManager.getCamera();
        
        // Create avatar creator
        avatarCreator = new AvatarCreator(scene);
        const avatar = avatarCreator.createAvatar();
        avatarCreator.loadConfiguration();
        
        // Create world builder
        worldBuilder = new WorldBuilder(scene);
        worldBuilder.buildWorld('paradise'); // Default world
        
        // Create camera controller
        cameraController = new CameraController(camera, scene);
        cameraController.initialize();
        cameraController.setFollowTarget(avatar);
        
        // Hide loading screen
        hideLoadingScreen();
        
        console.log('✅ HeartQuest 3D System initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing HeartQuest:', error);
        alert('Failed to initialize 3D system. Please refresh the page.');
    }
}

/**
 * Avatar customization functions (called from HTML)
 */
function updateAvatarHeight() {
    const heightInput = document.getElementById('avatarHeight');
    const heightValue = document.getElementById('heightValue');
    if (heightInput && avatarCreator) {
        const height = parseFloat(heightInput.value);
        avatarCreator.updateHeight(height);
        if (heightValue) {
            heightValue.textContent = height.toFixed(2) + 'm';
        }
    }
}

function updateAvatarBuild() {
    const buildInput = document.getElementById('avatarBuild');
    const buildValue = document.getElementById('buildValue');
    if (buildInput && avatarCreator) {
        const build = parseFloat(buildInput.value);
        avatarCreator.updateBuild(build);
        if (buildValue) {
            const label = avatarCreator.getBuildLabel(build);
            buildValue.textContent = label;
        }
    }
}

function updateSkinColor() {
    const skinInput = document.getElementById('skinColor');
    if (skinInput && avatarCreator) {
        avatarCreator.updateSkinColor(skinInput.value);
    }
}

function updateHairColor() {
    const hairInput = document.getElementById('hairColor');
    if (hairInput && avatarCreator) {
        avatarCreator.updateHairColor(hairInput.value);
    }
}

function updateHairStyle() {
    const hairSelect = document.getElementById('hairStyle');
    if (hairSelect && avatarCreator) {
        avatarCreator.updateHairStyle(hairSelect.value);
    }
}

function updateClothing() {
    const clothingSelect = document.getElementById('clothingStyle');
    if (clothingSelect && avatarCreator) {
        avatarCreator.updateClothing(clothingSelect.value);
    }
}

function saveAvatar() {
    if (avatarCreator) {
        avatarCreator.saveConfiguration();
        showNotification('💾 Avatar saved successfully!');
    }
}

function randomizeAvatar() {
    if (avatarCreator) {
        avatarCreator.randomize();
        showNotification('🎲 Avatar randomized!');
    }
}

/**
 * World functions (called from HTML)
 */
function teleportToWorld(worldName) {
    if (worldBuilder) {
        worldBuilder.buildWorld(worldName);
        showNotification(`🌍 Teleported to ${getWorldDisplayName(worldName)}!`);
        
        // Update active world card
        document.querySelectorAll('.world-card').forEach(card => {
            card.classList.remove('active');
        });
        event.target.closest('.world-card')?.classList.add('active');
    }
}

function getWorldDisplayName(worldName) {
    const names = {
        'paradise': 'Paradise Island',
        'city': 'Neon City',
        'fantasy': 'Fantasy Kingdom',
        'space': 'Space Station',
        'underwater': 'Underwater City',
        'mountain': 'Mountain Peak'
    };
    return names[worldName] || worldName;
}

/**
 * Vehicle functions
 */
function spawnVehicle(vehicleType) {
    showNotification(`🚗 ${vehicleType.toUpperCase()} spawned! (Feature coming soon)`);
    console.log('Vehicle spawned:', vehicleType);
}

/**
 * Quest functions
 */
function startNewQuest() {
    showNotification('✨ New quest started! (Feature coming soon)');
    console.log('Starting new quest');
}

/**
 * Dating/Social functions
 */
function findMatches() {
    showNotification('🔍 Searching for matches... (Feature coming soon)');
    console.log('Finding matches');
}

function startVirtualDate() {
    showNotification('🌹 Starting virtual date... (Feature coming soon)');
    console.log('Starting virtual date');
}

function createFamily() {
    showNotification('👨‍👩‍👧‍👦 Family system coming soon!');
    console.log('Creating family');
}

/**
 * Mode switching (called from HTML)
 */
function switchMode(mode) {
    // Hide all panels
    document.querySelectorAll('.control-panel, .world-selector, .adventure-quest, .social-panel')
        .forEach(panel => {
            panel.style.display = 'none';
        });
    
    // Show selected panel
    const panelMap = {
        'avatar': 'avatarPanel',
        'world': 'worldPanel',
        'adventure': 'questPanel',
        'social': 'socialPanel'
    };
    
    const panelId = panelMap[mode];
    if (panelId) {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = 'block';
        }
    }
    
    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
}

/**
 * Chat functions
 */
function handleChatInput(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('chatInput');
        if (input && input.value.trim()) {
            const message = input.value.trim();
            addChatMessage('You', message);
            input.value = '';
            
            // Simulate response (replace with actual logic later)
            setTimeout(() => {
                const responses = [
                    "That's interesting!",
                    "I'd love to explore that with you!",
                    "Sounds like fun!",
                    "Let's do it!"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addChatMessage('AI Friend', randomResponse);
            }, 1000);
        }
    }
}

function addChatMessage(sender, message) {
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

/**
 * Info panel
 */
function hideInfoPanel() {
    const infoPanel = document.getElementById('infoPanel');
    if (infoPanel) {
        infoPanel.style.display = 'none';
    }
}

/**
 * Loading screen functions
 */
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        
        // Simulate loading progress
        let progress = 0;
        const progressBar = document.getElementById('loadingProgress');
        const statusText = document.getElementById('loadingStatus');
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            if (statusText) {
                if (progress < 30) {
                    statusText.textContent = 'Loading 3D engine...';
                } else if (progress < 60) {
                    statusText.textContent = 'Creating world...';
                } else if (progress < 90) {
                    statusText.textContent = 'Preparing avatar...';
                } else {
                    statusText.textContent = 'Almost ready...';
                }
            }
        }, 100);
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    }
}

/**
 * Show notification
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing HeartQuest...');
    initializeHeartQuest();
});

// Make functions globally accessible
window.updateAvatarHeight = updateAvatarHeight;
window.updateAvatarBuild = updateAvatarBuild;
window.updateSkinColor = updateSkinColor;
window.updateHairColor = updateHairColor;
window.updateHairStyle = updateHairStyle;
window.updateClothing = updateClothing;
window.saveAvatar = saveAvatar;
window.randomizeAvatar = randomizeAvatar;
window.teleportToWorld = teleportToWorld;
window.spawnVehicle = spawnVehicle;
window.startNewQuest = startNewQuest;
window.findMatches = findMatches;
window.startVirtualDate = startVirtualDate;
window.createFamily = createFamily;
window.switchMode = switchMode;
window.handleChatInput = handleChatInput;
window.hideInfoPanel = hideInfoPanel;

