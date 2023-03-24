const express = require ("express")
const path = require("path")
const app = express()
const hbs = require("hbs")

require("./db/conn")
const Signup = require("./models/signups")
const Login = require("./models/logins")
const port = process.env.PORT || 3000

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json())
app.use(express.urlencoded({extended:false}))


app.use(express.static(static_path))
app.set("view engine" , "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path)

app.get ("/" , (request,resolve) => {
    resolve.render("index")
    })

app.get ("/signup" , (request,resolve) => {
    resolve.render("signup")
    })

// create a new user for our database
app.post ("/signup" , async(request,resolve) => {
    try{
        // console.log(request.body.name)
        // resolve.send(request.body.name)
        const capture_data = new Signup({
            name: request.body.name,
            email: request.body.email,
            username:request.body.username,
            password:request.body.password
        }) 
        const signup_saved = await capture_data.save()
        resolve.status(201).render("index")

    } catch(error){ //error response design
        resolve.status(400).send(error)
    }
})

app.get ("/login" , (request,resolve) => {
    resolve.render("login")
    })

// create a new user for our database
app.post ("/login" , async(request,resolve) => {
    try{
        const capture_data2 = new Login({
            email: request.body.email,
            password:request.body.password
        }) 
        const login_saved = await capture_data2.save()
        resolve.status(201).render("index")

    } catch(error){ //error response design
        resolve.status(400).send(error)
    }
})  

app.listen(port , ()=> {
console.log (`server is running at ${port}`)
})