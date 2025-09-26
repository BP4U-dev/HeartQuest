// HeartQuest Vehicle System - Transportation and Vehicle Management

function spawnVehicle(vehicleType) {
    try {
        // Remove existing vehicles
        scene.traverse((child) => {
            if (child.userData && child.userData.isVehicle) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
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
            default:
                vehicle = createSportsCar();
        }

        if (vehicle && window.avatar) {
            vehicle.userData.isVehicle = true;
            vehicle.position.set(
                window.avatar.position.x + 4, 
                window.avatar.position.y, 
                window.avatar.position.z
            );
            scene.add(vehicle);
            
            const vehicleNames = {
                car: 'Sports Car',
                bike: 'Motorcycle', 
                jet: 'Private Jet',
                dragon: 'Dragon'
            };
            
            if (window.HeartQuest && window.HeartQuest.showNotification) {
                window.HeartQuest.showNotification(`🚗 ${vehicleNames[vehicleType]} spawned! Use WASD to drive around.`);
                window.HeartQuest.updateStats('xp', 25);
            }
            
            console.log(`Vehicle ${vehicleType} spawned successfully`);
        }
    } catch (error) {
        console.error('Error spawning vehicle:', error);
        if (window.HeartQuest && window.HeartQuest.showNotification) {
            window.HeartQuest.showNotification('❌ Error spawning vehicle');
        }
    }
}

function createSportsCar() {
    const carGroup = new THREE.Group();
    
    try {
        // Car body (main chassis)
        const bodyGeometry = new THREE.BoxGeometry(4.2, 1.2, 2);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFF0000,
            emissive: 0x220000,
            emissiveIntensity: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        carGroup.add(body);

        // Hood
        const hoodGeometry = new THREE.BoxGeometry(1.5, 0.3, 1.8);
        const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
        hood.position.set(-1.8, 1.1, 0);
        carGroup.add(hood);

        // Windshield
        const windshieldGeometry = new THREE.BoxGeometry(1.8, 1, 0.1);
        const windshieldMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.6
        });
        const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
        windshield.position.set(-0.5, 1.3, 0);
        windshield.rotation.x = -0.2;
        carGroup.add(windshield);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 12);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const rimMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        
        const wheelPositions = [
            { x: -1.4, z: -1.3 }, // Front left
            { x: -1.4, z: 1.3 },  // Front right
            { x: 1.4, z: -1.3 },  // Rear left
            { x: 1.4, z: 1.3 }    // Rear right
        ];
        
        wheelPositions.forEach((pos, index) => {
            const wheelGroup = new THREE.Group();
            
            // Tire
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            wheelGroup.add(wheel);
            
            // Rim
            const rimGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.35, 8);
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.z = Math.PI / 2;
            wheelGroup.add(rim);
            
            wheelGroup.position.set(pos.x, 0.5, pos.z);
            wheelGroup.userData = { type: 'wheel', index: index };
            carGroup.add(wheelGroup);
        });

        // Headlights
        const headlightGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const headlightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            emissive: 0xFFFFFF,
            emissiveIntensity: 0.8
        });
        
        [-0.6, 0.6].forEach(z => {
            const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
            headlight.position.set(-2.2, 0.8, z);
            carGroup.add(headlight);
        });

        // Taillights
        const taillightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF0000,
            emissive: 0xFF0000,
            emissiveIntensity: 0.6
        });
        
        [-0.6, 0.6].forEach(z => {
            const taillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
            taillight.position.set(2.2, 0.8, z);
            carGroup.add(taillight);
        });

        // License plate
        const plateGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.05);
        const plateMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const plate = new THREE.Mesh(plateGeometry, plateMaterial);
        plate.position.set(2.1, 0.4, 0);
        carGroup.add(plate);

        carGroup.userData = { type: 'sports_car', maxSpeed: 2, acceleration: 0.1 };
        return carGroup;
    } catch (error) {
        console.error('Error creating sports car:', error);
        return null;
    }
}

