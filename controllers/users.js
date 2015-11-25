var express = require ('express'),
    router = express.Router(),
    User = require('../models/user.js');

//sign up
router.post('/new', function (req, res) {
  //make sure username and password are filled out
  if (!req.body.user.firstName || !req.body.user.firstName) {
    req.session.flash.needName = "Please enter your name";
    res.redirect(302, '/login');
  }  else if (!req.body.user.email) {
      req.session.flash.needEmail = "Please enter a valid email";
      res.redirect(302, '/login');
  } else if (!req.body.user.password) {
    req.session.flash.needPassword = "Please enter a password";
    res.redirect(302, '/login');
  } else {
    var newUser = new User(req.body.user);
    req.session.currentUser = newUser;

    newUser.save(function (err, added) {
      if (err) {
        if (err.code === 11000) {
          req.session.flash.duplicateName = "Username already in use";
          res.redirect(302, '/login');
        } else {
          console.log(err);
        }
      } else {
        User.find({}, function (err, users) {
          if (err) {
            console.log(err)
          } else {
            res.redirect(302, '/')
          }
        } )
      }
    });
  }
});

module.exports = router;
