/**
 * HeartQuest - Ready Player Me Integration for Lifelike Avatars
 * Save as: js/readyplayerme-avatars.js
 * 
 * This loads REAL photorealistic avatars into your dating game
 */

class ReadyPlayerMeIntegration {
    constructor(scene) {
        this.scene = scene;
        this.avatars = [];
        this.loader = new BABYLON.SceneLoader();
    }

    /**
     * Load a Ready Player Me avatar from URL
     * @param {string} avatarUrl - The .glb URL from Ready Player Me
     * @param {BABYLON.Vector3} position - Where to spawn the avatar
     */
    async loadAvatar(avatarUrl, position = BABYLON.Vector3.Zero()) {
        try {
            // Load the GLB file
            const result = await BABYLON.SceneLoader.ImportMeshAsync(
                "",
                "",
                avatarUrl,
                this.scene,
                null,
                ".glb"
            );

            const avatar = result.meshes[0];
            avatar.position = position;
            avatar.scaling = new BABYLON.Vector3(1, 1, 1);

            // Add to tracking
            this.avatars.push(avatar);

            // Add animations if they exist
            if (result.animationGroups && result.animationGroups.length > 0) {
                this.setupAnimations(avatar, result.animationGroups);
            }

            // Add simple walking behavior
            this.addWalkingAI(avatar);

            console.log("Loaded realistic avatar successfully!");
            return avatar;

        } catch (error) {
            console.error("Failed to load avatar:", error);
            return null;
        }
    }

    /**
     * Load multiple pre-made avatars for NPCs
     */
    async loadDemoAvatars() {
        // These are example avatars - you'll replace with your own
        const demoAvatarUrls = [
            "https://models.readyplayer.me/64bfa0d0f4f1d89a3a4e5c1a.glb",
            "https://models.readyplayer.me/64bfa0d0f4f1d89a3a4e5c1b.glb",
            "https://models.readyplayer.me/64bfa0d0f4f1d89a3a4e5c1c.glb",
        ];

        for (let i = 0; i < demoAvatarUrls.length; i++) {
            const position = new BABYLON.Vector3(i * 3, 0, 0);
            await this.loadAvatar(demoAvatarUrls[i], position);
        }
    }

