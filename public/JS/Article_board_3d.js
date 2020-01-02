function getRandom(min, max) {
  return Math.random() * Math.abs(max - min) + min;
}

function initScene() {
  //Initial global varible
  //For hover judging
  window.mouse = new THREE.Vector2();
  window.ray = new THREE.Raycaster();
  window.INTERSECTED = null;
  window.selectedCube = null;
  //For rendering
  window.scene;
  window.renderer;
  window.camera;

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight); // 場景大小
  renderer.setClearColor(0xeeeeee, 1.0); // 預設背景顏色
  renderer.shadowMap.enable = true; // 陰影效果

  // 將渲染器的 DOM 綁到網頁上
  document.querySelector(".articles").appendChild(renderer.domElement);

  //Orbit control
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  scene.add(camera);
  camera.lookAt(scene.position);
  camera.position.set(10, 10, 10);
  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.update();

  //Create light
  var pointLight = new THREE.PointLight(0xffffff, 1, 50);
  scene.add(pointLight);
  var light = new THREE.AmbientLight(0xaaaaaa);
  scene.add(light);

  //[TODO] Fetch article list and add block
  //Create object
  $.ajax({
    type: "GET",
    url: `/api/v1/article/${$("#board_id").text()}`,
    dataType: "json"
  }).done(data=>{
      console.log(data);
  })
  for (var i = 0; i < 100; i++) {
    const geometry = new THREE.BoxGeometry(0.1, 2, 2); // Article cube
    const material = new THREE.MeshPhongMaterial({
      color: getRandom(0, 0xffffff)
    });
    let cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      getRandom(-20, 20),
      getRandom(-20, 20),
      getRandom(-20, 20)
    );
    cube.id = i;
    scene.add(cube);

    let faceOnCamera = function() {
      cube.rotation.y = Math.atan2(
        cube.position.z - camera.position.z,
        camera.position.x - cube.position.x
      );
      /*cube.rotation.z = Math.atan2(
        (camera.position.y - cube.position.y),
        (camera.position.x - cube.position.x )
        );*/

      requestAnimationFrame(faceOnCamera);
    };
    faceOnCamera();
  }

  renderer.setAnimationLoop(function() {
    controls.update();
    renderer.render(scene, camera);
    let { x, y, z } = camera.position;
    pointLight.position.set(x, y, z);
    judgeHover();
  });

  renderer.domElement.addEventListener("mousemove", onSceneMouseMove, false);
  //document.querySelector("#article").style.width = `${window.innerWidth / 2}px`;
  //document.querySelector("#article").style.height = `${window.innerHeight}px`;
  renderer.domElement.addEventListener("mousedown", onSceneMouseDown);
  renderer.domElement.addEventListener("mouseup", onSceneMouseClick);

  //RWD
  window.addEventListener("resize", function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    let article_style = document.querySelector("#article").style;
    article_style.width = `${window.innerWidth / 2}px`;
    article_style.height = `${window.innerHeight}px`;
  });
}

function onSceneMouseMove(event) {
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  // event.preventDefault();

  // update the mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  let tooltip = document.querySelector("#tooltip");
  tooltip.style.top = `${event.clientY - tooltip.offsetHeight - 10}px`;
  tooltip.style.left = `${event.clientX - tooltip.offsetWidth / 2}px`;
}

function judgeHover() {
  ray.setFromCamera(mouse, camera);
  let intersects = ray.intersectObjects(scene.children);
  if (intersects.length > 0) {
    // if the closest object intersected is not the currently stored intersection object
    if (intersects[0].object != INTERSECTED) {
      // restore previous intersection object (if it exists) to its original color
      if (INTERSECTED)
        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
      // store reference to closest object as current intersection object
      INTERSECTED = intersects[0].object;
      // store color of closest object (for later restoration)
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
      // set a new color for closest object
      INTERSECTED.material.color.setHex(0xff0000);
      document.querySelector("#tooltip").innerHTML = INTERSECTED.id;
      document.querySelector("#tooltip").style.opacity = "1";
    }
  } // there are no intersections
  else {
    // restore previous intersection object (if it exists) to its original color
    if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"
    INTERSECTED = null;
    document.querySelector("#tooltip").style.opacity = "0";
  }
}

function onSceneMouseDown(e) {
  //document.querySelector("#article").style.display = "none";
  ray.setFromCamera(mouse, camera);
  let intersects = ray.intersectObjects(scene.children);
  if (intersects.length > 0) {
    selectedCube = intersects[0].object;
  } else {
    selectedCube = null;
  }
}

function onSceneMouseClick(e) {
  ray.setFromCamera(mouse, camera);
  let intersects = ray.intersectObjects(scene.children);
  if (intersects.length > 0 && intersects[0].object === selectedCube) {
    document.querySelector("#tooltip").style.opacity = "0";
    alert(intersects[0].object.id);
    //document.querySelector("#article").style.display = "block";
    //document.querySelector("#article").innerHTML = intersects[0].object.id;
  } else {
    //document.querySelector("#article").style.display = "none";
  }
}

initScene();
