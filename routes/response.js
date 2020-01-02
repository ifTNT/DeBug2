var express = require("express");
var util = require("../common.js");
var router = express.Router();

/* Create a new response */
router.post("/:board_id/:article_id/", function(req, res, next) {
  var rtVal = {};
  var content = req.body.content;
  var user_id = req.session.user_id;
  var response_id = Math.floor(2147483627 * Math.random());
  db.create_response(
    req.params.board_id,
    req.params.article_id,
    response_id,
    user_id,
    content
  )
    .then(() => {
      rtVal = {
        ok: true,
        response_id,
        msg: "Create response sucessfully"
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

/* Get list of all response */
router.get("/:board_id/:article_id/", function(req, res, next) {
  var rtVal = {};
  db.get_responses(req.params.board_id, req.params.article_id)
    .then(function(data) {
      rtVal = data.map(function(d) {
        d.permission = d.user_id === req.session.user_id;
        return d;
      });
    })
    .catch(err => {
      rtVal = { ok: false, msg: err };
    })
    .finally(() => {
      res.send(JSON.stringify(rtVal));
    });
});

/* Update response */
router.post("/:board_id/:article_id/:response_id", function(req, res, next) {
  var rtVal = {
    ok: true,
    msg: `Develop only id=${req.params.board_id}/${req.params.article_id}/${req.params.response_id}`
  };
});

/* Delete a response */
router.delete("/:board_id/:article_id/:response_id", function(req, res, next) {
  var rtVal = {};
  let board_id = req.params.board_id;
  let article_id = req.params.article_id;
  let response_id =  req.params.response_id;
  db.delete_response(
    board_id,
    article_id,
    response_id
  )
    .then(data=>{
      rtVal = {
        ok: true,
        msg: `Response ${board_id}.${article_id}.${response_id} remove successfully`
      };
    })
    .catch(err => {
      rtVal = { ok: false, msg: err.stack };
    })
    .finally(() => {
      res.send(JSON.stringify(rtVal));
    });
});

module.exports = router;
