// HeartQuest World System - 3D Environment Creation and Management

// Create world environments
function createWorld(worldType) {
    // Clear existing world objects (except avatar)
    const objectsToRemove = [];
    scene.traverse((child) => {
        if (child !== avatar && child.type === 'Mesh' && child.geometry) {
            objectsToRemove.push(child);
        }
    });
    objectsToRemove.forEach(obj => scene.remove(obj));

    switch(worldType) {
        case 'paradise':
            createParadiseIsland();
            break;
        case 'city':
            createNeonCity();
            break;
        case 'fantasy':
            createFantasyKingdom();
            break;
        case 'space':
            createSpaceStation();
            break;
        case 'underwater':
            createUnderwaterCity();
            break;
        case 'mountain':
            createMountainPeak();
            break;
    }
}

function createParadiseIsland() {
    scene.background = new THREE.Color(0x87CEEB);
    
    // Ground (sand)
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xF4E4BC });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Ocean
    const oceanGeometry = new THREE.PlaneGeometry(200, 200);
    const oceanMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x006994, 
        transparent: true, 
        opacity: 0.7 
    });
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.1;
    scene.add(ocean);

    // Palm trees
    for (let i = 0; i < 10; i++) {
        const palmGroup = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 3, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.castShadow = true;
        palmGroup.add(trunk);

        // Leaves
        const leafGeometry = new THREE.SphereGeometry(0.8, 8, 8);
        const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leafGeometry, leafMaterial);
        leaves.position.y = 3;
        leaves.scale.y = 0.3;
        palmGroup.add(leaves);

        palmGroup.position.x = (Math.random() - 0.5) * 80;
        palmGroup.position.z = (Math.random() - 0.5) * 80;
        palmGroup.rotation.y = Math.random() * Math.PI * 2;
        scene.add(palmGroup);
    }

    // Beach hut
    const hutGroup = new THREE.Group();
    const hutGeometry = new THREE.BoxGeometry(3, 2, 3);
    const hutMaterial = new THREE.MeshLambertMaterial({ color: 0xDEB887 });
    const hut = new THREE.Mesh(hutGeometry, hutMaterial);
    hut.position.y = 1;
    hut.castShadow = true;
    hutGroup.add(hut);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(2.5, 1, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.5;
    roof.rotation.y = Math.PI / 4;
    hutGroup.add(roof);

    hutGroup.position.set(10, 0, -10);
    scene.add(hutGroup);
}

function createNeonCity() {
    scene.background = new THREE.Color(0x000011);
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Buildings
    for (let i = 0; i < 20; i++) {
        const buildingHeight = Math.random() * 15 + 5;
        const buildingGeometry = new THREE.BoxGeometry(
            Math.random() * 3 + 1,
            buildingHeight,
            Math.random() * 3 + 1
        );
        
        const colors = [0xFF00FF, 0x00FFFF, 0xFF0080, 0x0080FF, 0x80FF00];
        const buildingMaterial = new THREE.MeshLambertMaterial({ 
            color: colors[Math.floor(Math.random() * colors.length)],
            emissive: colors[Math.floor(Math.random() * colors.length)],
            emissiveIntensity: 0.2
        });
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(
            (Math.random() - 0.5) * 60,
            buildingHeight / 2,
            (Math.random() - 0.5) * 60
        );
        building.castShadow = true;
        scene.add(building);
    }

    // Neon signs
    for (let i = 0; i < 15; i++) {
        const signGeometry = new THREE.PlaneGeometry(2, 1);
        const signMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF00FF,
            emissive: 0xFF00FF,
            emissiveIntensity: 0.5
        });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(
            (Math.random() - 0.5) * 50,
            Math.random() * 8 + 2,
            (Math.random() - 0.5) * 50
        );
        scene.add(sign);
    }
}

