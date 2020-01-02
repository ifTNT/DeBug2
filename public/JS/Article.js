function init() {
  $(".markdown").html(marked($(".markdown").text()));
  let latitude = parseFloat($("#latitude").text());
  let longitude = parseFloat($("#longitude").text());
  let board_id = $("#board_id").text();
  let article_id = $("#article_id").text();
  //放在抓取完資料後，傳入座標
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: latitude, lng: longitude },
    zoom: 17
  });
  var marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map
  });
  $.ajax({
    type: "GET",
    url: "/api/v1/response/" + board_id + "/" + article_id,
    dataType: "json"
  }).done(data => {
    if (data["ok"] !== false) {
      console.log(data);
      data.forEach(d => {
        let control =
          d.permission === false
            ? ""
            : `
                <a class='badge badge-primary mr-2' style='color: white;'>update</a>
                <a class='badge badge-danger' style='color: white;'>delete</a>
                `;
        let template = `<div class='someone_res d-flex justify-content-between align-items-center' style='padding-bottom: 0.5em;'>
              <div><span style='font-weight: 600;'>${d["user_id"]} :</span> ${d["content"]}</div>
              <div>
                ${control}
              </div>
          </div>`;
        document.querySelector(".articleResponse").innerHTML += template;
      });
    } else {
      $(".articleResponse").html("回應載入失敗");
    }
  });
}
init();

function updateART(){
  var titleT = $("#edit_title").val();
  var markdownT = $("#markdown").val();
  let board_id = $("#board_id").text(); // 回傳 board_id
  let article_id = $("#article_id").text(); //回傳 article_id
  console.log(titleT+" "+ markdownT)
  var d = {
    titleT,
    markdownT
  };
  $.ajax({
    type: "POST",
    url: "/api/v1/article/" + board_id + "/" + article_id,
    data: d,
    dataType: "json"
  }).done(data => {
    if(data.ok=true){
      alert(data.msg.toString());
      $("#edit_title").hide();
      $("#edit_main").hide();
      $("#edit_button").hide();
      location.reload();
    }else{
      alert(data.msg.toString());
      $("#edit_title").hide();
      $("#edit_main").hide();
      $("#edit_button").hide();
    }
  });
}

function update_article() {
  console.log("update_article");
  $("#edit_title").show();
  $("#edit_main").show();
  $("#edit_button").show();
  document.querySelector("#edit_button").addEventListener("click", updateART);
}

function delete_article() {
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  let board_id = $("#board_id").text(); // 回傳 board_id
  let article_id = $("#article_id").text(); //回傳 article_id
  console.log(board_id+" "+article_id)
  console.log("delete_article");
  $.ajax({
    type: "DELETE",
    url: "/api/v1/article/" + board_id + "/" + article_id,
    dataType: "json"
  }).done(data => {
    if(data.ok==true){
      window.history.back();
    }else{
      console.log(data.msg)
    }
    // window.location.href = "/Article_board?board_id="+board_id;
  });
}

function post_response() {
  console.log("post_response");
  var response_content = $("#response_content").val();
  console.log(response_content);
  // #{article_id}_block.d-flex.justify-content-between.align-items-center
  //       div user_id : #{content}
  //       div
  //         a.badge.badge-primary.mr-2( style='color: white;') update
  //         a.badge.badge-danger( style='color: white;') delete
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var article_id = url.searchParams.get("article_id"); // 回傳 article_id
  var user_id = document.querySelector(".user_id").innerHTML;
  /*---------建立區塊-----------*/
  var a =
    "<div class='d-flex justify-content-between align-items-center' id='" +
    article_id +
    "_block'>";
  var b = "<div >" + user_id + " : " + response_content + "</div>";
  var c = "<div >";
  var d =
    "<a class='badge badge-primary mr-2 update' id='" +
    user_id +
    "' style='color: white;' onclick='update_res(" +
    user_id +
    ")'>update</a>";
  var e =
    "<a class='badge badge-danger delete id='" +
    user_id +
    "' style='color: white;' onclick='delete_res(" +
    user_id +
    ")'>delete</a>";
  var f = "</div>";

  var new_res_block = document.createElement("div");
  new_res_block.id = article_id + "_block";
  new_res_block.classList.add("d-flex");
  new_res_block.classList.add("justify-content-between");
  new_res_block.classList.add("align-items-center");
  new_res_block.innerHTML = a + b + f + c + d + e + f + f;
  document.querySelector(".articleResponse").appendChild(new_res_block);
  $("#response_content").val("");
  /*---------------------------*/
}
function update_res(e) {
  console.log(e.id);
}

function delete_res(e) {
  console.log(e.id);
}

document
  .querySelector(".update_article")
  .addEventListener("click", update_article);
document
  .querySelector(".delete_article")
  .addEventListener("click", delete_article);
document
  .querySelector(".post_response")
  .addEventListener("click", post_response);

//是否顯示留言更新刪除  前端去找userid 右上角那個innerHTML抓 後端不做
