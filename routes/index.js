var express = require('express');
var router = express.Router();

/* GET first page. */
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

/*GET Home page*/
router.get('/home', function(req, res, next) {
  res.render('Home');
});

/*GET User info page*/
router.get('/user_info', function(req, res, next) {
  res.render('User_info');
});

/*GET change page*/
router.get('/change', function(req, res, next) {
  res.render('Change');
});

module.exports = router;