function createMotorcycle() {
    const bikeGroup = new THREE.Group();
    
    try {
        // Main body/fuel tank
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x000080,
            emissive: 0x000020,
            emissiveIntensity: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.rotation.z = Math.PI / 2;
        body.castShadow = true;
        bikeGroup.add(body);

        // Seat
        const seatGeometry = new THREE.BoxGeometry(1, 0.2, 0.6);
        const seatMaterial = new THREE.MeshLambertMaterial({ color: 0x4B0000 });
        const seat = new THREE.Mesh(seatGeometry, seatMaterial);
        seat.position.set(0.5, 1.1, 0);
        bikeGroup.add(seat);

        // Handlebars
        const handlebarGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
        const handlebarMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        const handlebars = new THREE.Mesh(handlebarGeometry, handlebarMaterial);
        handlebars.position.set(-0.8, 1.3, 0);
        handlebars.rotation.x = Math.PI / 2;
        bikeGroup.add(handlebars);

        // Front fork
        const forkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const fork = new THREE.Mesh(forkGeometry, handlebarMaterial);
        fork.position.set(-1, 0.5, 0);
        fork.rotation.x = -0.3;
        bikeGroup.add(fork);

        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16);
        const tireGeometry = new THREE.TorusGeometry(0.6, 0.1, 8, 16);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        const tireMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        
        // Front wheel
        const frontWheelGroup = new THREE.Group();
        const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        frontWheel.rotation.x = Math.PI / 2;
        frontWheelGroup.add(frontWheel);
        
        const frontTire = new THREE.Mesh(tireGeometry, tireMaterial);
        frontTire.rotation.x = Math.PI / 2;
        frontWheelGroup.add(frontTire);
        
        frontWheelGroup.position.set(-1.3, 0.6, 0);
        frontWheelGroup.userData = { type: 'wheel', position: 'front' };
        bikeGroup.add(frontWheelGroup);

        // Rear wheel
        const rearWheelGroup = new THREE.Group();
        const rearWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        rearWheel.rotation.x = Math.PI / 2;
        rearWheelGroup.add(rearWheel);
        
        const rearTire = new THREE.Mesh(tireGeometry, tireMaterial);
        rearTire.rotation.x = Math.PI / 2;
        rearWheelGroup.add(rearTire);
        
        rearWheelGroup.position.set(1.3, 0.6, 0);
        rearWheelGroup.userData = { type: 'wheel', position: 'rear' };
        bikeGroup.add(rearWheelGroup);

        // Engine
        const engineGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.4);
        const engineMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.position.set(0, 0.4, 0);
        bikeGroup.add(engine);

        // Exhaust pipe
        const exhaustGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1.5, 8);
        const exhaust = new THREE.Mesh(exhaustGeometry, handlebarMaterial);
        exhaust.position.set(1, 0.3, 0.5);
        exhaust.rotation.z = -Math.PI / 6;
        bikeGroup.add(exhaust);

        // Headlight
        const headlightGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const headlightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF,
            emissive: 0xFFFFFF,
            emissiveIntensity: 1
        });
        const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlight.position.set(-1.2, 1, 0);
        bikeGroup.add(headlight);

        bikeGroup.userData = { type: 'motorcycle', maxSpeed: 2.5, acceleration: 0.15 };
        return bikeGroup;
    } catch (error) {
        console.error('Error creating motorcycle:', error);
        return null;
    }
}

