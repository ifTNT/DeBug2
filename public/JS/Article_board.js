function search_article()
{
 
    console.log("search_article");
}
/*edit and create */
function new_article(){
    console.log("new_article");
   // window.location.href = `/edit_board?board_name=${$("#boardname").val()}`
   window.location.assign("/Create_article");
}

function list_article_in_board()
{
    var which_boardname= document.querySelector('.which_boardname').innerHTML;//$(".which_boardname").innerHTML;
    console.log(which_boardname);
    var board_id="";
    $.ajax({
      type: "GET",
      url: "/api/v1/board/"+ which_boardname,
      dataType: "json"
    })
      .done(function(data) {
        console.log(data);
        board_id=data.board_id;
        console.log(board_id);//確定ID正確性
    })
    .fail(function(err) {
      console.log(err);
    }).then(function(){
      console.log(board_id);//確定ID正確性
      $.ajax({
        type: "GET",
        url: "/api/v1/article/"+ board_id,
        dataType: "json"
      })
        .done(function(data) {
          console.log(data);
          
       
      })
      .fail(function(err) {
        console.log(err);
      })
    });
    
}
function subscribe()
{
  console.log("subscribe");
}
list_article_in_board();
document.querySelector('.new_article').addEventListener('click', new_article);
document.querySelector('.search_article_button').addEventListener('click',search_article);
document.querySelector('.subscribe').addEventListener('click',subscribe);