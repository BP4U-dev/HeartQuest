// HeartQuest World System - 3D Environment Creation and Management

// Create world environments
function createWorld(worldType) {
    try {
        // Clear existing world objects (except avatar and lights)
        const objectsToRemove = [];
        scene.traverse((child) => {
            if (child !== window.avatar && 
                child.type === 'Mesh' && 
                child.geometry && 
                !child.isLight) {
                objectsToRemove.push(child);
            }
        });
        objectsToRemove.forEach(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(mat => mat.dispose());
                } else {
                    obj.material.dispose();
                }
            }
            scene.remove(obj);
        });

        // Set current world
        window.currentWorld = worldType;

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
            default:
                createParadiseIsland();
        }
        
        console.log(`World '${worldType}' created successfully`);
    } catch (error) {
        console.error('Error creating world:', error);
        if (window.HeartQuest && window.HeartQuest.showNotification) {
            window.HeartQuest.showNotification(`❌ Error loading ${worldType} world`);
        }
    }
}

function createParadiseIsland() {
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    
    // Ground (sand)
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xF4E4BC });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.userData = { type: 'ground' };
    scene.add(ground);

    // Ocean with wave animation
    const oceanGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const oceanMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x006994, 
        transparent: true, 
        opacity: 0.7,
        wireframe: false
    });
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.1;
    ocean.userData = { type: 'ocean', animated: true };
    scene.add(ocean);

    // Palm trees with variety
    const palmTypes = [
        { trunkColor: 0x8B4513, leafColor: 0x228B22 },
        { trunkColor: 0x654321, leafColor: 0x32CD32 },
        { trunkColor: 0x8B7355, leafColor: 0x00FF00 }
    ];
    
    for (let i = 0; i < 15; i++) {
        const palmGroup = new THREE.Group();
        const palmType = palmTypes[Math.floor(Math.random() * palmTypes.length)];
        
        // Trunk with slight curve
        const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 3 + Math.random(), 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: palmType.trunkColor });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1.5;
        trunk.rotation.z = (Math.random() - 0.5) * 0.2; // Slight lean
        trunk.castShadow = true;
        palmGroup.add(trunk);

        // Palm fronds
        for (let j = 0; j < 6; j++) {
            const frondGeometry = new THREE.ConeGeometry(0.1, 1.5 + Math.random() * 0.5, 4);
            const frondMaterial = new THREE.MeshLambertMaterial({ color: palmType.leafColor });
            const frond = new THREE.Mesh(frondGeometry, frondMaterial);
            frond.position.y = 3 + Math.random() * 0.3;
            frond.rotation.z = (j / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
            frond.rotation.x = Math.PI / 6 + (Math.random() - 0.5) * 0.3;
            palmGroup.add(frond);
        }

        palmGroup.position.x = (Math.random() - 0.5) * 90;
        palmGroup.position.z = (Math.random() - 0.5) * 90;
        palmGroup.rotation.y = Math.random() * Math.PI * 2;
        palmGroup.userData = { type: 'palm_tree', sway: Math.random() * 0.02 + 0.01 };
        scene.add(palmGroup);
    }

    // Beach hut with details
    const hutGroup = new THREE.Group();
    const hutGeometry = new THREE.BoxGeometry(3, 2, 3);
    const hutMaterial = new THREE.MeshLambertMaterial({ color: 0xDEB887 });
    const hut = new THREE.Mesh(hutGeometry, hutMaterial);
    hut.position.y = 1;
    hut.castShadow = true;
    hutGroup.add(hut);

    // Thatched roof
    const roofGeometry = new THREE.ConeGeometry(2.5, 1, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.5;
    roof.rotation.y = Math.PI / 4;
    hutGroup.add(roof);

    // Door
    const doorGeometry = new THREE.BoxGeometry(0.8, 1.5, 0.1);
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.75, 1.55);
    hutGroup.add(door);

    hutGroup.position.set(10, 0, -10);
    hutGroup.userData = { type: 'beach_hut' };
    scene.add(hutGroup);

    // Seashells and decorations
    for (let i = 0; i < 20; i++) {
        const shellGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 6, 6);
        const shellMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.1, 0.8, 0.7) 
        });
        const shell = new THREE.Mesh(shellGeometry, shellMaterial);
        shell.position.set(
            (Math.random() - 0.5) * 80,
            0.05,
            (Math.random() - 0.5) * 80
        );
        shell.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        shell.userData = { type: 'decoration' };
        scene.add(shell);
    }
}

