import mongoose, { SchemaType } from 'mongoose';
const { Schema } = mongoose;

const ann = new Schema({
  content: {type:String, required:false}
  
});
module.exports = mongoose.model('ann',ann)