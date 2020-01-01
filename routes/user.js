var express = require("express");
var util = require("../common.js");
var router = express.Router();
var createError = require("http-errors");
var md5 = require("md5");

/* Create a new user */
router.post("/", function (req, res, next) {
  var rtVal = {};
  var uid = req.body.user_id;
  db.create_user(
    uid,
    md5(req.body.password),
    req.body.nickname,
    parseInt(Date.now() / 1000) //Join time
  )
    //Create personal board
    .then(() => {
      return db.create_personal_board(
        util.getPersonalBoardID(uid),
        req.body.nickname,
        1, //Read_only
        0 //Visible
      );
    })

    //Setup management
    .then(() => {
      return db.manage(uid, util.getPersonalBoardID(uid));
    })
    .then(() => {
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
router.get("/:id", function (req, res, next) {
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
      };
      return db.get_subscribe(req.params.id);
    })
    .then(data => {
      rtVal["subscribe"] = data;
      return db.get_userManager(req.params.id);
    })
    .then(data => {
      rtVal["manage"] = data;
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
router.post("/update", function (req, res, next) {
  //Fobrid invalid request
  //if (req.session.user_id !== req.params.id) {
  //  return next(createError(403));
  //}
  var rtVal;
  db.get_userinfo(req.session.user_id)
    .then(data => {
      return new Promise((resolve, reject) => {
        if (data.password === md5(req.body.old_password)) {
          resolve();
        } else {
          reject("Password mismatch");
        }
      });
    })
    .then(
      db.update_userinfo(
        req.session.user_id,
        md5(req.body.password),
        req.body.nick_name
      )
    ).then(() => {
      PerBoardID = util.getPersonalBoardID(req.session.user_id);
      db.update_board(PerBoardID, req.body.nick_name, null, null, null,1);
    })
    .then(() => {
      rtVal = {
        ok: true,
        msg: `Update info success user_id=${req.session.user_id}`
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
router.delete("/", function (req, res, next) {
  //Fobrid invalid request
  //if (req.session.user_id !== req.params.id) {
  //  return next(createError(403));
  //}
  var rtVal;
  db.delete_user(req.session.user_id)
    .then(() => {
      rtVal = {
        ok: true,
        msg: `Deleted successful user_id=${req.session.user_id}`
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