function createNeonCity() {
    scene.background = new THREE.Color(0x000011); // Dark night sky
    
    // Ground with grid pattern
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Buildings with variety
    const buildingTypes = [
        { width: 2, depth: 2, minHeight: 8, maxHeight: 25 },
        { width: 3, depth: 1.5, minHeight: 5, maxHeight: 15 },
        { width: 1.5, depth: 3, minHeight: 10, maxHeight: 30 }
    ];
    
    for (let i = 0; i < 30; i++) {
        const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        const buildingHeight = Math.random() * (buildingType.maxHeight - buildingType.minHeight) + buildingType.minHeight;
        
        const buildingGeometry = new THREE.BoxGeometry(
            buildingType.width + Math.random() * 0.5,
            buildingHeight,
            buildingType.depth + Math.random() * 0.5
        );
        
        // Neon colors
        const neonColors = [0xFF00FF, 0x00FFFF, 0xFF0080, 0x0080FF, 0x80FF00, 0xFF8000];
        const baseColor = neonColors[Math.floor(Math.random() * neonColors.length)];
        
        const buildingMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x222222,
            emissive: baseColor,
            emissiveIntensity: 0.1
        });
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(
            (Math.random() - 0.5) * 60,
            buildingHeight / 2,
            (Math.random() - 0.5) * 60
        );
        building.castShadow = true;
        building.userData = { type: 'building', glowColor: baseColor };
        scene.add(building);

        // Add windows
        for (let floor = 0; floor < Math.floor(buildingHeight / 2); floor++) {
            for (let window = 0; window < 3; window++) {
                if (Math.random() > 0.3) { // Not all windows are lit
                    const windowGeometry = new THREE.PlaneGeometry(0.2, 0.2);
                    const windowMaterial = new THREE.MeshBasicMaterial({ 
                        color: 0xFFFFAA,
                        emissive: 0xFFFFAA,
                        emissiveIntensity: 0.5
                    });
                    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                    windowMesh.position.set(
                        building.position.x + (window - 1) * 0.3,
                        building.position.y - buildingHeight/2 + floor * 2 + 1,
                        building.position.z + buildingType.depth/2 + 0.01
                    );
                    scene.add(windowMesh);
                }
            }
        }
    }

    // Neon signs
    for (let i = 0; i < 20; i++) {
        const signGeometry = new THREE.PlaneGeometry(2 + Math.random(), 1 + Math.random() * 0.5);
        const signColors = [0xFF00FF, 0x00FFFF, 0xFF0040, 0x40FF00];
        const signColor = signColors[Math.floor(Math.random() * signColors.length)];
        
        const signMaterial = new THREE.MeshBasicMaterial({ 
            color: signColor,
            emissive: signColor,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9
        });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(
            (Math.random() - 0.5) * 50,
            Math.random() * 8 + 2,
            (Math.random() - 0.5) * 50
        );
        sign.rotation.y = Math.random() * Math.PI * 2;
        sign.userData = { type: 'neon_sign', flicker: Math.random() * 0.1 + 0.05 };
        scene.add(sign);
    }

    // Flying cars (animated)
    for (let i = 0; i < 5; i++) {
        const carGroup = new THREE.Group();
        
        const carBody = new THREE.BoxGeometry(2, 0.5, 1);
        const carMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x666666,
            emissive: 0x0000FF,
            emissiveIntensity: 0.2 
        });
        const car = new THREE.Mesh(carBody, carMaterial);
        carGroup.add(car);
        
        // Glowing trail
        for (let j = 0; j < 3; j++) {
            const trailGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const trailMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x00FFFF,
                transparent: true,
                opacity: 0.6 - j * 0.2
            });
            const trail = new THREE.Mesh(trailGeometry, trailMaterial);
            trail.position.set(0, 0, j * 0.5 + 0.5);
            carGroup.add(trail);
        }
        
        carGroup.position.set(
            (Math.random() - 0.5) * 80,
            Math.random() * 10 + 15,
            (Math.random() - 0.5) * 80
        );
        carGroup.userData = { 
            type: 'flying_car', 
            speed: Math.random() * 0.05 + 0.02,
            path: Math.random() * Math.PI * 2
        };
        scene.add(carGroup);
    }
}

