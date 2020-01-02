function responseTemplate(d) {
  console.log(d);
  let control =
    d.permission === false
      ? ""
      : //        <a class='badge badge-primary mr-2' style='color: white;' data-id="${d["response_id"]}" onclick="update_res(this)">edit</a>
        `<a class='badge badge-danger' style='color: white;' data-id="${d["response_id"]}" onclick="delete_res(this)">delete</a>
                `;
  let template = `<div class='someone_res d-flex justify-content-between align-items-center' style='padding-bottom: 0.5em;'>
              <div><span style='font-weight: 600;'>${d["user_id"]} :</span> ${d["content"]}</div>
              <div>
                ${control}
              </div>
          </div>`;
  return template;
}

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
        document.querySelector(
          ".articleResponse"
        ).innerHTML += responseTemplate(d);
      });
    } else {
      $(".articleResponse").html("回應載入失敗");
    }
  });
}
init();

function update_article() {
  console.log("update_article");
  // var title=document.querySelector('.articles').innerHTML;
  //document.querySelector('.articles').innerHTML='';
}

function delete_article() {
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  let board_id = url.searchParams.get("board_id"); // 回傳 board_id
  let article_id = url.searchParams.get("article_id"); //回傳 article_id
  console.log("delete_article");
  $.ajax({
    type: "DELETE",
    url: "/api/v1/article/" + board_id + "/" + article_id,
    dataType: "json"
  }).done(data => {
    console.log(data);
    // window.location.href = "/Article_board?board_id="+board_id;
  });
}

function post_response(e) {
  e.preventDefault();
  console.log("post_response");
  var content = $("#response_content").val();
  let board_id = $("#board_id").text();
  let article_id = parseInt($("#article_id").text());
  let user_id = $(".user_id").text();
  let d = {
    content,
    board_id,
    article_id,
    user_id
  };
  $.ajax({
    type: "POST",
    url: `/api/v1/response/${board_id}/${article_id}/`,
    data: d,
    dataType: "json"
  }).done(data => {
    console.log(data);
    if (data.ok === true) {
      d["response_id"] = data.response_id;
      d["permission"] = true;
      document.querySelector(".articleResponse").innerHTML =
        responseTemplate(d) +
        document.querySelector(".articleResponse").innerHTML;
      $("#response_content").val("");
    } else {
      alert(data.err);
    }
  });
}
function update_res(e) {
  console.log(e.dataset.id);
}

function delete_res(e) {
  console.log(e.dataset.id);
  let board_id = $("#board_id").text();
  let article_id = parseInt($("#article_id").text());
  let response_id = e.dataset.id;
  $.ajax({
    type: "DELETE",
    url: `/api/v1/response/${board_id}/${article_id}/${response_id}`,
    dataType: "json"
  }).done(function(data) {
    console.log(data);
    if (data.ok === true) {
      document
        .querySelector(".articleResponse")
        .removeChild(e.parentNode.parentNode);
    } else {
      alert("A error occured when deleting response");
    }
  });
}

document
  .querySelector(".update_article")
  .addEventListener("click", update_article);
document
  .querySelector(".delete_article")
  .addEventListener("click", delete_article);
document
  .querySelector(".create_response")
  .addEventListener("submit", post_response);

//是否顯示留言更新刪除  前端去找userid 右上角那個innerHTML抓 後端不做
