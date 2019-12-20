function create_board(e) {
  e.preventDefault();
  var board_name = $("#board_name").val();
  var board_id = $("#board_id").val();
  var hashtag = $("#hash_tag").val();

  var d = {
    board_id,
    board_name,
    hashtag
  };
  console.log(d);

  $.ajax({
    type: "POST",
    url: `/api/v1/board/`,
    data: d,
    dataType: "json"
  })
    .done(function(data) {
      window.location.href = "/home";
    })
    .fail(function(err) {
      console.log(err);
    });

  // console.log(Boards);
  //console.log(Boards.map(d=>{return d['board_name']}));
}

document.querySelector("#boardForm").addEventListener("submit", create_board);
