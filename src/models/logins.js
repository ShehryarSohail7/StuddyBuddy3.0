const mongoose = require("mongoose")
const Basic_schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
    
})

// now we need to create a collection
const Login = new mongoose.model("Login" , Basic_schema)
module.exports = Login