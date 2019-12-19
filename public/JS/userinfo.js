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
document.querySelector('.delete_account').addEventListener('click', deleteAccount);

