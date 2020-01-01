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
function subscribe()
{
    $.ajax({
      type: "GET",
      url: "/api/v1/user/",
      dataType: "json"
    }).done(function(data){
      console.log(data);
      //const nameList = data.map(item => Object.values(item)[0]);
      //取得data的name
      var boardname=data.board_name;
      console.log(boardname);
      if(boardname==undefined)return;
      //創建原本的樣式到指定位置
      //<button style="border:none;text-align: left;" type="button" class="btn btn-outline-dark btn-lg btn-block">text</button> 
      const newButton=document.createElement('button');
      newButton.textContent=boardname;
      newButton.style.border="none";
      newButton.style.textAlign="left";
      newButton.type="Button";
      newButton.classList.add("btn");
      newButton.classList.add("btn-outline-dark");
      newButton.classList.add("btn-lg");
      newButton.classList.add("btn-block");
      newButton.classList.add("mt-3");
      //再加上自己的名字為ID
      newButton.id=boardname;

      document.querySelector('.boards').appendChild(newButton).addEventListener('click', Go_article_board);
  
      //console.log(Boards);
  }).fail(function(err){console.log(err)})
}

function manage()
{
  var userid=document.querySelector('.find_user_id').innerHTML;
  console.log(userid);
  $.ajax({
    type: "GET",
    url: "/api/v1/user/"+userid,
    dataType: "json"
  }).done(function(data){
    console.log(data);
    var boardid=data.subscribe;
    console.log(boardid);
    for( i in boardid) {
     
    //創建原本的樣式到指定位置
    //<p class="font-weight-bold">A</p>
    const newp=document.createElement('p');
    newp.textContent=boardid[i];
    newp.classList.add("font-weight-bold");
    //再加上boardid
    newp.id=boardid[i];

    document.querySelector('#subscribe').appendChild(newp);
    }
    //console.log(Boards);
}).fail(function(err){console.log(err)})
}

manage();
document.querySelector('.delete_account').addEventListener('click', deleteAccount);