    /**
     * Open Ready Player Me creator in iframe
     */
    openAvatarCreator(onComplete) {
        // Create iframe overlay
        const overlay = document.createElement('div');
        overlay.id = 'rpm-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const iframe = document.createElement('iframe');
        iframe.src = 'https://demo.readyplayer.me/avatar?frameApi';
        iframe.style.cssText = `
            width: 90%;
            height: 90%;
            border: none;
            border-radius: 10px;
        `;

        overlay.appendChild(iframe);
        document.body.appendChild(overlay);

        // Listen for avatar creation
        window.addEventListener('message', (event) => {
            if (event.data?.source === 'readyplayerme') {
                if (event.data.eventName === 'v1.avatar.exported') {
                    const avatarUrl = event.data.data.url;
                    
                    // Remove overlay
                    overlay.remove();
                    
                    // Load the new avatar
                    this.loadAvatar(avatarUrl, new BABYLON.Vector3(0, 0, 5));
                    
                    // Callback
                    if (onComplete) {
                        onComplete(avatarUrl);
                    }
                }
            }
        });

        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: #DC143C;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.2rem;
            z-index: 10001;
        `;
        closeBtn.onclick = () => overlay.remove();
        overlay.appendChild(closeBtn);
    }

    /**
     * Setup animations for avatar
     */
    setupAnimations(avatar, animationGroups) {
        avatar.animationGroups = animationGroups;
        
        // Play idle animation by default
        if (animationGroups[0]) {
            animationGroups[0].start(true);
        }
    }

    /**
     * Add simple walking AI to avatar
     */
    addWalkingAI(avatar) {
        let targetPos = this.randomPosition(20);
        let walkSpeed = 0.03;
        let idleTimer = 0;
        let isIdle = false;

        this.scene.onBeforeRenderObservable.add(() => {
            if (!avatar || avatar.isDisposed()) return;

            if (isIdle) {
                idleTimer++;
                if (idleTimer > 200) {
                    isIdle = false;
                    targetPos = this.randomPosition(20);
                    idleTimer = 0;
                }
            } else {
                const direction = targetPos.subtract(avatar.position);
                direction.y = 0;
                const distance = direction.length();

                if (distance > 1) {
                    direction.normalize();
                    avatar.position.addInPlace(direction.scale(walkSpeed));
                    
                    // Rotate to face direction
                    const angle = Math.atan2(direction.x, direction.z);
                    avatar.rotation.y = angle;
                } else {
                    isIdle = true;
                }
            }
        });
    }

    /**
     * Load avatar from file upload
     */
    loadFromFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const blob = new Blob([e.target.result]);
            const url = URL.createObjectURL(blob);
            this.loadAvatar(url, new BABYLON.Vector3(0, 0, 0));
        };
        reader.readAsArrayBuffer(file);
    }

    /**
     * Get random position for avatar spawning
     */
    randomPosition(range) {
        return new BABYLON.Vector3(
            Math.random() * range - range / 2,
            0,
            Math.random() * range - range / 2
        );
    }

    /**
     * Remove all avatars
     */
    clearAllAvatars() {
        this.avatars.forEach(avatar => {
            if (avatar && !avatar.isDisposed()) {
                avatar.dispose();
            }
        });
        this.avatars = [];
    }

    /**
     * Get avatar count
     */
    getAvatarCount() {
        return this.avatars.length;
    }
}

// Updated HeartQuestGame class with Ready Player Me support
class HeartQuestGameWithRealisticAvatars {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = null;
        this.camera = null;
        this.rpmIntegration = null;
        
        this.init();
    }

    init() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.15);

        // Camera
        this.camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 2, -10), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
        this.camera.speed = 0.3;
        this.camera.keysUp = [87];
        this.camera.keysDown = [83];
        this.camera.keysLeft = [65];
        this.camera.keysRight = [68];

        // Lights
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.8;

        const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, -1), this.scene);
        dirLight.intensity = 0.5;

        // Create world
        this.createWorld();

        // Initialize Ready Player Me integration
        this.rpmIntegration = new ReadyPlayerMeIntegration(this.scene);

        // Start render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    createWorld() {
        // Ground
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, this.scene);
        const groundMat = new BABYLON.StandardMaterial("groundMat", this.scene);
        groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.2);
        ground.material = groundMat;

        // Add some environment
        for (let i = 0; i < 10; i++) {
            this.createTree(this.randomPosition(40));
        }
    }

    createTree(position) {
        const tree = new BABYLON.TransformNode("tree", this.scene);
        tree.position = position;

        const trunk = BABYLON.MeshBuilder.CreateCylinder("trunk", {height: 3, diameter: 0.3}, this.scene);
        trunk.parent = tree;
        trunk.position.y = 1.5;
        const trunkMat = new BABYLON.StandardMaterial("trunkMat", this.scene);
        trunkMat.diffuseColor = new BABYLON.Color3(0.4, 0.2, 0.1);
        trunk.material = trunkMat;

        const leaves = BABYLON.MeshBuilder.CreateSphere("leaves", {diameter: 4}, this.scene);
        leaves.parent = tree;
        leaves.position.y = 4;
        const leavesMat = new BABYLON.StandardMaterial("leavesMat", this.scene);
        leavesMat.diffuseColor = new BABYLON.Color3(0.1, 0.5, 0.1);
        leaves.material = leavesMat;
    }

    randomPosition(range) {
        return new BABYLON.Vector3(
            Math.random() * range - range / 2,
            0,
            Math.random() * range - range / 2
        );
    }

    // Public API methods
    openAvatarCreator() {
        this.rpmIntegration.openAvatarCreator((avatarUrl) => {
            console.log("Created avatar:", avatarUrl);
            // Save avatar URL to your database here
        });
    }

    loadAvatarFromUrl(url) {
        return this.rpmIntegration.loadAvatar(url);
    }

    loadDemoAvatars() {
        return this.rpmIntegration.loadDemoAvatars();
    }

    getAvatarCount() {
        return this.rpmIntegration.getAvatarCount();
    }
}

// Make it globally accessible
window.HeartQuestGameWithRealisticAvatars = HeartQuestGameWithRealisticAvatars;
window.ReadyPlayerMeIntegration = ReadyPlayerMeIntegration;