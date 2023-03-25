import mongoose, { SchemaType } from 'mongoose';
const { Schema } = mongoose;

const tutor = new Schema({
  username: {type:String, required:true,unique:true},
  name: {type:String, required:true, default:username},
  password:{type:String, required:true},
  ads: {type: [Schema.Types.ObjectId], required:false, default:[]},
  appoint :  {type: [Schema.Types.ObjectId], required:false, default:[]},
  review: {type: [Schema.Types.ObjectId], required:false, default:[]}
});
module.exports = mongoose.model('tutor',tutor)
