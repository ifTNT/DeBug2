var express = require("express");
var util = require("../common.js");
var router = express.Router();
var createError = require("http-errors");
var md5 = require("md5");

/* Create a new user */
router.post("/", function(req, res, next) {
  var rtVal = {};
  db.create_user(
    req.body.user_id,
    md5(req.body.password),
    req.body.nickname,
    parseInt(Date.now() / 1000) //Join time
  )
    .then(data => {
      rtVal = {
        ok: true,
        msg: "User create successful"
      };
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

/* Get user info */
router.get("/:id", function(req, res, next) {
  var rtVal = {};
  db.get_userinfo(req.params.id)
    .then(data => {
      rtVal = {
        ok: true,
        user_id: data.user_id,
        nick_name: data.nick_name,
        join_time: data.join_time,
        last_active_time: data.last_active_time,
        personal_board_id: util.getPersonalBoardID(req.params.id)
        //subscribed: ["board_id 1", "board_id 2"]
      };
      return db.get_subscribe(req.params.id);
    })
    .then(data => {
      rtVal["subscribe"] = data;
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

/* Update userinfo */
router.post("/:id", function(req, res, next) {
  //Fobrid invalid request
  if (req.session.user_id !== req.params.id) {
    return next(createError(403));
  }
  var rtVal;
  db.update_userinfo(req.params.id, req.body.password, req.body.nick_name)
    .then(() => {
      rtVal = {
        ok: true,
        msg: `Update info success user_id=${req.params.id}`
      };
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

/* Delete a user */
router.delete("/:id", function(req, res, next) {
  //Fobrid invalid request
  if (req.session.user_id !== req.params.id) {
    return next(createError(403));
  }
  var rtVal;
  db.delete_user(req.params.id)
    .then(() => {
      rtVal = {
        ok: true,
        msg: `Deleted successful user_id=${req.params.id}`
      };
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

module.exports = router;
