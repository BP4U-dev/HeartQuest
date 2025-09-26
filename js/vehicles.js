// HeartQuest Vehicle System - Transportation and Vehicle Management

function spawnVehicle(vehicleType) {
    // Remove existing vehicles
    scene.traverse((child) => {
        if (child.userData && child.userData.isVehicle) {
            scene.remove(child);
        }
    });

    let vehicle;
    switch(vehicleType) {
        case 'car':
            vehicle = createSportsCar();
            break;
        case 'bike':
            vehicle = createMotorcycle();
            break;
        case 'jet':
            vehicle = createPrivateJet();
            break;
        case 'dragon':
            vehicle = createDragon();
            break;
    }

    if (vehicle) {
        vehicle.userData.isVehicle = true;
        vehicle.position.set(avatar.position.x + 3, avatar.position.y, avatar.position.z);
        scene.add(vehicle);
        showNotification(`🚗 ${vehicleType.toUpperCase()} spawned! Use WASD to drive around.`);
    }
}

function createSportsCar() {
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    carGroup.add(body);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 8);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    
    const positions = [
        [-1.5, 0, -1.2], [1.5, 0, -1.2], [-1.5, 0, 1.2], [1.5, 0, 1.2]
    ];
    
    positions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(...pos);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        carGroup.add(wheel);
    });

    return carGroup;
}

function createMotorcycle() {
    const bikeGroup = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 0.8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x000080 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.7;
    body.castShadow = true;
    bikeGroup.add(body);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.15, 16);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    
    const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontWheel.position.set(0, 0.5, -1.2);
    frontWheel.rotation.x = Math.PI / 2;
    frontWheel.castShadow = true;
    bikeGroup.add(frontWheel);

    const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backWheel.position.set(0, 0.5, 1.2);
    backWheel.rotation.x = Math.PI / 2;
    backWheel.castShadow = true;
    bikeGroup.add(backWheel);

    return bikeGroup;
}

function createPrivateJet() {
    const jetGroup = new THREE.Group();
    
    // Fuselage
    const fuselageGeometry = new THREE.CylinderGeometry(0.8, 1.2, 8, 8);
    const fuselageMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.rotation.z = Math.PI / 2;
    fuselage.position.y = 2;
    fuselage.castShadow = true;
    jetGroup.add(fuselage);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.2, 6, 1.5);
    const wingMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
    const wing = new THREE.Mesh(wingGeometry, wingMaterial);
    wing.position.y = 2;
    wing.castShadow = true;
    jetGroup.add(wing);

    // Engines
    for (let i = 0; i < 2; i++) {
        const engineGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8);
        const engineMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.position.set(0, 1.5, i === 0 ? -2.5 : 2.5);
        engine.rotation.x = Math.PI / 2;
        engine.castShadow = true;
        jetGroup.add(engine);
    }

    return jetGroup;
}

function createDragon() {
    const dragonGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 1.2, 6, 8);
    const bodyMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B0000,
        emissive: 0x8B0000,
        emissiveIntensity: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2;
    body.position.y = 3;
    body.castShadow = true;
    dragonGroup.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(1, 8, 8);
    const headMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(-3.5, 3.5, 0);
    head.castShadow = true;
    dragonGroup.add(head);

    // Wings
    const wingGeometry = new THREE.ConeGeometry(3, 5, 4);
    const wingMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4B0000,
        transparent: true,
        opacity: 0.8
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(0, 4, -4);
    leftWing.rotation.z = Math.PI / 4;
    dragonGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0, 4, 4);
    rightWing.rotation.z = -Math.PI / 4;
    dragonGroup.add(rightWing);

    // Add wing flapping animation
    dragonGroup.userData.wingFlap = 0;

    return dragonGroup;
}
