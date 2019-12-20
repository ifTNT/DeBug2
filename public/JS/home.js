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
        Boards : Boards
    };

    var json = JSON.stringify(obj);

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
        newButton.id="boardname";

        document.querySelector('.boards').appendChild(newButton);
        //console.log(Boards);
    }).fail(function(err){console.log(err)})


   // console.log(Boards);
    //console.log(Boards.map(d=>{return d['board_name']}));
    
}

function insert_board()
{
 
    console.log("search_board");
    var token=$('input[name=csrfimiddlewaretoken').val();
    var Boards=document.querySelector('.boards').innerHTML;
    //console.log(Boards);
    document.querySelector('.boards').innerHTML='';

    var obj = {
        csrfmiddlewaretoken: token,
        Boards : Boards
    };

    var json = JSON.stringify(obj);

    var name = $("#boardname").val();
    console.log(name);
    $.ajax({
        type:'POST',
        url:"/api/v1/board/" ,
        data: obj ,
        dataType: 'json'
    }).done(function(data){
        console.log(data);
        //const nameList = data.map(item => Object.values(item)[0]);
        //取得data的name
        var boardname=data.board_name;
        console.log(boardname);
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
        newButton.id="boardname";

        document.querySelector('.boards').appendChild(newButton);
        //console.log(Boards);
    }).fail(function(err){console.log(err)})


   // console.log(Boards);
    //console.log(Boards.map(d=>{return d['board_name']}));
    
}
function delete_board()
{
 
    console.log("search_board");
    var token=$('input[name=csrfimiddlewaretoken').val();
    var Boards=document.querySelector('.boards').innerHTML;
    //console.log(Boards);
    document.querySelector('.boards').innerHTML='';

    var obj = {
        csrfmiddlewaretoken: token,
        Boards : Boards
    };

    var json = JSON.stringify(obj);

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
        newButton.id="boardname";

        document.querySelector('.boards').appendChild(newButton);
        //console.log(Boards);
    }).fail(function(err){console.log(err)})


   // console.log(Boards);
    //console.log(Boards.map(d=>{return d['board_name']}));
    
}

document.querySelector('.search_board').addEventListener('click', search_board);
document.querySelector('.insert_board').addEventListener('click',insert_board);
document.querySelector('.delete_board').addEventListener('click', delete_board);
