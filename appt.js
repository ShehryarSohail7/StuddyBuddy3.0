import mongoose, { SchemaType } from 'mongoose';
const { Schema } = mongoose;

const appt = new Schema({
  content: {type:String, required:false}
  
});
module.exports = mongoose.model('appt',appt)