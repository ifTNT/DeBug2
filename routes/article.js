var express = require("express");
var util = require("../common.js");
var router = express.Router();

/* Create a new article */
router.post("/:board_id", function(req, res, next) {
  /* [TODO] QQ */
  var rtVal = {};
  let timeToArtId = +Date.now()*100+Math.floor(100*Math.random());
  switch(parseInt(req.body.type)){
    case 0:
      db.create_picture_article(
        req.params.board_id,
        timeToArtId,
        req.session.user_id,
        req.body.longitude,
        req.body.latitude,
        req.body.altitude,
        req.body.title,
        req.body.pic_url,
        req.body.alt_text
      ).then(() => {
        rtVal = {ok: true, msg:"upload succeed"};
      })
      .catch(err => {
        rtVal = {
          ok: false,
          msg: err
        };
      }).finally(()=>{
        res.send(JSON.stringify(rtVal));
      });
    break;
    case 1:
      db.create_plaintext_article(
        req.params.board_id,
        timeToArtId,
        req.session.user_id,
        req.body.longitude,
        req.body.latitude,
        req.body.altitude,
        req.body.title,
        req.body.markdown
      ).then(() => {
        rtVal = {ok: true, msg:"upload succeed"};
      })
      .catch(err => {
        rtVal = {
          ok: false,
          msg: err
        };
      }).finally(()=>{
        res.send(JSON.stringify(rtVal));
      });
    break;
    case 2:
      db.create_3D_article(
        req.params.board_id,
        timeToArtId,
        req.session.user_id,
        req.body.longitude,
        req.body.latitude,
        req.body.altitude,
        req.body.title,
        req.body.model_url,
        req.body.alt_text
      ).then(() => {
        rtVal = {ok: true, msg:"upload succeed"};
      })
      .catch(err => {
        rtVal = {
          ok: false,
          msg: err.stack
        };
      }).finally(()=>{
        res.send(JSON.stringify(rtVal));
      });
    break;
  }
});

/* Get list of all article */
router.get("/:board_id", function(req, res, next) {
  
  var rtVal = [];
  db.get_all_article(req.params.board_id)
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
  /*
  let rtVal = [
    {
      article_id: 1,
      latitude: 22.7311333,
      longitude: 120.2774256,
      altitude: 0,
      title: `article2 in ${req.params.board_id}`
    },
    {
      article_id: 2,
      latitude: 0.001 / 3600,
      longitude: 0.001 / 3600,
      altitude: 0,
      title: `article3 in ${req.params.board_id}`
    },
    {
      article_id: 3,
      latitude: 22.7311633,
      longitude: 120.2775256,
      altitude: 1,
      title: `只是隻鴨子`,
      model_url:
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf"
    },
    {
      article_id: 3,
      latitude: 23.01090,
      longitude: 120.66600,
      altitude: 1,
      title: `只是隻鴨子`,
      model_url:
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf"
    },
    {
      article_id: 4,
      latitude: 22.7311333,
      longitude: 120.2774256,
      altitude: 5,
      title: `芭樂`,
      model_url: "/glTF_models/Avocado/Avocado.gltf"
    },
    {
      article_id: 4,
      latitude: 22.7311333,
      longitude: 120.2774256,
      altitude: 10,
      title: `芭樂`,
      model_url: "/glTF_models/"
    }
  ];

  res.send(JSON.stringify(rtVal));
  */
});

/* Get content of article */
router.get("/:board_id/:article_id", function(req, res, next) {
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
  };
  res.send(JSON.stringify(rtVal));
});

/* Update article */
router.post("/:board_id/:article_id", function(req, res, next) {
  var rtVal = {
    ok: true,
    msg: `Develop only id=${req.params.board_id}/${req.params.article_id}`
  };
});

/* Delete an article */
router.delete("/:board_id/:article_id", function(req, res, next) {
  var rtVal = {
    ok: true,
    msg: `Develop only id=${req.params.board_id}/${req.params.article_id}`
  };
});

module.exports = router;
