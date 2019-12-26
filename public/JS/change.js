//Change page change button
function change(e)
{
    e.preventDefault();
    console.log("change");
    var token=$('input[name=csrfimiddlewaretoken').val();
    var oldpassword= $("#oldpassword").val();
    var newpassword=$("#newpassword").val();
    var newNickName=$("#newnickname").val();
    var alert=document.querySelector('#alert');

    console.log(oldpassword);
    console.log(newpassword);
    console.log(newNickName);

    var obj = {
        csrfmiddlewaretoken: token,
        old_password:oldpassword,
        password:newpassword,
        nick_name:newNickName
    };


   $.ajax({
        type:'POST',
        url:"/api/v1/user/update" ,
        data: obj ,
        dataType: 'json'
    }).done(function(data){
        console.log(data);
        var stutas=data.ok;
        console.log(stutas);
        if(stutas==false)
        {
            alert.style.display="block";
            alert.textContent="The old password mismatch."
        }
            
        else
        {
            alert.style.display="none";
            window.location.assign('/user_info');
        }
           
    }).fail(function(err){console.log(err)})
}
document.querySelector('#changeForm').addEventListener('submit',change );