function createPrivateJet() {
    const jetGroup = new THREE.Group();
    
    try {
        // Fuselage (main body)
        const fuselageGeometry = new THREE.CylinderGeometry(1, 1.5, 12, 12);
        const fuselageMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFFFFF,
            emissive: 0x111111,
            emissiveIntensity: 0.1
        });
        const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
        fuselage.rotation.z = Math.PI / 2;
        fuselage.position.y = 3;
        fuselage.castShadow = true;
        jetGroup.add(fuselage);

        // Cockpit
        const cockpitGeometry = new THREE.SphereGeometry(1.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const cockpit = new THREE.Mesh(cockpitGeometry, fuselageMaterial);
        cockpit.position.set(-5.5, 3, 0);
        cockpit.rotation.y = Math.PI / 2;
        jetGroup.add(cockpit);

        // Cockpit windows
        const windowGeometry = new THREE.SphereGeometry(1.3, 8, 6);
        const windowMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.6
        });
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(-5.2, 3.2, 0);
        window.scale.set(0.8, 0.6, 0.8);
        jetGroup.add(window);

        // Main wings
        const wingGeometry = new THREE.BoxGeometry(0.3, 8, 2);
        const wingMaterial = new THREE.MeshLambertMaterial({ color: 0xE0E0E0 });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        wings.position.set(0, 3, 0);
        wings.castShadow = true;
        jetGroup.add(wings);

        // Tail wing
        const tailWingGeometry = new THREE.BoxGeometry(0.2, 3, 0.8);
        const tailWing = new THREE.Mesh(tailWingGeometry, wingMaterial);
        tailWing.position.set(5.5, 3, 0);
        jetGroup.add(tailWing);

        // Vertical stabilizer
        const stabilizerGeometry = new THREE.BoxGeometry(0.2, 0.8, 2.5);
        const stabilizer = new THREE.Mesh(stabilizerGeometry, wingMaterial);
        stabilizer.position.set(5.5, 4.5, 0);
        jetGroup.add(stabilizer);

        // Engines
        const enginePositions = [
            { y: 2.5, z: -3 },
            { y: 2.5, z: 3 }
        ];
        
        enginePositions.forEach(pos => {
            const engineGeometry = new THREE.CylinderGeometry(0.4, 0.5, 2.5, 8);
            const engineMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x696969,
                emissive: 0x001111,
                emissiveIntensity: 0.2
            });
            const engine = new THREE.Mesh(engineGeometry, engineMaterial);
            engine.position.set(1, pos.y, pos.z);
            engine.rotation.x = Math.PI / 2;
            engine.castShadow = true;
            jetGroup.add(engine);

            // Engine exhaust
            const exhaustGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.8, 8);
            const exhaustMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xFF4500,
                emissive: 0xFF4500,
                emissiveIntensity: 0.8
            });
            const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
            exhaust.position.set(2.5, pos.y, pos.z);
            exhaust.rotation.x = Math.PI / 2;
            jetGroup.add(exhaust);
        });

        // Landing gear
        const gearGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const gearMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        
        // Front gear
        const frontGear = new THREE.Mesh(gearGeometry, gearMaterial);
        frontGear.position.set(-3, 1.5, 0);
        jetGroup.add(frontGear);
        
        // Main gears
        [-2, 2].forEach(z => {
            const mainGear = new THREE.Mesh(gearGeometry, gearMaterial);
            mainGear.position.set(1, 1.5, z);
            jetGroup.add(mainGear);
        });

        // Navigation lights
        const navLightGeometry = new THREE.SphereGeometry(0.1, 6, 6);
        
        // Wing tip lights
        const redLightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF0000,
            emissive: 0xFF0000,
            emissiveIntensity: 1
        });
        const greenLightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00FF00,
            emissive: 0x00FF00,
            emissiveIntensity: 1
        });
        
        const redLight = new THREE.Mesh(navLightGeometry, redLightMaterial);
        redLight.position.set(0, 3, -4.2);
        jetGroup.add(redLight);
        
        const greenLight = new THREE.Mesh(navLightGeometry, greenLightMaterial);
        greenLight.position.set(0, 3, 4.2);
        jetGroup.add(greenLight);

        jetGroup.userData = { type: 'private_jet', maxSpeed: 5, acceleration: 0.05, canFly: true };
        return jetGroup;
    } catch (error) {
        console.error('Error creating private jet:', error);
        return null;
    }
}

