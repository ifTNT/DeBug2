var express = require('express');
var util = require('../common.js');
var router = express.Router();

/* Create a new user */
router.post('/', function(req, res, next) {
  var rtVal = {
    ok: true,
    msg: "Develop only"
  }
  res.send(JSON.stringify(rtVal));
});

/* Get user info */
router.get('/:id', function(req, res, next) {
  var rtVal = {
    ok: true,
    user_id: req.params.id,
    nick_name: "DEV",
    join_time: 0,
    last_active_time: 0,
    personal_board_id: util.getPersonalBoardID(req.params.id),
    subscribed: [
      "board_id 1",
      "board_id 2"
    ]
  }
  res.send(JSON.stringify(rtVal));
});

/* Update userinfo */
router.post('/:id', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.id}`
  }
  res.send(JSON.stringify(rtVal));
});

/* Delete a user */
router.delete('/:id', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.id}`
  }
  res.send(JSON.stringify(rtVal));
});




module.exports = router;
