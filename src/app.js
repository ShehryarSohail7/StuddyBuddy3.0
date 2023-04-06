const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

require("./db/conn");
// Databases connected (All collections)
const tutor_db = require("./models/tutor");
const student_db = require("./models/student");
const admin_db = require("./models/admin");

const ad_db = require("./models/ad");
const ann_db = require("./models/ann");
const appt_db = require("./models/appt");
const notif_db = require("./models/notif");
const resources_db = require("./models/resources");
const review_db = require("./models/review");

// check if admin_db collection is empty or not
// add an admin if it is empty
admin_db
  .find()
  .then((result) => {
    if (result.length == 0) {
      // add an admin
      const admin = new admin_db({
        email: "admin123@gmail.com",
        password: "admin123",
      });
      admin.save().then((result) => {
        console.log(result);
      });
    }
  })
  .catch((error) => {
    console.log(error);
  });

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../frontend/pages");
const partials_path = path.join(__dirname, "../frontend/components");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./signup_uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/", (request, resolve) => {
  resolve.render("index");
});

app.get("/signup_follow", (request, resolve) => {
  resolve.render("signup_follow");
});

app.get("/signup_student", (request, resolve) => {
  //to go to that page
  resolve.render("signup_student");
});

// create a new user for our database
app.post(
  "/signup_student",
  upload.single("photo"),
  async (request, resolve) => {
    try {
      const capture_data = new student_db({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        // photo: request.file.path
        photo: request.file
          ? request.file.path
          : "signup_uploads\\default123.jpg",
        // Set the image attribute to the path of the uploaded file, or the
        // default image path if no file was uploaded
      });
      const signup_saved = await capture_data.save();
      const message = "Sign up as Student Successful";
      const script = `<script>alert('${message}'); window.location.href = '/';</script>`;

      // resolve.status(201).render(script)
      resolve.send(script);
    } catch (error) {
      //error response design
      // resolve.status(400).send(error)                         //one way

      // console.error(error);                                   //second way
      // if (error.code === 11000) {
      //     resolve.status(400).send("Email already exists");
      // } else {
      //     resolve.status(400).send("Signup failed");
      // }

      if (error.code === 11000) {
        // third way
        // display an alert message to the user
        const message = "Email already exists";
        const script = `<script>alert('${message}'); window.location.href = '/signup_student';</script>`;
        resolve.send(script);
      } else {
        // display an alert message to the user
        const message = "Signup failed";
        const script = `<script>alert('${message}'); window.location.href = '/signup_student';</script>`;
        resolve.send(script);
      }
    }
  }
);

app.get("/signup_tutor", (request, resolve) => {
  //to go to that page
  resolve.render("signup_tutor");
});

// create a new user for our database
app.post("/signup_tutor", upload.single("photo"), async (request, resolve) => {
  try {
    console.log(request.file);
    const capture_data = new tutor_db({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      photo: request.file
        ? request.file.path
        : "signup_uploads\\default123.jpg",
    });
    const signup_saved = await capture_data.save();
    const message = "Sign up as Tutor Successful";
    const script = `<script>alert('${message}'); window.location.href = '/';</script>`;

    // resolve.status(201).render(script)
    resolve.send(script);
  } catch (error) {
    //error response design
    if (error.code === 11000) {
      // display an alert message to the user
      const message = "Email already exists";
      const script = `<script>alert('${message}'); window.location.href = '/signup_tutor';</script>`;
      resolve.send(script);
    } else {
      // display an alert message to the user
      const message = "Signup failed";
      const script = `<script>alert('${message}'); window.location.href = '/signup_tutor';</script>`;
      resolve.send(script);
    }
  }
});

app.get("/login", (request, resolve) => {
  resolve.render("login");
});

