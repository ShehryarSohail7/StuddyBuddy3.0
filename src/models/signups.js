const mongoose = require("mongoose")
const Basic_schema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

// now we need to create a collection
const Signup = new mongoose.model("Signup" , Basic_schema)
module.exports = Signup