function createDragon() {
    const dragonGroup = new THREE.Group();
    
    try {
        // Dragon body (elongated and curved)
        const bodyGeometry = new THREE.CylinderGeometry(0.6, 1, 8, 8);
        const dragonMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8B0000,
            emissive: 0x8B0000,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, dragonMaterial);
        body.rotation.z = Math.PI / 2;
        body.position.y = 4;
        body.castShadow = true;
        dragonGroup.add(body);

        // Dragon head
        const headGeometry = new THREE.SphereGeometry(1.2, 8, 8);
        const head = new THREE.Mesh(headGeometry, dragonMaterial);
        head.position.set(-4.5, 4.5, 0);
        head.castShadow = true;
        dragonGroup.add(head);

        // Dragon snout
        const snoutGeometry = new THREE.ConeGeometry(0.4, 1.5, 6);
        const snout = new THREE.Mesh(snoutGeometry, dragonMaterial);
        snout.position.set(-5.8, 4.3, 0);
        snout.rotation.z = Math.PI / 2;
        dragonGroup.add(snout);

        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 6, 6);
        const eyeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF0000,
            emissive: 0xFF0000,
            emissiveIntensity: 1
        });
        
        [-0.4, 0.4].forEach(z => {
            const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eye.position.set(-5, 4.8, z);
            dragonGroup.add(eye);
        });

        // Horns
        const hornGeometry = new THREE.ConeGeometry(0.1, 0.8, 6);
        const hornMaterial = new THREE.MeshLambertMaterial({ color: 0x4B0000 });
        
        [-0.3, 0.3].forEach(z => {
            const horn = new THREE.Mesh(hornGeometry, hornMaterial);
            horn.position.set(-4.2, 5.5, z);
            horn.rotation.x = -0.3;
            dragonGroup.add(horn);
        });

        // Wings (large and membranous)
        const wingGeometry = new THREE.ConeGeometry(4, 6, 4);
        const wingMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4B0000,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        
        // Left wing
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-1, 6, -5);
        leftWing.rotation.set(Math.PI / 6, 0, Math.PI / 4);
        leftWing.userData = { type: 'dragon_wing', side: 0 };
        dragonGroup.add(leftWing);

        // Right wing
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(-1, 6, 5);
        rightWing.rotation.set(Math.PI / 6, 0, -Math.PI / 4);
        rightWing.userData = { type: 'dragon_wing', side: 1 };
        dragonGroup.add(rightWing);

        // Wing membranes (connecting lines)
        const membraneGeometry = new THREE.PlaneGeometry(3, 0.1);
        const membraneMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2B0000,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
        });
        
        for (let i = 0; i < 3; i++) {
            // Left wing membranes
            const leftMembrane = new THREE.Mesh(membraneGeometry, membraneMaterial);
            leftMembrane.position.set(-1 + i * 0.5, 5 + i * 0.3, -4 - i * 0.4);
            leftMembrane.rotation.z = Math.PI / 4;
            dragonGroup.add(leftMembrane);
            
            // Right wing membranes
            const rightMembrane = new THREE.Mesh(membraneGeometry, membraneMaterial);
            rightMembrane.position.set(-1 + i * 0.5, 5 + i * 0.3, 4 + i * 0.4);
            rightMembrane.rotation.z = -Math.PI / 4;
            dragonGroup.add(rightMembrane);
        }

        // Tail
        const tailGeometry = new THREE.ConeGeometry(0.3, 4, 6);
        const tail = new THREE.Mesh(tailGeometry, dragonMaterial);
        tail.position.set(5, 3.5, 0);
        tail.rotation.z = Math.PI / 2;
        dragonGroup.add(tail);

        // Tail spikes
        for (let i = 0; i < 4; i++) {
            const spikeGeometry = new THREE.ConeGeometry(0.1, 0.6, 4);
            const spike = new THREE.Mesh(spikeGeometry, hornMaterial);
            spike.position.set(3 + i * 0.8, 4.2, 0);
            spike.rotation.x = Math.random() * 0.4 - 0.2;
            dragonGroup.add(spike);
        }

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 6);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        
        const legPositions = [
            { x: -1.5, z: -1 },
            { x: -1.5, z: 1 },
            { x: 1.5, z: -1 },
            { x: 1.5, z: 1 }
        ];
        
        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(pos.x, 2, pos.z);
            dragonGroup.add(leg);
            
            // Claws
            const clawGeometry = new THREE.ConeGeometry(0.15, 0.5, 4);
            for (let j = 0; j < 3; j++) {
                const claw = new THREE.Mesh(clawGeometry, hornMaterial);
                claw.position.set(
                    pos.x + (j - 1) * 0.2, 
                    0.8, 
                    pos.z + (j - 1) * 0.1
                );
                claw.rotation.x = Math.PI;
                dragonGroup.add(claw);
            }
        });

        // Fire breath effect (particles)
        const fireGroup = new THREE.Group();
        for (let i = 0; i < 8; i++) {
            const fireGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 6, 6);
            const fireMaterial = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(Math.random() * 0.1, 1, 0.5),
                emissive: new THREE.Color().setHSL(Math.random() * 0.1, 1, 0.8),
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.8
            });
            const fire = new THREE.Mesh(fireGeometry, fireMaterial);
            fire.position.set(
                -6.5 - i * 0.3,
                4.3 + (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.6
            );
            fire.userData = { 
                type: 'fire_particle',
                speed: Math.random() * 0.1 + 0.05,
                life: Math.random() * 2 + 1
            };
            fireGroup.add(fire);
        }
        fireGroup.userData = { type: 'fire_breath' };
        dragonGroup.add(fireGroup);

        // Saddle for rider
        const saddleGeometry = new THREE.CylinderGeometry(0.8, 1, 0.3, 8);
        const saddleMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const saddle = new THREE.Mesh(saddleGeometry, saddleMaterial);
        saddle.position.set(0, 4.8, 0);
        dragonGroup.add(saddle);

        dragonGroup.userData = { 
            type: 'dragon', 
            maxSpeed: 3, 
            acceleration: 0.08, 
            canFly: true,
            wingFlap: 0,
            fireBreath: true
        };
        return dragonGroup;
    } catch (error) {
        console.error('Error creating dragon:', error);
        return null;
    }
}

