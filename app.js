const express=require("express"),
        app=express(),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),

        passport = require("passport"),
        LocalStrategy = require("passport-local").Strategy,

        Comment = require("./models/comment"),
        Campground = require("./models/campground"),
        User = require("./models/user"),
        seedDB= require("./seed");

const indexRouter=require("./routes/index"),
       campgroundRouter=require("./routes/campground"),
        commentRouter=require("./routes/comment");


seedDB();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");



//passport configuration
app.use(require("express-session")({
    secret:"Eric future",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// must after passport setup
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


//database
mongoose.connect("mongodb://localhost/yelpcamp");


//Route
app.get("/",function (req,res) {
    res.render("landing")
});

app.use("/campgrounds",campgroundRouter);
app.use("/",indexRouter);
app.use("/campgrounds/:id/comments",commentRouter);


app.listen(3000,function () {
    console.log("App is running")
})