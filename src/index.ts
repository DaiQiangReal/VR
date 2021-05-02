// import * as THREE from 'three';
// import WebVRPolyfill from 'webvr-polyfill';
// import TWEEN from '@tweenjs/tween.js'
// const polyfill = new WebVRPolyfill();

// class VRBase {
// 	renderElement: any;
// 	buttonElement: any;
// 	scene: THREE.Scene;
// 	camera: THREE.PerspectiveCamera;
// 	renderer: THREE.WebGLRenderer;
// 	clock: THREE.Clock;
// 	constructor({ renderElement,buttonElement }) {
// 		this.renderElement = renderElement;
// 		this.buttonElement = buttonElement;
// 		// 初始化场景
// 		this.scene = new THREE.Scene();
// 		// 初始化相机
// 		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// 		this.scene.add(this.camera);

// 		// 初始化渲染器
// 		this.renderer = new THREE.WebGLRenderer({ antialias: true });
// 		this.renderer.setSize(window.innerWidth, window.innerHeight);
// 		this.renderer.shadowMapEnabled = true;
// 		this.renderer.setPixelRatio(window.devicePixelRatio);
// 		renderElement.appendChild(this.renderer.domElement);

// 		this.clock = new THREE.Clock();
// 		// VR初始化
// 		this._initVR();
// 		// 往场景添加3d物体
// 		this.start();
// 		// 窗口大小调整监听
// 		window.addEventListener('resize', this._resize.bind(this), false);
// 		// THREE.DefaultLoadingManager.onLoad = () => {
// 			// 渲染动画
// 			this.renderer.animate(this._animate.bind(this));
// 		// }
// 	}
// 	start() {}
// 	update() {}
// 	_initVR() {
// 		const { renderer, buttonElement} = this;
// 		renderer.xr.enabled = true;
// 		// 获取VRDisplay实例
// 		navigator.getVRDisplays().then(display => {
// 			// 将display实例传给renderer渲染器
// 			renderer.xr.setDevice(display[0]);
// 			VRButton.init(display[0], renderer, buttonElement, () => buttonElement.textContent = '退出VR', () => buttonElement.textContent = '进入VR');
// 		}).catch(err => console.warn(err));
// 	}
// 	_resize() {
// 		const { camera, renderer } = this;
// 		// 窗口调整重新调整渲染器
// 		camera.aspect = window.innerWidth / window.innerHeight;
// 		camera.updateProjectionMatrix();
// 		renderer.setSize(window.innerWidth, window.innerHeight);
// 	}
// 	_animate() {
// 		const { scene, camera, renderer } = this;
// 		// 启动渲染
// 		this.update();
// 		renderer.render(scene, camera);
// 	}
// }
// // VR按钮控制
// const VRButton = {
// 	/** 
// 	 * @param {VRDisplay} display VRDisplay实例
// 	 * @param {THREE.WebGLRenderer} renderer 渲染器
// 	 * @param {HTMLElement} button VR控制按钮
// 	 * @param {Function} enterVR 点击进入VR模式时回调
// 	 * @param {Function} exitVR 点击退出VR模式时回调
// 	 **/
// 	init(display, renderer, button, enterVR, exitVR) {
// 		if (display) {
// 			button.addEventListener('click', e => {
// 				display.isPresenting ? display.exitPresent() : display.requestPresent([{ source: renderer.domElement }]);
// 			});
// 			window.addEventListener('vrdisplaypresentchange', e => {
// 				display.isPresenting ? enterVR() : exitVR();
// 			}, false);
// 		} else {
// 			button.remove();
// 		}
// 	}
// }

// class WebVRApp extends VRBase {
// 	state: { _duration: number; };
// 	animate: {};
// 	gazer: Gazer;
// 	constructor() {
// 		super({
// 			renderElement: document.querySelector('.main'),
// 			buttonElement: document.querySelector('.vr-btn')
// 		});
// 	}
// 	start() {
// 		const { scene, camera } = this;
// 		this.state = {
// 			_duration: 1500
// 		};
// 		this.animate = {};
// 		// 创建准心
// 		camera.add(this.createCrosshair());
// 		// 创建光线
// 		scene.add(new THREE.AmbientLight(0xFFFFFF));
// 		scene.add(this.createLight());
// 		// 创建地面
// 		scene.add(this.createGround(1000, 1000));
// 		this.gazer = new Gazer();