// create a new user for our database
app.post("/login", async (request, resolve) => {
  try {
    const { email, password, confirm_password, user_type } = request.body;
    if (user_type === "student") {
      student_db.find({ email }).then((result) => {
        // const matchingEmails = result.filter((result) => result.email === email);
        // const emails = matchingEmails.map((matchingEmail) => matchingEmail.email);
        if (password !== confirm_password) {
          const message = "your password and confirm password are different";
          const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
          resolve.send(script);
        } else {
          if (result.length === 0) {
            const message = "no such email exists";
            const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
            resolve.send(script);
          } else {
            const pass = result[0];
            if (pass.password !== password) {
              const message = "password is incorrect";
              const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
              resolve.send(script);
            } else {
              //storing login details
              store_email = pass.email;
              store_password = pass.password;
              console.log(store_email);
              console.log(store_password);
              // transfer of variables to another file
              module.exports = {
                store_email: store_email,
                store_password: store_password,
                user_type: user_type,
              };
              // const { store_email, store_password } = require('./app');
              const message =
                " ==>Student login successful-here we enter the student terminal";
              // resolve.send(email + message); //change this to render to new webpage (student terminal)
              resolve.render("student_landing");
            }
          }
        }
      });
    } else if (user_type === "tutor") {
      tutor_db.find({ email }).then((result) => {
        // const matchingEmails = result.filter((result) => result.email === email);
        // const emails = matchingEmails.map((matchingEmail) => matchingEmail.email);
        if (password !== confirm_password) {
          const message = "your password and confirm password are different";
          const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
          resolve.send(script);
        } else {
          if (result.length === 0) {
            const message = "no such email exists";
            const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
            resolve.send(script);
          } else {
            const pass = result[0];
            if (pass.password !== password) {
              const message = "password is incorrect";
              const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
              resolve.send(script);
            } else {
              store_email = pass.email;
              store_password = pass.password;
              console.log(store_email);
              console.log(store_password);
              // transfer of variables to another file
              module.exports = {
                store_email: store_email,
                store_password: store_password,
                user_type: user_type,
              };
              const message =
                " ==>Tutor login successful-here we enter the Tutor terminal";
              // resolve.send(email + message); //change this to render to new webpage (tutor terminal)
              resolve.render("tutor_terminal");
            }
          }
        }
      });
    } else if (user_type === "admin") {
      admin_db.find({ email }).then((result) => {
        // const matchingEmails = result.filter((result) => result.email === email);
        // const emails = matchingEmails.map((matchingEmail) => matchingEmail.email);
        if (password !== confirm_password) {
          const message = "your password and confirm password are different";
          const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
          resolve.send(script);
        } else {
          if (result.length === 0) {
            const message = "no such email exists";
            const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
            resolve.send(script);
          } else {
            const pass = result[0];
            if (pass.password !== password) {
              const message = "password is incorrect";
              const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
              resolve.send(script);
            } else {
              store_email = pass.email;
              store_password = pass.password;
              console.log(store_email);
              console.log(store_password);
              // transfer of variables to another file
              module.exports = {
                store_email: store_email,
                store_password: store_password,
                user_type: user_type,
              };
              const message =
                " ==>Admin login successful-here we enter the Admin terminal";
              // resolve.send(email + message); //change this to render to new webpage (tutor terminal)
              resolve.render("admin_terminal");
            }
          }
        }
      });
    }
  } catch (error) {
    // Handle any errors
    resolve.status(500).send(error);
  }
});

// app.get ("/settings" , (request,resolve) => {
//     resolve.render("settings")
//     })

app.get("/settings", (req, res) => {
  const { store_password, store_email, user_type } = require("./app");
  const userType = user_type; // e.g. "student", "tutor", or "admin"
  res.render("settings", {
    userTypeIsStudent: userType === "student",
    userTypeIsTutor: userType === "tutor",
    userTypeIsAdmin: userType === "admin",
  });
});

// ad_db // code to delete ads
//   .find()
//   .then((ads) => {
//     if (ads.length > 0) {
//       ad_db
//         .deleteMany({})
//         .then(() => {
//           console.log("All ads have been deleted");
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// ad_db
//   .find()
//   .then((result) => {
//     let count = -1;

//     count += 1;

//     // Add ads
//     const ads = [
//       {
//         subject: "math",
//         class: "grade 7",
//         time: "Aaqib Hasanie",
//         price: "$50 per hour",
//         image:
//           "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
//       },
//       {
//         subject: "english",
//         class: "grade 12",
//         time: "Nawal sidique",
//         price: "$60 per hour",
//         image:
//           "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
//       },
//       {
//         subject: "biology",
//         class: "grade 8",
//         time: "Amna Sahar",
//         price: "$100 per hour",
//         image:
//           "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
//       },
//       {
//         subject: "sat",
//         class: "all grades",
//         time: "Shehryar",
//         price: "$10 per hour",
//         image:
//           "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
//       },
//       {
//         subject: "matric",
//         class: "grade 9",
//         time: "Shehryar",
//         price: "$5 per hour",
//         image:
//           "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
//       },
//       {
//         subject: "olevels",
//         class: "grade 10",
//         time: "Shafay",
//         price: "$50 per hour",
//         image:
//           "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
//       },
//       {
//         subject: "alevels",
//         class: "grade 11",
//         time: "Nafay",
//         price: "$50 per hour",
//         image:
//           "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
//       },
//       {
//         subject: "fsc",
//         class: "grade 10",
//         time: "Sumair",
//         price: "$5 per hour",
//         image:
//           "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80",
//       },
//     ];

//     ad_db
//       .insertMany(ads)
//       .then((result) => {
//         console.log("Ads added successfully");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

app.get("/tutor_terminal", (request, resolve) => {
  resolve.render("tutor_terminal");
});
app.get("/student_terminal", (request, resolve) => {
  resolve.render("student_terminal");
});
app.get("/admin_terminal", (request, resolve) => {
  resolve.render("admin_terminal");
});

// app.get ("/update_password" , (request,resolve) => {
//     resolve.render("update_password")
//     })

app.get("/reviews", async (req, res) => {
  // making to check reviews of the tutor
  try {
    const tutors = await tutor_db.find({}).populate("reviews");
    const ads = tutors.flatMap((tutor) => tutor.ads);
    res.send(ads);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching ads");
  }
});

