/**
 * HeartQuest - Camera Controller
 * Advanced camera controls and movement
 */

class CameraController {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.followTarget = null;
        this.cameraMode = 'free'; // 'free', 'follow', 'firstPerson'
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false
        };
    }

    /**
     * Initialize camera controls
     */
    initialize() {
        this.setupKeyboardControls();
        this.setupMouseControls();
        console.log('🎥 Camera controller initialized');
    }

    /**
     * Setup keyboard controls for camera movement
     */
    setupKeyboardControls() {
        window.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.keys.forward = true;
                    break;
                case 's':
                case 'arrowdown':
                    this.keys.backward = true;
                    break;
                case 'a':
                case 'arrowleft':
                    this.keys.left = true;
                    break;
                case 'd':
                case 'arrowright':
                    this.keys.right = true;
                    break;
                case 'q':
                    this.keys.up = true;
                    break;
                case 'e':
                    this.keys.down = true;
                    break;
                case 'r':
                    this.resetCamera();
                    break;
                case '1':
                    this.setCameraMode('free');
                    break;
                case '2':
                    this.setCameraMode('follow');
                    break;
                case '3':
                    this.setCameraMode('firstPerson');
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    this.keys.forward = false;
                    break;
                case 's':
                case 'arrowdown':
                    this.keys.backward = false;
                    break;
                case 'a':
                case 'arrowleft':
                    this.keys.left = false;
                    break;
                case 'd':
                case 'arrowright':
                    this.keys.right = false;
                    break;
                case 'q':
                    this.keys.up = false;
                    break;
                case 'e':
                    this.keys.down = false;
                    break;
            }
        });

        // Update camera based on keys
        this.scene.registerBeforeRender(() => {
            this.updateCameraMovement();
        });
    }

    /**
     * Setup mouse controls
     */
    setupMouseControls() {
        // Camera is already attached to canvas in scene manager
        // Additional mouse controls can be added here
    }

    /**
     * Update camera movement based on key presses
     */
    updateCameraMovement() {
        if (this.cameraMode !== 'free') return;

        const speed = 0.1;
        const target = this.camera.target;

        if (this.keys.forward) {
            const direction = target.subtract(this.camera.position).normalize();
            this.camera.position.addInPlace(direction.scale(speed));
            this.camera.target.addInPlace(direction.scale(speed));
        }
        if (this.keys.backward) {
            const direction = target.subtract(this.camera.position).normalize();
            this.camera.position.subtractInPlace(direction.scale(speed));
            this.camera.target.subtractInPlace(direction.scale(speed));
        }
        if (this.keys.left) {
            const right = BABYLON.Vector3.Cross(
                this.camera.upVector,
                target.subtract(this.camera.position)
            ).normalize();
            this.camera.position.addInPlace(right.scale(speed));
            this.camera.target.addInPlace(right.scale(speed));
        }
        if (this.keys.right) {
            const right = BABYLON.Vector3.Cross(
                this.camera.upVector,
                target.subtract(this.camera.position)
            ).normalize();
            this.camera.position.subtractInPlace(right.scale(speed));
            this.camera.target.subtractInPlace(right.scale(speed));
        }
        if (this.keys.up) {
            this.camera.position.y += speed;
            this.camera.target.y += speed;
        }
        if (this.keys.down) {
            this.camera.position.y -= speed;
            this.camera.target.y -= speed;
        }
    }

    /**
     * Set camera mode
     */
    setCameraMode(mode) {
        this.cameraMode = mode;
        console.log(`Camera mode set to: ${mode}`);

        switch(mode) {
            case 'free':
                this.setFreeCamera();
                break;
            case 'follow':
                this.setFollowCamera();
                break;
            case 'firstPerson':
                this.setFirstPersonCamera();
                break;
        }
    }

    /**
     * Set free roaming camera
     */
    setFreeCamera() {
        this.camera.detachControl();
        this.camera.attachControl(this.scene.getEngine().getRenderingCanvas(), true);
    }

    /**
     * Set follow camera (follows avatar)
     */
    setFollowCamera() {
        if (!this.followTarget) {
            console.warn('No follow target set');
            return;
        }

        this.scene.registerBeforeRender(() => {
            if (this.cameraMode === 'follow' && this.followTarget) {
                const targetPosition = this.followTarget.position;
                this.camera.target = targetPosition.clone();
                
                // Smooth camera follow
                const offset = new BABYLON.Vector3(0, 2, -5);
                const desiredPosition = targetPosition.add(offset);
                this.camera.position = BABYLON.Vector3.Lerp(
                    this.camera.position,
                    desiredPosition,
                    0.1
                );
            }
        });
    }

    /**
     * Set first person camera
     */
    setFirstPersonCamera() {
        if (!this.followTarget) {
            console.warn('No follow target set');
            return;
        }

        this.scene.registerBeforeRender(() => {
            if (this.cameraMode === 'firstPerson' && this.followTarget) {
                const targetPosition = this.followTarget.position;
                const offset = new BABYLON.Vector3(0, 1.6, 0); // Eye level
                this.camera.position = targetPosition.add(offset);
                this.camera.target = targetPosition.add(offset).add(new BABYLON.Vector3(0, 0, 1));
            }
        });
    }

    /**
     * Set target for camera to follow
     */
    setFollowTarget(target) {
        this.followTarget = target;
        console.log('Camera follow target set');
    }

    /**
     * Reset camera to default position
     */
    resetCamera() {
        this.camera.position = new BABYLON.Vector3(0, 5, -10);
        this.camera.target = new BABYLON.Vector3(0, 1, 0);
        this.camera.alpha = Math.PI / 2;
        this.camera.beta = Math.PI / 3;
        this.camera.radius = 10;
        console.log('Camera reset to default position');
    }

    /**
     * Focus camera on a mesh
     */
    focusOn(mesh) {
        if (!mesh) return;
        
        this.camera.target = mesh.position.clone();
        console.log('Camera focused on:', mesh.name);
    }

    /**
     * Smooth camera transition to position
     */
    transitionTo(position, target, duration = 1000) {
        const startPos = this.camera.position.clone();
        const startTarget = this.camera.target.clone();
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease in-out)
            const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            this.camera.position = BABYLON.Vector3.Lerp(startPos, position, eased);
            this.camera.target = BABYLON.Vector3.Lerp(startTarget, target, eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * Zoom camera in/out
     */
    zoom(delta) {
        if (this.camera instanceof BABYLON.ArcRotateCamera) {
            this.camera.radius += delta;
            this.camera.radius = Math.max(
                this.camera.lowerRadiusLimit,
                Math.min(this.camera.upperRadiusLimit, this.camera.radius)
            );
        }
    }

    /**
     * Get camera information
     */
    getInfo() {
        return {
            mode: this.cameraMode,
            position: this.camera.position.clone(),
            target: this.camera.target.clone(),
            hasFollowTarget: this.followTarget !== null
        };
    }
}

// Make CameraController globally accessible
window.CameraController = CameraController;

