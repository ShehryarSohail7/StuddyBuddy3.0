// import mongoose, { SchemaType } from 'mongoose';
// const { Schema } = mongoose;
const mongoose = require("mongoose")
const { Schema } = mongoose;
const student = new Schema({
  name: {type:String, required:true},
  email: {type:String, required:true,unique:true},
  password:{type:String, required:true},
  photo: {type:String, required:false},
  ads: {type: [Schema.Types.ObjectId], required:false, default:[]},
  appoint :  {type: [Schema.Types.ObjectId], required:false, default:[]},
  review: {type: [Schema.Types.ObjectId], required:false, default:[]}
});
// module.exports = mongoose.model('student',student)
const Student = new mongoose.model("Student" , student)
module.exports = Student

