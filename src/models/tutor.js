// import mongoose, { SchemaType } from 'mongoose';
const mongoose = require("mongoose");
const { Schema } = mongoose;

const tutor = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, required: false },
  ads: { type: [Schema.Types.ObjectId], required: false, default: [] },
  appoint: [
    {
      username: { type: String, required: true },
      courses: { type: String, required: true },
      days: { type: Number, required: true },
      hours: { type: Number, required: true },
      bid: { type: Number, required: true },
      desc: { type: String, required: false },
    },
  ],
  review: { type: [Schema.Types.ObjectId], required: false, default: [] },
});

// now we need to create a collection
const Tutor = new mongoose.model("Tutor", tutor);
module.exports = Tutor;
// module.exports = mongoose.model('tutor',tutor)
