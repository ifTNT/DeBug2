//TODO
function search_article()
{
  //抓board_id
    var getUrlString = location.href;
    var url = new URL(getUrlString);
    var board_id=url.searchParams.get('board_id'); // 回傳 board_id

    console.log("search_article");
    var title=document.querySelector('.articles').innerHTML;
    document.querySelector('.articles').innerHTML='';

    var article_name = $("#articlename").val();
    console.log(article_name);
    if(article_name==="")return;
    $.ajax({
        type:'GET',
        url:"/api/v1/article/"+ board_id+"/search?article_name="+article_name ,
        dataType: 'json'
    }).done(function(data){
        console.log(data);
        //取得data的title
        for(i in data){
          var title=data[i].title;
          console.log(title);
          //if(boardname==undefined)return;

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
          //再加上自己的article_id為ID HTML
          var article_id=data[i].article_id;
          newButton.id=article_id;

          document.querySelector('.articles').appendChild(newButton).addEventListener('click', Go_article);
     }
        //console.log(Boards);
    }).fail(function(err){console.log(err)})
}
function Go_article()
{
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var board_id=url.searchParams.get('board_id'); // 回傳 board_id  
  console.log("Go_article");
}
/*edit and create */
function new_article(){
    console.log("new_article");
    var getUrlString = location.href;
    var url = new URL(getUrlString);
    var board_id=url.searchParams.get('board_id'); // 回傳 board_id
    window.location.href = "/Create_article?board_id="+board_id;
   //window.location.assign("/Create_article");
}


function list_article_in_board()
{
   //抓board_id
   var getUrlString = location.href;
   var url = new URL(getUrlString);
   var board_id=url.searchParams.get('board_id'); // 回傳 board_id

   console.log("list_article_in_board");
   var title=document.querySelector('.articles').innerHTML;
   document.querySelector('.articles').innerHTML='';

   $.ajax({
       type:'GET',
       url:"/api/v1/article/"+ board_id ,
       dataType: 'json'
   }).done(function(data){
       console.log(data);
       //取得data的title
       for(i in data){
         var title=data[i].title;
         console.log(title);
         //if(boardname==undefined)return;

         //創建原本的樣式到指定位置
         //<button style="border:none;text-align: left;" type="button" class="btn btn-outline-dark btn-lg btn-block">text</button> 
         const newButton=document.createElement('button');
         newButton.textContent=title;
         newButton.style.border="none";
         newButton.style.textAlign="left";
         newButton.type="Button";
         newButton.classList.add("btn");
         newButton.classList.add("btn-outline-dark");
         newButton.classList.add("btn-lg");
         newButton.classList.add("btn-block");
         newButton.classList.add("mt-3");
         //再加上自己的article_id為ID HTML
         var article_id=data[i].article_id;
         newButton.id=article_id;
         document.querySelector('.articles').appendChild(newButton).addEventListener('click', Go_article);
    }
       //console.log(Boards);
   }).fail(function(err){console.log(err)})
}
function subscribe()
{
  console.log("subscribe");
  //catch board_id
  var getUrlString = location.href;
  var url = new URL(getUrlString);
  var board_id=url.searchParams.get('board_id'); // 回傳 21

  $.ajax({
    type: "POST",
    url: "/api/v1/board/"+board_id+"/subscribe",
    dataType: "json"
  })
    .done(function(data) {
      console.log(data);
    })
    .fail(function(err) {
      console.log(err);
    });

}
//list_article_in_board();
document.querySelector('.new_article').addEventListener('click', new_article);
document.querySelector('.search_article_button').addEventListener('click',search_article);
document.querySelector('.subscribe').addEventListener('click',subscribe);