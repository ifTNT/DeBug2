var express = require('express');
var util = require('../common.js');
var router = express.Router();

/* Create a new board */
router.post('/', function(req, res, next) {
  var rtVal = {
    ok: true,
    msg: "Develop only"
  }
  res.send(JSON.stringify(rtVal));
});

/* Get liste of boards */
router.get('/', function(req, res, next){
  var rtVal = [
    {
        board_id: "test1",
        board_name: "TEST1",
        type: 0,
        create_time: 0,
        read_only: 0,
        online_user_cnt: 0
    },
    {
        board_id: "test1",
        board_name: "TEST1",
        type: 0,
        create_time: 0,
        read_only: 0,
        online_user_cnt: 0
    }
  ];
  res.send(JSON.stringify(rtVal));
});

/* Get board info */
router.get('/:name', function(req, res, next) {
  var rtVal = {
    board_id: "test1",
    board_name: "TEST1",
    type: 0,
    create_time: 0,
    read_only: 0,
    online_user_cnt: 0
  }
  res.send(JSON.stringify(rtVal));
});

/* Update board info */
router.post('/:id', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.id}`
  }
  res.send(JSON.stringify(rtVal));
});

/* Delete a board */
router.delete('/:id', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.id}`
  }
  res.send(JSON.stringify(rtVal));
});

/* Subscribe a board */
router.post('/:id/subscribe', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.id}`
  }
  res.send(JSON.stringify(rtVal));
});

/* Get managers of a board */
router.get('/:id/manager', function(req, res, next){
  var rtVal = [
    "manager1",
    "manager2"
  ]
  res.send(JSON.stringify(rtVal));
});

/* Update managers of a board */
router.post('/:id/manager', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.id}`
  }
  res.send(JSON.stringify(rtVal));
});


module.exports = router;