// ann_db // code to delete announcementes
//   .find()
//   .then((ann) => {
//     if (ann.length > 0) {
//       ann_db
//         .deleteMany({})
//         .then(() => {
//           console.log("All anns have been deleted");
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });

app.post("/addann", async (req, res) => {
  try {
    const newAnnouncement = new ann_db({
      content: req.body.contentt,
      createdAt: new Date(),
    });

    await newAnnouncement.save();

    res.status(201).json({ message: "Announcement added successfully." });
  } catch (err) {
    // Send a response indicating an error occurred
    res.status(500).json({ message: "Failed to add announcement." });
  }
});

app.get("/viewann", async (req, res) => {
  try {
    // Find all the announcements in the database and sort them by createdAt date in descending order
    const announcements = await ann_db
      .find()
      .select("content createdAt")
      .sort({ createdAt: -1 });

    // Send the announcements back as a response
    res.status(200).json({ announcements });
  } catch (err) {
    // Send a response indicating an error occurred
    res.status(500).json({ message: "Failed to get announcements." });
  }
});

app.delete("/deleteann", async (req, res) => {
  // works greatly with id
  try {
    const adId = req.body._id;
    const deletedAd = await ann_db.findByIdAndDelete(adId);
    if (!deletedAd) {
      return res.status(404).send("announcement not found");
    }
    res.send("announcement deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/ads", async (req, res) => {
  // gives all ads
  try {
    const tutors = await ad_db.find({});
    res.send(tutors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching ads");
  }
});

app.post("/postad", async (req, res) => {
  try {
    // Create a new Ads object with data from the request body
    const newAds = new ad_db({
      subject: req.body.subject,
      class: req.body.class,
      time: req.body.time,
      price: req.body.price,
      image: req.body.image,
    });

    // Save the new Ads object to the database
    const savedAds = await newAds.save();

    // Send a success response with the saved object
    res.status(201).json("Ad addedd successfully");
  } catch (err) {
    // Handle any errors and send an error response
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/tutors", async (req, res) => {
  ///
  // function to return all tutors
  try {
    const tutors = await tutor_db.find({});
    res.send(tutors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tutors");
  }
});

app.get("/tutor/:name", async (req, res) => {
  // returns specific tutor
  const name = req.params.name;
  try {
    const tutor = await tutor_db.findOne({ name: name });
    if (!tutor) {
      res.status(404).send("username not found");
      return;
    }
    res.send(`The name of the tutor with email ${name} is ${tutor.name}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/deleteads", async (req, res) => {
  // works greatly with id
  try {
    const adId = req.body._id;
    const deletedAd = await ad_db.findByIdAndDelete(adId);
    if (!deletedAd) {
      return res.status(404).send("Ad not found");
    }
    res.send("Ad deleted successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/search", async (req, res) => {
  // suggested one
  try {
    const searchQuery = String(req.query.q).toLowerCase(); // change req.body.q to req.query.q
    const ads = await ad_db.find({
      $or: [
        { subject: searchQuery },
        { class: searchQuery },
        { time: searchQuery },
        { price: searchQuery },
        { image: searchQuery },
      ],
    });
    res.send(ads);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/update_password", (req, res) => {
  const { store_password, store_email, user_type } = require("./app");
  const userType = user_type; // e.g. "student", "tutor", or "admin"
  res.render("update_password", {
    userTypeIsStudent: userType === "student",
    userTypeIsTutor: userType === "tutor",
    userTypeIsAdmin: userType === "admin",
  });
});

app.post("/update_password", async (request, resolve) => {
  try {
    const { old_pass, new_pass, confirm_pass } = request.body;
    console.log(old_pass, new_pass, confirm_pass);
    const { store_password, store_email, user_type } = require("./app");
    console.log(store_email);
    console.log(store_password);
    if (store_password !== old_pass) {
      const message = "the old password you typed in is incorrect";
      const script = `<script>alert('${message}'); window.location.href = '/update_password';</script>`;
      resolve.send(script);
    } else {
      if (new_pass !== confirm_pass) {
        const message = "your new password and confirm password are different";
        const script = `<script>alert('${message}'); window.location.href = '/update_password';</script>`;
        resolve.send(script);
      } else {
        if (user_type === "student") {
          const updatedStudent = await student_db.findOneAndUpdate(
            { email: store_email },
            { password: new_pass },
            { new: true } // Return the updated document
          );
        } else if (user_type === "tutor") {
          const updatedTutor = await tutor_db.findOneAndUpdate(
            { email: store_email },
            { password: new_pass },
            { new: true } // Return the updated document
          );
        } else if (user_type === "admin") {
          const updatedAdmin = await admin_db.findOneAndUpdate(
            { email: store_email },
            { password: new_pass },
            { new: true } // Return the updated document
          );
        }
        const message =
          "password successfully updated, please login again with your new password";
        const script = `<script>alert('${message}'); window.location.href = '/login';</script>`;
        resolve.send(script);
      }
    }
  } catch (error) {
    // Handle any errors
    resolve.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
