var express = require("express");
var router = express.Router();
var md5 = require('md5');

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login_test", function(req, res, next) {
  var rtVal={};
  db.get_userinfo(req.body.user_id)
  .then(user=>{
    return new Promise((resolve, reject)=>{
      if(user.password == md5(req.body.password)){
        resolve(user);
      }else{
        reject("Password mismatch");
      }
    });
  })
  .then(user=>{
    req.session.user_id = user.user_id;
    req.session.authenticated = true;
    rtVal = {
      ok: true,
      msg: `Logged in as user_id=${user.user_id}`
    }
    db.update_last_active_time(user.user_id)
  })
  .catch(err=>{
    rtVal = {
      ok: false,
      msg: err
    }
  })
  .finally(()=>{
    res.send(JSON.stringify(rtVal));
  })
});

module.exports = router;
