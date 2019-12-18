var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('First_page');
});

/*GET Sign in page*/
router.get('/signin', function(req, res, next) {
  res.render('Sign_in');
});

/*GET Sign up page*/
router.get('/signup', function(req, res, next) {
  res.render('Sign_up');
});
module.exports = router;
