var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var classSchema = new Schema({
  _teacher: {type: Schema.Types.ObjectId, ref: 'user'},
  subject:  { type: String, required: true},
  period: {type: Number, required: true},
  students: [{type: Schema.Types.ObjectId, ref: 'student', many: true}],
  numStudents: {type: Number},
  pictureUrl: {type: String},
  group: {type: Array}
}, {collections: 'classes', strict: false});

var Class = mongoose.model('class', classSchema);

module.exports = Class;
