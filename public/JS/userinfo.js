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

get_subscribe_manage();
document.querySelector('.sure_delete_account').addEventListener('click', deleteAccount);
document.querySelector('.go_own_board_page').addEventListener('click', go_own_board_page);

