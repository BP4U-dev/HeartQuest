/**
 * HeartQuest - Avatar Creator
 * Handles 3D avatar creation and customization
 */

class AvatarCreator {
    constructor(scene) {
        this.scene = scene;
        this.avatar = null;
        this.avatarParts = {
            head: null,
            body: null,
            arms: null,
            legs: null,
            hair: null
        };
        this.currentConfig = {
            gender: 'male',
            height: 1.75,
            build: 50,
            skinColor: '#f4c2a1',
            hairStyle: 'short',
            hairColor: '#8b4513',
            clothingStyle: 'casual'
        };
    }

    /**
     * Create a basic humanoid avatar
     */
    createAvatar() {
        // Create parent mesh for the avatar
        this.avatar = new BABYLON.TransformNode('avatar', this.scene);
        this.avatar.position = new BABYLON.Vector3(0, 0, 0);

        // Create body parts
        this.createHead();
        this.createBody();
        this.createArms();
        this.createLegs();
        this.createHair();

        // Apply initial configuration
        this.applyConfiguration();

        console.log('✅ Avatar created successfully');
        return this.avatar;
    }

    /**
     * Create head mesh
     */
    createHead() {
        const head = BABYLON.MeshBuilder.CreateSphere(
            'head',
            { diameter: 0.3, segments: 16 },
            this.scene
        );
        head.position.y = 1.65;
        head.parent = this.avatar;
        
        const headMaterial = new BABYLON.StandardMaterial('headMaterial', this.scene);
        headMaterial.diffuseColor = this.hexToColor3(this.currentConfig.skinColor);
        head.material = headMaterial;
        
        this.avatarParts.head = head;
        
        // Add shadow
        if (window.sceneManager && window.sceneManager.shadowGenerator) {
            window.sceneManager.addShadowCaster(head);
        }
    }

    /**
     * Create body mesh
     */
    createBody() {
        const body = BABYLON.MeshBuilder.CreateCylinder(
            'body',
            { height: 0.8, diameter: 0.4, tessellation: 16 },
            this.scene
        );
        body.position.y = 1.1;
        body.parent = this.avatar;
        
        const bodyMaterial = new BABYLON.StandardMaterial('bodyMaterial', this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8); // Default clothing color
        body.material = bodyMaterial;
        
        this.avatarParts.body = body;
        
        if (window.sceneManager && window.sceneManager.shadowGenerator) {
            window.sceneManager.addShadowCaster(body);
        }
    }

    /**
     * Create arms
     */
    createArms() {
        const armContainer = new BABYLON.TransformNode('arms', this.scene);
        armContainer.parent = this.avatar;
        
        // Left arm
        const leftArm = BABYLON.MeshBuilder.CreateCylinder(
            'leftArm',
            { height: 0.7, diameter: 0.12, tessellation: 8 },
            this.scene
        );
        leftArm.position = new BABYLON.Vector3(-0.3, 1.1, 0);
        leftArm.parent = armContainer;
        
        // Right arm
        const rightArm = BABYLON.MeshBuilder.CreateCylinder(
            'rightArm',
            { height: 0.7, diameter: 0.12, tessellation: 8 },
            this.scene
        );
        rightArm.position = new BABYLON.Vector3(0.3, 1.1, 0);
        rightArm.parent = armContainer;
        
        // Apply skin material
        const armMaterial = new BABYLON.StandardMaterial('armMaterial', this.scene);
        armMaterial.diffuseColor = this.hexToColor3(this.currentConfig.skinColor);
        leftArm.material = armMaterial;
        rightArm.material = armMaterial;
        
        this.avatarParts.arms = armContainer;
        
        if (window.sceneManager && window.sceneManager.shadowGenerator) {
            window.sceneManager.addShadowCaster(leftArm);
            window.sceneManager.addShadowCaster(rightArm);
        }
    }

    /**
     * Create legs
     */
    createLegs() {
        const legContainer = new BABYLON.TransformNode('legs', this.scene);
        legContainer.parent = this.avatar;
        
        // Left leg
        const leftLeg = BABYLON.MeshBuilder.CreateCylinder(
            'leftLeg',
            { height: 0.9, diameter: 0.15, tessellation: 8 },
            this.scene
        );
        leftLeg.position = new BABYLON.Vector3(-0.12, 0.45, 0);
        leftLeg.parent = legContainer;
        
        // Right leg
        const rightLeg = BABYLON.MeshBuilder.CreateCylinder(
            'rightLeg',
            { height: 0.9, diameter: 0.15, tessellation: 8 },
            this.scene
        );
        rightLeg.position = new BABYLON.Vector3(0.12, 0.45, 0);
        rightLeg.parent = legContainer;
        
        // Apply pants material
        const legMaterial = new BABYLON.StandardMaterial('legMaterial', this.scene);
        legMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.3); // Dark pants
        leftLeg.material = legMaterial;
        rightLeg.material = legMaterial;
        
        this.avatarParts.legs = legContainer;
        
