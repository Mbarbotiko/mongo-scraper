var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    //creating schema for Note Object.
  text: String
});

var Note = mongoose.model("Note", NoteSchema);


module.exports = Note; 