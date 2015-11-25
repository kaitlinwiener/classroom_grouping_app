var express = require ('express'),
PORT = process.env.PORT || 5555,
server = express(),
router = express.Router(),
MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
dbname = "classroom",
morgan = require('morgan'),
mongoose = require('mongoose'),
// ejs = require ('ejs'),
// layouts = require ('express-ejs-layouts'),
session = require ('express-session'),
methodOverride = require ('method-override'),
bodyParser = require ('body-parser'),
bcrypt = require('bcryptjs'),
SALT_WORK_FACTOR = 10;


//APP STUFF
// server.set('views', './views');
// server.set('view engine', 'ejs');
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(session({
  secret: "someFancySecret",
  resave: false,
  saveUninitialized: true
}));

// server.use(layouts);

server.use(function (req, res, next) {
  res.locals.flash  = req.session.flash || {};
  req.session.flash = {};
  next();
});

server.use(function (req, res, next) {
  res.locals.currentUser = req.session.currentUser;
  next();
});

server.use(methodOverride('_method'));

server.use(express.static('./public'));

mongoose.set('debug', true);

var userController = require('./controllers/users.js');
server.use('/users', userController);

var studentController = require('./controllers/students.js');
server.use('/classes/:id/students', studentController);

var classController = require('./controllers/classes.js');
server.use('/classes', classController);

var User = require('./models/user.js');
var Class = require('./models/class.js');
var Student = require('./models/student.js');

// var loggedIn = function (req, res, next) {
//   if (req.session.currentUser) {
//     next();
//   } else {
//     res.redirect(302, "/login")
//   }
// }

//Server specific controllers

//if already logged in, redirect to main page
server.get('/login', function (req, res) {
  res.sendFile('login.html', {
    root: __dirname + '/public'
  });
  // console.log(req.session.currentUser)
  // if (req.session.currentUser) {
  //   res.sendFile('index.html', {
  //     root: __dirname + '/public/'
  //   });
  // } else {
  //   res.sendFile('login.html', {
  //     root: __dirname + '/public'
  //   });
  // }
})

//view all classes
// server.get('/', loggedIn, function (req, res) {
server.get('/', function (req, res) {

    // res.sendFile('index.html', {
    //   root: __dirname + '/public'
    // });
  //if user is logged in, set the current user and render the homepage
  if (req.session.currentUser) {
    User.findOne({email: req.session.currentUser.email}).populate('classes')
    .exec(function (err, results) {
      if (err) {
        console.log(err);
      } else {
        // var orderedClasses = []
        // if (results.classes.length > 0) {
        //   orderedClasses[0] = results.classes[0]
        //
        //   for (var i=1; i<results.classes.length; i++) {
        //     if (results.classes[i].period < orderedClasses[0].period) {
        //       orderedClasses.unshift(results.classes[i])
        //     } else if (results.classes[i].period > orderedClasses[orderedClasses.length-1].period) {
        //       orderedClasses.push(results.classes[i])
        //     } else {
        //       var j = orderedClasses.length-1;
        //       while (results.classes[i].period < orderedClasses[j].period) {
        //         j--
        //       }
        //       orderedClasses.splice(j+1, 0, results.classes[i])
        //       orderedClasses.join()
        //     }
        //   }
        // }
        res.sendFile('index.html', {
          root: __dirname + '/public'
        });
      }
    })
  } else {
      res.sendFile('login.html', {
        root: __dirname + '/public'
      });
  }
});

//log in
server.post('/session', function (req, res) {
  User.findOne({email: req.body.user.email}, function (err, currentUser) {
    if (err) {
      console.log(err);
    } else {
      if (currentUser === null) {
        req.session.flash.userDoesntExist = "Incorrect Email";
        res.redirect(302, '/login')
      }  else {
        bcrypt.compare(req.body.user.password, currentUser.password, function (err, match) {
          if (err) {
            console.log(err);
          } else if (!match) {
            req.session.flash.incorrectPassword = "Incorrect Password";
            res.redirect(302, '/login')
          } else {
            req.session.currentUser = currentUser;
            User.find({}, function (err, users) {
              if (err) {
                console.log("err")
              } else {
                req.session.numUsers = users.length
                res.redirect(302, '/')
              }
            } )
          }
        })
      }
    }
  });
});

//log out
server.delete('/session', function (req, res) {
  req.session.currentUser = null;
  res.redirect(302, '/login');
})

mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function () {
  console.log("Server is up on port:", PORT);
})
