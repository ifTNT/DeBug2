//sign up page submit button
function signup(e) {
  e.preventDefault();
    console.log("signup");
  var token = $("input[name=csrfimiddlewaretoken").val();
  var userid = $("#userid").val();
  var password = $("#Password1").val();
  var check_password = $("#Password2").val();
  var NickName = $("#NickName").val();
  var alert = document.querySelector("#alert");

  console.log(userid);
  console.log(password);
  console.log(check_password);
  console.log(NickName);
  //先確認密碼
  if (password !== check_password) {
    alert.style.display = "block";
    alert.textContent = "This Password is not the same.";
    return;
  }

  var obj = {
    csrfmiddlewaretoken: token,
    user_id: userid,
    password: password,
    nickname: NickName
  };


  $.ajax({
    type: "POST",
    url: "/api/v1/user/",
    data: obj,
    dataType: "json"
  })
    .done(function(data) {
      console.log(data);
      var stutas = data.ok;
      console.log(stutas);
      if (stutas == false) {
        alert.style.display = "block";
        alert.textContent = "This UserID has been used.";
      } else {
        alert.style.display = "none";
        window.location.assign("/signin");
      }
    })
    .fail(function(err) {
      console.log(err);
    });
}
document.querySelector("#signupForm").addEventListener("submit", signup);
