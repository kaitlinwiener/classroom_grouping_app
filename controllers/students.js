var express = require ('express'),
router = express.Router(),
Student = require('../models/student.js'),
Class = require('../models/class.js');

//add student to class
router.post('/', function (req, res) {
  var classId = req.originalUrl.split('/')[2]
  Student.findOne({email: req.body.student.email}, function (err, student) {
    if (err) {
      console.log(err)
    } else {
      //if student already exists and is in the class
      if (student != null && student._classes.indexOf(classId) != -1) {
        req.session.flash.studentExists = "Student already added to this class";
        res.redirect(302, '/classes/' + classId)
      } else {
        //if need to create new student
        if (student == null) {
          console.log("new student")
          student = new Student()
          console.log(req.body.student)
          student.name = req.body.student.name
          student.email = req.body.student.email
        }
        //in any case where the student is not already in the class
        student._classes.push(classId)
        student.aptitude.push(req.body.student.aptitude)
        student.behavior.push(req.body.student.behavior)
        console.log(student)
        student.save(function (err, addedStudent) {
          if (err) {
            console.log(err)
          } else {
            Class.findById(classId, function (err, specificClass) {
              if (err) {
                console.log(err)
              } else {
                specificClass.students.push(addedStudent._id)
                specificClass.numStudents = specificClass.numStudents + 1;
                specificClass.save(function (err, saved) {
                  if (err) {
                    console.log(err)
                  } else {
                    res.redirect(302, '/classes/' + classId)
                  }
                })
              }
            })
          }
        })
      }
    }
  })
})

router.get('/:studentid', function (req, res) {
  var classId = req.originalUrl.split('/')[2]
  Student.findById(req.params.studentid, function (err, specificStudent) {
    if (err) {
      console.log(err)
    } else {
      res.render('student/show', {
        student: specificStudent,
        index: specificStudent._classes.indexOf(classId)
      })
    }
  })
})

router.patch('/:studentid', function (req, res) {
  var classId = req.originalUrl.split('/')[2]
  Student.findById(req.params.studentid, function (err, specificStudent) {
    if (err) {
      console.log(err)
    } else {
      var index = specificStudent._classes.indexOf(classId)
      specificStudent.behavior[index] = parseInt(req.body.student.behavior)
      specificStudent.aptitude[index] = parseInt(req.body.student.aptitude)

      console.log(specificStudent)
      Student.update(specificStudent, function (err, savedStudent) {
        if (err) {
          console.log(err)
        } else {
          console.log(savedStudent)
          res.redirect(302, '/')
        }
      })
    }
  })
})

router.delete('/:studentid', function (req, res) {
  var classId = req.originalUrl.split('/')[2]
  Class.findById(classId, function (err, specificClass) {
    if (err) {
      console.log(err)
    } else {
      var index = specificClass.students.indexOf(req.params.studentid)

      specificClass.students.splice(index, 1)
      specificClass.numStudents = specificClass.numStudents-1

      specificClass.save(function (err, saved) {
        if (err) {
          console.log(err)
        } else {
          console.log(saved)
        }
      })
    }
  })

  Student.findById(req.params.studentid, function (err, specificStudent) {
    if (err) {
      console.log(err)
    } else {
      var index = specificStudent._classes.indexOf(classId)

      specificStudent._classes.splice(index, 1)
      specificStudent.behavior.splice(index, 1)
      specificStudent.aptitude.splice(index, 1)

      specificStudent.save(function (err, saved) {
        if (err) {
          console.log(err)
        } else {
          console.log(saved)
          res.redirect(302, '/classes/' + classId)
        }
      })
    }
  })
})


module.exports = router;
