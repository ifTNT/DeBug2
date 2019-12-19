var express = require('express');
var util = require('../common.js');
var router = express.Router();

/* Create a new user */
router.post('/', function(req, res, next) {
  db.create_user(req.body.user_id, req.body.password, req.body.nickname, req.body.join_time)
  .then((data)=>{
    var rtVal = {
      ok: true,
      msg: "User create successful"
    }
    res.send(JSON.stringify(rtVal));
  })
  .catch((err)=>{
    var rtVal = {
      ok: false,
      msg: err.msg
    }
    res.send(JSON.stringify(rtVal));
  });
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
