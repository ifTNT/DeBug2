//Home page search button
function search_board()
{
 
    console.log("search_board");
    var token=$('input[name=csrfimiddlewaretoken').val();
    var Boards=document.querySelector('.boards').innerHTML;
    //console.log(Boards);
    document.querySelector('.boards').innerHTML='';

    var obj = {
        csrfmiddlewaretoken: token,
        board_name : Boards
    };
    
    var name = $("#boardname").val();
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
    }).fail(function(err){console.log(err)})


   // console.log(Boards);
    //console.log(Boards.map(d=>{return d['board_name']}));
    
}
/*edit and create */
function edit_board(){
    console.log("edit_board");
    window.location.href = `/edit_board?board_name=${$("#boardname").val()}`
}

function list_board()
{
    $.ajax({
      type: "GET",
      url: "/api/v1/board/",
      dataType: "json"
    })
      .done(function(data) {
        console.log(data);
        for(var obj in data)
        {
            console.log(data[obj].board_name); 
            var name=data[obj].board_name;
            //創建原本的樣式到指定位置
           /*<button style="border:none;text-align: left;" type="button" 
           class="btn btn-outline-dark btn-lg btn-block">Block level button</button>*/
            const newButton=document.createElement('button');
            newButton.textContent=name;
            newButton.style.border="none";
            newButton.style.textAlign="left";
            newButton.type="Button";
            newButton.classList.add("btn");
            newButton.classList.add("btn-outline-dark");
            newButton.classList.add("btn-lg");
            newButton.classList.add("btn-block");
            newButton.classList.add("mt-3");
            //newButton.onclick="Go_article_board("+name+")";
            //再加上自己的名字為ID
            newButton.id=name;
            document.querySelector('.boards').appendChild(newButton).addEventListener('click', Go_article_board);
        }
    })
      .fail(function(err) {
        console.log(err);
      });
}
function Go_article_board()
{
    //find which board is clocked
    var boardname_linkurl=this.id;
    console.log( boardname_linkurl);
    window.location.assign("/Article_board?board_name="+boardname_linkurl);
}
list_board();
document.querySelector('.search_board').addEventListener('click', search_board);
document.querySelector('.edit_board').addEventListener('click',edit_board);
