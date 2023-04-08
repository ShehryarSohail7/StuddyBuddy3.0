// import mongoose, { SchemaType } from 'mongoose';
// const { Schema } = mongoose;
const mongoose = require("mongoose");
const { Schema } = mongoose;
const student = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, required: false },
  ads: {
    requestId: { type: Schema.Types.ObjectId, required: true },
    studentEmail: { type: String, required: true },
    courses: { type: String, required: true },
    days: { type: Number, required: true },
    hours: { type: Number, required: true },
    bid: { type: Number, required: true },
    desc: { type: String, required: false },
  },
  appoint: { type: [Schema.Types.ObjectId], required: false, default: [] },
  review: { type: [Schema.Types.ObjectId], required: false, default: [] },
});
// module.exports = mongoose.model('student',student)
const Student = new mongoose.model("Student", student);
module.exports = Student;
