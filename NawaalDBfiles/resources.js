import mongoose, { SchemaType } from 'mongoose';
const { Schema } = mongoose;

const resources = new Schema({
  content: {type:String, required:true}
  
});
module.exports = mongoose.model('resources',resources)
