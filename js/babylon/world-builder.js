/**
 * HeartQuest - World Builder
 * Creates and manages different virtual worlds
 */

class WorldBuilder {
    constructor(scene) {
        this.scene = scene;
        this.currentWorld = null;
        this.worlds = {};
        this.worldMeshes = [];
    }

    /**
     * Build a specific world
     */
    buildWorld(worldName) {
        // Clear current world
        this.clearWorld();

        console.log(`🌍 Building world: ${worldName}`);

        switch (worldName) {
            case 'paradise':
                this.buildParadiseIsland();
                break;
            case 'city':
                this.buildNeonCity();
                break;
            case 'fantasy':
                this.buildFantasyKingdom();
                break;
            case 'space':
                this.buildSpaceStation();
                break;
            case 'underwater':
                this.buildUnderwaterCity();
                break;
            case 'mountain':
                this.buildMountainPeak();
                break;
            default:
                this.buildParadiseIsland();
        }

        this.currentWorld = worldName;
    }

    /**
     * Paradise Island - Tropical beach paradise
     */
    buildParadiseIsland() {
        // Sky color
        this.scene.clearColor = new BABYLON.Color4(0.53, 0.81, 0.92, 1.0);

        // Beach ground
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, this.scene);
        const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.95, 0.9, 0.7); // Sand color
        ground.material = groundMat;
        ground.receiveShadows = true;
        this.worldMeshes.push(ground);

        // Ocean
        const ocean = BABYLON.MeshBuilder.CreateGround('ocean', { width: 200, height: 200 }, this.scene);
        ocean.position.y = -0.5;
        const oceanMat = new BABYLON.StandardMaterial('oceanMat', this.scene);
        oceanMat.diffuseColor = new BABYLON.Color3(0.0, 0.5, 0.8);
        oceanMat.alpha = 0.7;
        ocean.material = oceanMat;
        this.worldMeshes.push(ocean);

        // Palm trees
        for (let i = 0; i < 10; i++) {
            const tree = this.createPalmTree();
            const angle = (i / 10) * Math.PI * 2;
            const radius = 15 + Math.random() * 10;
            tree.position.x = Math.cos(angle) * radius;
            tree.position.z = Math.sin(angle) * radius;
            this.worldMeshes.push(tree);
        }

        // Sun
        const sun = BABYLON.MeshBuilder.CreateSphere('sun', { diameter: 10 }, this.scene);
        sun.position = new BABYLON.Vector3(50, 30, -50);
        const sunMat = new BABYLON.StandardMaterial('sunMat', this.scene);
        sunMat.emissiveColor = new BABYLON.Color3(1, 0.9, 0.5);
        sun.material = sunMat;
        this.worldMeshes.push(sun);

        console.log('🏖️ Paradise Island built');
    }

    /**
     * Neon City - Futuristic cyberpunk city
     */
    buildNeonCity() {
        // Night sky
        this.scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.15, 1.0);

        // City ground
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, this.scene);
        const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.25);
        ground.material = groundMat;
        ground.receiveShadows = true;
        this.worldMeshes.push(ground);

        // Buildings
        const buildingColors = [
            new BABYLON.Color3(0, 1, 1),
            new BABYLON.Color3(1, 0, 1),
            new BABYLON.Color3(1, 0.5, 0),
            new BABYLON.Color3(0, 1, 0.5)
        ];

        for (let i = 0; i < 20; i++) {
            const height = 5 + Math.random() * 20;
            const building = BABYLON.MeshBuilder.CreateBox('building' + i, { 
                width: 3, 
                height: height, 
                depth: 3 
            }, this.scene);
            
            building.position.x = (Math.random() - 0.5) * 80;
            building.position.y = height / 2;
            building.position.z = (Math.random() - 0.5) * 80;
            
            const buildingMat = new BABYLON.StandardMaterial('buildingMat' + i, this.scene);
            buildingMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.15);
            buildingMat.emissiveColor = buildingColors[Math.floor(Math.random() * buildingColors.length)];
            buildingMat.emissiveColor = buildingMat.emissiveColor.scale(0.3);
            building.material = buildingMat;
            
            this.worldMeshes.push(building);
        }

        console.log('🏙️ Neon City built');
    }

    /**
     * Fantasy Kingdom - Medieval fantasy world
     */
    buildFantasyKingdom() {
        // Fantasy sky
        this.scene.clearColor = new BABYLON.Color4(0.6, 0.4, 0.8, 1.0);

        // Grass ground
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, this.scene);
        const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.2);
        ground.material = groundMat;
        ground.receiveShadows = true;
        this.worldMeshes.push(ground);

        // Castle
        const castle = this.createCastle();
        castle.position = new BABYLON.Vector3(0, 0, -20);
        this.worldMeshes.push(castle);

        // Trees
        for (let i = 0; i < 15; i++) {
            const tree = this.createFantasyTree();
            tree.position.x = (Math.random() - 0.5) * 60;
            tree.position.z = (Math.random() - 0.5) * 60;
            if (Math.abs(tree.position.z) < 25) continue; // Avoid castle area
            this.worldMeshes.push(tree);
        }

        console.log('🏰 Fantasy Kingdom built');
    }

    /**
     * Space Station - Futuristic space environment
     */
    buildSpaceStation() {
        // Space background
        this.scene.clearColor = new BABYLON.Color4(0.0, 0.0, 0.05, 1.0);

        // Station platform
        const platform = BABYLON.MeshBuilder.CreateCylinder('platform', { 
            diameter: 40, 
            height: 2 
        }, this.scene);
        const platformMat = new BABYLON.StandardMaterial('platformMat', this.scene);
        platformMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
        platformMat.emissiveColor = new BABYLON.Color3(0.1, 0.2, 0.3);
        platform.material = platformMat;
        platform.receiveShadows = true;
        this.worldMeshes.push(platform);

        // Central dome
        const dome = BABYLON.MeshBuilder.CreateSphere('dome', { 
            diameter: 15, 
            slice: 0.5 
        }, this.scene);
        dome.position.y = 5;
        const domeMat = new BABYLON.StandardMaterial('domeMat', this.scene);
        domeMat.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.6);
        domeMat.alpha = 0.5;
        dome.material = domeMat;
        this.worldMeshes.push(dome);

        // Stars
        for (let i = 0; i < 100; i++) {
            const star = BABYLON.MeshBuilder.CreateSphere('star' + i, { diameter: 0.5 }, this.scene);
            star.position = new BABYLON.Vector3(
                (Math.random() - 0.5) * 200,
                Math.random() * 100 + 20,
                (Math.random() - 0.5) * 200
            );
            const starMat = new BABYLON.StandardMaterial('starMat' + i, this.scene);
            starMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
            star.material = starMat;
            this.worldMeshes.push(star);
        }

        console.log('🚀 Space Station built');
    }

    /**
     * Underwater City - Submerged civilization
     */
    buildUnderwaterCity() {
        // Ocean color
        this.scene.clearColor = new BABYLON.Color4(0.0, 0.2, 0.4, 1.0);

        // Ocean floor
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, this.scene);
        const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.4, 0.5, 0.3);
        ground.material = groundMat;
        ground.receiveShadows = true;
        this.worldMeshes.push(ground);

        // Bubbles dome
        const dome = BABYLON.MeshBuilder.CreateSphere('dome', { 
            diameter: 30, 
            slice: 0.5 
        }, this.scene);
        dome.position.y = 3;
        const domeMat = new BABYLON.StandardMaterial('domeMat', this.scene);
        domeMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.8);
        domeMat.alpha = 0.3;
        dome.material = domeMat;
        this.worldMeshes.push(dome);

        // Coral structures
        for (let i = 0; i < 20; i++) {
            const coral = BABYLON.MeshBuilder.CreateCylinder('coral' + i, {
                height: 1 + Math.random() * 3,
                diameterTop: 0.3,
                diameterBottom: 0.5
            }, this.scene);
            coral.position.x = (Math.random() - 0.5) * 60;
            coral.position.y = coral.scaling.y / 2;
            coral.position.z = (Math.random() - 0.5) * 60;
            
            const coralMat = new BABYLON.StandardMaterial('coralMat' + i, this.scene);
            coralMat.diffuseColor = new BABYLON.Color3(
                0.5 + Math.random() * 0.5,
                0.2 + Math.random() * 0.3,
                0.5 + Math.random() * 0.5
            );
            coral.material = coralMat;
            this.worldMeshes.push(coral);
        }

        console.log('🐠 Underwater City built');
    }

    /**
     * Mountain Peak - High altitude mountain
     */
    buildMountainPeak() {
        // Sky color
        this.scene.clearColor = new BABYLON.Color4(0.7, 0.85, 1.0, 1.0);

        // Mountain ground
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { 
            width: 100, 
            height: 100,
            subdivisions: 50
        }, this.scene);
        
        // Make it uneven (simple approach)
        const positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        for (let i = 0; i < positions.length; i += 3) {
            const distance = Math.sqrt(positions[i] * positions[i] + positions[i + 2] * positions[i + 2]);
            positions[i + 1] = Math.max(0, 5 - distance * 0.1) + Math.random() * 2;
        }
        ground.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        ground.createNormals(true);
        
        const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.9); // Snow color
        ground.material = groundMat;
        ground.receiveShadows = true;
        this.worldMeshes.push(ground);

        // Pine trees
        for (let i = 0; i < 10; i++) {
            const tree = this.createPineTree();
            const angle = (i / 10) * Math.PI * 2;
            const radius = 10 + Math.random() * 10;
            tree.position.x = Math.cos(angle) * radius;
            tree.position.z = Math.sin(angle) * radius;
            tree.position.y = 1;
            this.worldMeshes.push(tree);
        }

        console.log('🏔️ Mountain Peak built');
    }

    /**
     * Helper: Create palm tree
     */
    createPalmTree() {
        const tree = new BABYLON.TransformNode('palmTree', this.scene);
        
        // Trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder('trunk', { 
            height: 5, 
            diameter: 0.3 
        }, this.scene);
        trunk.position.y = 2.5;
        trunk.parent = tree;
        const trunkMat = new BABYLON.StandardMaterial('trunkMat', this.scene);
        trunkMat.diffuseColor = new BABYLON.Color3(0.4, 0.3, 0.2);
        trunk.material = trunkMat;
        
        // Leaves
        for (let i = 0; i < 6; i++) {
            const leaf = BABYLON.MeshBuilder.CreateCylinder('leaf', { 
                height: 3, 
                diameter: 0.5 
            }, this.scene);
            const angle = (i / 6) * Math.PI * 2;
            leaf.position.y = 5;
            leaf.rotation.z = Math.PI / 3;
            leaf.rotation.y = angle;
            leaf.parent = tree;
            const leafMat = new BABYLON.StandardMaterial('leafMat', this.scene);
            leafMat.diffuseColor = new BABYLON.Color3(0.1, 0.6, 0.1);
            leaf.material = leafMat;
        }
        
        return tree;
    }

    /**
     * Helper: Create fantasy tree
     */
    createFantasyTree() {
        const tree = new BABYLON.TransformNode('fantasyTree', this.scene);
        
        // Trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder('trunk', { 
            height: 4, 
            diameter: 0.5 
        }, this.scene);
        trunk.position.y = 2;
        trunk.parent = tree;
        const trunkMat = new BABYLON.StandardMaterial('trunkMat', this.scene);
        trunkMat.diffuseColor = new BABYLON.Color3(0.3, 0.2, 0.1);
        trunk.material = trunkMat;
        
        // Foliage
        const foliage = BABYLON.MeshBuilder.CreateSphere('foliage', { diameter: 3 }, this.scene);
        foliage.position.y = 5;
        foliage.parent = tree;
        const foliageMat = new BABYLON.StandardMaterial('foliageMat', this.scene);
        foliageMat.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.2);
        foliage.material = foliageMat;
        
        return tree;
    }

    /**
     * Helper: Create pine tree
     */
    createPineTree() {
        const tree = new BABYLON.TransformNode('pineTree', this.scene);
        
        // Trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder('trunk', { 
            height: 3, 
            diameter: 0.3 
        }, this.scene);
        trunk.position.y = 1.5;
        trunk.parent = tree;
        const trunkMat = new BABYLON.StandardMaterial('trunkMat', this.scene);
        trunkMat.diffuseColor = new BABYLON.Color3(0.3, 0.2, 0.1);
        trunk.material = trunkMat;
        
        // Pine needles (cone shape)
        const needles = BABYLON.MeshBuilder.CreateCylinder('needles', { 
            height: 4, 
            diameterTop: 0.1,
            diameterBottom: 2 
        }, this.scene);
        needles.position.y = 4;
        needles.parent = tree;
        const needlesMat = new BABYLON.StandardMaterial('needlesMat', this.scene);
        needlesMat.diffuseColor = new BABYLON.Color3(0.1, 0.4, 0.1);
        needles.material = needlesMat;
        
        return tree;
    }

    /**
     * Helper: Create castle
     */
    createCastle() {
        const castle = new BABYLON.TransformNode('castle', this.scene);
        
        // Main keep
        const keep = BABYLON.MeshBuilder.CreateBox('keep', { 
            width: 8, 
            height: 12, 
            depth: 8 
        }, this.scene);
        keep.position.y = 6;
        keep.parent = castle;
        const keepMat = new BABYLON.StandardMaterial('keepMat', this.scene);
        keepMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        keep.material = keepMat;
        
        // Towers
        for (let i = 0; i < 4; i++) {
            const tower = BABYLON.MeshBuilder.CreateCylinder('tower', { 
                height: 15, 
                diameter: 3 
            }, this.scene);
            const x = i < 2 ? -5 : 5;
            const z = i % 2 === 0 ? -5 : 5;
            tower.position.set(x, 7.5, z);
            tower.parent = castle;
            tower.material = keepMat;
            
            // Tower roof
            const roof = BABYLON.MeshBuilder.CreateCylinder('roof', { 
                height: 2, 
                diameterTop: 0.1,
                diameterBottom: 3.5 
            }, this.scene);
            roof.position.set(x, 16, z);
            roof.parent = castle;
            const roofMat = new BABYLON.StandardMaterial('roofMat', this.scene);
            roofMat.diffuseColor = new BABYLON.Color3(0.6, 0.2, 0.2);
            roof.material = roofMat;
        }
        
        return castle;
    }

    /**
     * Clear current world
     */
    clearWorld() {
        this.worldMeshes.forEach(mesh => {
            if (mesh && !mesh.isDisposed()) {
                mesh.dispose();
            }
        });
        this.worldMeshes = [];
    }

    /**
     * Get current world name
     */
    getCurrentWorld() {
        return this.currentWorld;
    }
}

// Make WorldBuilder globally accessible
window.WorldBuilder = WorldBuilder;

