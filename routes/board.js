var express = require("express");
var util = require("../common.js");
var router = express.Router();

/* Create a new board */
router.post("/", function(req, res, next) {
  var rtVal = {};
  db.create_general_board(
    req.body.board_id,
    req.body.board_name,
    req.body.read_only,
    req.body.hashtag
  )
    .then(()=>{
      return db.manage(req.session.user_id, req.body.board_id)
    })
    .then(() => {
      rtVal = {
        ok: true,
        msg: `Create board successfully board_id=${req.body.board_id}`
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

/* Get list of boards */
router.get("/", function(req, res, next) {
  var rtVal = [];
  db.get_board_list()
    .then(data => {
      rtVal = data;
    })
    .finally(() => {
      res.send(JSON.stringify(rtVal));
    });
});

/* Get board info by name*/
router.get("/:name", function(req, res, next) {
  var rtVal = {};
  db.find_board(req.params.name)
    .then(data => {
      rtVal = data;
      rtVal["ok"] = true;
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

router.get("/:name/board", function(req, res, next) {
  var rtVal = {};
  db.get_board(req.params.name)
    .then((data)=>{
      rtVal = data;
      rtVal["ok"] = true;
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

/* Update board info */
router.post("/:id", function(req, res, next) {
  var rtVal = {};
  db.update_board(
    req.params.id,
    req.body.board_name,
    req.body.read_only,
    req.body.hashtag,
    req.body.visiable,
    req.body.flag
  )
    .then(() => {
      rtVal = {
        ok: true,
        msg: `Updated board_id=${req.params.id}`
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

/* Delete a board */
router.delete("/:id", function(req, res, next) {
  var rtVal = {};
  db.delete_board(req.params.id)
    .then(() => {
      rtVal = {
        ok: true,
        msg: `Successfully deleted board_id=${req.params.id}`
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

/* Subscribe a board */
router.post("/:id/subscribe", function(req, res, next) {
  var rtVal = {};
  db.subscribe(req.session.user_id, req.params.id)
    .then(() => {
      rtVal = {
        ok: true,
        msg: `Successfully subscribed board_id=${req.params.id} for user_id=${req.session.user_id}`
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

/* Get managers of a board */
router.get("/:id/manager", function(req, res, next) {
  var rtVal = [];
  db.get_all_boardManager(req.params.id)
    .then(data => {
      rtVal = data;
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

/* Update managers of a board */
router.post("/:id/manager", function(req, res, next) {
  var rtVal = [];
  db.manage(req.session.user_id, req.params.id)
    .then(() => {
      rtVal = {
        ok: true,
        msg: `Successfully change manager of board_id=${req.params.id} to user_id=${req.session.user_id}`
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
