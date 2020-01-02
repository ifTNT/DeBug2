function getRandom(min, max) {
  return Math.random() * Math.abs(max - min) + min;
}

function fromLongLatToXZ(longitude, latitude) {
  let r = 6371000; //Radius of earth (m);
  let scaleFactor = 1;

  longitude = longitude * Math.PI / 180;
  latitude = latitude * Math.PI / 180;

  //For small area, euqalrectangular projection is fine.
  let x = (r * longitude * Math.cos(latitude)) / scaleFactor;
  let z = (r * latitude) / scaleFactor;

  return { x, z };
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
  window.controls;

  scene = new THREE.Scene();

  //Load texture for scene
  var cubeTextureLoader = new THREE.CubeTextureLoader();
  cubeTextureLoader.setPath("/images/");

  cubeTextureLoader.load(
    [
      /*
      "paper_texture.jpg",
      "paper_texture.jpg",
      "paper_texture.jpg",
      "paper_texture.jpg",
      "paper_texture.jpg",
      "paper_texture.jpg"
      */
      "minecraft_1.png",
      "minecraft_no_sun.png",
      "minecraft_sky.png",
      "minecraft_ground.png",
      "minecraft_no_sun.png",
      "minecraft_no_sun.png"
    ],
    function(texture) {
      scene.background = texture;
    }
  );

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

  //Clock for update control
  var clock = new THREE.Clock();
  //Control
  controls = new THREE.FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 10;
  controls.lookSpeed = 0.1;
  controls.update(clock.getDelta());
  //let controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.update();

  //Point light that stick to camera
  var pointLight = new THREE.PointLight(0xffffff, 1, 50);
  scene.add(pointLight);
  //Ambient light
  var light = new THREE.AmbientLight(0xaaaaaa);
  scene.add(light);

  //Axes helper
  var axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  //Create article cubes
  $.ajax({
    type: "GET",
    url: `/api/v1/article/${$("#board_id").text()}`,
    dataType: "json"
  }).done(function(data) {
    console.log(data);
    for (let i of data) {
      let { x, z } = fromLongLatToXZ(i.longitude, i.latitude);
      let y = i.altitude;
      console.log(x, y, z);

      if (i.model_url && i.model_url !== null) {
        let loader = new THREE.GLTFLoader();
        loader.load(
          i.model_url,
          function(gltf) {
            gltf.scene.position.set(x, y, z);
            console.log(gltf.scene);
            scene.add(gltf.scene);
          },
          undefined,
          function(error) {
            console.error(error);
            //Handle fallback
            var texture = new THREE.TextureLoader().load("images/fallback.png");
            let material = new THREE.MeshBasicMaterial({ map: texture });
            const geometry = new THREE.BoxGeometry(1, 1, 1); // Fallback cube
            let cube = new THREE.Mesh(geometry, material);

            cube.position.set(x, y, z);
            cube.id = i.article_id;
            cube.title = "Object doesn't exist";
            scene.add(cube);
          }
        );
      } else {
        const geometry = new THREE.BoxGeometry(0.1, 2, 2); // Article cube
        const material = new THREE.MeshPhongMaterial({
          color: getRandom(0, 0xfaffff)
        });
        let cube = new THREE.Mesh(geometry, material);

        cube.position.set(x, y, z);
        cube.id = i.article_id;
        cube.title = i.title;
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
    }
  });

  renderer.setAnimationLoop(function() {
    controls.update(clock.getDelta());
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
    controls.handleResize();
    //let article_style = document.querySelector("#article").style;
    //article_style.width = `${window.innerWidth / 2}px`;
    //article_style.height = `${window.innerHeight}px`;
  });

  //Update camera location from geolocation
  navigator.geolocation.watchPosition(function(p) {
    let { longitude, latitude, altitude } = p.coords;
    let { x, z } = fromLongLatToXZ(longitude, latitude);
    let y = altitude == null ? 0 : altitude;
    camera.position.set(x, y, z);
    console.log("camera:", x, y, z);
    console.log(p.coords);
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
      document.querySelector("#tooltip").innerHTML = INTERSECTED.title;
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