// 		// 创建立方体
// 		for (let i = 0; i < 100; i++) {
// 			const cube = this.createCube(2, 2, 2);
// 			cube.position.set(
// 				100 * Math.random() - 50,
// 				50 * Math.random() - 10,
// 				100 * Math.random() - 50
// 			);
// 			scene.add(cube);

// 			this.gazer.on(cube, 'gazeEnter', () => {
// 				this.state._wait = true;
// 				this.animate.loader.start();
// 			});
// 			this.gazer.on(cube, 'gazeLeave', () => {
// 				this.animate.loader.stop();
// 				cube.scale.set(1, 1, 1);
// 				cube.material.opacity = 1;
// 			});
// 			this.gazer.on(cube, 'gazeWait', () => {
// 				this.animate.loader.stop();
// 				cube.material.opacity = 0.5;
// 			})
// 		}
// 	}
// 	createCrosshair() {
// 		// 创建准心
// 		const geometry1 = new THREE.CircleGeometry(0.002, 16);
// 		const material = new THREE.MeshBasicMaterial({
// 			color: 0xffffff,
// 			opacity: 0.5,
// 			side: THREE.DoubleSide,
// 			transparent: true,
// 			needsUpdate: true
// 		});
// 		const pointer = new THREE.Mesh(geometry1, material);
// 		pointer.name = 'pointer';
// 		const geometry2 = new THREE.CircleGeometry();
// 		const loader = new THREE.Mesh(geometry2, material);
// 		loader.rotation.set(0, Math.PI, Math.PI / 2);
// 		loader.name = 'loader';
// 		this.animate.loader = new TWEEN.Tween({ thetaLength: 0 })
// 			.to({ thetaLength: 2 * Math.PI }, this.state._duration)
// 			.onUpdate(function () {
// 				loader.geometry = new THREE.RingGeometry(0.005, 0.007, 32, 8, 0, this.thetaLength);
// 				loader.geometry.verticesNeedUpdate = true;
// 			})
// 			.onStop(function () {
// 				this.thetaLength = 0;
// 				loader.geometry = new THREE.Geometry();
// 			});
// 		const crosshair = new THREE.Group();
// 		crosshair.add(pointer);
// 		crosshair.add(loader);
// 		crosshair.position.z = -0.5;
// 		crosshair.matrixAutoUpdate = false;
// 		crosshair.updateMatrix();
// 		console.log(crosshair);
// 		return crosshair;
// 	}
// 	createCube(width = 2, height = 2, depth = 2, color = 0xef6500) {
// 		// 创建立方体

