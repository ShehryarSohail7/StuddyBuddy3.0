const express = require ("express")
const path = require("path")
const app = express()
const hbs = require("hbs")

require("./db/conn")
// Databases connected (All collections)
const tutor_db = require("./models/tutor")
const student_db = require("./models/student")
const admin_db = require("./models/admin")

const ad_db = require("./models/ad")
const ann_db = require("./models/ann")
const appt_db = require("./models/appt")
const notif_db = require("./models/notif")
const resources_db = require("./models/resources")
const review_db = require("./models/review")

// check if admin_db collection is empty or not
// add an admin if it is empty
admin_db.find().then((result) => {
    if (result.length == 0) {
        // add an admin
        const admin = new admin_db({
            email: "admin123@gmail.com",
            password: "admin123"
        })
        admin.save().then((result) => {
        console.log(result) })}
}
).catch((error) => {
    console.log(error)
})

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

app.get ("/signup_follow" , (request,resolve) => {
    resolve.render("signup_follow")
    })

app.get ("/signup_student" , (request,resolve) => { //to go to that page
    resolve.render("signup_student")
    })

// create a new user for our database
app.post ("/signup_student" , async(request,resolve) => {
    try{
        const capture_data = new student_db({
            name: request.body.name,
            email: request.body.email,
            password:request.body.password
        }) 
        const signup_saved = await capture_data.save()
        const message = "Sign up as Student Successful";
        const script = `<script>alert('${message}'); window.location.href = '/';</script>`

        // resolve.status(201).render(script)
        resolve.send(script)

    } catch(error){ //error response design
        // resolve.status(400).send(error)                         //one way

        // console.error(error);                                   //second way
        // if (error.code === 11000) {
        //     resolve.status(400).send("Email already exists");
        // } else {
        //     resolve.status(400).send("Signup failed");
        // }

        if (error.code === 11000) {                                 // third way
            // display an alert message to the user
            const message = "Email already exists";
            const script = `<script>alert('${message}'); window.location.href = '/signup_student';</script>`
            resolve.send(script)
            
        } else {
            // display an alert message to the user
            const message = "Signup failed";
            const script = `<script>alert('${message}'); window.location.href = '/signup_student';</script>`
            resolve.send(script)
        }
    }
})


app.get ("/signup_tutor" , (request,resolve) => { //to go to that page
    resolve.render("signup_tutor")
    })

// create a new user for our database
app.post ("/signup_tutor" , async(request,resolve) => {
    try{
        const capture_data = new tutor_db({
            name: request.body.name,
            email: request.body.email,
            password:request.body.password
        }) 
        const signup_saved = await capture_data.save()
        const message = "Sign up as Tutor Successful";
        const script = `<script>alert('${message}'); window.location.href = '/';</script>`

        // resolve.status(201).render(script)
        resolve.send(script)

    } catch(error){ //error response design
        if (error.code === 11000) {     
            // display an alert message to the user
            const message = "Email already exists";
            const script = `<script>alert('${message}'); window.location.href = '/signup_tutor';</script>`
            resolve.send(script)
            
        } else {
            // display an alert message to the user
            const message = "Signup failed";
            const script = `<script>alert('${message}'); window.location.href = '/signup_tutor';</script>`
            resolve.send(script)
        }
    }
})


app.get ("/login" , (request,resolve) => {
    resolve.render("login")
    })

// create a new user for our database
app.post ("/login" , async(request,resolve) => {
    try {
        const { email, password , confirm_password , user_type} = request.body;
        if (user_type === "student"){
        student_db.find({email}).then((result)=>{ 
            // const matchingEmails = result.filter((result) => result.email === email);
            // const emails = matchingEmails.map((matchingEmail) => matchingEmail.email);
            if (password !== confirm_password){
                const message = "your password and confirm password are different";
                const script = `<script>alert('${message}'); window.location.href = '/login';</script>`
                resolve.send(script)
            }else{
                if (result.length === 0){
                    const message = "no such email exists";
                    const script = `<script>alert('${message}'); window.location.href = '/login';</script>`
                    resolve.send(script)
                }else{
                    const pass = result[0]
                    if (pass.password !== password) {
                        const message = "password is incorrect";
                        const script = `<script>alert('${message}'); window.location.href = '/login';</script>`
                        resolve.send(script)
                    }else{
                    const message = " ==>Student login successful-here we enter the student terminal";
                    resolve.send(email + message); //change this to render to new webpage (student terminal)
                    }
                }
            }
        })}else if (user_type === "tutor"){
            tutor_db.find({email}).then((result)=>{ 
                // const matchingEmails = result.filter((result) => result.email === email);
                // const emails = matchingEmails.map((matchingEmail) => matchingEmail.email);
                if (password !== confirm_password){
                    const message = "your password and confirm password are different";
                    const script = `<script>alert('${message}'); window.location.href = '/login';</script>`
                    resolve.send(script)
                }else{
                    if (result.length === 0){
                        const message = "no such email exists";
                        const script = `<script>alert('${message}'); window.location.href = '/login';</script>`
                        resolve.send(script)
                    }else{
                        const pass = result[0]
                        if (pass.password !== password) {
                            const message = "password is incorrect";
                            const script = `<script>alert('${message}'); window.location.href = '/login';</script>`
                            resolve.send(script)
                        }else{
                        const message = " ==>Tutor login successful-here we enter the Tutor terminal";
                        resolve.send(email + message); //change this to render to new webpage (tutor terminal)
                        }
                    }
                }
            })


        } else if (user_type === "admin"){
            admin_db.find({email}).then((result)=>{ 
                // const matchingEmails = result.filter((result) => result.email === email);
                // const emails = matchingEmails.map((matchingEmail) => matchingEmail.email);
                if (password !== confirm_password){
                    const message = "your password and confirm password are different";
                    const script = `<script>alert('${message}'); window.location.href = '/login';</script>`
                    resolve.send(script)
                }else{
                    if (result.length === 0){
                        const message = "no such email exists";
                        const script = `<script>alert('${message}'); window.location.href = '/login';</script>`
                        resolve.send(script)
                    }else{
                        const pass = result[0]
                        if (pass.password !== password) {
                            const message = "password is incorrect";
                            const script = `<script>alert('${message}'); window.location.href = '/login';</script>`
                            resolve.send(script)
                        }else{
                        const message = " ==>Admin login successful-here we enter the Admin terminal";
                        resolve.send(email + message); //change this to render to new webpage (tutor terminal)
                        }
                    }
                }
            })

            
        }
    }catch(error){
    // Handle any errors
    resolve.status(500).send(error);
    }
})  

app.listen(port , ()=> {
console.log (`server is running at ${port}`)
})
