//Classes controller
var express = require ('express'),
    router = express.Router(),
    Class = require('../models/class.js'),
    User = require('../models/user.js'),
    Student = require('../models/student.js');

//create new class
router.post('/', function (req, res) {
  var newClass = new Class(req.body.class);
  newClass.students = [];
  newClass.numStudents = 0;
  newClass._teacher = req.session.currentUser._id

  newClass.save(function (err, addedClass) {
    if (err) {
      console.log(err)
    } else {
      User.findById(req.session.currentUser._id, function (err, currentUser) {
        if (err) {
          console.log(err)
        } else {
          currentUser.classes.push(addedClass._id)
          currentUser.save(function (err, updatedUser) {
            if (err) {
              console.log(err)
            } else {
              res.redirect(302, '/')
            }
          })
        }
      })
    }
  })
})

//view individual class
router.get('/:id', function (req, res) {
  Class.findById(req.params.id).populate('students').exec(function (err, specificClass) {
    if (err) {
      console.log(err)
    } else {
      console.log(specificClass)
      res.render('class/show', {
        specificClass: specificClass
      });
    }
  })
})

//get edit form
router.get('/:id/edit', function (req, res) {
  Class.findById(req.params.id).populate('students').exec(function (err, specificClass) {
    if (err) {
      console.log(err)
    } else {
      console.log(specificClass)
      var indices = []
      for (var i=0; i<specificClass.students.length; i++) {
        indices.push(specificClass.students[i]._classes.indexOf(specificClass._id))
      }
      res.render('class/edit', {
        specificClass: specificClass,
        indices: indices
      });
    }
  })
})

//edit class
router.patch('/:id', function (req, res) {
  Class.findById(req.params.id, function (err, specificClass) {
    if (err) {
      console.log(err)
    } else {
      specificClass.subject = req.body.class.subject
      specificClass.period = req.body.class.period

      specificClass.save(function (err, savedClass) {
        if (err) {
          console.log(err)
        } else {
          console.log(savedClass)
          res.redirect(302, '/')
        }
      })
    }
  })
})

//delete class
router.delete('/:id', function (req, res) {
  //find all students in the class and remove class from their array
  Student.find({"_classes":  req.params.id}, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      console.log(results)
      for (var i=0; i<results.length; i++) {
        var index = results[i]._classes.indexOf(req.params.id)

        results[i]._classes.splice(index, 1)
        results[i].behavior.splice(index, 1)
        results[i].aptitude.splice(index, 1)

        results[i].save(function (err, saved) {
          if (err) {
            console.log(err)
          } else {
            console.log(saved)
          }
        })
      }
    }
  })
  //find user who teaches the class, update their class array
  User.findOne({"classes":  req.params.id}, function (err, correspondingUser) {
    if (err) {
      console.log(err)
    } else {
      var index = correspondingUser.classes.indexOf(req.params.id)

      correspondingUser.classes.splice(index, 1)

      correspondingUser.save(function (err, savedUser) {
        if (err) {
          console.log(err)
        } else {
          console.log(savedUser)
        }
      })
    }
  })

  Class.findByIdAndRemove(req.params.id, function (err, deletedClass) {
    if (err) {
      console.log(err)
    } else {
      res.redirect(302, '/')
    }
  })
});

router.post('/:id/group', function (req, res) {
  console.log("grouping")
})



module.exports = router;