// 		const geometry = new THREE.RingGeometry(width, height, depth);
// 		const material = new THREE.MeshLambertMaterial({
// 			color: color,
// 			needsUpdate: true,
// 			opacity: 1,
// 			transparent: true
// 		});
// 		const cube = new THREE.Mesh(geometry, material);
// 		cube.castShadow = true;
// 		return cube;
// 	}
// 	createLight() {
// 		// 创建光线
// 		const light = new THREE.DirectionalLight(0xffffff, 0.3);
// 		light.position.set(50, 50, -50);
// 		light.castShadow = true;
// 		light.shadow.mapSize.width = 2048;
// 		light.shadow.mapSize.height = 512;
// 		return light;
// 	}
// 	createGround(width, height) {
// 		// 创建地平面
// 		const geometry = new THREE.PlaneBufferGeometry(width, height);
// 		const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
// 		const ground = new THREE.Mesh(geometry, material);
// 		ground.rotation.x = - Math.PI / 2;
// 		ground.position.y = -10;
// 		ground.receiveShadow = true;
// 		return ground;
// 	}
// 	update() {
// 		const { scene, camera, renderer, clock } = this;
// 		const delta = clock.getDelta() * 60;
// 		// 启动渲染
// 		TWEEN.update();
// 		this.gazer.update(camera);
// 	}
// }
// // 凝视监听器
// class Gazer {
// 	raycaster: THREE.Raycaster;
// 	_center: THREE.Vector2;
// 	rayList: {};
// 	targetList: any[];
// 	_intersection: any;
// 	_lastTarget: any;
// 	_gazeEnterTime: any;
// 	_delayTime: any;
// 	intersection: any;
// 	constructor() {
// 		// 初始化射线发射源
// 		this.raycaster = new THREE.Raycaster();
// 		this._center = new THREE.Vector2();
// 		this.rayList = {}, this.targetList = [];
// 		this._intersection = null, this._lastTarget = null;
// 		this._gazeEnterTime = null, this.delayTime = 1500;
// 	}
// 	get delayTime() {
// 		return this._delayTime;
// 	}
// 	set delayTime(val) {
// 		this._delayTime = val;
// 	}
// 	get target() {
// 		return this._lastTarget;
// 	}
// 	/** 
// 	 * @param {THREE.Mesh} target 监听的3d网格
// 	 * @param {String} eventType 事件类型 
// 	 *      'gazeEnter': '射线击中物体触发一次', 
// 	 *      'gazeTrigger': '射线击中物体触发', 
// 	 *      'gazeLeave': '射线离开物体触发'
// 	 *      'gazeWait': '射线击中物体超过一定时间触发'
// 	 * @param {Function} callback 事件回调
// 	 **/
// 	on(target, eventType, callback) {
// 		const noop = () => { };
// 		if (!this.rayList[target.id]) this.rayList[target.id] = {
// 			target,
// 			gazeEnter: noop,
// 			gazeTrigger: noop,
// 			gazeLeave: noop,
// 			gazeWait: noop
// 		};
// 		this.rayList[target.id][eventType] = callback;
// 		this.targetList = Object.keys(this.rayList).map(key => this.rayList[key].target);
// 	}
// 	off(target, eventType) {
// 		if (!eventType) {
// 			delete this.rayList[target.id];
// 			this.targetList = Object.keys(this.rayList).map(key => this.rayList[key].target);
// 		} else {
// 			const noop = () => { };
// 			this.rayList[target.id][eventType] = noop;
// 		}
// 	}
// 	clear() {
// 		this.rayList = {}, this.targetList = [];
// 	}
// 	update(camera) {
// 		if (this.targetList.length <= 0) return;
// 		//创建凝视器
// 		this.raycaster.setFromCamera(this._center, camera);
// 		const intersects = this.raycaster.intersectObjects(this.targetList);
// 		if (intersects.length > 0) { //凝视触发
// 			const intersection = intersects[0], currentTarget = intersection.object;
// 			const targetChanged = this._lastTarget && this._lastTarget.id !== currentTarget.id; // 射线是否从A物体切换至B物体

// 			if (targetChanged) this.rayList[this._lastTarget.id].gazeLeave(this._intersection); // 射线从A物体离开，触发A物体的gazeLeave事件

// 			if (!this._lastTarget || targetChanged) {
// 				this._gazeEnterTime = Date.now();
// 				this.rayList[currentTarget.id].gazeEnter(intersection); // 射线进入B物体，触发B物体的gazeEnter事件
// 			}

// 			this.rayList[currentTarget.id].gazeTrigger(intersection); // 射线在B物体上，触发B物体的gazeTrigger事件
// 			this._delayListener(currentTarget.id);
// 			this.intersection = intersection;
// 			this._lastTarget = currentTarget;
// 		} else {
// 			// 如果是离开物体，则触发gazeLeave
// 			if (this._lastTarget) this.rayList[this._lastTarget.id].gazeLeave(this._intersection);
// 			this.intersection = null;
// 			this._lastTarget = null;
// 		}
// 	}
// 	_delayListener(targetid) {
// 		const {_gazeEnterTime,delayTime,rayList} = this;
// 		if (_gazeEnterTime && Date.now() - _gazeEnterTime > delayTime) {
// 			rayList[targetid].gazeWait();
// 			this._gazeEnterTime = null;
// 		}

// 	}
// }


// new WebVRApp();


import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import * as THREE from 'three';

let camera, scene, renderer;
let geometry, material, mesh;

init();

function init() {

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
	camera.position.z = 1;

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
	material = new THREE.MeshNormalMaterial();
	

	mesh = new THREE.Mesh(geometry, material);
	mesh.translate.x=10
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);


	document.body.appendChild(renderer.domElement);
	renderer.setAnimationLoop(function (time) {
		animation(time)
		renderer.render(scene, camera);

	});
	document.body.appendChild(VRButton.createButton(renderer));

	renderer.xr.enabled = true;

}

function animation(time) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render(scene, camera);

}





