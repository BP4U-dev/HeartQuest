/**
 * HeartQuest - Babylon.js Scene Manager
 * Manages the main 3D scene, engine, and rendering
 */

class SceneManager {
    constructor() {
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.lights = [];
        this.isInitialized = false;
    }

    /**
     * Initialize the Babylon.js engine and create the main scene
     */
    async initialize(canvasId = 'renderCanvas') {
        try {
            // Get the canvas element
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.error('Canvas element not found:', canvasId);
                return false;
            }

            // Create the Babylon.js engine
            this.engine = new BABYLON.Engine(this.canvas, true, {
                preserveDrawingBuffer: true,
                stencil: true,
                antialias: true
            });

            // Create the scene
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color4(0.4, 0.6, 0.9, 1.0); // Sky blue

            // Enable physics
            this.scene.enablePhysics(
                new BABYLON.Vector3(0, -9.81, 0),
                new BABYLON.CannonJSPlugin()
            );

            // Setup camera
            this.setupCamera();

            // Setup lighting
            this.setupLighting();

            // Setup environment
            this.setupEnvironment();

            // Handle window resize
            window.addEventListener('resize', () => {
                this.engine.resize();
            });

            // Run the render loop
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });

            this.isInitialized = true;
            console.log('✅ Babylon.js Scene Manager initialized successfully');
            return true;

        } catch (error) {
            console.error('❌ Failed to initialize Scene Manager:', error);
            return false;
        }
    }

    /**
     * Setup the main camera
     */
    setupCamera() {
        // Create arc rotate camera (orbiting camera)
        this.camera = new BABYLON.ArcRotateCamera(
            'mainCamera',
            Math.PI / 2,  // Alpha (horizontal rotation)
            Math.PI / 3,  // Beta (vertical rotation)
            10,           // Radius (distance from target)
            new BABYLON.Vector3(0, 1, 0), // Target position
            this.scene
        );

        // Attach camera controls to canvas
        this.camera.attachControl(this.canvas, true);

        // Camera limits
        this.camera.lowerRadiusLimit = 2;
        this.camera.upperRadiusLimit = 50;
        this.camera.lowerBetaLimit = 0.1;
        this.camera.upperBetaLimit = Math.PI / 2;

        // Camera speed
        this.camera.wheelPrecision = 50;
        this.camera.angularSensibilityX = 1000;
        this.camera.angularSensibilityY = 1000;
    }

    /**
     * Setup scene lighting
     */
    setupLighting() {
        // Hemispheric light (ambient)
        const hemisphericLight = new BABYLON.HemisphericLight(
            'hemisphericLight',
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        hemisphericLight.intensity = 0.6;
        this.lights.push(hemisphericLight);

        // Directional light (sun)
        const directionalLight = new BABYLON.DirectionalLight(
            'directionalLight',
            new BABYLON.Vector3(-1, -2, -1),
            this.scene
        );
        directionalLight.position = new BABYLON.Vector3(20, 40, 20);
        directionalLight.intensity = 0.8;
        this.lights.push(directionalLight);

        // Enable shadows
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;
        this.shadowGenerator = shadowGenerator;
    }

    /**
     * Setup environment (skybox, ground, etc.)
     */
    setupEnvironment() {
        // Create ground
        const ground = BABYLON.MeshBuilder.CreateGround(
            'ground',
            { width: 100, height: 100 },
            this.scene
        );

        // Ground material
        const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.6, 0.3);
        groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        ground.material = groundMaterial;
        ground.receiveShadows = true;

        // Add physics to ground
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(
            ground,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0.5 },
            this.scene
        );

        // Create skybox
        const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 1000 }, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.7, 1.0);
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
    }

    /**
     * Add mesh to shadow casters
     */
    addShadowCaster(mesh) {
        if (this.shadowGenerator) {
            this.shadowGenerator.addShadowCaster(mesh);
        }
    }

    /**
     * Get the current scene
     */
    getScene() {
        return this.scene;
    }

    /**
     * Get the engine
     */
    getEngine() {
        return this.engine;
    }

    /**
     * Get the camera
     */
    getCamera() {
        return this.camera;
    }

    /**
     * Dispose of the scene and engine
     */
    dispose() {
        if (this.engine) {
            this.engine.dispose();
        }
        this.isInitialized = false;
    }
}

// Create global scene manager instance
window.sceneManager = new SceneManager();