// Vehicle animation and control system
function animateVehicles() {
    if (!scene) return;
    
    try {
        scene.traverse((child) => {
            if (child.userData && child.userData.isVehicle) {
                const time = Date.now() * 0.001;
                
                // Animate wheels for ground vehicles
                if (child.userData.type === 'sports_car' || child.userData.type === 'motorcycle') {
                    child.traverse((wheel) => {
                        if (wheel.userData && wheel.userData.type === 'wheel') {
                            wheel.rotation.x += 0.1;
                        }
                    });
                }
                
                // Animate dragon wings
                if (child.userData.type === 'dragon') {
                    child.userData.wingFlap += 0.15;
                    child.traverse((wing) => {
                        if (wing.userData && wing.userData.type === 'dragon_wing') {
                            const flapAmount = Math.sin(child.userData.wingFlap) * 0.3;
                            wing.rotation.x += wing.userData.side === 0 ? flapAmount : -flapAmount;
                        }
                    });
                    
                    // Animate fire particles
                    child.traverse((fire) => {
                        if (fire.userData && fire.userData.type === 'fire_particle') {
                            fire.position.x -= fire.userData.speed;
                            fire.userData.life -= 0.016;
                            fire.material.opacity = Math.max(0, fire.userData.life / 2);
                            
                            // Reset fire particle
                            if (fire.userData.life <= 0) {
                                fire.position.x = -6.5;
                                fire.userData.life = Math.random() * 2 + 1;
                                fire.material.opacity = 0.8;
                            }
                        }
                    });
                    
                    // Gentle floating motion
                    child.position.y = 4 + Math.sin(time * 2) * 0.3;
                }
                
                // Animate jet engines
                if (child.userData.type === 'private_jet') {
                    // Engine glow effect
                    child.traverse((engine) => {
                        if (engine.material && engine.material.emissive) {
                            engine.material.emissiveIntensity = 0.5 + Math.sin(time * 10) * 0.3;
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.error('Error animating vehicles:', error);
    }
}

// Vehicle movement system (basic)
let vehicleControls = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

// Enhanced keyboard controls for vehicles
document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    
    // Find active vehicle
    let activeVehicle = null;
    scene.traverse((child) => {
        if (child.userData && child.userData.isVehicle) {
            activeVehicle = child;
        }
    });
    
    if (!activeVehicle) return;
    
    const speed = activeVehicle.userData.maxSpeed * 0.3 || 0.5;
    
    switch(event.code) {
        case 'KeyW':
            activeVehicle.position.z -= speed;
            if (window.avatar) {
                window.avatar.position.z -= speed;
            }
            break;
        case 'KeyS':
            activeVehicle.position.z += speed;
            if (window.avatar) {
                window.avatar.position.z += speed;
            }
            break;
        case 'KeyA':
            activeVehicle.position.x -= speed;
            activeVehicle.rotation.y += 0.05;
            if (window.avatar) {
                window.avatar.position.x -= speed;
            }
            break;
        case 'KeyD':
            activeVehicle.position.x += speed;
            activeVehicle.rotation.y -= 0.05;
            if (window.avatar) {
                window.avatar.position.x += speed;
            }
            break;
        case 'Space':
            // Flying vehicles can go up
            if (activeVehicle.userData.canFly) {
                event.preventDefault();
                activeVehicle.position.y += speed * 0.5;
                if (window.avatar) {
                    window.avatar.position.y += speed * 0.5;
                }
            }
            break;
        case 'ShiftLeft':
            // Flying vehicles can go down
            if (activeVehicle.userData.canFly) {
                activeVehicle.position.y -= speed * 0.5;
                if (window.avatar) {
                    window.avatar.position.y = Math.max(0, window.avatar.position.y - speed * 0.5);
                }
            }
            break;
        case 'KeyF':
            // Special abilities (dragon fire breath, jet afterburner, etc.)
            if (activeVehicle.userData.fireBreath) {
                triggerFireBreath(activeVehicle);
            }
            break;
    }
    
    // Update camera to follow vehicle
    if (window.camera) {
        window.camera.position.x = activeVehicle.position.x;
        window.camera.position.z = activeVehicle.position.z + 8;
        window.camera.position.y = activeVehicle.position.y + 3;
        window.camera.lookAt(activeVehicle.position);
    }
});

function triggerFireBreath(dragon) {
    try {
        // Create temporary fire blast effect
        const fireBlast = new THREE.Group();
        
        for (let i = 0; i < 15; i++) {
            const fireGeometry = new THREE.SphereGeometry(Math.random() * 0.3 + 0.2, 6, 6);
            const fireMaterial = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color().setHSL(Math.random() * 0.1, 1, 0.6),
                emissive: new THREE.Color().setHSL(Math.random() * 0.1, 1, 0.9),
                emissiveIntensity: 1,
                transparent: true,
                opacity: 0.9
            });
            const fire = new THREE.Mesh(fireGeometry, fireMaterial);
            fire.position.set(
                -8 - Math.random() * 5,
                dragon.position.y + (Math.random() - 0.5) * 2,
                dragon.position.z + (Math.random() - 0.5) * 3
            );
            fireBlast.add(fire);
        }
        
        scene.add(fireBlast);
        
        // Remove fire blast after animation
        setTimeout(() => {
            if (fireBlast.parent) {
                fireBlast.traverse((child) => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
                scene.remove(fireBlast);
            }
        }, 2000);
        
        if (window.HeartQuest && window.HeartQuest.showNotification) {
            window.HeartQuest.showNotification('🔥 Dragon breathes fire!');
        }
    } catch (error) {
        console.error('Error creating fire breath:', error);
    }
}

// Vehicle upgrade system
function upgradeVehicle(vehicleType, upgrade) {
    try {
        scene.traverse((child) => {
            if (child.userData && child.userData.isVehicle && child.userData.type === vehicleType) {
                switch(upgrade) {
                    case 'speed':
                        child.userData.maxSpeed *= 1.5;
                        addSpeedUpgrade(child);
                        break;
                    case 'appearance':
                        upgradeAppearance(child);
                        break;
                    case 'special':
                        addSpecialFeatures(child);
                        break;
                }
                
                if (window.HeartQuest && window.HeartQuest.showNotification) {
                    window.HeartQuest.showNotification(`🔧 Vehicle upgraded: ${upgrade}!`);
                    window.HeartQuest.updateStats('coins', -500);
                }
            }
        });
    } catch (error) {
        console.error('Error upgrading vehicle:', error);
    }
}

function addSpeedUpgrade(vehicle) {
    // Add visual speed indicators (flames, boost effects)
    const boostGeometry = new THREE.ConeGeometry(0.2, 1, 6);
    const boostMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00FFFF,
        emissive: 0x00FFFF,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.7
    });
    
    for (let i = 0; i < 4; i++) {
        const boost = new THREE.Mesh(boostGeometry, boostMaterial);
        boost.position.set(
            vehicle.userData.type === 'dragon' ? 6 : 2,
            vehicle.position.y,
            (i - 1.5) * 0.5
        );
        boost.rotation.z = Math.PI / 2;
        boost.userData = { type: 'speed_boost' };
        vehicle.add(boost);
    }
}

function upgradeAppearance(vehicle) {
    // Add chrome/metallic finish
    vehicle.traverse((child) => {
        if (child.material && child.material.color) {
            child.material.metalness = 0.8;
            child.material.roughness = 0.2;
            child.material.emissiveIntensity += 0.1;
        }
    });
    
    // Add decorative elements
    if (vehicle.userData.type === 'sports_car') {
        addSpoiler(vehicle);
    } else if (vehicle.userData.type === 'dragon') {
        addDragonArmor(vehicle);
    }
}

function addSpoiler(car) {
    const spoilerGeometry = new THREE.BoxGeometry(2, 0.1, 0.5);
    const spoilerMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const spoiler = new THREE.Mesh(spoilerGeometry, spoilerMaterial);
    spoiler.position.set(1.8, 1.2, 0);
    car.add(spoiler);
}

function addDragonArmor(dragon) {
    // Add armor plates
    for (let i = 0; i < 5; i++) {
        const armorGeometry = new THREE.BoxGeometry(0.8, 0.1, 1.2);
        const armorMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xC0C0C0,
            emissive: 0x111111,
            emissiveIntensity: 0.3
        });
        const armor = new THREE.Mesh(armorGeometry, armorMaterial);
        armor.position.set(-3 + i * 1.5, 4.2, 0);
        armor.rotation.x = (Math.random() - 0.5) * 0.2;
        dragon.add(armor);
    }
}

