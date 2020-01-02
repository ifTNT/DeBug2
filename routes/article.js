var express = require('express');
var util = require('../common.js');
var router = express.Router();

/* Create a new article */
router.post('/:board_id', function(req, res, next) {
  /* [TODO] QQ */
  /*var rtVal = {};
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
    });*/
  var rtVal = {
    ok: true,
    msg: "Develop only"
  }
  res.send(JSON.stringify(rtVal));
});

/* Get list of all article */
router.get('/:board_id', function(req, res, next) {
  var rtVal = [
    {
        article_id: 0,
        longitude: 0,
        latitude: 0,
        altitude: 0,
        title: `article1 in ${req.params.board_id}`
    },
    {
        article_id: 1,
        longitude: 0,
        latitude: 0,
        altitude: 0,
        title: `article2 in ${req.params.board_id}`
    }
  ];

  res.send(JSON.stringify(rtVal));
});

/* Get content of article */
router.get('/:board_id/:article_id', function(req, res, next) {
  var rtVal = {
    type: 0,
    longitude: 0,
    latitude: 0,
    altitude: 0,
    title: "Article 1",
    pic_url: "http://test",
    alt_text: "test",
    markdown: "###test",
    model_url: "heep://3d_test"
  }
  res.send(JSON.stringify(rtVal));
});

/* Update article */
router.post('/:board_id/:article_id', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.board_id}/${req.params.article_id}`
  }
});

/* Delete an article */
router.delete('/:board_id/:article_id', function(req, res, next){
  var rtVal = {
    ok: true,
    msg:　`Develop only id=${req.params.board_id}/${req.params.article_id}`
  }
});

module.exports = router;
