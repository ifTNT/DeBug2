var express = require('express');
var util = require('../common.js');
var router = express.Router();

/* Create a new response */
router.post('/:board_id/:article_id/', function(req, res, next) {
  var rtVal = {
    ok: true,
    msg: `Develop only. New response under ${req.params.board_id}/${req.params.article_id}`
  }
  res.send(JSON.stringify(rtVal));
});

/* Get list of all response */
router.get('/:board_id/:article_id/', function(req, res, next) {
  var rtVal = [
    {
        response_id: 0,
        time: 0,
        content: "test1",
        user_id: "user1"
    },
    {
        response_id: 1,
        time: 1,
        content: "test2",
        user_id: "user2"
    }
  ]
  res.send(JSON.stringify(rtVal));
});

/* Update response */
router.post('/:board_id/:article_id/:response_id', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.board_id}/${req.params.article_id}/${req.params.response_id}`
  }
});

/* Delete a response */
router.delete('/:board_id/:article_id/:response_id', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.board_id}/${req.params.article_id}/${req.params.response_id}`
  }
});




module.exports = router;
