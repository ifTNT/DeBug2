var express = require("express");
var router = express.Router();
var md5 = require("md5");
var createError = require("http-errors");

/* GET first page. */
router.get("/", function(req, res, next) {
  if (req.session.authenticated === true) {
    res.redirect("/home");
  } else {
    res.render("First_page");
  }
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
  if (req.session.authenticated === true) {
    res.render("Home", { user_id: req.session.user_id });
  } else {
    res.redirect("/");
  }
});

/*GET User info page*/
router.get("/user_info", function(req, res, next) {
  db.get_userinfo(req.session.user_id)
    .then(data => {
      res.render("User_info", data);
    })
    .catch(() => {
      next(createError(403));
    });
});

/*GET change page*/
router.get("/change", function(req, res, next) {
  res.render("Change");
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
  req.session.user_id = undefined;
  req.session.authenticated = false;
  res.redirect("/");
});

/*GET create board page*/
router.get("/create_board", function(req, res, next) {
  res.render("Edit_board", { create: true });
});

/*GET create board page*/
router.get("/edit_board", function(req, res, next) {
  console.log(req.query.board_name);
  db.find_board(req.query.board_name)
    .then(data => {
      res.render("Edit_board", {
        create: false,
        board_id: data.board_id,
        board_name: data.board_name,
        hashtag: data.hashtag
      });
    })
    .catch(() => {
      next(createError(404));
    });
});

/*GET Article in a board page*/
router.get("/Article_board", function(req, res, next) {
  if (req.session.authenticated === true) {
    console.log(req.query.board_name);
    console.log(req.session.user_id);
    res.render("Article_board", { user_id: req.session.user_id,board_id:req.query.board_id});

  } else {
    res.redirect("/");
  }
});
/*GET create Article page*/
router.get("/Create_article", function(req, res, next) {
  res.render("Create_article");
});

router.get("/Article", function(req, res, next) {
  if (req.session.authenticated === true) {
    res.render("Article", { user_id: req.session.user_id});

  } else {
    res.redirect("/");
  }
});

router.get("/Edit_person_board", function(req, res, next) {
  res.render("Edit_person_board", { create: true });
});
module.exports = router;
