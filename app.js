if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user.js');

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const dburl = process.env.ATLASDB_URL;
main()
    .then(() => {
        console.log("connections Established")
    })
    .catch(err => {
        console.log(err)
    });

async function main() {
    await mongoose.connect(dburl);
}

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
})

store.on("error", () => {
    console.log("ERROR in Atlas database session", err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
// root routes
// app.get("/", (req, res) => {
//     res.send("working properlly...");
// });

//for the cookie passing
app.use(session(sessionOption));

app.use(flash());

app.use(passport.initialize()); //middle ware 
app.use(passport.session()); //cookies knowing who is navigate in next page that user same or not 
passport.use(new LocalStrategy(User.authenticate())); //Generate fuction that is used in passport stratagy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressErr(404, "Page Not Found.!"))
})


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went to wrong" } = err;
    res.status(statusCode).render("./listings/error.ejs", { message });
})

app.listen(3000, () => {
    console.log("server is listening on 3000 port");
});