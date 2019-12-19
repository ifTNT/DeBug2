//sign in page login button
function signin(e) {
  e.preventDefault();
  console.log("signin");
  var token = $("input[name=csrfimiddlewaretoken").val();
  var userid = $("#userid").val();
  var password = $("#password").val();
  console.log(userid);
  console.log(password);
  var alert = document.querySelector("#alert");

  var obj = {
    csrfmiddlewaretoken: token,
    user_id: userid,
    password: password
  };

  var json = JSON.stringify(obj);

  $.ajax({
    type: "POST",
    url: "/signin_",
    data: obj,
    dataType: "json"
  })
    .done(function(data) {
      console.log(data);
      var stutas = data.ok;
      console.log(stutas);
      if (stutas == false) {
        alert.style.display = "block";
      } else {
        alert.style.display = "none";
        window.location.assign("/Home");
      }
    })
    .fail(function(err) {
      console.log(err);
    });
}
document.querySelector("#LoginForm").addEventListener("submit", signin);
