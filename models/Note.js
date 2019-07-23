const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  text: {
  	type: String,
  	trim: true,
  	required: 'Must have text.'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