function createFantasyKingdom() {
    scene.background = new THREE.Color(0x4169E1); // Royal blue sky
    
    // Ground (enchanted grass)
    const groundGeometry = new THREE.PlaneGeometry(150, 150);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Castle complex
    const castleGroup = new THREE.Group();
    
    // Main keep
    const keepGeometry = new THREE.CylinderGeometry(3, 3.5, 12, 8);
    const keepMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
    const keep = new THREE.Mesh(keepGeometry, keepMaterial);
    keep.position.y = 6;
    keep.castShadow = true;
    castleGroup.add(keep);

    // Keep roof
    const keepRoofGeometry = new THREE.ConeGeometry(3.5, 3, 8);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
    const keepRoof = new THREE.Mesh(keepRoofGeometry, roofMaterial);
    keepRoof.position.y = 13.5;
    castleGroup.add(keepRoof);

    // Flag on top
    const flagPole = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const pole = new THREE.Mesh(flagPole, poleMaterial);
    pole.position.y = 16;
    castleGroup.add(pole);

    const flagGeometry = new THREE.PlaneGeometry(1, 0.6);
    const flagMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xFF0000,
        side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(0.5, 16.5, 0);
    castleGroup.add(flag);

    // Castle walls
    const wallPositions = [
        { x: 0, z: 8 }, { x: 0, z: -8 }, { x: 8, z: 0 }, { x: -8, z: 0 }
    ];
    
    wallPositions.forEach((pos, index) => {
        const wallGeometry = new THREE.BoxGeometry(
            index >= 2 ? 2 : 12,
            6,
            index >= 2 ? 12 : 2
        );
        const wall = new THREE.Mesh(wallGeometry, keepMaterial);
        wall.position.set(pos.x, 3, pos.z);
        wall.castShadow = true;
        castleGroup.add(wall);
        
        // Wall towers
        const towerGeometry = new THREE.CylinderGeometry(1, 1.2, 8, 6);
        const tower = new THREE.Mesh(towerGeometry, keepMaterial);
        tower.position.set(pos.x, 4, pos.z);
        castleGroup.add(tower);
        
        const towerRoof = new THREE.ConeGeometry(1.2, 2, 6);
        const towerRoofMesh = new THREE.Mesh(towerRoof, roofMaterial);
        towerRoofMesh.position.set(pos.x, 9, pos.z);
        castleGroup.add(towerRoofMesh);
    });

    castleGroup.position.set(0, 0, -25);
    castleGroup.userData = { type: 'castle' };
    scene.add(castleGroup);

    // Enchanted forest
    for (let i = 0; i < 25; i++) {
        const treeGroup = new THREE.Group();
        
        const trunkHeight = Math.random() * 2 + 3;
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, trunkHeight, 8);
        const trunkColors = [0x4B0082, 0x8B4513, 0x654321];
        const trunkMaterial = new THREE.MeshLambertMaterial({ 
            color: trunkColors[Math.floor(Math.random() * trunkColors.length)]
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = trunkHeight / 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // Magical leaves
        const leavesGeometry = new THREE.SphereGeometry(1.5 + Math.random() * 0.5, 8, 8);
        const leafColors = [0xFF1493, 0x9370DB, 0x00FF7F, 0xFF69B4];
        const leafColor = leafColors[Math.floor(Math.random() * leafColors.length)];
        const leavesMaterial = new THREE.MeshLambertMaterial({ 
            color: leafColor,
            emissive: leafColor,
            emissiveIntensity: 0.1
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = trunkHeight + 1;
        treeGroup.add(leaves);

        // Glowing particles around magical trees
        if (Math.random() > 0.7) {
            for (let j = 0; j < 5; j++) {
                const particleGeometry = new THREE.SphereGeometry(0.05, 6, 6);
                const particleMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xFFFFAA,
                    transparent: true,
                    opacity: 0.8
                });
                const particle = new THREE.Mesh(particleGeometry, particleMaterial);
                particle.position.set(
                    (Math.random() - 0.5) * 4,
                    trunkHeight + Math.random() * 2,
                    (Math.random() - 0.5) * 4
                );
                particle.userData = { 
                    type: 'magic_particle',
                    float: Math.random() * 0.02 + 0.01,
                    phase: Math.random() * Math.PI * 2
                };
                treeGroup.add(particle);
            }
        }

        treeGroup.position.set(
            (Math.random() - 0.5) * 120,
            0,
            (Math.random() - 0.5) * 120
        );
        treeGroup.userData = { type: 'enchanted_tree' };
        scene.add(treeGroup);
    }

    // Dragons flying around
    for (let i = 0; i < 2; i++) {
        const dragonGroup = new THREE.Group();
        
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 8);
        const dragonMaterial = new THREE.MeshLambertMaterial({ 
            color: i === 0 ? 0x8B0000 : 0x000080,
            emissive: i === 0 ? 0x8B0000 : 0x000080,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, dragonMaterial);
        body.rotation.z = Math.PI / 2;
        dragonGroup.add(body);

        // Wings
        for (let wing = 0; wing < 2; wing++) {
            const wingGeometry = new THREE.ConeGeometry(1.5, 3, 3);
            const wingMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x4B0000,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const wingMesh = new THREE.Mesh(wingGeometry, wingMaterial);
            wingMesh.position.set(0, wing === 0 ? 2 : -2, 0);
            wingMesh.rotation.z = wing === 0 ? Math.PI / 6 : -Math.PI / 6;
            wingMesh.userData = { type: 'dragon_wing', side: wing };
            dragonGroup.add(wingMesh);
        }

        dragonGroup.position.set(
            (Math.random() - 0.5) * 60,
            Math.random() * 15 + 20,
            (Math.random() - 0.5) * 60
        );
        dragonGroup.userData = { 
            type: 'dragon', 
            speed: Math.random() * 0.03 + 0.02,
            radius: Math.random() * 30 + 20,
            angle: Math.random() * Math.PI * 2,
            wingFlap: 0
        };
        scene.add(dragonGroup);
    }
}

function createSpaceStation() {
    scene.background = new THREE.Color(0x000000); // Deep space
    
    // Star field
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ 
        color: 0xFFFFFF,
        size: 2,
        sizeAttenuation: false
    });
    
    const starVertices = [];
    for (let i = 0; i < 15000; i++) {
        starVertices.push((Math.random() - 0.5) * 2000);
        starVertices.push((Math.random() - 0.5) * 2000);
        starVertices.push((Math.random() - 0.5) * 2000);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Space station floor (main platform)
    const floorGeometry = new THREE.CylinderGeometry(20, 20, 2, 24);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4169E1,
        emissive: 0x000044,
        emissiveIntensity: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.userData = { type: 'station_floor' };
    scene.add(floor);

    // Station walls (transparent dome)
    const wallGeometry = new THREE.SphereGeometry(20, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const wallMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x708090,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 1;
    scene.add(walls);

    // Control panels around the perimeter
    for (let i = 0; i < 12; i++) {
        const panelGroup = new THREE.Group();
        
        const panelGeometry = new THREE.BoxGeometry(2, 2, 0.3);
        const panelMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x333333,
            emissive: 0x001122,
            emissiveIntensity: 0.3
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panelGroup.add(panel);
        
        // Holographic displays
        const screenGeometry = new THREE.PlaneGeometry(1.5, 1.2);
        const screenColors = [0x00FFFF, 0x00FF00, 0xFF00FF, 0xFFFF00];
        const screenMaterial = new THREE.MeshBasicMaterial({ 
            color: screenColors[i % screenColors.length],
            emissive: screenColors[i % screenColors.length],
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.2;
        panelGroup.add(screen);
        
        const angle = (i / 12) * Math.PI * 2;
        panelGroup.position.x = Math.cos(angle) * 18;
        panelGroup.position.z = Math.sin(angle) * 18;
        panelGroup.position.y = 2;
        panelGroup.lookAt(new THREE.Vector3(0, 2, 0));
        panelGroup.userData = { type: 'control_panel', flicker: Math.random() * 0.02 };
        scene.add(panelGroup);
    }

    // Central command console
    const commandGeometry = new THREE.CylinderGeometry(3, 4, 3, 8);
    const commandMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x2F4F4F,
        emissive: 0x004400,
        emissiveIntensity: 0.3
    });
    const command = new THREE.Mesh(commandGeometry, commandMaterial);
    command.position.y = 2.5;
    scene.add(command);

    // Holographic display above command console
    const holoGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const holoMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });
    const holo = new THREE.Mesh(holoGeometry, holoMaterial);
    holo.position.y = 6;
    holo.userData = { type: 'hologram', spin: 0.01 };
    scene.add(holo);

    // Floating planets in the distance
    const planetData = [
        { color: 0xFF4500, size: 3, distance: 80, height: 25 },
        { color: 0x32CD32, size: 2, distance: 120, height: 30 },
        { color: 0x1E90FF, size: 4, distance: 150, height: 40 },
        { color: 0xFF69B4, size: 1.5, distance: 90, height: 20 },
        { color: 0xFFD700, size: 2.5, distance: 200, height: 50 }
    ];
    
    planetData.forEach((planet, index) => {
        const planetGeometry = new THREE.SphereGeometry(planet.size, 16, 16);
        const planetMaterial = new THREE.MeshLambertMaterial({ 
            color: planet.color,
            emissive: planet.color,
            emissiveIntensity: 0.3
        });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        
        const angle = (index / planetData.length) * Math.PI * 2;
        planetMesh.position.set(
            Math.cos(angle) * planet.distance,
            planet.height,
            Math.sin(angle) * planet.distance
        );
        planetMesh.userData = { 
            type: 'planet', 
            orbit: 0.001 + Math.random() * 0.002,
            distance: planet.distance,
            originalAngle: angle
        };
        scene.add(planetMesh);
    });

    // Space debris and asteroids
    for (let i = 0; i < 15; i++) {
        const debrisGeometry = new THREE.DodecahedronGeometry(Math.random() * 2 + 0.5, 0);
        const debrisMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
        debris.position.set(
            (Math.random() - 0.5) * 300,
            Math.random() * 100 + 10,
            (Math.random() - 0.5) * 300
        );
        debris.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        debris.userData = { 
            type: 'debris',
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        scene.add(debris);
    }
}

