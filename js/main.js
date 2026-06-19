// js/main.js

const App3D = {
    scene: null,
    camera: null,
    renderer: null,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),

    // UI tracking state
    doors: {}, // maps doorId to { doorMesh, frameMesh, portalGateMesh, data }
    hoveredDoorId: null,
    selectedDoorId: null,

    // Embers and Fountain particles
    emberParticles: null,
    fountainParticles: null,
    fountainLavaMesh: null,
    lavaLight: null,

    // First Person Camera Variables
    yaw: 0,      // Horizontal look angle (radians)
    pitch: 0,    // Vertical look angle (radians)
    lookSpeed: 0.035,
    walkSpeed: 0.65,

    // Movement controls state
    moveState: { forward: false, backward: false, left: false, right: false },
    joystickMove: { x: 0, y: 0 }, // X: strafe (-1 to 1), Y: walk (-1 to 1)
    lookJoystickMove: { x: 0, y: 0 }, // X: yaw (-1 to 1), Y: pitch (-1 to 1)
    joystickLerp: { x: 0, y: 0, z: 0 },
    keyboardLerp: { x: 0, y: 0, z: 0 },

    // Drag-to-look state
    isPointerDragging: false,
    prevPointerPos: { x: 0, y: 0 },

    // Camera initial overview target coordinates for resets (yaw/pitch targets)
    initialCameraPos: { x: 0, y: 3.5, z: 45 },

    init() {
        const container = document.getElementById('webgl-container');

        window.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

        // Scene setup (Dark volcanic hell theme)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#0c0200');
        this.scene.fog = new THREE.FogExp2('#140400', 0.018);

        // Camera setup (Start at eye-level)
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(this.initialCameraPos.x, this.initialCameraPos.y, this.initialCameraPos.z);
        this.camera.rotation.order = 'YXZ'; // Important for first-person FPS rotation style

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: !window.isMobileDevice, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.isMobileDevice ? 1 : Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = !window.isMobileDevice;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);

        this.initTextures();
        this.buildEnvironment();
        this.buildFountain();
        this.buildSign();
        this.buildDoors();
        this.setupLights();
        this.setupEmberParticles();

        // 1. Keyboard listeners for walking
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // 2. Mouse/Pointer drag listeners for looking around
        container.addEventListener('pointerdown', (e) => this.onPointerDownLook(e));
        window.addEventListener('pointermove', (e) => this.onPointerMoveLook(e));
        window.addEventListener('pointerup', () => this.onPointerUpLook());
        window.addEventListener('pointercancel', () => this.onPointerUpLook());

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Door raycasting/clicking (uses pointerdown)
        window.addEventListener('pointerdown', (e) => this.onPointerDownClick(e));

        // Start render loop
        this.animate();

        // Expose to window context
        window.App3D = this;
    },

    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveState.forward = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveState.backward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveState.left = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveState.right = true;
                break;
        }
    },

    onKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveState.forward = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveState.backward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveState.left = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveState.right = false;
                break;
        }
    },

    onPointerDownLook(event) {
        if (event.button !== 0) return; // Only left click drag looks
        this.isPointerDragging = true;
        this.prevPointerPos.x = event.clientX;
        this.prevPointerPos.y = event.clientY;
    },

    onPointerMoveLook(event) {
        // Update mouse NDC coordinates for raycasting
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Trigger hover glow effects
        this.onPointerMove(event);
    },

    onPointerUpLook() {
        this.isPointerDragging = false;
    },

    initTextures() {
        const loader = new THREE.TextureLoader();
        this.loadedTextures = {
            lavaFloor: loader.load('assets/lava_floor.png'),
            lavaPool: loader.load('assets/lava_pool.png'),
            volcanicWall: loader.load('assets/gothic_wall.png'),
            hellCeiling: loader.load('assets/hell_ceiling.png'),
            cauldronSides: loader.load('assets/cauldron_sides.png'),
            boneDoor: loader.load('assets/bone_door.png'),
            soulDoor: loader.load('assets/soul_door.png'),
            beastDoor: loader.load('assets/beast_door.png'),
            runicDoor: loader.load('assets/runic_door.png'),
            hellSkyWindow: loader.load('assets/hell_sky_window.png')
        };

        // Configure tiling repeats
        this.loadedTextures.lavaFloor.wrapS = THREE.RepeatWrapping;
        this.loadedTextures.lavaFloor.wrapT = THREE.RepeatWrapping;
        this.loadedTextures.lavaFloor.repeat.set(24, 24);

        this.loadedTextures.lavaPool.wrapS = THREE.RepeatWrapping;
        this.loadedTextures.lavaPool.wrapT = THREE.RepeatWrapping;
        this.loadedTextures.lavaPool.repeat.set(1.5, 1.5);

        this.loadedTextures.hellCeiling.wrapS = THREE.RepeatWrapping;
        this.loadedTextures.hellCeiling.wrapT = THREE.RepeatWrapping;
        this.loadedTextures.hellCeiling.repeat.set(12, 12);

        this.loadedTextures.cauldronSides.wrapS = THREE.RepeatWrapping;
        this.loadedTextures.cauldronSides.wrapT = THREE.RepeatWrapping;
        this.loadedTextures.cauldronSides.repeat.set(4, 1);

        this.loadedTextures.volcanicWall.wrapS = THREE.RepeatWrapping;
        this.loadedTextures.volcanicWall.wrapT = THREE.RepeatWrapping;
        this.loadedTextures.volcanicWall.repeat.set(20, 8);
    },

    setupLights() {
        // Deep reddish-orange ambient glow - raised brightness
        const ambientLight = new THREE.AmbientLight('#ff5522', 1.15);
        this.scene.add(ambientLight);

        // Overhead high-intensity light to illuminate the entire courtyard
        const overheadLight = new THREE.DirectionalLight('#ff7744', 3.0);
        overheadLight.position.set(0, 39, 0);
        overheadLight.castShadow = !window.isMobileDevice;
        overheadLight.shadow.mapSize.width = 2048;
        overheadLight.shadow.mapSize.height = 2048;
        overheadLight.shadow.camera.near = 0.5;
        overheadLight.shadow.camera.far = 100;
        const dX = 60;
        overheadLight.shadow.camera.left = -dX;
        overheadLight.shadow.camera.right = dX;
        overheadLight.shadow.camera.top = dX;
        overheadLight.shadow.camera.bottom = -dX;
        overheadLight.shadow.bias = -0.0005;
        this.scene.add(overheadLight);

        // Volcanic lava cauldron glow (Central point light) - raised brightness and range
        this.lavaLight = new THREE.PointLight('#ff5500', 5.5, 75);
        this.lavaLight.position.set(0, 2, 0);
        this.lavaLight.castShadow = false;
        this.lavaLight.shadow.bias = -0.002;
        this.scene.add(this.lavaLight);

        // Gothic realistic wall torches list
        this.torches = [];

        const torchPositions = [
            // Back wall
            { x: -35, y: 12, z: -58.8, rotY: 0 },
            { x: 35, y: 12, z: -58.8, rotY: 0 },
            // Left wall
            { x: -58.8, y: 12, z: -30, rotY: Math.PI / 2 },
            { x: -58.8, y: 12, z: 30, rotY: Math.PI / 2 },
            // Right wall
            { x: 58.8, y: 12, z: -30, rotY: -Math.PI / 2 },
            { x: 58.8, y: 12, z: 30, rotY: -Math.PI / 2 },
            // Front wall
            { x: -35, y: 12, z: 58.8, rotY: Math.PI },
            { x: 35, y: 12, z: 58.8, rotY: Math.PI }
        ];

        const mountPlateGeo = new THREE.BoxGeometry(0.8, 1.8, 0.15);
        const bracketArmGeo = new THREE.BoxGeometry(0.2, 0.2, 1.2);
        const bowlGeo = new THREE.CylinderGeometry(0.45, 0.2, 0.8, 12);
        const torchMetalMat = new THREE.MeshStandardMaterial({ color: '#0b0b0d', roughness: 0.85, metalness: 0.95 });

        // Semi-transparent realistic licking flame group and layers
        torchPositions.forEach(pos => {
            const torchGroup = new THREE.Group();
            torchGroup.position.set(pos.x, pos.y, pos.z);
            torchGroup.rotation.y = pos.rotY;

            // 1. Mount plate on wall
            const plate = new THREE.Mesh(mountPlateGeo, torchMetalMat);
            plate.position.set(0, 0, -0.05);
            torchGroup.add(plate);

            // 2. Bracket arm sticking out
            const arm = new THREE.Mesh(bracketArmGeo, torchMetalMat);
            arm.position.set(0, 0, 0.5);
            torchGroup.add(arm);

            // 3. Flame bowl/cup
            const bowl = new THREE.Mesh(bowlGeo, torchMetalMat);
            bowl.position.set(0, 0.5, 1.0);
            torchGroup.add(bowl);

            // 4. Licking flame group and its nested layers
            const flameGroup = new THREE.Group();
            flameGroup.position.set(0, 1.25, 1.0);

            // Outer flame layer (red-orange, wider)
            const outerFlameGeo = new THREE.ConeGeometry(0.48, 1.6, 16);
            outerFlameGeo.translate(0, 0.8, 0); // pivot at bottom
            const outerFlameMat = new THREE.MeshBasicMaterial({
                color: '#ff3700',
                transparent: true,
                opacity: 0.65,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
            flameGroup.add(outerFlame);

            // Mid flame layer (orange-yellow, medium)
            const midFlameGeo = new THREE.ConeGeometry(0.35, 1.2, 16);
            midFlameGeo.translate(0, 0.6, 0); // pivot at bottom
            const midFlameMat = new THREE.MeshBasicMaterial({
                color: '#ffa600',
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            const midFlame = new THREE.Mesh(midFlameGeo, midFlameMat);
            flameGroup.add(midFlame);

            // Inner flame core (bright yellow-white, narrow)
            const innerFlameGeo = new THREE.ConeGeometry(0.20, 0.8, 16);
            innerFlameGeo.translate(0, 0.4, 0); // pivot at bottom
            const innerFlameMat = new THREE.MeshBasicMaterial({
                color: '#fffae0',
                transparent: true,
                opacity: 0.95,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
            flameGroup.add(innerFlame);

            torchGroup.add(flameGroup);

            // 5. Flickering point light
            const tLight = new THREE.PointLight('#ff6600', 3.0, 32);
            tLight.position.set(0, 1.5, 1.1);
            torchGroup.add(tLight);

            this.scene.add(torchGroup);

            // Save references for loops
            this.torches.push({
                flameGroup: flameGroup,
                outerFlame: outerFlame,
                midFlame: midFlame,
                innerFlame: innerFlame,
                light: tLight,
                baseIntensity: 3.2 + Math.random() * 0.6,
                baseLightPos: { x: 0, y: 1.5, z: 1.1 },
                seed: Math.random() * 100
            });
        });
    },

    buildEnvironment() {
        // 1. Giant Courtyard Ground Plane (scaled to 120x120)
        const groundGeo = new THREE.PlaneGeometry(120, 120);
        const groundMat = new THREE.MeshStandardMaterial({
            map: this.loadedTextures.lavaFloor,
            roughness: 0.85,
            metalness: 0.3,
            bumpMap: this.loadedTextures.lavaFloor,
            bumpScale: 0.15
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // 1b. Giant Closed Gothic Hell Ceiling (120x120 at Y = 40, facing down)
        const ceilingGeo = new THREE.PlaneGeometry(120, 120);
        const ceilingMat = new THREE.MeshStandardMaterial({
            map: this.loadedTextures.hellCeiling,
            roughness: 0.9,
            metalness: 0.2,
            bumpMap: this.loadedTextures.hellCeiling,
            bumpScale: 0.12,
            emissive: '#ff2200',
            emissiveMap: this.loadedTextures.hellCeiling,
            emissiveIntensity: 0.75
        });
        const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
        ceiling.position.y = 40.0;
        ceiling.rotation.x = Math.PI / 2;
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);

        // 2. Lava Canals running along the sides of the courtyard
        // Left Canal (X = -48) and Right Canal (X = 48) - Tessellated for vertex waves
        const canalGeo = new THREE.PlaneGeometry(6, 110, 8, 64);
        const canalMat = new THREE.MeshStandardMaterial({
            map: this.loadedTextures.lavaPool,
            color: '#ff2200',
            emissive: '#ff3c00',
            emissiveIntensity: 2.4,
            roughness: 0.15
        });

        this.leftCanal = new THREE.Mesh(canalGeo, canalMat);
        this.leftCanal.rotation.x = -Math.PI / 2;
        this.leftCanal.position.set(-48, 0.05, 0);
        this.leftCanal.receiveShadow = true;
        this.scene.add(this.leftCanal);

        this.rightCanal = new THREE.Mesh(canalGeo, canalMat);
        this.rightCanal.rotation.x = -Math.PI / 2;
        this.rightCanal.position.set(48, 0.05, 0);
        this.rightCanal.receiveShadow = true;
        this.scene.add(this.rightCanal);

        // Canal borders (dark stone curbs)
        const curbGeo = new THREE.BoxGeometry(0.8, 0.6, 110);
        const curbMat = new THREE.MeshStandardMaterial({ color: '#0a0302', roughness: 0.95 });

        const curbLeft1 = new THREE.Mesh(curbGeo, curbMat);
        curbLeft1.position.set(-51.4, 0.3, 0);
        this.scene.add(curbLeft1);

        const curbLeft2 = new THREE.Mesh(curbGeo, curbMat);
        curbLeft2.position.set(-44.6, 0.3, 0);
        this.scene.add(curbLeft2);

        const curbRight1 = new THREE.Mesh(curbGeo, curbMat);
        curbRight1.position.set(44.6, 0.3, 0);
        this.scene.add(curbRight1);

        const curbRight2 = new THREE.Mesh(curbGeo, curbMat);
        curbRight2.position.set(51.4, 0.3, 0);
        this.scene.add(curbRight2);

        // 3. Massive Palace Walls (120 width x 40 height)
        const wallMat = new THREE.MeshStandardMaterial({
            map: this.loadedTextures.volcanicWall,
            roughness: 0.9,
            metalness: 0.3,
            bumpMap: this.loadedTextures.volcanicWall,
            bumpScale: 0.081
        });

        const wallGeo = new THREE.PlaneGeometry(120, 40);

        // Back Wall (Z = -60)
        const backWall = new THREE.Mesh(wallGeo, wallMat);
        backWall.position.set(0, 20, -60);
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Left Wall (X = -60)
        const leftWall = new THREE.Mesh(wallGeo, wallMat);
        leftWall.position.set(-60, 20, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Right Wall (X = 60)
        const rightWall = new THREE.Mesh(wallGeo, wallMat);
        rightWall.position.set(60, 20, 0);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);

        // Front Wall (Z = 60)
        const frontWall = new THREE.Mesh(wallGeo, wallMat);
        frontWall.position.set(0, 20, 60);
        frontWall.rotation.y = Math.PI;
        frontWall.receiveShadow = true;
        this.scene.add(frontWall);

        // 4. Gothic Pillars along the walls (spaced for 120x120 scale)
        const pillarGeo = new THREE.CylinderGeometry(1.5, 2.0, 40, 16);
        const pillarMat = new THREE.MeshStandardMaterial({
            color: '#0d0402',
            roughness: 0.95,
            bumpMap: this.loadedTextures.volcanicWall,
            bumpScale: 0.05
        });

        // Place pillars around the courtyard (Spaced at corner areas to avoid overlaps with the 35 doors)
        const pillarPositions = [
            // Corners
            { x: -58.5, z: -58.5 },
            { x: 58.5, z: -58.5 },
            { x: -58.5, z: 58.5 },
            { x: 58.5, z: 58.5 },
            // Midway between walls but avoiding any doors at -55, -45, -35, -25, -15, -5, 5, 15, 25, 35, 45, 55
            // So we place them at X: -60, -30, 0, 30, 60 or Z: -60, -25, 25, 60
            { x: 0, z: -58.5 },
            { x: 0, z: 58.5 },
            { x: -58.5, z: -25 },
            { x: -58.5, z: 25 },
            { x: 58.5, z: -25 },
            { x: 58.5, z: 25 }
        ];

        pillarPositions.forEach(pos => {
            const p = new THREE.Mesh(pillarGeo, pillarMat);
            p.position.set(pos.x, 20, pos.z);
            p.castShadow = true;
            this.scene.add(p);
        });

        // 5. Gothic Windows looking out into Hell (Double-layered photorealistic views)
        const windowFrameGeo = new THREE.BoxGeometry(8, 16, 0.4);
        const windowFrameMat = new THREE.MeshStandardMaterial({ color: '#090302', roughness: 0.95 });

        // Window Sky Pane using our generated photorealistic Hell Sky Window texture
        const skyPaneGeo = new THREE.PlaneGeometry(7.2, 15.2);
        const skyPaneMat = new THREE.MeshBasicMaterial({
            map: this.loadedTextures.hellSkyWindow,
            color: '#ffaa88', // warm glow tint
            side: THREE.DoubleSide
        });

        this.windowSkyPanes = [];

        const addWindow = (x, y, z, rotY) => {
            const frame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
            frame.position.set(x, y, z);
            frame.rotation.y = rotY;
            this.scene.add(frame);

            const pane = new THREE.Mesh(skyPaneGeo, skyPaneMat.clone());

            // offset slightly forward to not clip
            const offset = new THREE.Vector3(0, 0, 0.25).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
            pane.position.set(x + offset.x, y, z + offset.z);
            pane.rotation.y = rotY;

            this.scene.add(pane);
            this.windowSkyPanes.push(pane);

            // Add a point light to cast hell glow from the window
            const glow = new THREE.PointLight('#ff3c00', 3.5, 25);
            glow.position.copy(pane.position);
            this.scene.add(glow);
        };

        // Add windows along Back wall (aligned vertically above doors to prevent overlaps)
        addWindow(-50, 24, -59.5, 0);
        addWindow(-20, 24, -59.5, 0);
        addWindow(20, 24, -59.5, 0);
        addWindow(50, 24, -59.5, 0);

        addWindow(-59.5, 24, -45, Math.PI / 2);
        addWindow(-59.5, 24, -15, Math.PI / 2);
        addWindow(-59.5, 24, 15, Math.PI / 2);
        addWindow(-59.5, 24, 45, Math.PI / 2);

        addWindow(59.5, 24, -45, -Math.PI / 2);
        addWindow(59.5, 24, -15, -Math.PI / 2);
        addWindow(59.5, 24, 15, -Math.PI / 2);
        addWindow(59.5, 24, 45, -Math.PI / 2);

        // 6. Wall Battlements / Castle Crenellations along top of the walls
        const battlementGeo = new THREE.BoxGeometry(6, 4, 3);
        for (let x = -55; x <= 55; x += 12) {
            const b1 = new THREE.Mesh(battlementGeo, wallMat);
            b1.position.set(x, 42, -59.5);
            this.scene.add(b1);

            const b2 = new THREE.Mesh(battlementGeo, wallMat);
            b2.position.set(x, 42, 59.5);
            this.scene.add(b2);
        }
        for (let z = -55; z <= 55; z += 12) {
            const b1 = new THREE.Mesh(battlementGeo, wallMat);
            b1.position.set(-59.5, 42, z);
            b1.rotation.y = Math.PI / 2;
            this.scene.add(b1);

            const b2 = new THREE.Mesh(battlementGeo, wallMat);
            b2.position.set(59.5, 42, z);
            b2.rotation.y = Math.PI / 2;
            this.scene.add(b2);
        }
    },

    buildFountain() {
        const fountainGroup = new THREE.Group();
        fountainGroup.position.set(0, 0, 0);

        // Stone structure (Gothic cauldron style using custom cauldronSides texture)
        const stoneMat = new THREE.MeshStandardMaterial({
            map: this.loadedTextures.cauldronSides,
            roughness: 0.9,
            metalness: 0.2,
            bumpMap: this.loadedTextures.cauldronSides,
            bumpScale: 0.1,
            emissive: '#ff2200',
            emissiveMap: this.loadedTextures.cauldronSides,
            emissiveIntensity: 0.6
        });

        const metalMat = new THREE.MeshStandardMaterial({
            color: '#0b0b0d',
            roughness: 0.8,
            metalness: 0.9
        });

        // Cauldron main body (height reduced from 3.8 to 1.8)
        const cauldronGeo = new THREE.CylinderGeometry(8, 7.5, 1.8, 32);
        const cauldron = new THREE.Mesh(cauldronGeo, stoneMat);
        cauldron.position.y = 0.9;
        cauldron.castShadow = true;
        cauldron.receiveShadow = true;
        fountainGroup.add(cauldron);

        // Cauldron Lip rim
        const lipGeo = new THREE.TorusGeometry(8, 0.4, 16, 32);
        const lip = new THREE.Mesh(lipGeo, stoneMat);
        lip.rotation.x = Math.PI / 2;
        lip.position.y = 1.8;
        lip.castShadow = true;
        fountainGroup.add(lip);

        // Add 8 vertical gothic iron support ribs wrapping the cauldron exterior
        const ribGeo = new THREE.BoxGeometry(0.5, 1.8, 0.7);
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const rib = new THREE.Mesh(ribGeo, metalMat);
            const rad = 7.7;
            rib.position.set(Math.cos(angle) * rad, 0.9, Math.sin(angle) * rad);
            rib.rotation.y = -angle;
            rib.castShadow = true;
            fountainGroup.add(rib);
        }

        // Add 4 overflowing lava runnels cascading down the sides
        const runnelGeo = new THREE.BoxGeometry(1.0, 1.8, 0.2);
        const runnelMat = new THREE.MeshStandardMaterial({
            map: this.loadedTextures.lavaPool,
            color: '#ff3c00',
            emissive: '#ff2200',
            emissiveIntensity: 2.5,
            roughness: 0.1
        });
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
            const runnel = new THREE.Mesh(runnelGeo, runnelMat);
            const rad = 7.72;
            runnel.position.set(Math.cos(angle) * rad, 0.9, Math.sin(angle) * rad);
            runnel.rotation.y = -angle;
            fountainGroup.add(runnel);
        }

        // Lava liquid pool inside the cauldron (height reduced to 1.6)
        const lavaLiquidGeo = new THREE.CylinderGeometry(7.6, 7.6, 0.2, 32, 8);
        const lavaLiquidMat = new THREE.MeshStandardMaterial({
            map: this.loadedTextures.lavaPool,
            color: '#ff3c00',
            emissive: '#ff2200',
            emissiveIntensity: 2.2,
            roughness: 0.15,
            metalness: 0.5
        });
        this.fountainLavaMesh = new THREE.Mesh(lavaLiquidGeo, lavaLiquidMat);
        this.fountainLavaMesh.position.y = 1.6;
        fountainGroup.add(this.fountainLavaMesh);

        // Store baseline Y coordinates for vertex deformation animation
        const posAttr = this.fountainLavaMesh.geometry.attributes.position;
        this.fountainLavaBaseY = new Float32Array(posAttr.count);
        for (let i = 0; i < posAttr.count; i++) {
            this.fountainLavaBaseY[i] = posAttr.getY(i);
        }

        // Bubbling lava details
        this.lavaBubbles = [];
        const bubbleMat = new THREE.MeshStandardMaterial({
            color: '#ff2a00',
            emissive: '#ff6600',
            emissiveIntensity: 2.5,
            roughness: 0.05
        });
        const bubbleGeo = new THREE.SphereGeometry(0.4, 16, 16);

        for (let i = 0; i < 15; i++) {
            const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
            const angle = Math.random() * Math.PI * 2;
            const rad = Math.random() * 6.5;
            bubble.position.set(Math.cos(angle) * rad, 1.6, Math.sin(angle) * rad);

            fountainGroup.add(bubble);
            this.lavaBubbles.push({
                mesh: bubble,
                age: Math.random(),
                speed: 0.6 + Math.random() * 1.0,
                maxScale: 0.5 + Math.random() * 0.9,
                radius: rad,
                angle: angle
            });
        }

        this.scene.add(fountainGroup);

        // Low-lying steam/heat and sparks particle systems
        this.setupFountainParticles();
    },

    setupFountainParticles() {
        // 1. Steam/Smoke Particle System (Dark red volcanic fumes)
        const steamCount = 80;
        const steamGeo = new THREE.BufferGeometry();
        const steamPositions = new Float32Array(steamCount * 3);

        for (let i = 0; i < steamCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const rad = Math.random() * 7.2;
            steamPositions[i * 3] = Math.cos(angle) * rad;
            steamPositions[i * 3 + 1] = 1.7 + Math.random() * 2.5;
            steamPositions[i * 3 + 2] = Math.sin(angle) * rad;
        }
        steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

        const steamMat = new THREE.PointsMaterial({
            color: '#c9340c',
            size: 0.6,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });
        this.fountainParticles = new THREE.Points(steamGeo, steamMat);
        this.scene.add(this.fountainParticles);

        // 2. Sparks Particle System (Bright popping embers/sparks)
        const sparksCount = 120;
        const sparksGeo = new THREE.BufferGeometry();
        const sparksPositions = new Float32Array(sparksCount * 3);
        this.fountainSparksData = [];

        for (let i = 0; i < sparksCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const rad = Math.random() * 7.0;
            sparksPositions[i * 3] = Math.cos(angle) * rad;
            sparksPositions[i * 3 + 1] = 1.6 + Math.random() * 0.5;
            sparksPositions[i * 3 + 2] = Math.sin(angle) * rad;

            this.fountainSparksData.push({
                velY: 0.04 + Math.random() * 0.07,
                velX: (Math.random() - 0.5) * 0.02,
                velZ: (Math.random() - 0.5) * 0.02
            });
        }
        sparksGeo.setAttribute('position', new THREE.BufferAttribute(sparksPositions, 3));

        const sparksMat = new THREE.PointsMaterial({
            color: '#ffea6c',
            size: 0.12,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending
        });
        this.fountainSparks = new THREE.Points(sparksGeo, sparksMat);
        this.scene.add(this.fountainSparks);
    },

    buildSign() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.shadowColor = '#ff2200';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#ff3300';
        ctx.font = 'bold 110px "Cairo", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('مدرسة الشياطين', 512, 100);

        ctx.font = 'bold 45px "Cairo", sans-serif';
        ctx.fillStyle = '#ffaa88';
        ctx.fillText('أروقة ومناهج درس إبليس التفاعلية', 512, 200);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff, transparent: true });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(35, 8.75, 1);
        sprite.position.set(0, 16, 0);

        this.scene.add(sprite);
        this.mainSign = sprite;
    },

    setupEmberParticles() {
        // Floating volcanic ash and embers in the courtyard
        const particleCount = window.isMobileDevice ? 120 : 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            // Scattered random position
            positions[i * 3] = (Math.random() - 0.5) * 58;
            positions[i * 3 + 1] = Math.random() * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 58;

            // Slow drift velocities
            velocities.push({
                x: (Math.random() - 0.5) * 0.1,
                y: 0.2 + Math.random() * 0.3, // rises up
                z: (Math.random() - 0.5) * 0.1,
                amplitude: Math.random() * 1.5,
                frequency: 0.2 + Math.random() * 0.5
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: '#ff8800',
            size: 0.12,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.emberParticles = new THREE.Points(geometry, material);
        this.scene.add(this.emberParticles);

        this.emberParticlesData = velocities;
    },

    buildDoors() {
        const doorsData = DataManager.loadData();

        doorsData.forEach(d => {
            const doorGroup = new THREE.Group();
            doorGroup.position.set(d.position.x, d.position.y, d.position.z);
            doorGroup.rotation.set(d.rotation.x, d.rotation.y, d.rotation.z);

            // 1. Gothic Arch Door Frame
            const frameMat = new THREE.MeshStandardMaterial({
                color: '#0c0504',
                roughness: 0.9,
                bumpMap: this.loadedTextures.volcanicWall,
                bumpScale: 0.05
            });

            // Frame sides and arch top
            const sideLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7.5, 0.6), frameMat);
            sideLeft.position.set(-2.25, 0, 0);
            sideLeft.castShadow = true;
            doorGroup.add(sideLeft);

            const sideRight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 7.5, 0.6), frameMat);
            sideRight.position.set(2.25, 0, 0);
            sideRight.castShadow = true;
            doorGroup.add(sideRight);

            const archTop = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.5, 0.6), frameMat);
            archTop.position.set(0, 3.75, 0);
            archTop.castShadow = true;
            doorGroup.add(archTop);

            // 2. Swirling portal background behind the door leaf (visible when opened)
            const portalGeo = new THREE.PlaneGeometry(4.0, 7.0);
            const portalMat = new THREE.MeshBasicMaterial({
                color: '#1a0000',
                transparent: true,
                opacity: 0.0,
                side: THREE.DoubleSide
            });
            const portalGate = new THREE.Mesh(portalGeo, portalMat);
            portalGate.position.set(0, 0, -0.05); // tucked slightly behind door leaf
            doorGroup.add(portalGate);

            // 3. Interactive Door Leaf
            let doorTex = this.loadedTextures.boneDoor; // fallback

            if (d.style === 'magma') {
                doorTex = this.loadedTextures.lavaFloor;
            } else if (d.style === 'souls') {
                doorTex = this.loadedTextures.soulDoor;
            } else if (d.style === 'beast') {
                doorTex = this.loadedTextures.beastDoor;
            } else if (d.style === 'runes') {
                doorTex = this.loadedTextures.runicDoor;
            }

            const doorMat = new THREE.MeshStandardMaterial({
                map: doorTex,
                roughness: 0.8,
                metalness: d.style === 'spikes' ? 0.8 : 0.1,
                emissive: '#110000',
                emissiveIntensity: 0.5
            });

            // Special handling for the Spikes door
            if (d.style === 'spikes') {
                doorMat.color = new THREE.Color('#332520');
                doorMat.map = null;
            }

            const doorGeo = new THREE.BoxGeometry(4.0, 7.0, 0.15);
            const doorMesh = new THREE.Mesh(doorGeo, doorMat);
            doorMesh.position.set(0, 0, 0);
            doorMesh.castShadow = true;
            doorMesh.userData = { doorId: d.id }; // store key for raycasting

            // Set pivot offset so door swings open on left hinge
            const doorPivot = new THREE.Group();
            doorPivot.position.set(-2.0, 0, 0); // hinge position
            doorMesh.position.set(2.0, 0, 0); // offset child by half width
            doorPivot.add(doorMesh);
            doorGroup.add(doorPivot);

            // Add spikes on door if style is 'spikes'
            if (d.style === 'spikes' && !window.isMobileDevice) {
                const spikeGeo = new THREE.ConeGeometry(0.15, 0.6, 8);
                const spikeMat = new THREE.MeshStandardMaterial({ color: '#2a221f', roughness: 0.7 });
                for (let sy = -2.5; sy <= 2.5; sy += 1.25) {
                    for (let sx = 0.5; sx <= 3.5; sx += 1.0) {
                        const spike = new THREE.Mesh(spikeGeo, spikeMat);
                        spike.rotation.x = Math.PI / 2;
                        spike.position.set(sx, sy, 0.3);
                        doorPivot.children[0].add(spike); // add as child of doorMesh
                    }
                }
            }

            // Outer group added to scene
            this.scene.add(doorGroup);

            // Keep reference for interactive controls
            this.doors[d.id] = {
                group: doorGroup,
                pivot: doorPivot,
                doorMesh: doorMesh,
                portalGate: portalGate,
                data: d,
                isOpened: false
            };

            // Restore opened state from localStorage
            let openedDoors = [];
            try {
                openedDoors = JSON.parse(localStorage.getItem('openedDoors')) || [];
            } catch (e) {
                console.error("Error reading localStorage:", e);
            }

            if (openedDoors.includes(d.id)) {
                this.doors[d.id].isOpened = true;
                doorPivot.rotation.y = -Math.PI * 0.65; // Open door
                portalGate.material.opacity = 0.95;

                portalGate.material.color.set('#ff3300');
                if (d.style === 'souls') portalGate.material.color.set('#00ffa0');
                if (d.style === 'bones') portalGate.material.color.set('#cca380');
            }
        });
    },

    onPointerMove(event) {
        // Calculate mouse coordinates in NDC
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Perform hover detection
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Gather all door leaf meshes for intersection
        const meshesToInteract = Object.values(this.doors).map(d => d.doorMesh);
        const intersects = this.raycaster.intersectObjects(meshesToInteract);

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const doorId = hitMesh.userData.doorId;

            if (this.hoveredDoorId !== doorId) {
                // Remove emissive hover state from old door
                this.resetHoverState();

                this.hoveredDoorId = doorId;

                // Set glowing hover state
                hitMesh.material.emissive.set('#ff3300');
                hitMesh.material.emissiveIntensity = 1.2;
                document.body.style.cursor = 'pointer';
            }
        } else {
            if (this.hoveredDoorId) {
                this.resetHoverState();
                this.hoveredDoorId = null;
                document.body.style.cursor = 'default';
            }
        }
    },

    resetHoverState() {
        if (this.hoveredDoorId && this.doors[this.hoveredDoorId]) {
            const m = this.doors[this.hoveredDoorId].doorMesh;
            m.material.emissive.set('#110000');
            m.material.emissiveIntensity = 0.5;
        }
    },

    checkDoorIntersect(clientX, clientY) {
        if (!this.camera || !this.doors) return false;
        const tempMouse = new THREE.Vector2();
        tempMouse.x = (clientX / window.innerWidth) * 2 - 1;
        tempMouse.y = -(clientY / window.innerHeight) * 2 + 1;
        const tempRaycaster = new THREE.Raycaster();
        tempRaycaster.setFromCamera(tempMouse, this.camera);
        const meshesToInteract = Object.values(this.doors).map(d => d.doorMesh);
        const intersects = tempRaycaster.intersectObjects(meshesToInteract);
        return intersects.length > 0;
    },

    onPointerDownClick(event) {
        // Ignore clicks on UI overlays
        if (event.target.tagName !== 'CANVAS') return;

        // Update mouse NDC coordinates based on the exact click coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const meshesToInteract = Object.values(this.doors).map(d => d.doorMesh);
        const intersects = this.raycaster.intersectObjects(meshesToInteract);

        if (intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const doorId = hitMesh.userData.doorId;
            this.selectDoor(doorId);
        }
    },

    selectDoor(doorId) {
        if (!this.doors[doorId]) return;

        const door = this.doors[doorId];
        this.selectedDoorId = doorId;

        // Animate camera zooming in close to the door
        const doorWorldPos = new THREE.Vector3();
        door.doorMesh.getWorldPosition(doorWorldPos);

        // Position camera in front of the door (offset 6.5 units out)
        const viewOffset = new THREE.Vector3(0, 0, 6.5);
        viewOffset.applyEuler(door.group.rotation);

        const camTargetX = doorWorldPos.x + viewOffset.x;
        const camTargetY = 3.5; // keep eye height constant
        const camTargetZ = doorWorldPos.z + viewOffset.z;

        // Calculate target camera yaw to face the door leaf directly
        const targetYaw = door.group.rotation.y;

        // Smoothly slide camera and rotate it to face the door
        gsap.to(this.camera.position, {
            x: camTargetX,
            y: camTargetY,
            z: camTargetZ,
            duration: 1.6,
            ease: "power2.inOut"
        });

        gsap.to(this, {
            yaw: targetYaw,
            pitch: 0,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.rotation.y = this.yaw;
                this.camera.rotation.x = this.pitch;
            },
            onComplete: () => {
                Interaction.showDoorPanel(door.data);
            }
        });
    },

    lookCloserAtDoor(doorId) {
        if (!this.doors[doorId]) return;
        const door = this.doors[doorId];

        const doorWorldPos = new THREE.Vector3();
        door.doorMesh.getWorldPosition(doorWorldPos);

        const viewOffset = new THREE.Vector3(0, 0, 3.2); // extra close zoom
        viewOffset.applyEuler(door.group.rotation);

        gsap.to(this.camera.position, {
            x: doorWorldPos.x + viewOffset.x,
            y: 3.5,
            z: doorWorldPos.z + viewOffset.z,
            duration: 1.0,
            ease: "power1.inOut"
        });
    },

    resetCamera() {
        if (this.selectedDoorId && this.doors[this.selectedDoorId]) {
            const door = this.doors[this.selectedDoorId];
            const doorWorldPos = new THREE.Vector3();
            door.doorMesh.getWorldPosition(doorWorldPos);

            // Move camera back by 18 units along the door normal rotation
            const viewOffset = new THREE.Vector3(0, 0, 18.0);
            viewOffset.applyEuler(door.group.rotation);

            gsap.to(this.camera.position, {
                x: doorWorldPos.x + viewOffset.x,
                y: 3.5,
                z: doorWorldPos.z + viewOffset.z,
                duration: 1.5,
                ease: "power2.out"
            });
        }
        this.selectedDoorId = null;
    },

    // Animate door opening/closing rotation
    animateDoorState(doorId, openState) {
        if (!this.doors[doorId]) return;
        const door = this.doors[doorId];

        const targetRot = openState ? -Math.PI * 0.65 : 0; // swing open
        const targetOpacity = openState ? 0.95 : 0.0; // portal gate hum opacity

        // Open door swing animation
        gsap.to(door.pivot.rotation, {
            y: targetRot,
            duration: 2.0,
            ease: "power2.inOut"
        });

        // Portal background fade-in animation
        gsap.to(door.portalGate.material, {
            opacity: targetOpacity,
            duration: 1.5,
            onStart: () => {
                if (openState) {
                    door.portalGate.material.color.set('#ff3300');
                    if (door.data.style === 'souls') door.portalGate.material.color.set('#00ffa0');
                    if (door.data.style === 'bones') door.portalGate.material.color.set('#cca380');
                }
            }
        });

        door.isOpened = openState;

        // Persist opened door state
        let openedDoors = JSON.parse(localStorage.getItem('openedDoors')) || [];
        if (openState) {
            if (!openedDoors.includes(doorId)) {
                openedDoors.push(doorId);
                localStorage.setItem('openedDoors', JSON.stringify(openedDoors));
            }
        } else {
            const index = openedDoors.indexOf(doorId);
            if (index > -1) {
                openedDoors.splice(index, 1);
                localStorage.setItem('openedDoors', JSON.stringify(openedDoors));
            }
        }
    },

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // 1. Calculate keyboard target movement and smoothly interpolate it
        let keyTargetX = 0;
        let keyTargetZ = 0;
        if (this.moveState.forward) keyTargetZ -= 1;
        if (this.moveState.backward) keyTargetZ += 1;
        if (this.moveState.left) keyTargetX -= 1;
        if (this.moveState.right) keyTargetX += 1;

        // Smooth key movements (lerp)
        this.keyboardLerp.x += (keyTargetX - this.keyboardLerp.x) * 0.15;
        this.keyboardLerp.z += (keyTargetZ - this.keyboardLerp.z) * 0.15;

        // 2. Smooth joystick movements (lerp)
        this.joystickLerp.x += (this.joystickMove.x - this.joystickLerp.x) * 0.15;
        this.joystickLerp.y += (this.joystickMove.y - this.joystickLerp.y) * 0.15;

        // 3. Combine both smoothed movement inputs

        // Apply Look Joystick continuous turning
        if (this.lookJoystickMove.x !== 0 || this.lookJoystickMove.y !== 0) {
            this.yaw -= this.lookJoystickMove.x * this.lookSpeed * 2.0;
            this.pitch -= this.lookJoystickMove.y * this.lookSpeed * 2.0;
            this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));
            this.camera.rotation.y = this.yaw;
            this.camera.rotation.x = this.pitch;
        }

        const moveDir = new THREE.Vector3(
            this.keyboardLerp.x + this.joystickLerp.x,
            0,
            this.keyboardLerp.z - this.joystickLerp.y
        );

        if (moveDir.lengthSq() > 0.0001) {
            // Apply camera yaw rotation to convert local direction to world direction
            moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
            this.camera.position.addScaledVector(moveDir, this.walkSpeed);
        }

        // Auto-jump logic when crossing the left or right lava canals
        let jumpYOffset = 0;
        const inLeftCanal = (this.camera.position.x >= -51.5 && this.camera.position.x <= -44.5);
        const inRightCanal = (this.camera.position.x >= 44.5 && this.camera.position.x <= 51.5);

        if (!this.isJumping && (inLeftCanal || inRightCanal)) {
            this.isJumping = true;
            this.jumpTime = 0;
            if (window.Interaction) {
                window.Interaction.playJumpSound();
            }
        }

        if (this.isJumping) {
            this.jumpTime += 0.055; // jump speed progress rate
            if (this.jumpTime >= 1.0) {
                this.isJumping = false;
                this.jumpTime = 0;
                if (window.Interaction) {
                    window.Interaction.playFootstep();
                }
            } else {
                // Parabolic jump curve
                jumpYOffset = Math.sin(this.jumpTime * Math.PI) * 4.8;
            }
        }

        // Room boundary constraints (X: -57.5 to 57.5, Z: -57.5 to 57.5)
        this.camera.position.x = Math.max(-57.5, Math.min(57.5, this.camera.position.x));
        this.camera.position.z = Math.max(-57.5, Math.min(57.5, this.camera.position.z));
        this.camera.position.y = 3.5 + jumpYOffset; // Lock height with jump offset

        // Cauldron collision constraint (center (0,0), radius 9.2)
        const currentX = this.camera.position.x;
        const currentZ = this.camera.position.z;
        const distToCauldron = Math.sqrt(currentX * currentX + currentZ * currentZ);
        const minCauldronDist = 9.2;

        if (distToCauldron < minCauldronDist) {
            const pushX = currentX / distToCauldron;
            const pushZ = currentZ / distToCauldron;
            this.camera.position.set(pushX * minCauldronDist, 3.5 + jumpYOffset, pushZ * minCauldronDist);
        }

        // Play periodic footstep sound effects when walking on the ground
        if (moveDir.lengthSq() > 0.0001 && !this.isJumping) {
            if (!this.stepTimer) this.stepTimer = 0;
            this.stepTimer += 1.0;
            if (this.stepTimer >= 22) {
                if (window.Interaction) {
                    window.Interaction.playFootstep();
                }
                this.stepTimer = 0;
            }
        } else {
            this.stepTimer = 0;
        }

        // 1. Pulsate Central Lava Light intensity
        if (this.lavaLight) {
            this.lavaLight.intensity = 3.5 + Math.sin(time * 4.0) * 1.0 + Math.cos(time * 2.2) * 0.4;
        }

        // Float the main title sign
        if (this.mainSign) {
            this.mainSign.position.y = 16 + Math.sin(time * 1.5) * 0.5;
        }

        // 2. Animate fountain lava mesh surface with realistic viscous wave deformation
        if (this.fountainLavaMesh && this.fountainLavaBaseY) {
            const posAttr = this.fountainLavaMesh.geometry.attributes.position;
            const count = posAttr.count;
            for (let i = 0; i < count; i++) {
                const x = posAttr.getX(i);
                const z = posAttr.getZ(i);
                const baseY = this.fountainLavaBaseY[i];

                // Only deform the top face vertices (above 0 locally)
                if (baseY > 0) {
                    // Viscous, slow rolling wave formulas
                    const wave1 = Math.sin(time * 2.0 + x * 0.4 + z * 0.3) * 0.16;
                    const wave2 = Math.cos(time * 1.4 - x * 0.2 + z * 0.5) * 0.12;
                    posAttr.setY(i, baseY + wave1 + wave2);
                }
            }
            posAttr.needsUpdate = true;

            // Slowly crawl lava texture offsets
            if (this.loadedTextures.lavaFloor) {
                this.loadedTextures.lavaFloor.offset.x += 0.0004;
                this.loadedTextures.lavaFloor.offset.y += 0.0003;
            }
            if (this.loadedTextures.lavaPool) {
                this.loadedTextures.lavaPool.offset.x += 0.0007;
                this.loadedTextures.lavaPool.offset.y += 0.0005;
            }
        }

        // 2b. Animate Lava Canals (longitudinal traveling waves to simulate flowing rivers of molten magma)
        if (this.leftCanal && this.rightCanal) {
            [this.leftCanal, this.rightCanal].forEach(canal => {
                const posAttr = canal.geometry.attributes.position;
                const count = posAttr.count;
                for (let i = 0; i < count; i++) {
                    const localX = posAttr.getX(i);
                    const localY = posAttr.getY(i);
                    // Traveling wave formula along Y local coordinate (which maps to world Z direction)
                    const wave = Math.sin(time * 3.5 - localY * 0.18) * 0.15 +
                        Math.cos(time * 2.2 + localX * 0.8) * 0.06;
                    posAttr.setZ(i, wave);
                }
                posAttr.needsUpdate = true;
            });
        }

        // 3. Animate Viscous Lava Bubbles (Dome expansion, surface tension swell, popping decay, and Y wave lock)
        if (this.lavaBubbles) {
            this.lavaBubbles.forEach(b => {
                b.age += 0.008 * b.speed;
                if (b.age > 1.0) {
                    b.age = 0;
                    // Reset position randomly on the lava surface
                    const angle = Math.random() * Math.PI * 2;
                    const rad = Math.random() * 6.5;
                    b.mesh.position.set(Math.cos(angle) * rad, 1.6, Math.sin(angle) * rad);
                }

                let scaleY = 0.5;
                let scaleXZ = 1.0;
                let s = Math.sin(b.age * Math.PI) * b.maxScale;

                if (b.age > 0.85) {
                    // Popping explosion
                    const popAge = (b.age - 0.85) / 0.15; // 0 to 1
                    s = b.maxScale * (1.0 + popAge * 0.4);
                    scaleY = 0.5 * (1.0 - popAge); // flattens as it pops
                    b.mesh.material.opacity = 1.0 - popAge; // fade out
                    b.mesh.material.transparent = true;
                } else {
                    b.mesh.material.opacity = 1.0;
                    b.mesh.material.transparent = false;
                    // Dome profile (squashed vertically)
                    scaleY = 0.5 + Math.sin(b.age * Math.PI) * 0.15;
                    scaleXZ = 1.0 + Math.sin(b.age * Math.PI) * 0.1;
                }

                b.mesh.scale.set(s * scaleXZ, s * scaleY, s * scaleXZ);

                // Wave lock (keep bubble rising on the wavy lava surface)
                const lavaX = b.mesh.position.x;
                const lavaZ = b.mesh.position.z;
                const surfaceWave = Math.sin(time * 2.0 + lavaX * 0.4 + lavaZ * 0.3) * 0.16 +
                    Math.cos(time * 1.4 - lavaX * 0.2 + lavaZ * 0.5) * 0.12;
                b.mesh.position.y = 1.6 + surfaceWave + (s * scaleY * 0.4);
            });
        }

        // 4. Erupt Fountain Steam/Smoke Particles (rise slowly and fade/reset)
        if (this.fountainParticles) {
            const positions = this.fountainParticles.geometry.attributes.position.array;
            const count = positions.length / 3;

            for (let i = 0; i < count; i++) {
                // Slowly drift up
                positions[i * 3 + 1] += 0.025; // rise dy
                positions[i * 3] += (Math.random() - 0.5) * 0.03; // drift dx
                positions[i * 3 + 2] += (Math.random() - 0.5) * 0.03; // drift dz

                // Reset particle when it floats too high
                if (positions[i * 3 + 1] > 7.5) {
                    const angle = Math.random() * Math.PI * 2;
                    const rad = Math.random() * 7.2;
                    positions[i * 3] = Math.cos(angle) * rad;
                    positions[i * 3 + 1] = 3.7;
                    positions[i * 3 + 2] = Math.sin(angle) * rad;
                }
            }
            this.fountainParticles.geometry.attributes.position.needsUpdate = true;
        }

        // 5. Erupt Fountain Ember/Spark Particles (rise rapidly, float and reset)
        if (this.fountainSparks) {
            const positions = this.fountainSparks.geometry.attributes.position.array;
            const count = positions.length / 3;

            for (let i = 0; i < count; i++) {
                const vel = this.fountainSparksData[i];
                positions[i * 3 + 1] += vel.velY; // rise fast
                positions[i * 3] += vel.velX + (Math.random() - 0.5) * 0.025;
                positions[i * 3 + 2] += vel.velZ + (Math.random() - 0.5) * 0.025;

                // Reset spark when it flies too high
                if (positions[i * 3 + 1] > 9.5) {
                    const angle = Math.random() * Math.PI * 2;
                    const rad = Math.random() * 7.0;
                    positions[i * 3] = Math.cos(angle) * rad;
                    positions[i * 3 + 1] = 3.6;
                    positions[i * 3 + 2] = Math.sin(angle) * rad;
                }
            }
            this.fountainSparks.geometry.attributes.position.needsUpdate = true;
        }

        // 4. Float Ember Particles
        if (this.emberParticles) {
            const positions = this.emberParticles.geometry.attributes.position.array;
            const count = positions.length / 3;

            for (let i = 0; i < count; i++) {
                const vel = this.emberParticlesData[i];

                // Rise up
                positions[i * 3 + 1] += vel.y * 0.08;
                // Sway drift
                positions[i * 3] += Math.sin(time * vel.frequency) * vel.amplitude * 0.01;
                positions[i * 3 + 2] += Math.cos(time * vel.frequency) * vel.amplitude * 0.01;

                // Reset if ember floats too high
                if (positions[i * 3 + 1] > 20) {
                    positions[i * 3] = (Math.random() - 0.5) * 58;
                    positions[i * 3 + 1] = 0;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 58;
                }
            }
            this.emberParticles.geometry.attributes.position.needsUpdate = true;
        }

        // 5. Rotate portal textures inside opened gates for swirling vortex effect
        Object.values(this.doors).forEach(door => {
            if (door.isOpened && door.portalGate) {
                // Subtle oscillation of portal gate scales to simulate portal vibrations
                const scaleOsc = 1.0 + Math.sin(time * 6) * 0.02;
                door.portalGate.scale.set(scaleOsc, scaleOsc, 1);
            }
        });

        // 6. Animate realistic torch flickering (organic shape deformation + point light intensity and position jitter)
        if (this.torches) {
            this.torches.forEach(t => {
                const seed = t.seed;

                // Outer flame stretches and wavers
                const outerScaleY = 1.0 + Math.sin(time * 15 + seed) * 0.25 + Math.cos(time * 29 + seed) * 0.1;
                const outerScaleXZ = 1.0 + Math.sin(time * 22 + seed) * 0.12;
                t.outerFlame.scale.set(outerScaleXZ, outerScaleY, outerScaleXZ);

                // Mid flame stretches and wavers with a phase shift
                const midScaleY = 1.0 + Math.cos(time * 18 + seed) * 0.2 + Math.sin(time * 33 + seed) * 0.08;
                const midScaleXZ = 1.0 + Math.cos(time * 25 + seed) * 0.1;
                t.midFlame.scale.set(midScaleXZ, midScaleY, midScaleXZ);

                // Inner core stays relatively stable but vibrates rapidly
                const innerScaleY = 1.0 + Math.sin(time * 35 + seed) * 0.15;
                const innerScaleXZ = 1.0 + Math.cos(time * 42 + seed) * 0.08;
                t.innerFlame.scale.set(innerScaleXZ, innerScaleY, innerScaleXZ);

                // Flame group translation (sway slightly in simulated wind / convective heat)
                t.flameGroup.position.x = Math.sin(time * 8 + seed) * 0.04 + Math.cos(time * 19 + seed) * 0.02;
                t.flameGroup.position.z = 1.0 + Math.cos(time * 7 + seed) * 0.04 + Math.sin(time * 17 + seed) * 0.02;
                t.flameGroup.position.y = 1.25 + Math.sin(time * 12 + seed) * 0.03;

                // Flickering point light intensity and position jitter
                t.light.intensity = t.baseIntensity +
                    Math.sin(time * 23 + seed) * 0.5 +
                    Math.cos(time * 11 + seed) * 0.25 +
                    (Math.random() - 0.5) * 0.15;

                // Jitter position slightly to cast realistic moving shadows
                t.light.position.set(
                    t.baseLightPos.x + Math.sin(time * 30 + seed) * 0.06,
                    t.baseLightPos.y + Math.cos(time * 24 + seed) * 0.04,
                    t.baseLightPos.z + Math.sin(time * 18 + seed) * 0.06
                );
            });
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
};

document.addEventListener('DOMContentLoaded', () => App3D.init());
