var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var studentSchema = new Schema({
  _classes: [{type: Schema.Types.ObjectId, ref: 'class', default: []}],
  name:  { type: String, required: true},
  email: {type: String, required: true},
  behavior: [{type: Number, required: true}],
  aptitude: [{type: Number, required: true}],
  picture: {type: String}
}, {collections: 'students', strict: false});

var Student = mongoose.model('student', studentSchema);

module.exports = Student;
