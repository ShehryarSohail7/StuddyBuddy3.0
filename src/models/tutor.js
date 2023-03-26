// import mongoose, { SchemaType } from 'mongoose';
const mongoose = require("mongoose")
const { Schema } = mongoose;

const tutor = new Schema({
  name: {type:String, required:true},
  email: {type:String, required:true,unique:true},
  password:{type:String, required:true},
  ads: {type: [Schema.Types.ObjectId], required:false, default:[]},
  appoint :  {type: [Schema.Types.ObjectId], required:false, default:[]},
  review: {type: [Schema.Types.ObjectId], required:false, default:[]}
});

// now we need to create a collection
const Tutor = new mongoose.model("Tutor" , tutor)
module.exports = Tutor
// module.exports = mongoose.model('tutor',tutor)