function createFantasyKingdom() {
    scene.background = new THREE.Color(0x4169E1);
    
    // Ground (grass)
    const groundGeometry = new THREE.PlaneGeometry(150, 150);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Castle
    const castleGroup = new THREE.Group();
    
    // Main tower
    const towerGeometry = new THREE.CylinderGeometry(2, 2.5, 8, 8);
    const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.y = 4;
    tower.castShadow = true;
    castleGroup.add(tower);

    // Tower roof
    const roofGeometry = new THREE.ConeGeometry(2.5, 2, 8);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 9;
    castleGroup.add(roof);

    // Walls
    for (let i = 0; i < 4; i++) {
        const wallGeometry = new THREE.BoxGeometry(6, 4, 1);
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.y = 2;
        
        if (i === 0) wall.position.z = 3;
        if (i === 1) wall.position.z = -3;
        if (i === 2) { wall.position.x = 3; wall.rotation.y = Math.PI / 2; }
        if (i === 3) { wall.position.x = -3; wall.rotation.y = Math.PI / 2; }
        
        wall.castShadow = true;
        castleGroup.add(wall);
    }

    castleGroup.position.set(0, 0, -20);
    scene.add(castleGroup);

    // Mystical trees
    for (let i = 0; i < 15; i++) {
        const treeGroup = new THREE.Group();
        
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 4, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x4B0082 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        const leavesGeometry = new THREE.SphereGeometry(1.5, 8, 8);
        const leavesMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFF1493,
            emissive: 0xFF1493,
            emissiveIntensity: 0.1
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 5;
        treeGroup.add(leaves);

        treeGroup.position.set(
            (Math.random() - 0.5) * 100,
            0,
            (Math.random() - 0.5) * 100
        );
        scene.add(treeGroup);
    }
}

function createSpaceStation() {
    scene.background = new THREE.Color(0x000000);
    
    // Add stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF });
    
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        starVertices.push((Math.random() - 0.5) * 2000);
        starVertices.push((Math.random() - 0.5) * 2000);
        starVertices.push((Math.random() - 0.5) * 2000);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Space station floor
    const floorGeometry = new THREE.CylinderGeometry(15, 15, 1, 16);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    scene.add(floor);

    // Station walls
    const wallGeometry = new THREE.CylinderGeometry(15, 15, 8, 16, 1, true);
    const wallMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x708090,
        transparent: true,
        opacity: 0.8
    });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 4;
    scene.add(walls);

    // Control panels
    for (let i = 0; i < 8; i++) {
        const panelGeometry = new THREE.BoxGeometry(2, 1.5, 0.2);
        const panelMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00FFFF,
            emissive: 0x00FFFF,
            emissiveIntensity: 0.3
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        
        const angle = (i / 8) * Math.PI * 2;
        panel.position.x = Math.cos(angle) * 13;
        panel.position.z = Math.sin(angle) * 13;
        panel.position.y = 2;
        panel.lookAt(new THREE.Vector3(0, 2, 0));
        scene.add(panel);
    }

    // Add floating planets in distance
    for (let i = 0; i < 5; i++) {
        const planetGeometry = new THREE.SphereGeometry(Math.random() * 3 + 1, 16, 16);
        const planetColors = [0xFF4500, 0x32CD32, 0x1E90FF, 0xFF69B4, 0xFFD700];
        const planetMaterial = new THREE.MeshLambertMaterial({ 
            color: planetColors[i],
            emissive: planetColors[i],
            emissiveIntensity: 0.2
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        planet.position.set(
            (Math.random() - 0.5) * 200,
            Math.random() * 50 + 20,
            (Math.random() - 0.5) * 200
        );
        scene.add(planet);
    }
}

function createUnderwaterCity() {
    scene.background = new THREE.Color(0x006994);
    
    // Ocean floor
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Underwater buildings (domes)
    for (let i = 0; i < 10; i++) {
        const domeGeometry = new THREE.SphereGeometry(Math.random() * 3 + 2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x40E0D0,
            transparent: true,
            opacity: 0.7
        });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.set(
            (Math.random() - 0.5) * 80,
            Math.random() * 2 + 2,
            (Math.random() - 0.5) * 80
        );
        dome.castShadow = true;
        scene.add(dome);
    }

    // Coral reefs
    for (let i = 0; i < 25; i++) {
        const coralGeometry = new THREE.ConeGeometry(
            Math.random() * 0.5 + 0.2,
            Math.random() * 3 + 1,
            6
        );
        const coralColors = [0xFF69B4, 0xFF1493, 0xFF4500, 0x32CD32, 0x9370DB];
        const coralMaterial = new THREE.MeshLambertMaterial({ 
            color: coralColors[Math.floor(Math.random() * coralColors.length)]
        });
        const coral = new THREE.Mesh(coralGeometry, coralMaterial);
        coral.position.set(
            (Math.random() - 0.5) * 100,
            Math.random() * 2 + 0.5,
            (Math.random() - 0.5) * 100
        );
        coral.rotation.z = (Math.random() - 0.5) * 0.5;
        scene.add(coral);
    }

    // Swimming fish (animated cubes for simplicity)
    for (let i = 0; i < 20; i++) {
        const fishGeometry = new THREE.BoxGeometry(0.5, 0.3, 1);
        const fishMaterial = new THREE.MeshLambertMaterial({ 
            color: Math.random() * 0xffffff
        });
        const fish = new THREE.Mesh(fishGeometry, fishMaterial);
        fish.position.set(
            (Math.random() - 0.5) * 100,
            Math.random() * 8 + 2,
            (Math.random() - 0.5) * 100
        );
        fish.userData = {
            speed: Math.random() * 0.02 + 0.01,
            direction: Math.random() * Math.PI * 2
        };
        scene.add(fish);
    }
}