function createUnderwaterCity() {
    scene.background = new THREE.Color(0x006994); // Deep ocean blue
    
    // Ocean floor
    const floorGeometry = new THREE.PlaneGeometry(200, 200, 20, 20);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Underwater domes (city buildings)
    for (let i = 0; i < 12; i++) {
        const domeGroup = new THREE.Group();
        
        const domeSize = Math.random() * 2 + 3;
        const domeGeometry = new THREE.SphereGeometry(domeSize, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x40E0D0,
            transparent: true,
            opacity: 0.6,
            emissive: 0x002222,
            emissiveIntensity: 0.3
        });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.y = domeSize / 2;
        dome.castShadow = true;
        domeGroup.add(dome);
        
        // Interior lights
        for (let j = 0; j < 3; j++) {
            const lightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const lightMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xFFFFAA,
                emissive: 0xFFFFAA,
                emissiveIntensity: 0.8
            });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(
                (Math.random() - 0.5) * domeSize * 0.8,
                Math.random() * domeSize * 0.7,
                (Math.random() - 0.5) * domeSize * 0.8
            );
            domeGroup.add(light);
        }
        
        domeGroup.position.set(
            (Math.random() - 0.5) * 120,
            0,
            (Math.random() - 0.5) * 120
        );
        domeGroup.userData = { type: 'underwater_dome' };
        scene.add(domeGroup);
    }

    // Coral reefs with variety
    const coralTypes = [
        { shape: 'cone', colors: [0xFF69B4, 0xFF1493, 0xDC143C] },
        { shape: 'sphere', colors: [0x32CD32, 0x00FF7F, 0x7FFF00] },
        { shape: 'cylinder', colors: [0x9370DB, 0x8A2BE2, 0x4B0082] }
    ];
    
    for (let i = 0; i < 40; i++) {
        const coralType = coralTypes[Math.floor(Math.random() * coralTypes.length)];
        let coralGeometry;
        
        switch(coralType.shape) {
            case 'cone':
                coralGeometry = new THREE.ConeGeometry(
                    Math.random() * 0.5 + 0.3,
                    Math.random() * 3 + 1,
                    6 + Math.floor(Math.random() * 4)
                );
                break;
            case 'sphere':
                coralGeometry = new THREE.SphereGeometry(
                    Math.random() * 0.8 + 0.4,
                    8,
                    6
                );
                break;
            case 'cylinder':
                coralGeometry = new THREE.CylinderGeometry(
                    Math.random() * 0.3 + 0.1,
                    Math.random() * 0.4 + 0.2,
                    Math.random() * 2 + 1,
                    8
                );
                break;
        }
        
        const coralColor = coralType.colors[Math.floor(Math.random() * coralType.colors.length)];
        const coralMaterial = new THREE.MeshLambertMaterial({ 
            color: coralColor,
            emissive: coralColor,
            emissiveIntensity: 0.1
        });
        const coral = new THREE.Mesh(coralGeometry, coralMaterial);
        coral.position.set(
            (Math.random() - 0.5) * 140,
            Math.random() * 2 + 0.5,
            (Math.random() - 0.5) * 140
        );
        coral.rotation.z = (Math.random() - 0.5) * 0.8;
        coral.rotation.x = (Math.random() - 0.5) * 0.4;
        coral.userData = { type: 'coral', sway: Math.random() * 0.02 + 0.01 };
        scene.add(coral);
    }

    // Swimming fish (animated)
    const fishShapes = ['box', 'ellipsoid'];
    const fishColors = [0xFF6347, 0x00CED1, 0xFF69B4, 0x32CD32, 0xFFD700, 0x9370DB];
    
    for (let i = 0; i < 25; i++) {
        const fishGroup = new THREE.Group();
        
        let fishGeometry;
        if (fishShapes[Math.floor(Math.random() * fishShapes.length)] === 'box') {
            fishGeometry = new THREE.BoxGeometry(0.6, 0.3, 1.2);
        } else {
            fishGeometry = new THREE.SphereGeometry(0.4, 8, 6);
            fishGeometry.scale(1.5, 0.7, 1);
        }
        
        const fishColor = fishColors[Math.floor(Math.random() * fishColors.length)];
        const fishMaterial = new THREE.MeshLambertMaterial({ 
            color: fishColor,
            emissive: fishColor,
            emissiveIntensity: 0.1
        });
        const fish = new THREE.Mesh(fishGeometry, fishMaterial);
        fishGroup.add(fish);
        
        // Tail
        const tailGeometry = new THREE.ConeGeometry(0.2, 0.4, 4);
        const tail = new THREE.Mesh(tailGeometry, fishMaterial);
        tail.position.set(0, 0, 0.8);
        tail.rotation.x = Math.PI / 2;
        fishGroup.add(tail);
        
        fishGroup.position.set(
            (Math.random() - 0.5) * 120,
            Math.random() * 12 + 2,
            (Math.random() - 0.5) * 120
        );
        fishGroup.userData = {
            type: 'fish',
            speed: Math.random() * 0.03 + 0.02,
            direction: Math.random() * Math.PI * 2,
            swimPattern: Math.random() * 0.1,
            verticalBob: Math.random() * 0.02
        };
        scene.add(fishGroup);
    }

    // Kelp forest
    for (let i = 0; i < 20; i++) {
        const kelpGroup = new THREE.Group();
        const kelpHeight = Math.random() * 8 + 4;
        const segments = Math.floor(kelpHeight / 0.5);
        
        for (let j = 0; j < segments; j++) {
            const segmentGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 6);
            const kelpMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x228B22,
                transparent: true,
                opacity: 0.8
            });
            const segment = new THREE.Mesh(segmentGeometry, kelpMaterial);
            segment.position.y = j * 0.5 + 0.25;
            segment.position.x = Math.sin(j * 0.3) * 0.2;
            segment.rotation.z = Math.sin(j * 0.5) * 0.1;
            kelpGroup.add(segment);
        }
        
        kelpGroup.position.set(
            (Math.random() - 0.5) * 100,
            0,
            (Math.random() - 0.5) * 100
        );
        kelpGroup.userData = { 
            type: 'kelp', 
            sway: Math.random() * 0.02 + 0.01,
            phase: Math.random() * Math.PI * 2
        };
        scene.add(kelpGroup);
    }

    // Underwater geysers
    for (let i = 0; i < 5; i++) {
        const geyserGroup = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(1, 1.5, 0.5, 8);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.25;
        geyserGroup.add(base);
        
        // Bubbles
        for (let j = 0; j < 8; j++) {
            const bubbleGeometry = new THREE.SphereGeometry(Math.random() * 0.2 + 0.1, 6, 6);
            const bubbleMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.6
            });
            const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
            bubble.position.set(
                (Math.random() - 0.5) * 0.8,
                Math.random() * 8 + 1,
                (Math.random() - 0.5) * 0.8
            );
            bubble.userData = { 
                type: 'bubble',
                rise: Math.random() * 0.05 + 0.02,
                wobble: Math.random() * 0.01
            };
            geyserGroup.add(bubble);
        }
        
        geyserGroup.position.set(
            (Math.random() - 0.5) * 80,
            0,
            (Math.random() - 0.5) * 80
        );
        scene.add(geyserGroup);
    }
}

