// import mongoose, { SchemaType } from 'mongoose';
const mongoose = require("mongoose")
const { Schema } = mongoose;

const ann = new Schema({
  content: {type:String, required:false}
  
});
// module.exports = mongoose.model('ann',ann)
const Ann = new mongoose.model("Ann" , ann)
module.exports = Ann

