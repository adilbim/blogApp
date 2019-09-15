var mongoose = require('mongoose');
//set the schema
var blogSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: 
    [{ 
      type: mongoose.Schema.Types.ObjectId ,
      ref: 'comment'
    }],
    date: { type: Date, default: Date.now }
  });

//set the model and export it
module.exports = mongoose.model('blog', blogSchema);