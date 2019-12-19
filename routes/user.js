var express = require("express");
var util = require("../common.js");
var router = express.Router();
var createError = require("http-errors");

/* Create a new user */
router.post("/", function(req, res, next) {
  db.create_user(
    req.body.user_id,
    req.body.password,
    req.body.nickname,
    req.body.join_time
  )
    .then(data => {
      var rtVal = {
        ok: true,
        msg: "User create successful"
      };
      res.send(JSON.stringify(rtVal));
    })
    .catch(err => {
      var rtVal = {
        ok: false,
        msg: err
      };
      res.send(JSON.stringify(rtVal));
    });
});

/* Get user info */
router.get("/:id", function(req, res, next) {
  db.get_userinfo(req.params.id)
    .then(data => {
      var rtVal = {
        ok: true,
        user_id: data.user_id,
        nick_name: data.nick_name,
        join_time: data.join_time,
        last_active_time: data.last_active_time,
        personal_board_id: util.getPersonalBoardID(req.params.id)
        //subscribed: ["board_id 1", "board_id 2"]
      };
      res.send(JSON.stringify(rtVal));
    })
    .catch(err => {
      var rtVal = {
        ok: false
      };
      res.send(JSON.stringify(rtVal));
    });
});

/* Update userinfo */
router.post("/:id", function(req, res, next) {
  //Fobrid invalid request
  if (req.session.user_id !== req.params.id) {
    return next(createError(403));
  }
  db.update_userinfo(req.params.id, req.body.password, req.body.nick_name)
    .then(() => {
      var rtVal = {
        ok: true,
        msg: `Update info success user_id=${req.params.id}`
      };
      res.send(JSON.stringify(rtVal));
    })
    .catch(err => {
      var rtVal = {
        ok: false,
        msg: err
      };
      res.send(JSON.stringify(rtVal));
    });
});

/* Delete a user */
router.delete("/:id", function(req, res, next) {
  //Fobrid invalid request
  if (req.session.user_id !== req.params.id) {
    return next(createError(403));
  }
  db.delete_user(req.params.id)
    .then(() => {
      var rtVal = {
        ok: true,
        msg: `Deleted successful user_id=${req.params.id}`
      };
      res.send(JSON.stringify(rtVal));
    })
    .catch(err => {
      var rtVal = {
        ok: false,
        msg: err
      };
      res.send(JSON.stringify(rtVal));
    });
});

module.exports = router;