function addSpecialFeatures(vehicle) {
    switch(vehicle.userData.type) {
        case 'sports_car':
            addNitroSystem(vehicle);
            break;
        case 'private_jet':
            addCloakingDevice(vehicle);
            break;
        case 'dragon':
            addMagicAura(vehicle);
            break;
        case 'motorcycle':
            addJumpSystem(vehicle);
            break;
    }
}

function addNitroSystem(car) {
    // Add nitro flames
    const nitroGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const flameGeometry = new THREE.ConeGeometry(0.1, 0.8, 4);
        const flameMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x0080FF,
            emissive: 0x0080FF,
            emissiveIntensity: 1
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(2.5 + i * 0.1, 0.5, (i % 2 === 0 ? -0.3 : 0.3));
        flame.rotation.z = Math.PI / 2;
        nitroGroup.add(flame);
    }
    nitroGroup.userData = { type: 'nitro_system' };
    car.add(nitroGroup);
}

function addCloakingDevice(jet) {
    // Add shimmering effect
    jet.traverse((child) => {
        if (child.material) {
            child.material.transparent = true;
            child.material.opacity = 0.7;
        }
    });
    
    jet.userData.cloaked = true;
}

function addMagicAura(dragon) {
    // Add magical particle system
    const auraGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
            emissive: new THREE.Color().setHSL(Math.random(), 0.8, 0.8),
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.8
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4
        );
        particle.userData = { 
            type: 'magic_particle',
            orbit: Math.random() * 0.02 + 0.01,
            phase: Math.random() * Math.PI * 2
        };
        auraGroup.add(particle);
    }
    auraGroup.userData = { type: 'magic_aura' };
    dragon.add(auraGroup);
}