function createMountainPeak() {
    scene.background = new THREE.Color(0x87CEEB);
    
    // Mountain base
    const mountainGeometry = new THREE.ConeGeometry(30, 25, 8);
    const mountainMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.y = 12.5;
    mountain.receiveShadow = true;
    scene.add(mountain);

    // Snow cap
    const snowGeometry = new THREE.ConeGeometry(10, 8, 8);
    const snowMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const snow = new THREE.Mesh(snowGeometry, snowMaterial);
    snow.position.y = 21;
    scene.add(snow);

    // Platform at peak
    const platformGeometry = new THREE.CylinderGeometry(5, 5, 1, 16);
    const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = 25.5;
    platform.receiveShadow = true;
    scene.add(platform);

    // Clouds around mountain
    for (let i = 0; i < 10; i++) {
        const cloudGeometry = new THREE.SphereGeometry(Math.random() * 3 + 2, 8, 8);
        const cloudMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.6
        });
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(
            (Math.random() - 0.5) * 60,
            Math.random() * 10 + 15,
            (Math.random() - 0.5) * 60
        );
        cloud.scale.x = Math.random() + 1;
        cloud.scale.z = Math.random() + 1;
        scene.add(cloud);
    }

    // Eagles flying around
    for (let i = 0; i < 5; i++) {
        const eagleGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.8);
        const eagleMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const eagle = new THREE.Mesh(eagleGeometry, eagleMaterial);
        eagle.position.set(
            (Math.random() - 0.5) * 40,
            Math.random() * 15 + 10,
            (Math.random() - 0.5) * 40
        );
        eagle.userData = {
            speed: Math.random() * 0.03 + 0.02,
            radius: Math.random() * 20 + 10,
            angle: Math.random() * Math.PI * 2
        };
        scene.add(eagle);
    }
}

// World functions
function teleportToWorld(worldType, evt) {
    currentWorld = worldType;
    createWorld(worldType);
    
    // Update active world card
    document.querySelectorAll('.world-card').forEach(card => {
        card.classList.remove('active');
    });
    if (evt && evt.target) {
        const card = evt.target.closest('.world-card');
        if (card) card.classList.add('active');
    }

    // Update stats
    const xp = parseInt(document.getElementById('xpStat').textContent.replace(',', ''));
    document.getElementById('xpStat').textContent = (xp + 25).toLocaleString();

    if (evt && evt.target) {
        const nameEl = evt.target.querySelector('.world-name') || evt.target.closest('.world-card')?.querySelector('.world-name');
        if (nameEl) {
            showNotification(`🌍 Welcome to ${nameEl.textContent}!`);
        }
    }
}
