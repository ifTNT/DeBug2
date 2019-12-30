function search_article()
{
 
    console.log("search_article");
    /*var token=$('input[name=csrfimiddlewaretoken').val();
    var title=document.querySelector('.articles').innerHTML;
    document.querySelector('.articles').innerHTML='';

    var obj = {
        csrfmiddlewaretoken: token,
        title : title
    };
    
    var name = $("#articlename").val();
    console.log(name);
    $.ajax({
        type:'GET',
        url:"/api/v1/board/"+ name ,
        data: obj ,
        dataType: 'json'
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

        document.querySelector('.boards').appendChild(newButton);
    
        //console.log(Boards);
    }).fail(function(err){console.log(err)})*/
    
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