function createMountainPeak() {
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    
    // Mountain base with multiple peaks
    const mountainGroup = new THREE.Group();
    
    // Main peak
    const mainPeakGeometry = new THREE.ConeGeometry(30, 35, 8);
    const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
    const mainPeak = new THREE.Mesh(mainPeakGeometry, rockMaterial);
    mainPeak.position.y = 17.5;
    mainPeak.receiveShadow = true;
    mountainGroup.add(mainPeak);
    
    // Secondary peaks
    for (let i = 0; i < 4; i++) {
        const peakGeometry = new THREE.ConeGeometry(
            Math.random() * 15 + 10,
            Math.random() * 20 + 15,
            8
        );
        const peak = new THREE.Mesh(peakGeometry, rockMaterial);
        const angle = (i / 4) * Math.PI * 2;
        peak.position.set(
            Math.cos(angle) * 40,
            Math.random() * 5 + 10,
            Math.sin(angle) * 40
        );
        mountainGroup.add(peak);
    }
    
    scene.add(mountainGroup);

    // Snow caps on peaks
    scene.traverse((child) => {
        if (child.geometry && child.geometry.type === 'ConeGeometry' && child.position.y > 15) {
            const snowGeometry = new THREE.ConeGeometry(
                child.geometry.parameters.radius * 0.6,
                child.geometry.parameters.height * 0.4,
                8
            );
            const snowMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xFFFFFF,
                emissive: 0x111111,
                emissiveIntensity: 0.1
            });
            const snow = new THREE.Mesh(snowGeometry, snowMaterial);
            snow.position.copy(child.position);
            snow.position.y += child.geometry.parameters.height * 0.3;
            scene.add(snow);
        }
    });

    // Platform at main peak
    const platformGeometry = new THREE.CylinderGeometry(6, 6, 1.5, 16);
    const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = 35.75;
    platform.receiveShadow = true;
    scene.add(platform);

    // Observation tower
    const towerGeometry = new THREE.CylinderGeometry(1, 1.2, 4, 8);
    const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.y = 38.5;
    tower.castShadow = true;
    scene.add(tower);

    // Clouds around mountain
    for (let i = 0; i < 15; i++) {
        const cloudGroup = new THREE.Group();
        
        // Multiple spheres to form cloud
        for (let j = 0; j < 4; j++) {
            const cloudGeometry = new THREE.SphereGeometry(
                Math.random() * 2 + 2,
                8,
                8
            );
            const cloudMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.7
            });
            const cloudPart = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloudPart.position.set(
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 4
            );
            cloudGroup.add(cloudPart);
        }
        
        cloudGroup.position.set(
            (Math.random() - 0.5) * 100,
            Math.random() * 15 + 15,
            (Math.random() - 0.5) * 100
        );
        cloudGroup.scale.set(
            Math.random() * 0.5 + 0.8,
            Math.random() * 0.3 + 0.7,
            Math.random() * 0.5 + 0.8
        );
        cloudGroup.userData = { 
            type: 'cloud',
            drift: Math.random() * 0.01 + 0.005,
            bob: Math.random() * 0.01
        };
        scene.add(cloudGroup);
    }

    // Eagles flying around
    for (let i = 0; i < 6; i++) {
        const eagleGroup = new THREE.Group();
        
        const bodyGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.8);
        const eagleMaterial = new THREE.MeshLambertMaterial({ 
            color: i % 2 === 0 ? 0x8B4513 : 0x654321
        });
        const body = new THREE.Mesh(bodyGeometry, eagleMaterial);
        eagleGroup.add(body);
        
        // Wings
        const wingGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.4);
        const wings = new THREE.Mesh(wingGeometry, eagleMaterial);
        wings.userData = { type: 'eagle_wings' };
        eagleGroup.add(wings);
        
        eagleGroup.position.set(
            (Math.random() - 0.5) * 60,
            Math.random() * 20 + 15,
            (Math.random() - 0.5) * 60
        );
        eagleGroup.userData = { 
            type: 'eagle', 
            speed: Math.random() * 0.04 + 0.03,
            radius: Math.random() * 25 + 15,
            angle: Math.random() * Math.PI * 2,
            height: eagleGroup.position.y,
            wingFlap: 0
        };
        scene.add(eagleGroup);
    }

    // Mountain paths and rocky outcrops
    for (let i = 0; i < 20; i++) {
        const rockGeometry = new THREE.DodecahedronGeometry(Math.random() * 2 + 1, 0);
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(
            (Math.random() - 0.5) * 80,
            Math.random() * 15,
            (Math.random() - 0.5) * 80
        );
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        scene.add(rock);
    }

    // Alpine trees
    for (let i = 0; i < 12; i++) {
        const treeGroup = new THREE.Group();
        
        const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 4, 6);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x4B0000 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Pine needles (layered cones)
        for (let layer = 0; layer < 4; layer++) {
            const needleGeometry = new THREE.ConeGeometry(
                1.5 - layer * 0.2,
                2,
                8
            );
            const needleMaterial = new THREE.MeshLambertMaterial({ color: 0x0F4F0F });
            const needles = new THREE.Mesh(needleGeometry, needleMaterial);
            needles.position.y = 3.5 + layer * 1.2;
            treeGroup.add(needles);
        }
        
        treeGroup.position.set(
            (Math.random() - 0.5) * 60,
            Math.random() * 8,
            (Math.random() - 0.5) * 60
        );
        treeGroup.userData = { type: 'alpine_tree' };
        scene.add(treeGroup);
    }
}

