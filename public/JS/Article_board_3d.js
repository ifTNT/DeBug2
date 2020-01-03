window.mobilecheck = function() {
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

function getRandom(min, max) {
  return Math.random() * Math.abs(max - min) + min;
}

function convertCoordinates(longitude, latitude, altitude) {
  let r = 6371000; //Radius of earth (m);
  let scaleFactor = 200;
  let scaleAltitude = 3;

  longitude = (longitude * Math.PI) / 180;
  latitude = (latitude * Math.PI) / 180;

  //For small area, euqalrectangular projection is fine.
  let x = (r * longitude * Math.cos(latitude)) / scaleFactor;
  let z = (r * latitude) / scaleFactor;
  let y = altitude * scaleAltitude;

  return { x, y, z };
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
  window.clock;
  window.pointLight;

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
  clock = new THREE.Clock();
  //Control
  if (!mobilecheck()) {
    controls = new THREE.FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 10;
    controls.lookSpeed = 0.1;
    controls.update(clock.getDelta());
  } else {
    controls = new THREE.DeviceOrientationControls(camera);
    controls.update();
  }
  //let controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.update();

  //Point light that stick to camera
  pointLight = new THREE.PointLight(0xffffff, 1, 50);
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
      let { x, y, z } = convertCoordinates(i.longitude, i.latitude, i.altitude);
      //console.log(x, y, z);

      if (i.model_url && i.model_url !== null) {
        let loader = new THREE.GLTFLoader();
        loader.load(
          i.model_url,
          function(gltf) {
            gltf.scene.position.set(x, y, z);
            console.log(gltf.scene.position);
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
        if (i.pic_url !== null) {
          console.log(i.pic_url);
          var texture = new THREE.TextureLoader().load(i.pic_url);
          var material = new THREE.MeshBasicMaterial({ map: texture });
        } else {
          var material = new THREE.MeshPhongMaterial({
            color: getRandom(0, 0xfaffff)
          });
        }
        let cube = new THREE.Mesh(geometry, material);

        cube.position.set(x, y, z);
        cube.name = i.article_id;
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

  renderer.setAnimationLoop(animate);

  renderer.domElement.addEventListener("mousemove", onSceneMouseMove, false);
  //document.querySelector("#article").style.width = `${window.innerWidth / 2}px`;
  //document.querySelector("#article").style.height = `${window.innerHeight}px`;
  renderer.domElement.addEventListener("mousedown", onSceneMouseDown);
  renderer.domElement.addEventListener("mouseup", onSceneMouseClick);
  renderer.domElement.addEventListener("mouseout", onSceneMouseOut);
  renderer.domElement.addEventListener("mouseenter", onSceneMouseEnter);
  document
    .querySelector(".navigator .wrap")
    .addEventListener("mouseenter", () => {
      controls.activeLook = false;
    });

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
    altitude = altitude == null ? 0 : altitude;
    let { x, y, z } = convertCoordinates(longitude, latitude, altitude);
    camera.position.set(x, y, z);
    console.log("camera:", x, y, z);
    console.log(p.coords);
  });
}
function animate() {
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
  let { x, y, z } = camera.position;
  pointLight.position.set(x, y, z);
  judgeHover();
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
    openArticle(intersects[0].object.name);
    //document.querySelector("#article").style.display = "block";
    //document.querySelector("#article").innerHTML = intersects[0].object.id;
  } else {
    //document.querySelector("#article").style.display = "none";
  }
}

function onSceneMouseOut(e) {
  document.querySelector("#tooltip").style.display = "none";
}

function onSceneMouseEnter(e) {
  document.querySelector("#tooltip").style.display = "block";
  controls.activeLook = true;
}

(function() {
  if (!mobilecheck()) {
    $("#startMobile").hide();
    initScene();
  } else {
    document.querySelector("#startMobile").addEventListener("click", () => {
      $("#startMobile").hide();
      initScene();
    });
  }
})();

function openArticle(article_id) {
  let board_id = document.querySelector("#board_id").innerHTML;
  window.location.href = `/article/${board_id}/${article_id}`;
  //alert("還沒做啦幹", article_id);
}
