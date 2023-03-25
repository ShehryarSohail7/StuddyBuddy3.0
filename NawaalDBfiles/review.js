import mongoose, { SchemaType } from 'mongoose';
const { Schema } = mongoose;

const review = new Schema({
  content: {type:String, required:false}
  
});
module.exports = mongoose.model('review',review)
