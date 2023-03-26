// import mongoose, { SchemaType } from 'mongoose';
const mongoose = require("mongoose")
const { Schema } = mongoose;

const review = new Schema({
  content: {type:String, required:false}
  
});
// module.exports = mongoose.model('review',review)
const Review = new mongoose.model("Review" , review)
module.exports = Review
