const mongoose = require("mongoose")
// mongoose.connect("mongodb://127.0.0.1:27017/studybuddy",{ //used 127.0.0.1 instead of localhost
mongoose.connect(process.env.MONGODB_URI,{
}).then (()=> {
    console.log(`connection successful`)
}).catch((e) => {
    console.log(`no connection`)
    console.log(e)
})