        if (window.sceneManager && window.sceneManager.shadowGenerator) {
            window.sceneManager.addShadowCaster(leftLeg);
            window.sceneManager.addShadowCaster(rightLeg);
        }
    }

    /**
     * Create hair
     */
    createHair() {
        const hair = BABYLON.MeshBuilder.CreateSphere(
            'hair',
            { diameter: 0.32, segments: 16 },
            this.scene
        );
        hair.position.y = 1.75;
        hair.parent = this.avatar;
        
        const hairMaterial = new BABYLON.StandardMaterial('hairMaterial', this.scene);
        hairMaterial.diffuseColor = this.hexToColor3(this.currentConfig.hairColor);
        hair.material = hairMaterial;
        
        this.avatarParts.hair = hair;
        
        if (window.sceneManager && window.sceneManager.shadowGenerator) {
            window.sceneManager.addShadowCaster(hair);
        }
    }

    /**
     * Update avatar height
     */
    updateHeight(height) {
        this.currentConfig.height = height;
        const scale = height / 1.75; // 1.75 is default height
        if (this.avatar) {
            this.avatar.scaling.y = scale;
        }
        console.log('Avatar height updated to:', height);
    }

    /**
     * Update avatar build (thin to muscular)
     */
    updateBuild(buildValue) {
        this.currentConfig.build = buildValue;
        const scale = 0.8 + (buildValue / 100) * 0.4; // Scale from 0.8 to 1.2
        
        if (this.avatarParts.body) {
            this.avatarParts.body.scaling.x = scale;
            this.avatarParts.body.scaling.z = scale;
        }
        
        console.log('Avatar build updated to:', buildValue);
    }

    /**
     * Update skin color
     */
    updateSkinColor(colorHex) {
        this.currentConfig.skinColor = colorHex;
        const color = this.hexToColor3(colorHex);
        
        if (this.avatarParts.head && this.avatarParts.head.material) {
            this.avatarParts.head.material.diffuseColor = color;
        }
        
        if (this.avatarParts.arms) {
            this.avatarParts.arms.getChildMeshes().forEach(arm => {
                if (arm.material) {
                    arm.material.diffuseColor = color;
                }
            });
        }
        
        console.log('Skin color updated to:', colorHex);
    }

    /**
     * Update hair color
     */
    updateHairColor(colorHex) {
        this.currentConfig.hairColor = colorHex;
        const color = this.hexToColor3(colorHex);
        
        if (this.avatarParts.hair && this.avatarParts.hair.material) {
            this.avatarParts.hair.material.diffuseColor = color;
        }
        
        console.log('Hair color updated to:', colorHex);
    }

    /**
     * Update hair style
     */
    updateHairStyle(style) {
        this.currentConfig.hairStyle = style;
        
        if (!this.avatarParts.hair) return;
        
        // Remove old hair
        this.avatarParts.hair.dispose();
        
        // Create new hair based on style
        let hair;
        switch (style) {
            case 'short':
                hair = BABYLON.MeshBuilder.CreateSphere('hair', { diameter: 0.32 }, this.scene);
                hair.position.y = 1.75;
                break;
            case 'medium':
                hair = BABYLON.MeshBuilder.CreateSphere('hair', { diameter: 0.35 }, this.scene);
                hair.position.y = 1.75;
                hair.scaling.y = 1.2;
                break;
            case 'long':
                hair = BABYLON.MeshBuilder.CreateCylinder('hair', { height: 0.5, diameter: 0.3 }, this.scene);
                hair.position.y = 1.75;
                break;
            case 'curly':
                hair = BABYLON.MeshBuilder.CreateSphere('hair', { diameter: 0.38 }, this.scene);
                hair.position.y = 1.75;
                break;
            case 'braids':
                hair = BABYLON.MeshBuilder.CreateCylinder('hair', { height: 0.4, diameter: 0.28 }, this.scene);
                hair.position.y = 1.75;
                break;
            case 'bald':
                hair = BABYLON.MeshBuilder.CreateSphere('hair', { diameter: 0.05 }, this.scene);
                hair.position.y = 1.8;
                break;
            default:
                hair = BABYLON.MeshBuilder.CreateSphere('hair', { diameter: 0.32 }, this.scene);
                hair.position.y = 1.75;
        }
        
        hair.parent = this.avatar;
        const hairMaterial = new BABYLON.StandardMaterial('hairMaterial', this.scene);
        hairMaterial.diffuseColor = this.hexToColor3(this.currentConfig.hairColor);
        hair.material = hairMaterial;
        this.avatarParts.hair = hair;
        
        if (window.sceneManager && window.sceneManager.shadowGenerator) {
            window.sceneManager.addShadowCaster(hair);
        }
        
        console.log('Hair style updated to:', style);
    }

    /**
     * Update clothing style
     */
    updateClothing(style) {
        this.currentConfig.clothingStyle = style;
        
        if (!this.avatarParts.body || !this.avatarParts.body.material) return;
        
        let color;
        switch (style) {
            case 'casual':
                color = new BABYLON.Color3(0.2, 0.4, 0.8);
                break;
            case 'formal':
                color = new BABYLON.Color3(0.1, 0.1, 0.1);
                break;
            case 'sporty':
                color = new BABYLON.Color3(0.8, 0.2, 0.2);
                break;
            case 'gothic':
                color = new BABYLON.Color3(0.2, 0.0, 0.2);
                break;
            case 'fantasy':
                color = new BABYLON.Color3(0.6, 0.4, 0.8);
                break;
            case 'futuristic':
                color = new BABYLON.Color3(0.0, 0.8, 0.8);
                break;
            default:
                color = new BABYLON.Color3(0.2, 0.4, 0.8);
        }
        
        this.avatarParts.body.material.diffuseColor = color;
        console.log('Clothing style updated to:', style);
    }

    /**
     * Apply all configuration settings
     */
    applyConfiguration() {
        this.updateHeight(this.currentConfig.height);
        this.updateBuild(this.currentConfig.build);
        this.updateSkinColor(this.currentConfig.skinColor);
        this.updateHairColor(this.currentConfig.hairColor);
        this.updateHairStyle(this.currentConfig.hairStyle);
        this.updateClothing(this.currentConfig.clothingStyle);
    }

    /**
     * Randomize avatar appearance
     */
    randomize() {
        const randomSkinTones = ['#f4c2a1', '#e8b89a', '#d4a481', '#c68642', '#8d5524', '#4a2511'];
        const randomHairColors = ['#000000', '#8b4513', '#daa520', '#ff6347', '#4b0082', '#00ffff'];
        const randomHairStyles = ['short', 'medium', 'long', 'curly', 'braids', 'bald'];
        const randomClothing = ['casual', 'formal', 'sporty', 'gothic', 'fantasy', 'futuristic'];
        
        this.currentConfig.height = 1.5 + Math.random() * 0.5;
        this.currentConfig.build = Math.random() * 100;
        this.currentConfig.skinColor = randomSkinTones[Math.floor(Math.random() * randomSkinTones.length)];
        this.currentConfig.hairColor = randomHairColors[Math.floor(Math.random() * randomHairColors.length)];
        this.currentConfig.hairStyle = randomHairStyles[Math.floor(Math.random() * randomHairStyles.length)];
        this.currentConfig.clothingStyle = randomClothing[Math.floor(Math.random() * randomClothing.length)];
        
        this.applyConfiguration();
        
        // Update UI
        this.syncUIWithConfig();
        
        console.log('🎲 Avatar randomized');
    }

    /**
     * Sync UI controls with current configuration
     */
    syncUIWithConfig() {
        const heightInput = document.getElementById('avatarHeight');
        const buildInput = document.getElementById('avatarBuild');
        const skinInput = document.getElementById('skinColor');
        const hairColorInput = document.getElementById('hairColor');
        const hairStyleSelect = document.getElementById('hairStyle');
        const clothingSelect = document.getElementById('clothingStyle');
        
        if (heightInput) heightInput.value = this.currentConfig.height;
        if (buildInput) buildInput.value = this.currentConfig.build;
        if (skinInput) skinInput.value = this.currentConfig.skinColor;
        if (hairColorInput) hairColorInput.value = this.currentConfig.hairColor;
        if (hairStyleSelect) hairStyleSelect.value = this.currentConfig.hairStyle;
        if (clothingSelect) clothingSelect.value = this.currentConfig.clothingStyle;
        
        // Update labels
        const heightValue = document.getElementById('heightValue');
        const buildValue = document.getElementById('buildValue');
        if (heightValue) heightValue.textContent = this.currentConfig.height.toFixed(2) + 'm';
        if (buildValue) buildValue.textContent = this.getBuildLabel(this.currentConfig.build);
    }

    /**
     * Get build label from value
     */
    getBuildLabel(value) {
        if (value < 25) return 'Slim';
        if (value < 50) return 'Average';
        if (value < 75) return 'Athletic';
        return 'Muscular';
    }

    /**
     * Save avatar configuration
     */
    saveConfiguration() {
        localStorage.setItem('heartquest_avatar', JSON.stringify(this.currentConfig));
        console.log('💾 Avatar configuration saved');
    }

    /**
     * Load avatar configuration
     */
    loadConfiguration() {
        const saved = localStorage.getItem('heartquest_avatar');
        if (saved) {
            this.currentConfig = JSON.parse(saved);
            this.applyConfiguration();
            this.syncUIWithConfig();
            console.log('📂 Avatar configuration loaded');
        }
    }

    /**
     * Convert hex color to Babylon Color3
     */
    hexToColor3(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? new BABYLON.Color3(
                parseInt(result[1], 16) / 255,
                parseInt(result[2], 16) / 255,
                parseInt(result[3], 16) / 255
            )
            : new BABYLON.Color3(1, 1, 1);
    }

    /**
     * Get avatar mesh
     */
    getAvatar() {
        return this.avatar;
    }

    /**
     * Dispose avatar
     */
    dispose() {
        if (this.avatar) {
            this.avatar.dispose();
        }
    }
}

// Make AvatarCreator globally accessible
window.AvatarCreator = AvatarCreator;

