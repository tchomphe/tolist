//--------------- CONFIGURE VARIABLES ---------------//
var express = require('express');
var expressSession = require('express-session')
var mongoose = require('mongoose');
var app = express();
var api = require('./api');

var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');

// Define multer settings (for multi-form file uploading) //
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '_' + Date.now())
  },
  limits : {fileSize: 1000000, files:5},
});
var upload = multer({ storage: storage })

// TODO: move passport authentication into separate file
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user'); // used for authentication


//--------------- CONFIGURE MIDDLEWARE ---------------//
app.use('/assets', express.static(path.join(__dirname, 'static'))); // define public path location
app.use(logger('dev')); // records client requests -> server, via console.log()
app.use(cookieParser()); // read cookies, needed for authentication
app.use(bodyParser.json()); // parse through html forms
app.use(bodyParser.urlencoded({ extended: false}));
app.use(expressSession({resave: false, saveUninitialized: false, secret: 'sellit, TOlist or listTO?'}));
app.use(passport.initialize());
app.use(passport.session());

// Set up view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Connect to the database
// TODO: update db name to final site's name
mongoose.connect('mongodb://127.0.0.1/sellit');

passport.use(new LocalStrategy({
    // define parameters in req.body passportjs defines as username and password
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done){
    User.findOne({ email:username }, function(err, user){
      if(err) { return done(err); }
      if(!user) { return done(new Error('User Not Found!'), false); }
      if(!user.validPassword(password)) { return done(new Error('Invalid Password!'), false); }

      return done(null, user);
    });
  }
));

// set up serialization & deserialization of user their session
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});


//----------------- CONFIGURE ROUTING -----------------//
// GET requests
app.get(['/', '/create-post'], function(req, res){
  res.render('home');
});

app.get('/paginatePosts/:pageNum', api.paginatePosts);
app.get('/post/:id', api.getPostByID);
app.get('/user/:id', api.getUserByID);
app.get('/searchByTitle/:title', api.searchByTitle);
app.get('/postByTitle/:title', api.getPostByTitle);
app.get('/userByEmail/:email', api.getUserByEmail);
app.get('/myAccount', function(req, res){
  if (req.isAuthenticated())
    res.status(200).send({message: 'User is logged in!'});
  else
    res.redirect(400, '/');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect(200, '/');
});

// POST requests
app.post('/createPost', upload.array('postImages'), api.createPost);
app.post('/createUser', upload.array('userImages'), api.createUser);
app.post('/login', function(req, res, next){
  console.log('Received login Request...');
  console.log(req.body);

  if (req.body.email){
    passport.authenticate('local', function(err, user) {
      if (err) {
        console.log('ERROR: ' + err.message);
        return res.status(400).send({error: err.message});
      }
      console.log('Authentication successful.....');

      // establish user login, potentially with req.logIn(user, func)
      req.login(user, function(err){
        if (err) {
          console.log('login() ERROR: ' + err);
          return res.status(400).send({error: err});
        }

        console.log('SUCCESS: ' + req.body.email + ' has been logged in.');
        return res.redirect(200, '/create-post');
      });
    })(req, res, next);
  }
  else{
    console.log('ERROR: Body email field is null');
    return res.redirect(400, '/');
  }
});

// PUT requests
app.put('/user/:id', api.updateUserInfo);
app.put('/post/:id', api.updatePostInfo);

// DELETE requests
app.delete('/user/:id', api.deleteUser);
app.delete('/post/:id', api.deletePost);

// Start up server
app.listen(8080, function(){
  console.log('Server running on port: 8080');
});