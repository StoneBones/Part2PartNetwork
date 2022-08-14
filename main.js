let camera, scene, renderer, controls, raycaster;

let container, stats;
let INTERSECTED;
let pickableObjs = [];
let plane1, plane2, plane3, plane4, plane5;
const pointer = new THREE.Vector2();

init();
// animate(); // Fire the animation loop once the GLTF is loaded to avoid lags

function init() {

  const container = document.createElement('div');
  document.body.appendChild(container);

  let floorMat;
  let mesh1, mesh2;
  let planeGeo1, planeGeo2, planeGeo3, planeGeo4, planeGeo5;


  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 200);
  camera.position.set(- 6, 5, 5.4);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfe3dd);

  const ambLight = new THREE.AmbientLight(0xe0e0e0, .5); // soft white light
  scene.add(ambLight);

  const dirLight = new THREE.DirectionalLight(0xe0e0e0, 1);
  dirLight.position.set(0, 3, 0);
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = .5;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.left = -10;
  dirLight.shadow.camera.right = 10;
  dirLight.shadow.camera.top = 10;
  dirLight.shadow.camera.bottom = -10;

  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);


  const planeTex1 = new THREE.TextureLoader().load('textures/icon1.jpg');
  const planeTex2 = new THREE.TextureLoader().load('textures/icon2.jpg');
  const planeTex3 = new THREE.TextureLoader().load('textures/icon3.jpg');
  const planeTex4 = new THREE.TextureLoader().load('textures/icon4.jpg');
  const planeTex5 = new THREE.TextureLoader().load('textures/icon5.jpg');

  const planeMat1 = new THREE.MeshLambertMaterial({ map: planeTex1 });
  const planeMat2 = new THREE.MeshLambertMaterial({ map: planeTex2 });
  const planeMat3 = new THREE.MeshLambertMaterial({ map: planeTex3 });
  const planeMat4 = new THREE.MeshLambertMaterial({ map: planeTex4 });
  const planeMat5 = new THREE.MeshLambertMaterial({ map: planeTex5 });

  planeGeo1 = new THREE.PlaneGeometry(1, 1);
  plane1 = new THREE.Mesh(planeGeo1, planeMat1);
  plane1.receiveShadow = true;
  plane1.castShadow = true;
  plane1.position.set(1.5, 1.5, 1);
  plane1.lookAt(camera.position);
  pickableObjs.push(plane1);
  plane1.name = "plane1";
  scene.add(plane1);

  planeGeo2 = new THREE.PlaneGeometry(1, 1);
  plane2 = new THREE.Mesh(planeGeo2, planeMat2);
  plane2.receiveShadow = true;
  plane1.castShadow = true;
  plane2.position.set(1.5, 1.5, -4);
  plane2.lookAt(camera.position);
  pickableObjs.push(plane2);
  plane2.name = "plane2";
  scene.add(plane2);

  planeGeo3 = new THREE.PlaneGeometry(1, 1);
  plane3 = new THREE.Mesh(planeGeo3, planeMat3);
  plane3.receiveShadow = true;
  plane1.castShadow = true;
  plane3.position.set(-4, 1.5, 1);
  plane3.lookAt(camera.position);
  pickableObjs.push(plane3);
  plane3.name = "plane3";
  scene.add(plane3);

  planeGeo4 = new THREE.PlaneGeometry(1, 1);
  plane4 = new THREE.Mesh(planeGeo4, planeMat4);
  plane4.receiveShadow = true;
  plane1.castShadow = true;
  plane4.position.set(-5.5, 1.5, -1.5);
  plane4.lookAt(camera.position);
  pickableObjs.push(plane4);
  plane4.name = "plane4";
  scene.add(plane4);

  planeGeo5 = new THREE.PlaneGeometry(1, 1);
  plane5 = new THREE.Mesh(planeGeo5, planeMat5);
  plane5.receiveShadow = true;
  plane1.castShadow = true;
  plane5.position.set(-4, 1.5, -4);
  plane5.lookAt(camera.position);
  pickableObjs.push(plane5);
  plane5.name = "plane5";
  scene.add(plane5);

 //---ANTHONY PLEASE LOOK AT RGBE LOADER---///
  // new THREE.RGBELoader()
  //   .setPath( 'textures/' )
  //   .load( 'royal_esplanade_1k.hdr', function ( texture ) {

  //     texture.mapping = THREE.EquirectangularReflectionMapping;

  //     scene.background = texture;
  //     scene.environment = texture;

  //     render();

  // model

  const loader = new THREE.GLTFLoader().setPath('models/');
  loader.load('bldg2.gltf', function (gltf) {

    mesh1 = gltf.scene.children[0];
    mesh2 = gltf.scene.children[1];
    scene.add(gltf.scene);
    mesh1.position.set(-5, -.6, 1);
    mesh2.position.set(-5, -.6, 1);
    mesh1.scale.set(5, 5, 5);
    mesh2.scale.set(5, 5, 5);

    animate();

  });
  //} );

  loader.load('dchSite.gltf', function (gltf) {
    scene.add(gltf.scene);
    for(let i = 0; i < gltf.scene.children.length; i++){
      gltf.scene.children[i].position.set(-5, 0, 0);
      gltf.scene.children[i].scale.set(.025, .025, .025);
    }

    animate();

  });

  //} );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .75;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.addEventListener('change', animate); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 15;
  controls.target.set(-1.5, 0.5, -1.5);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.update();

  raycaster = new THREE.Raycaster();

  //stats = new Stats();
  //container.appendChild(stats.dom);

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

function onPointerMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ( ( event.clientX - rect.left ) / ( rect. right - rect.left ) ) * 2 - 1;
  pointer.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;
}

function onDocumentMouseDown(event) {

  controls.autoRotate = false;
  if(INTERSECTED){
    console.log("clicked");
    if(INTERSECTED.name == "plane1"){
      //Go to mapping page
      window.location.replace("html/mapping.html");
      console.log("clicked plane1");
    }

    if(INTERSECTED.name == "plane2"){
      //Go to texturing page
      window.location.replace("html/texturing.html");
      console.log("clicked plane2");
    }

    if(INTERSECTED.name == "plane3"){
      //Go to stackSim page
      window.location.replace("html/program_sort.html");
      console.log("clicked plane3");
    }

    if(INTERSECTED.name == "plane4"){
      //Go to renders page
      window.location.replace("html/renders.html");
      console.log("clicked plane4");
    }

    if(INTERSECTED.name == "plane5"){
      //Go to floorSim page
      window.location.replace("html/interior_growth.html");
      console.log("clicked plane5");
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  render();
  //stats.update;
}

function render() {
  controls.update();

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(pickableObjs, true);
  if (intersects.length > 0) {
    if(INTERSECTED != intersects[0].object) {
      const intersectedMaterial = intersects[0].object.material;
      intersectedMaterial.emissive.setHex(0x0000ff);
      INTERSECTED = intersects[0].object;
    }
  } else {
    if(INTERSECTED){
      INTERSECTED.material.emissive.setHex(0x000000);
      INTERSECTED = null;
    }
  }

  // TODO: reset the hex of the other planes

  renderer.render(scene, camera);

    plane1.lookAt(camera.position);
    plane2.lookAt(camera.position);
    plane3.lookAt(camera.position);
    plane4.lookAt(camera.position);
    plane5.lookAt(camera.position);

  // console.log(camera.position);
}

