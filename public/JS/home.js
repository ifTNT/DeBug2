//Home page search button
function search_board() {
  // var which_type_board_name=document.querySelector('.search_choose').innerHTML;
  var which_type_board_name = document.querySelector(".search_choose")
    .textContent;
  var token = $("input[name=csrfimiddlewaretoken").val();
  var Boards = document.querySelector(".boards").innerHTML;
  document.querySelector(".boards").innerHTML = "";

  var obj = {
    csrfmiddlewaretoken: token,
    board_name: Boards
  };

  var name = $("#boardname").val();
  console.log(name);

  var urlForAjax = "/api/v1/board/";
  if (which_type_board_name == "公版") {
    //public board
    urlForAjax += name;
    findBoard(urlForAjax, obj);
  } else {
    //persional board
    $.ajax({
      type: "GET",
      url: "/api/v1/user/" + name,
      dataType: "json"
    }).done(function(data) {
      urlForAjax += data.personal_board_id + "/board";
      console.log(urlForAjax);
      findBoard(urlForAjax, obj);
    });
  }
}

function findBoard(urlForAjax, obj) {
  $.ajax({
    type: "GET",
    url: urlForAjax,
    data: obj,
    dataType: "json"
  })
    .done(function(d) {
      let processData = data => {
        //const nameList = data.map(item => Object.values(item)[0]);
        //取得data的name
        var boardname = data.board_name;
        if (boardname == undefined) return;
        //創建原本的樣式到指定位置
        //<button style="border:none;text-align: left;" type="button" class="btn btn-outline-dark btn-lg btn-block">text</button>
        const newButton = document.createElement("button");
        newButton.textContent = boardname;
        newButton.style.border = "none";
        newButton.style.textAlign = "left";
        newButton.type = "Button";
        newButton.classList.add("btn");
        newButton.classList.add("btn-outline-dark");
        newButton.classList.add("btn-lg");
        newButton.classList.add("btn-block");
        newButton.classList.add("mt-3");
        //再加上自己的名字為ID
        newButton.id = data.board_id;

        document
          .querySelector(".boards")
          .appendChild(newButton)
          .addEventListener("click", Go_article_board);

        //console.log(Boards);
      };
      if(Array.isArray(d)){
        d.forEach(processData);
      }else{
        processData(d);
      }
    })
    .fail(function(err) {
      console.log(err);
    });
}

/*edit and create */
function edit_board() {
  // console.log("edit_board");
  window.location.href = `/edit_board?board_name=${$("#boardname").val()}`;
}

function list_board() {
  $.ajax({
    type: "GET",
    url: "/api/v1/board/",
    dataType: "json"
  })
    .done(function(data) {
      for (var obj in data) {
        var name = data[obj].board_name;
        //創建原本的樣式到指定位置
        /*<button style="border:none;text-align: left;" type="button" 
                class="btn btn-outline-dark btn-lg btn-block">Block level button</button>*/
        const newButton = document.createElement("button");
        newButton.textContent = name;
        newButton.style.border = "none";
        newButton.style.textAlign = "left";
        newButton.type = "Button";
        newButton.classList.add("btn");
        newButton.classList.add("btn-outline-dark");
        newButton.classList.add("btn-lg");
        newButton.classList.add("btn-block");
        newButton.classList.add("mt-3");
        //newButton.onclick="Go_article_board("+name+")";
        //再加上自己的ID為HTML ID
        newButton.id = data[obj].board_id;
        document
          .querySelector(".boards")
          .appendChild(newButton)
          .addEventListener("click", Go_article_board);
      }
    })
    .fail(function(err) {
      console.log(err);
    });
}
function Go_article_board() {
  //find which board is clocked
  var boardid_linkurl = this.id;

  window.location.assign("/Article_board?board_id=" + boardid_linkurl);
}

function search_choose_public() {
  document.querySelector(".search_choose").innerHTML = "公版";
  document.querySelector(".boards").innerHTML = "";
  list_board();
}
function search_choose_personal() {
  document.querySelector(".search_choose").innerHTML = "個版";
}

list_board();
document.querySelector(".search_board").addEventListener("click", search_board);
document.querySelector(".edit_board").addEventListener("click", edit_board);

document
  .querySelector(".search_choose_public")
  .addEventListener("click", search_choose_public);
document
  .querySelector(".search_choose_personal")
  .addEventListener("click", search_choose_personal);
