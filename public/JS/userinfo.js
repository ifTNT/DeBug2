//User info page change button
function deleteAccount()
{
    console.log("deleteAccount");
    $.ajax({
      type: "DELETE",
      url: "/api/v1/user/",
      dataType: "json"
    }).done(data=>{
        window.location.href = "/sign_out"
    });
}

function get_subscribe_manage()
{
  var userid=document.querySelector('.find_user_id').innerHTML;
  console.log(userid);
  $.ajax({
    type: "GET",
    url: "/api/v1/user/"+userid,
    dataType: "json"
  }).done(function(data){
    console.log(data);
    var boardmanage=data.manage;
    console.log(boardmanage);
    for( i in boardmanage) {
      //創建原本的樣式到指定位置
      //<p class="font-weight-bold">A</p>
      const newmanage=document.createElement('p');
      newmanage.textContent=boardmanage[i].board_name;
      newmanage.classList.add("font-weight-bold");
      //再加上boardname
      newmanage.id=boardmanage[i].board_name;
      document.querySelector('.manage_list').appendChild(newmanage);
    }

    var boardsubscribe=data.subscribe;
    console.log(boardsubscribe);
    for( i in boardsubscribe) {
      //創建原本的樣式到指定位置
      //<p class="font-weight-bold">A</p>
      const newsubscribe=document.createElement('p');
      newsubscribe.textContent=boardsubscribe[i].board_name;
      newsubscribe.classList.add("font-weight-bold");
      //再加上boardname
      newsubscribe.id=boardsubscribe[i].board_name;
      document.querySelector('.subscribe_list').appendChild(newsubscribe);
    }
}).fail(function(err){console.log(err)})
}

//TODO 沒找到ID  因為沒跑下面
function go_own_board_page()
{
  var userid=document.querySelector('.find_user_id').innerHTML;
  var personal_board_id="";
  $.ajax({
    type: "GET",
    url: "/api/v1/user/"+userid,
    dataType: "json"
  }).done(function(data){
    console.log(data);
    personal_board_id=data.personal_board_id;
    console.log(personal_board_id);
}).then(function(){
  window.location.assign("/Article_board?&board_id="+personal_board_id);
}) 
}

function Update_own_page_type_true()
{
  var userid=document.querySelector('.find_user_id').innerHTML;
  console.log("Update_own_page_type_true");
  var personal_board_id="";
  $.ajax({
    type: "GET",
    url: "/api/v1/user/"+userid,
    dataType: "json"
  }).done(function(data){
    console.log(data);
    personal_board_id=data.personal_board_id;
    console.log(personal_board_id);
  }).then(function(){
    var board_name=document.querySelector('.find_user_nickname').innerHTML;
    var id = personal_board_id;
    var visiable = 1;
    var flag=1;
    console.log(id);
    var d = {
      id,
      board_name,
      visiable,
      flag
    };


    $.ajax({
      type: "POST",
      url: "/api/v1/board/"+id,
      data: d,
      dataType: "json"
    })
      .done(function(data) {
        console.log(data);
      })
      .fail(function(err) {
        console.log(err);
      });
  }) 
  
}

function Update_own_page_type_false()
{
  var userid=document.querySelector('.find_user_id').innerHTML;
  console.log("Update_own_page_type_true");
  var personal_board_id="";
  $.ajax({
    type: "GET",
    url: "/api/v1/user/"+userid,
    dataType: "json"
  }).done(function(data){
    console.log(data);
    personal_board_id=data.personal_board_id;
    console.log(personal_board_id);
  }).then(function(){
    var board_name=document.querySelector('.find_user_nickname').innerHTML;
    var id = personal_board_id;
    var visiable = 0;
    var flag=1;
    console.log(id);
    var d = {
      id,
      board_name,
      visiable,
      flag
    };


    $.ajax({
      type: "POST",
      url: "/api/v1/board/"+id,
      data: d,
      dataType: "json"
    })
      .done(function(data) {
        console.log(data);
      })
      .fail(function(err) {
        console.log(err);
      });
  }) 
}

get_subscribe_manage();
document.querySelector('.sure_delete_account').addEventListener('click', deleteAccount);
document.querySelector('.go_own_board_page').addEventListener('click', go_own_board_page);
document.querySelector('.type_true').addEventListener('click', Update_own_page_type_true);
document.querySelector('.type_false').addEventListener('click', Update_own_page_type_false);

