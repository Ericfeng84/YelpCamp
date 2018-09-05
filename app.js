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

// after passport setup
app.use(function (req, res, next) {
    res.locals.currentUser = req.user
    console.log(req);
    next();
});


//database
mongoose.connect("mongodb://localhost/yelpcamp");


//Route
app.get("/",function (req,res) {
    res.render("landing")
});

app.get("/campgrounds/",function (req,res) {
    console.log(req.user);
    // console.log(res.currentUser);
    Campground.find(function (err,campgroundall) {
        if(err){
            console.log(err)
        } else {
            res.render("campground/index",{campgrounds:campgroundall})
        }

    })
});

app.post("/campgrounds/",function (req,res) {
    var name=req.body.name;
    var img=req.body.img
    var des=req.body.des
    var newCamp ={name:name, img:img,des:des};
    //insert database
    Campground.create(newCamp,function (err,newCampground) {
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds")
        }

        })
});

app.get("/campgrounds/new",function (req,res) {
    res.render("campground/new");
});

app.get("/campgrounds/:id",function (req,res) {
    var picId=req.params.id;
    Campground.findById(picId).populate("comments").exec(function(err,detailId){
        if (err){
            console.log("Error")
        } else {
            console.log(detailId);
            res.render("campground/show",{detail:detailId});
        }
    })
});

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("Id error")
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("Id error")
        } else {
            //Comment creation
            Comment.create(req.body.comment, function(err,newComment){
                if (err){
                    console.log("error")
                } else {
                    campground.comments.push(newComment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
});

//Authorization Route
app.get("/register",function (req,res) {
    res.render("register")
});

app.post("/register",function (req,res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function (err,user) {
        if(err){
            console.log(err)
        } else {
            console.log("is ok")
            passport.authenticate("local")(req,res,function () {
                console.log("ok")
                res.redirect("/campgrounds");
                }
            )
        }
    })
});

//login logic
app.get("/login",function (req,res) {
    res.render("login")
});

app.get("/loginout",function (req,res) {
    req.logout();
    res.redirect("/campgrounds")
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

app.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}),function (req,res) {})

app.listen(3000,function () {
    console.log("App is running")
})