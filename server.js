var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var mongoose = require('mongoose');
var api = require('./api');
var exphbs  = require('express-handlebars');


var User = require('./models/user');
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

var app = express();

// Logger to print request/response to server
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

// Setting middleware path location
app.use('/assets', express.static(path.join(__dirname, 'static')));

// Set up view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


mongoose.connect('mongodb://127.0.0.1/sellit');

passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({ username:username }, function(err, user){
      if(err) {
        // console.log('Error! ' + err);
        return done(err); }
      if(!user) {
        // console.log('User not found');
        return done(null, false, {message: 'Incorrect username'});
      }
      if(!user.validPassword(password)){
        // console.log('Invalid PW');
        return done(null, false, {message: 'Incorrect password'});
      }
      // console.log('Username: ' + username + ', password: ' + password);
      return done(null, user);
    });
  }
));

// GET request
app.get('/', function(req, res){
  res.render('home');
});

app.get('/getPostPage/:pageNum', api.getPostPage);
app.get('/getByTitle/:title', api.getPostByTitle);
app.get('/getUsername/:id', api.getUsernameByID);

// POST request
app.post('/', function (req, res) {
  res.send('Got a POST request')
});
app.post('/login', passport.authenticate('local', function(req, res){
  console.log('Passport authentication passed!');
  //res.redirect('/login/success');
}));

app.post('/createPost', api.createPost);

//Put request to /user
app.put('/user/:id', api.updateUserInfo);

// PUT request to /post
app.put('/post/:id', api.updatePostInfo);

// DELETE request to /user
app.delete('/user', api.deleteUser);

// DELETE request to /post
app.delete('/post/:id', api.deletePost);

// Post request to /login
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));

app.listen(8080, function(){
  console.log('Server running on port: 8080');
})
