var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login_test", function(req, res, next) {
  req.session.user_id = "ifTNT";
  req.session.authenticated = true;
  res.send(JSON.stringify({ ok: true}));
});

module.exports = router;
