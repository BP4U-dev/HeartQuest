// HeartQuest Avatar System - Enhanced 3D Avatar Creation and Customization

// Create 3D avatar
function createAvatar() {
    const avatarGroup = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const headMaterial = new THREE.MeshLambertMaterial({ color: avatarSettings.skinColor });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;
    head.castShadow = true;
    avatarGroup.add(head);

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.8, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 }); // Royal Blue shirt
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.2;
    body.castShadow = true;
    avatarGroup.add(body);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.6, 8);
    const armMaterial = new THREE.MeshLambertMaterial({ color: avatarSettings.skinColor });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.3, 1.2, 0);
    leftArm.castShadow = true;
    avatarGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.3, 1.2, 0);
    rightArm.castShadow = true;
    avatarGroup.add(rightArm);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 8);
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0x000080 }); // Navy pants
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.1, 0.4, 0);
    leftLeg.castShadow = true;
    avatarGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.1, 0.4, 0);
    rightLeg.castShadow = true;
    avatarGroup.add(rightLeg);

    // Hair
    if (avatarSettings.hairStyle !== 'bald') {
        const hairGeometry = new THREE.SphereGeometry(0.18, 16, 16);
        const hairMaterial = new THREE.MeshLambertMaterial({ color: avatarSettings.hairColor });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 1.75;
        avatarGroup.add(hair);
    }

    // Scale based on height
    const heightScale = avatarSettings.height / 1.75;
    avatarGroup.scale.set(heightScale, heightScale, heightScale);

    avatar = avatarGroup;
    scene.add(avatar);
}

// Avatar customization functions
function updateAvatar() {
    avatarSettings.gender = document.getElementById('avatarGender').value;
    if (avatar) {
        scene.remove(avatar);
        createAvatar();
    }
}

function updateAvatarHeight() {
    const height = document.getElementById('avatarHeight').value;
    avatarSettings.height = parseFloat(height);
    document.getElementById('heightValue').textContent = height + 'm';
    
    if (avatar) {
        scene.remove(avatar);
        createAvatar();
    }
}

function updateAvatarBuild() {
    const build = document.getElementById('avatarBuild').value;
    avatarSettings.build = parseInt(build);
    
    const buildTypes = ['Slim', 'Athletic', 'Muscular'];
    const buildIndex = Math.floor(build / 34);
    document.getElementById('buildValue').textContent = buildTypes[buildIndex] || 'Athletic';
    
    if (avatar) {
        scene.remove(avatar);
        createAvatar();
    }
}

function updateSkinColor() {
    avatarSettings.skinColor = document.getElementById('skinColor').value;
    if (avatar) {
        scene.remove(avatar);
        createAvatar();
    }
}

function updateHairStyle() {
    avatarSettings.hairStyle = document.getElementById('hairStyle').value;
    if (avatar) {
        scene.remove(avatar);
        createAvatar();
    }
}

function updateHairColor() {
    avatarSettings.hairColor = document.getElementById('hairColor').value;
    if (avatar) {
        scene.remove(avatar);
        createAvatar();
    }
}

function updateClothing() {
    avatarSettings.clothingStyle = document.getElementById('clothingStyle').value;
    if (avatar) {
        scene.remove(avatar);
        createAvatar();
    }
}

function saveAvatar() {
    const avatarData = JSON.stringify(avatarSettings);
    // In a real app, this would save to a database
    alert('✅ Avatar saved successfully! In the full version, this will save to your profile.');
    
    // Update stats
    const xp = parseInt(document.getElementById('xpStat').textContent.replace(',', ''));
    document.getElementById('xpStat').textContent = (xp + 100).toLocaleString();
}

function randomizeAvatar() {
    // Randomize all avatar settings
    const genders = ['male', 'female', 'non-binary'];
    const hairStyles = ['short', 'medium', 'long', 'curly', 'braids'];
    const clothingStyles = ['casual', 'formal', 'sporty', 'gothic', 'fantasy', 'futuristic'];
    
    avatarSettings.gender = genders[Math.floor(Math.random() * genders.length)];
    avatarSettings.height = Math.random() * 0.5 + 1.5; // 1.5-2.0m
    avatarSettings.build = Math.random() * 100;
    avatarSettings.skinColor = `hsl(${Math.random() * 60 + 20}, ${Math.random() * 30 + 40}%, ${Math.random() * 30 + 40}%)`;
    avatarSettings.hairStyle = hairStyles[Math.floor(Math.random() * hairStyles.length)];
    avatarSettings.hairColor = `hsl(${Math.random() * 360}, ${Math.random() * 50 + 50}%, ${Math.random() * 40 + 20}%)`;
    avatarSettings.clothingStyle = clothingStyles[Math.floor(Math.random() * clothingStyles.length)];

    // Update UI elements
    document.getElementById('avatarGender').value = avatarSettings.gender;
    document.getElementById('avatarHeight').value = avatarSettings.height;
    document.getElementById('avatarBuild').value = avatarSettings.build;
    document.getElementById('skinColor').value = avatarSettings.skinColor;
    document.getElementById('hairStyle').value = avatarSettings.hairStyle;
    document.getElementById('hairColor').value = avatarSettings.hairColor;
    document.getElementById('clothingStyle').value = avatarSettings.clothingStyle;

    updateAvatarHeight();
    updateAvatarBuild();

    if (avatar) {
        scene.remove(avatar);
        createAvatar();
    }
}