// World functions
function teleportToWorld(worldType, evt) {
    try {
        window.currentWorld = worldType;
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
        if (window.HeartQuest && window.HeartQuest.updateStats) {
            window.HeartQuest.updateStats('xp', 50);
        }

        // Show notification
        let worldName = worldType;
        if (evt && evt.target) {
            const nameEl = evt.target.querySelector('.world-name') || 
                          evt.target.closest('.world-card')?.querySelector('.world-name');
            if (nameEl) {
                worldName = nameEl.textContent;
            }
        }
        
        if (window.HeartQuest && window.HeartQuest.showNotification) {
            window.HeartQuest.showNotification(`🌍 Welcome to ${worldName}!`);
        }
        
        console.log(`Teleported to ${worldType}`);
    } catch (error) {
        console.error('Error teleporting to world:', error);
        if (window.HeartQuest && window.HeartQuest.showNotification) {
            window.HeartQuest.showNotification('❌ Error teleporting to world');
        }
    }
}

// World animation system
function animateWorldElements() {
    if (!scene) return;
    
    try {
        const time = Date.now() * 0.001;
        
        scene.traverse((child) => {
            if (!child.userData) return;
            
            switch(child.userData.type) {
                case 'palm_tree':
                    if (child.userData.sway) {
                        child.rotation.z = Math.sin(time + child.position.x) * child.userData.sway;
                    }
                    break;
                    
                case 'fish':
                    if (child.userData.speed && child.userData.direction !== undefined) {
                        child.userData.direction += (Math.random() - 0.5) * 0.1;
                        child.position.x += Math.cos(child.userData.direction) * child.userData.speed;
                        child.position.z += Math.sin(child.userData.direction) * child.userData.speed;
                        child.position.y += Math.sin(time * 2 + child.position.x) * child.userData.verticalBob;
                        child.rotation.y = child.userData.direction;
                        
                        // Keep fish in bounds
                        if (Math.abs(child.position.x) > 60) child.userData.direction += Math.PI;
                        if (Math.abs(child.position.z) > 60) child.userData.direction += Math.PI;
                        if (child.position.y < 1) child.position.y = 1;
                        if (child.position.y > 15) child.position.y = 15;
                    }
                    break;
                    
                case 'eagle':
                    if (child.userData.radius && child.userData.angle !== undefined) {
                        child.userData.angle += child.userData.speed;
                        child.position.x = Math.cos(child.userData.angle) * child.userData.radius;
                        child.position.z = Math.sin(child.userData.angle) * child.userData.radius;
                        child.position.y = child.userData.height + Math.sin(time + child.userData.angle) * 2;
                        child.rotation.y = child.userData.angle + Math.PI / 2;
                        
                        // Wing flap animation
                        child.userData.wingFlap += 0.3;
                        const wings = child.children.find(c => c.userData.type === 'eagle_wings');
                        if (wings) {
                            wings.rotation.z = Math.sin(child.userData.wingFlap) * 0.3;
                        }
                    }
                    break;
                    
                case 'dragon':
                    if (child.userData.radius && child.userData.angle !== undefined) {
                        child.userData.angle += child.userData.speed;
                        child.position.x = Math.cos(child.userData.angle) * child.userData.radius;
                        child.position.z = Math.sin(child.userData.angle) * child.userData.radius;
                        child.rotation.y = child.userData.angle + Math.PI / 2;
                        
                        // Wing flap animation
                        child.userData.wingFlap += 0.2;
                        child.children.forEach(wing => {
                            if (wing.userData.type === 'dragon_wing') {
                                const flapAmount = Math.sin(child.userData.wingFlap) * 0.4;
                                wing.rotation.z += wing.userData.side === 0 ? flapAmount : -flapAmount;
                            }
                        });
                    }
                    break;
                    
                case 'flying_car':
                    if (child.userData.speed && child.userData.path !== undefined) {
                        child.userData.path += child.userData.speed;
                        child.position.x += Math.cos(child.userData.path) * 2;
                        child.position.z += Math.sin(child.userData.path) * 2;
                        child.position.y += Math.sin(time * 2) * 0.5;
                        child.rotation.y = child.userData.path;
                        
                        // Keep in bounds
                        if (Math.abs(child.position.x) > 100) child.userData.path += Math.PI;
                        if (Math.abs(child.position.z) > 100) child.userData.path += Math.PI;
                    }
                    break;
                    
                case 'neon_sign':
                    if (child.userData.flicker) {
                        child.material.emissiveIntensity = 0.8 + Math.sin(time * 10) * child.userData.flicker;
                    }
                    break;
                    
                case 'hologram':
                    if (child.userData.spin) {
                        child.rotation.y += child.userData.spin;
                        child.rotation.x = Math.sin(time) * 0.1;
                    }
                    break;
                    
                case 'planet':
                    if (child.userData.orbit && child.userData.distance && child.userData.originalAngle !== undefined) {
                        const angle = child.userData.originalAngle + time * child.userData.orbit;
                        child.position.x = Math.cos(angle) * child.userData.distance;
                        child.position.z = Math.sin(angle) * child.userData.distance;
                        child.rotation.y += 0.01;
                    }
                    break;
                    
                case 'cloud':
                    if (child.userData.drift) {
                        child.position.x += child.userData.drift;
                        if (child.userData.bob) {
                            child.position.y += Math.sin(time + child.position.x * 0.1) * child.userData.bob;
                        }
                        
                        // Reset position when too far
                        if (child.position.x > 150) child.position.x = -150;
                    }
                    break;
                    
                case 'coral':
                case 'kelp':
                    if (child.userData.sway) {
                        const phase = child.userData.phase || 0;
                        child.rotation.z = Math.sin(time * 0.5 + phase) * child.userData.sway;
                    }
                    break;
                    
                case 'bubble':
                    if (child.userData.rise) {
                        child.position.y += child.userData.rise;
                        if (child.userData.wobble) {
                            child.position.x += Math.sin(time * 3 + child.position.y) * child.userData.wobble;
                        }
                        
                        // Reset bubble when it reaches surface
                        if (child.position.y > 20) {
                            child.position.y = 1;
                            child.position.x = (Math.random() - 0.5) * 0.8;
                        }
                    }
                    break;
                    
                case 'magic_particle':
                    if (child.userData.float && child.userData.phase !== undefined) {
                        const phase = child.userData.phase;
                        child.position.y += Math.sin(time * 2 + phase) * child.userData.float;
                        child.position.x += Math.cos(time + phase) * child.userData.float * 0.5;
                        child.material.opacity = 0.5 + Math.sin(time * 3 + phase) * 0.3;
                    }
                    break;
                    
                case 'debris':
                    if (child.userData.rotationSpeed) {
                        child.rotation.x += child.userData.rotationSpeed.x;
                        child.rotation.y += child.userData.rotationSpeed.y;
                        child.rotation.z += child.userData.rotationSpeed.z;
                    }
                    break;
                    
                case 'control_panel':
                    if (child.userData.flicker) {
                        const screen = child.children.find(c => c.material && c.material.emissiveIntensity !== undefined);
                        if (screen) {
                            screen.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * child.userData.flicker;
                        }
                    }
                    break;
            }
        });
    } catch (error) {
        console.error('Error animating world elements:', error);
    }
}

// Export for use in main animation loop
if (typeof window !== 'undefined') {
    window.animateWorldElements = animateWorldElements;
    window.teleportToWorld = teleportToWorld;
    window.createWorld = createWorld;
}