var express = require("express");
var router = express.Router();
var md5 = require("md5");

/* GET first page. */
router.get("/", function(req, res, next) {
  res.render("First_page");
});

/*GET Sign in page*/
router.get("/signin", function(req, res, next) {
  res.render("Sign_in");
});

/*GET Sign up page*/
router.get("/signup", function(req, res, next) {
  res.render("Sign_up");
});

/*GET Home page*/
router.get("/home", function(req, res, next) {
  res.render("Home");
});

/*GET User info page*/
router.get("/user_info", function(req, res, next) {
  res.render("User_info");
});

/*GET change page*/
router.get("/change", function(req, res, next) {
  res.render("Change");
});

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

/* Backend of login*/
router.post("/signin_", function(req, res, next) {
  var rtVal = {};
  db.get_userinfo(req.body.user_id)
    .then(user => {
      return new Promise((resolve, reject) => {
        if (user.password == md5(req.body.password)) {
          resolve(user);
        } else {
          reject("Password mismatch");
        }
      });
    })
    .then(user => {
      req.session.user_id = user.user_id;
      req.session.authenticated = true;
      rtVal = {
        ok: true,
        msg: `Logged in as user_id=${user.user_id}`
      };
      db.update_last_active_time(user.user_id);
    })
    .catch(err => {
      rtVal = {
        ok: false,
        msg: err
      };
    })
    .finally(() => {
      res.send(JSON.stringify(rtVal));
    });
});

/* Backend of sign_out */
router.get("/sign_out", function(req, res, next) {
  req.session = undefined;
  res.redirect("/");
});

module.exports = router;
