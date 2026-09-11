import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const container = document.getElementById("scene-container");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(8, 8, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 15, 8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.left = -15;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.top = 15;
directionalLight.shadow.camera.bottom = -15;
scene.add(directionalLight);

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x333333);
scene.add(gridHelper);

const cubeColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf1c40f, 0x9b59b6, 0xe67e22];
const cubePositions = [
  [-4, -2],
  [-1.5, 1],
  [1, -3],
  [3, 2],
  [-3, 4],
  [4, -1],
];

const cubeSize = 1;
const cubes = cubePositions.map(([x, z], i) => {
  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const material = new THREE.MeshStandardMaterial({
    color: cubeColors[i % cubeColors.length],
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, cubeSize / 2, z);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);
  return cube;
});

const linePositions = [];
for (let i = 0; i < cubes.length; i++) {
  for (let j = i + 1; j < cubes.length; j++) {
    linePositions.push(
      cubes[i].position.x, cubes[i].position.y, cubes[i].position.z,
      cubes[j].position.x, cubes[j].position.y, cubes[j].position.z
    );
  }
}

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(linePositions, 3)
);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lines);

const webcamVideo = document.getElementById("webcam-video");
const webcamStatus = document.getElementById("webcam-status");

function showWebcamStatus(message) {
  webcamStatus.textContent = message;
  webcamStatus.hidden = false;
}

async function initWebcam() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showWebcamStatus("Webcam not supported in this browser.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcamVideo.srcObject = stream;
    webcamStatus.hidden = true;
  } catch (err) {
    showWebcamStatus("Webcam unavailable.");
    console.warn("Unable to access webcam:", err);
  }
}

initWebcam();

function onWindowResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("resize", onWindowResize);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