function addJumpSystem(bike) {
    // Add hydraulic boosters
    const boosterGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 6);
    const boosterMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xFF4500,
        emissive: 0xFF4500,
        emissiveIntensity: 0.3
    });
    
    const positions = [
        { x: -1.3, y: 0.2, z: 0 },
        { x: 1.3, y: 0.2, z: 0 }
    ];
    
    positions.forEach(pos => {
        const booster = new THREE.Mesh(boosterGeometry, boosterMaterial);
        booster.position.set(pos.x, pos.y, pos.z);
        booster.userData = { type: 'jump_booster' };
        bike.add(booster);
    });
}

// Vehicle cleanup function
function removeVehicle() {
    scene.traverse((child) => {
        if (child.userData && child.userData.isVehicle) {
            // Dispose of geometries and materials
            child.traverse((subChild) => {
                if (subChild.geometry) subChild.geometry.dispose();
                if (subChild.material) {
                    if (Array.isArray(subChild.material)) {
                        subChild.material.forEach(mat => mat.dispose());
                    } else {
                        subChild.material.dispose();
                    }
                }
            });
            scene.remove(child);
        }
    });
}

// Vehicle selection and management
function selectVehicle(vehicleType) {
    // Remove current vehicle
    removeVehicle();
    
    // Spawn new vehicle
    setTimeout(() => {
        spawnVehicle(vehicleType);
    }, 100);
}

// Vehicle physics (basic)
function updateVehiclePhysics() {
    scene.traverse((child) => {
        if (child.userData && child.userData.isVehicle) {
            // Basic gravity for non-flying vehicles
            if (!child.userData.canFly && child.position.y > 0) {
                child.position.y = Math.max(0, child.position.y - 0.1);
                
                // Update avatar position with vehicle
                if (window.avatar) {
                    window.avatar.position.y = Math.max(0, child.position.y);
                }
            }
            
            // Keep vehicles in world bounds
            const bounds = 100;
            child.position.x = Math.max(-bounds, Math.min(bounds, child.position.x));
            child.position.z = Math.max(-bounds, Math.min(bounds, child.position.z));
            
            // Flying vehicles have altitude limits
            if (child.userData.canFly) {
                child.position.y = Math.max(0, Math.min(50, child.position.y));
            }
        }
    });
}

// Advanced vehicle effects
function addVehicleTrail(vehicle) {
    const trailGeometry = new THREE.SphereGeometry(0.1, 6, 6);
    const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.6
    });
    
    for (let i = 0; i < 10; i++) {
        const trail = new THREE.Mesh(trailGeometry, trailMaterial.clone());
        trail.position.set(
            vehicle.position.x + i * 0.3,
            vehicle.position.y,
            vehicle.position.z
        );
        trail.userData = {
            type: 'trail_particle',
            life: 2,
            maxLife: 2
        };
        scene.add(trail);
        
        // Remove trail after fade
        setTimeout(() => {
            if (trail.parent) {
                trail.geometry.dispose();
                trail.material.dispose();
                scene.remove(trail);
            }
        }, 2000);
    }
}

