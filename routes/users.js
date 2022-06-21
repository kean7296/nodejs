var express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const { ReturnDocument } = require('mongodb');
const user = require('../models/user');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
  .then(user => {
    console.log(user);
    if (user != null) {
      var err = new Error(`User ${req.body.username} aleadt exist!`)
      err.status = 403;
      next(err);
    } else {
      return User.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  })
  .then(user => {
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.json({ status: 'Registration Successful', user: user });
  }, err => next(err))
  .catch(err => next(err));
});

router.post('/login', (req, res, next) => {
  if (!req.session.user) {
      var authHeader = req.headers.authorization;
      if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
    
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    
      var username = auth[0];
      var password = auth[1];
      
      User.findOne({ username: username })
      .then(user => {
        if (user === null) {
          var err = new Error(`User ${username} does not exist!`);
          err.status = 403;
          return next(err);          
        } else if (user.password !== password) {
          var err = new Error(`Your password incorrect!`);   
          err.status = 403;
          return next(err);        
        } else if (user.username  === username && user.password === password) {
          req.session.user = 'authenticated';
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!');
        } 
      })
      .catch(err => next(err)); 
    } else {
      res.statusCode = 200;
      res.setHeader('content-type', 'text/plain');
      res.end('You are already authenticated!');
    }
});

router.get('/logout', (req, res, next) => {
  if (!req.session) {
    var err = new Error('You are not logged in!');
    err.status = 403; 
    next(err);
  } 
  
  req.session.destroy();
  res.clearCookie('session-id');
  res.redirect('/');
});

module.exports = router;
