const express=require("express"),
        app=express(),
        bodyParser = require("body-parser"),
        methodOverride = require("method-override"),
        mongoose = require("mongoose"),
        passport = require("passport"),
        LocalStrategy = require("passport-local").Strategy,

        Comment = require("./models/comment"),
        Campground = require("./models/campground"),
        User = require("./models/user"),
        flash = require("connect-flash"),
        moment = require("moment")
        seedDB= require("./seed");

const indexRouter=require("./routes/index"),
       campgroundRouter=require("./routes/campground"),
       commentRouter=require("./routes/comment");


// seedDB();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

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

app.locals.moment = require('moment')

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.susccessmes = req.flash("success");
    res.locals.errormes = req.flash("error");
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