// HeartQuest Main Application - 3D Engine and Core Functionality

// Global variables
let scene, camera, renderer, avatar, currentWorld = 'paradise';
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
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue

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

    // Create avatar
    createAvatar();
    
    // Create world environment
    createWorld(currentWorld);
    
    // Add controls
    addControls();
    
    // Start render loop
    animate();
}

// Add camera controls
function addControls() {
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (!isMouseDown) return;
        
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        
        camera.position.x += deltaX * 0.01;
        camera.position.y -= deltaY * 0.01;
        
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        const speed = 0.5;
        switch(event.code) {
            case 'KeyW':
                camera.position.z -= speed;
                if (avatar) avatar.position.z -= speed;
                break;
            case 'KeyS':
                camera.position.z += speed;
                if (avatar) avatar.position.z += speed;
                break;
            case 'KeyA':
                camera.position.x -= speed;
                if (avatar) avatar.position.x -= speed;
                break;
            case 'KeyD':
                camera.position.x += speed;
                if (avatar) avatar.position.x += speed;
                break;
            case 'Space':
                event.preventDefault();
                camera.position.y += speed;
                if (avatar) avatar.position.y += speed * 0.5;
                break;
        }
    });

    // Mouse wheel zoom
    document.addEventListener('wheel', (event) => {
        event.preventDefault();
        const zoomSpeed = 0.1;
        camera.position.z += event.deltaY * zoomSpeed * 0.01;
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Animate fish in underwater world
    if (currentWorld === 'underwater') {
        scene.traverse((child) => {
            if (child.userData && child.userData.speed) {
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

    // Animate eagles in mountain world
    if (currentWorld === 'mountain') {
        scene.traverse((child) => {
            if (child.userData && child.userData.radius) {
                child.userData.angle += child.userData.speed;
                child.position.x = Math.cos(child.userData.angle) * child.userData.radius;
                child.position.z = Math.sin(child.userData.angle) * child.userData.radius;
                child.rotation.y = child.userData.angle + Math.PI / 2;
            }
        });
    }

    // Rotate avatar slightly for breathing effect
    if (avatar) {
        avatar.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        avatar.position.y = Math.sin(Date.now() * 0.002) * 0.05;
    }

    // Make camera follow avatar
    if (avatar) {
        camera.position.x = avatar.position.x;
        camera.position.z = avatar.position.z + 5;
        camera.lookAt(avatar.position);
    }

    renderer.render(scene, camera);
}

// UI Functions
function switchMode(mode, evt) {
    // Hide all panels
    document.getElementById('avatarPanel').style.display = 'none';
    document.getElementById('worldPanel').style.display = 'none';
    document.getElementById('socialPanel').style.display = 'none';
    document.getElementById('questPanel').style.display = 'none';

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (evt && evt.target) {
        evt.target.classList.add('active');
    }

    // Show selected panel
    switch(mode) {
        case 'avatar':
            document.getElementById('avatarPanel').style.display = 'block';
            break;
        case 'world':
            document.getElementById('worldPanel').style.display = 'block';
            break;
        case 'dating':
        case 'social':
            document.getElementById('socialPanel').style.display = 'block';
            break;
        case 'adventure':
            document.getElementById('questPanel').style.display = 'block';
            break;
        case 'home':
            showHomeBuilder();
            break;
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
    
    // Update stats
    const currentMatches = parseInt(document.getElementById('matchesStat').textContent);
    document.getElementById('matchesStat').textContent = currentMatches + 1;
    
    const friends = parseInt(document.getElementById('friendsStat').textContent);
    document.getElementById('friendsStat').textContent = friends + 1;
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
    
    // Update stats
    const dateCount = parseInt(document.getElementById('dateCount') ? document.getElementById('dateCount').textContent : '0');
    // Note: dateCount element doesn't exist in this version, but keeping for consistency
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
    
    // Update XP
    const xp = parseInt(document.getElementById('xpStat').textContent.replace(',', ''));
    document.getElementById('xpStat').textContent = (xp + 500).toLocaleString();
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

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 20px;
        border-radius: 15px;
        border: 2px solid #4ecdc4;
        max-width: 300px;
        z-index: 1000;
        backdrop-filter: blur(15px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showFloatingUI(title, content) {
    const existingUI = document.querySelector('.floating-ui');
    if (existingUI) existingUI.remove();
    
    const floatingUI = document.createElement('div');
    floatingUI.className = 'floating-ui';
    floatingUI.innerHTML = `
        <h2 style="margin-bottom: 15px; color: #4ecdc4;">${title}</h2>
        <p style="margin-bottom: 20px; line-height: 1.6;">${content}</p>
        <button class="btn btn-primary" onclick="this.parentElement.remove()">Got it!</button>
    `;
    document.body.appendChild(floatingUI);
}

function hideInfoPanel() {
    document.getElementById('infoPanel').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('infoPanel').style.display = 'none';
    }, 500);
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
