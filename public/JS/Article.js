

//放在抓取完資料後，傳入座標
// ((latitude,longitude) => {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: { lat: latitude, lng: longitude },
//         zoom: 17
//     });
//     var marker = new google.maps.Marker({ position: { lat: latitude, lng: longitude }, map: map });
// });

function update_article()
{
    console.log("update_article");
   // var title=document.querySelector('.articles').innerHTML;
    //document.querySelector('.articles').innerHTML='';
}

function delete_article()
{
    var getUrlString = location.href;
    var url = new URL(getUrlString);
    board_id = url.searchParams.get('board_id'); // 回傳 board_id
    article_id = url.searchParams.get('article_id'); //回傳 article_id
    console.log("delete_article");
    $.ajax({
      type: "DELETE",
      url: "/api/v1/article/"+board_id+"/"+article_id,
      dataType: "json"
    }).done(data=>{
        console.log(data);
       // window.location.href = "/Article_board?board_id="+board_id;
    });
}

function post_response()
{
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
    var article_id=url.searchParams.get('article_id'); // 回傳 article_id  
    var user_id=document.querySelector(".user_id").innerHTML;
    /*---------建立區塊-----------*/
    var a="<div class='d-flex justify-content-between align-items-center' id='"+article_id+"_block'>";
    var b="<div >"+user_id+" : "+response_content+"</div>";
    var c="<div >"
    var d="<a class='badge badge-primary mr-2 update' id='"+user_id+"' style='color: white;' onclick='update_res("+user_id+")'>update</a>"
    var e="<a class='badge badge-danger delete id='"+user_id+"' style='color: white;' onclick='delete_res("+user_id+")'>delete</a>"
    var f="</div>"

    var new_res_block=document.createElement('div');
    new_res_block.id=article_id+"_block";
    new_res_block.classList.add("d-flex");
    new_res_block.classList.add("justify-content-between");
    new_res_block.classList.add("align-items-center");
    new_res_block.innerHTML=a+b+f+c+d+e+f+f;
    document.querySelector(".articleResponse").appendChild(new_res_block);
    $("#response_content").val("");
    /*---------------------------*/



}
function update_res(e)
{
    console.log(e.id);
}

function delete_res(e)
{
    console.log(e.id);
} 

document.querySelector(".update_article").addEventListener("click", update_article);
document.querySelector(".delete_article").addEventListener("click", delete_article);
document.querySelector(".post_response").addEventListener("click", post_response);

//是否顯示留言更新刪除  前端去找userid 右上角那個innerHTML抓 後端不做