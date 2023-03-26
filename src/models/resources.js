// import mongoose, { SchemaType } from 'mongoose';
const mongoose = require("mongoose")
const { Schema } = mongoose;

const resources = new Schema({
  content: {type:String, required:true}
  
});
// module.exports = mongoose.model('resources',resources)
const Resources = new mongoose.model("Resources" , resources)
module.exports = Resources
