/*[TODO] */
/*function create_board(e) {
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
  */

  function change_for_type_pic()
  {
    console.log("pic");
    $("#display_pic").show();
    $("#display_plaintext").hide();
    $("#display_3D").hide();
    

  }
  function change_for_type_plaintext()
  {
    console.log("plaintext");
    $("#display_pic").hide();
    $("#display_plaintext").show();
    $("#display_3D").hide();

  }
  function change_for_type_3D()
  {
    console.log("3D");
    $("#display_pic").hide();
    $("#display_plaintext").hide();
    $("#display_3D").show();

  }
 
 // document.querySelector("#ArticleForm").addEventListener("submit", create_board);
  document.querySelector("#picture").addEventListener('click', change_for_type_pic);
  document.querySelector("#plaintext").addEventListener('click', change_for_type_plaintext);
  document.querySelector("#three_dimensional").addEventListener('click', change_for_type_3D);
