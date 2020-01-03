function search_article() {
  //抓board_id
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var board_id = url.searchParams.get("board_id"); // 回傳 board_id

  console.log("search_article");
  var title = document.querySelector(".articles").innerHTML;
  //document.querySelector('.articles').innerHTML='';

  var article_name = $("#articlename").val();
  console.log(article_name);
  if (article_name === "") return;
  $.ajax({
    type: "GET",
    url: "/api/v1/article/" + board_id + "/search?query=" + article_name,
    dataType: "json"
  })
    .done(function(data) {
      //Remove all object
      while (scene.children.length > 4) {
        let i = scene.children[scene.children.length - 1];
        console.log(i.type);
        if (i.type == "Mesh") {
          scene.remove(i);
          i.geometry.dispose();
          i.material.dispose();
          i = undefined;
        }
      }
      animate();
      console.log(data);
      if (data.ok === true) {
        for (i of data.result) {
          //console.log(i);
          let { x, y, z } = convertCoordinates(
            i.longitude,
            i.latitude,
            i.altitude
          );
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
                var texture = new THREE.TextureLoader().load(
                  "images/fallback.png"
                );
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

          //if(boardname==undefined)return;
          /*
          //創建原本的樣式到指定位置
          //<button style="border:none;text-align: left;" type="button" class="btn btn-outline-dark btn-lg btn-block">text</button> 
          const newButton=document.createElement('button');
          newButton.textContent=title;
          newButton.style.border="none";
          newButton.style.textAlign="left";
          newButton.type="Button";
          newButton.classList.add("btn");
          newButton.classList.add("btn-outline-dark");
          newButton.classList.add("btn-lg");
          newButton.classList.add("btn-block");
          newButton.classList.add("mt-3");
          //再加上自己的article_id為ID HTML
          var article_id=data[i].article_id;
          newButton.id=article_id;

          document.querySelector('.articles').appendChild(newButton).addEventListener('click', Go_article);
*/
        }
      } else {
        alert(data.err);
      }
    })
    .fail(function(err) {
      console.log(err);
    });
}
function Go_article() {
  console.log("Go_article");
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var board_id = url.searchParams.get("board_id"); // 回傳 board_id
  var article_id = this.id;
  // window.location.assign("/Article?board_id="+board_id+"&article_id="+article_id);
}

/*edit and create */
function new_article() {
  console.log("new_article");
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var board_id = url.searchParams.get("board_id"); // 回傳 board_id
  window.location.href = "/Create_article?board_id=" + board_id;
  //window.location.assign("/Create_article");
}

function list_article_in_board() {
  //抓board_id
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var board_id = url.searchParams.get("board_id"); // 回傳 board_id

  console.log("list_article_in_board");
  var title = document.querySelector(".articles").innerHTML;
  document.querySelector(".articles").innerHTML = "";

  $.ajax({
    type: "GET",
    url: "/api/v1/article/" + board_id,
    dataType: "json"
  })
    .done(function(data) {
      console.log(data);
      //取得data的title
      for (i in data) {
        var title = data[i].title;
        console.log(title);
        //if(boardname==undefined)return;

        //創建原本的樣式到指定位置
        //<button style="border:none;text-align: left;" type="button" class="btn btn-outline-dark btn-lg btn-block">text</button>
        const newButton = document.createElement("button");
        newButton.textContent = title;
        newButton.style.border = "none";
        newButton.style.textAlign = "left";
        newButton.type = "Button";
        newButton.classList.add("btn");
        newButton.classList.add("btn-outline-dark");
        newButton.classList.add("btn-lg");
        newButton.classList.add("btn-block");
        newButton.classList.add("mt-3");
        //再加上自己的article_id為ID HTML
        var article_id = data[i].article_id;
        newButton.id = article_id;
        document
          .querySelector(".articles")
          .appendChild(newButton)
          .addEventListener("click", Go_article);
      }
      //console.log(Boards);
    })
    .fail(function(err) {
      console.log(err);
    });
}
function subscribe() {
  console.log("subscribe");
  //catch board_id
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var board_id = url.searchParams.get("board_id"); // 回傳 21

  $.ajax({
    type: "POST",
    url: "/api/v1/board/" + board_id + "/subscribe",
    dataType: "json"
  })
    .done(function(data) {
      alert(`已訂閱 ${$(".boardname").text()}`);
      console.log(data);
    })
    .fail(function(err) {
      console.log(err);
    });
}
//list_article_in_board();
document.querySelector(".new_article").addEventListener("click", new_article);
document
  .querySelector(".search_article_button")
  .addEventListener("click", search_article);
document.querySelector(".subscribe").addEventListener("click", subscribe);
