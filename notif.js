import mongoose, { SchemaType } from 'mongoose';
const { Schema } = mongoose;

const notif = new Schema({
  content: {type:String, required:false}
  
});
module.exports = mongoose.model('notif',notif)