// Vehicle sound effects (placeholder)
function playVehicleSound(vehicleType, action) {
    // In a full implementation, this would play actual sounds
    const soundMap = {
        sports_car: {
            start: '🚗 Engine roars to life!',
            drive: '🏎️ Tires screech!',
            horn: '🚗 BEEP BEEP!'
        },
        motorcycle: {
            start: '🏍️ Bike revs up!',
            drive: '💨 Wind rushing!',
            horn: '🔊 VROOM!'
        },
        dragon: {
            start: '🐉 Dragon awakens!',
            drive: '🔥 Wings flapping!',
            roar: '🗣️ ROOOAAAAR!'
        },
        private_jet: {
            start: '✈️ Engines spooling up!',
            drive: '🌪️ Jet engines whoosh!',
            horn: '📢 Tower, requesting clearance!'
        }
    };
    
    const sound = soundMap[vehicleType]?.[action];
    if (sound && window.HeartQuest && window.HeartQuest.showNotification) {
        window.HeartQuest.showNotification(sound);
    }
}

// Vehicle damage system (basic)
function damageVehicle(vehicle, amount) {
    if (!vehicle.userData.health) {
        vehicle.userData.health = 100;
    }
    
    vehicle.userData.health -= amount;
    
    // Visual damage effects
    if (vehicle.userData.health < 50) {
        // Add smoke effects
        addSmokeEffect(vehicle);
    }
    
    if (vehicle.userData.health <= 0) {
        // Vehicle destroyed
        explodeVehicle(vehicle);
    }
}

function addSmokeEffect(vehicle) {
    const smokeGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const smokeGeometry = new THREE.SphereGeometry(0.2, 6, 6);
        const smokeMaterial = new THREE.MeshBasicMaterial({
            color: 0x555555,
            transparent: true,
            opacity: 0.5
        });
        const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
        smoke.position.set(
            (Math.random() - 0.5) * 2,
            Math.random() * 2,
            (Math.random() - 0.5) * 2
        );
        smoke.userData = {
            type: 'smoke_particle',
            rise: 0.02,
            fade: 0.01
        };
        smokeGroup.add(smoke);
    }
    vehicle.add(smokeGroup);
}

function explodeVehicle(vehicle) {
    // Create explosion effect
    const explosionGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const explosionGeometry = new THREE.SphereGeometry(Math.random() * 0.3 + 0.1, 6, 6);
        const explosionMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random() * 0.1, 1, 0.6),
            emissive: new THREE.Color().setHSL(Math.random() * 0.1, 1, 0.8),
            emissiveIntensity: 1
        });
        const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
        explosion.position.set(
            vehicle.position.x + (Math.random() - 0.5) * 4,
            vehicle.position.y + (Math.random() - 0.5) * 4,
            vehicle.position.z + (Math.random() - 0.5) * 4
        );
        explosionGroup.add(explosion);
    }
    
    scene.add(explosionGroup);
    removeVehicle();
    
    // Remove explosion after animation
    setTimeout(() => {
        explosionGroup.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
        scene.remove(explosionGroup);
    }, 3000);
    
    if (window.HeartQuest && window.HeartQuest.showNotification) {
        window.HeartQuest.showNotification('💥 Vehicle destroyed!');
    }
}

// Animation loop integration
function animateVehicleEffects() {
    const time = Date.now() * 0.001;
    
    scene.traverse((child) => {
        if (child.userData) {
            switch(child.userData.type) {
                case 'trail_particle':
                    child.userData.life -= 0.016;
                    child.material.opacity = child.userData.life / child.userData.maxLife;
                    if (child.userData.life <= 0) {
                        child.geometry.dispose();
                        child.material.dispose();
                        scene.remove(child);
                    }
                    break;
                    
                case 'smoke_particle':
                    child.position.y += child.userData.rise;
                    child.material.opacity -= child.userData.fade;
                    if (child.material.opacity <= 0) {
                        child.geometry.dispose();
                        child.material.dispose();
                        child.parent.remove(child);
                    }
                    break;
                    
                case 'magic_particle':
                    if (child.userData.orbit && child.userData.phase !== undefined) {
                        const phase = child.userData.phase;
                        child.position.y += Math.sin(time * 2 + phase) * 0.01;
                        child.position.x += Math.cos(time + phase) * child.userData.orbit;
                        child.position.z += Math.sin(time + phase) * child.userData.orbit;
                    }
                    break;
            }
        }
    });
}

// Export vehicle functions for use in main game loop
if (typeof window !== 'undefined') {
    window.animateVehicles = animateVehicles;
    window.removeVehicle = removeVehicle;
    window.upgradeVehicle = upgradeVehicle;
    window.selectVehicle = selectVehicle;
    window.updateVehiclePhysics = updateVehiclePhysics;
    window.animateVehicleEffects = animateVehicleEffects;
    window.spawnVehicle = spawnVehicle;
    window.playVehicleSound = playVehicleSound;
    window.damageVehicle = damageVehicle;
}