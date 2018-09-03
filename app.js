const express=require("express"),
        app=express(),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        Comment = require("./models/comment"),
        Campground = require("./models/campground"),
        seedDB= require("./seed")


seedDB()
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//database
mongoose.connect("mongodb://localhost/yelpcamp");


//Route
app.get("/",function (req,rep) {
    rep.render("landing")
});

app.get("/campgrounds/",function (req,rep) {
    Campground.find(function (err,campgroundall) {
        if(err){
            console.log(err)
        } else {
            rep.render("campground/index",{campgrounds:campgroundall})
        }

    })
});

app.post("/campgrounds/",function (req,rep) {
    var name=req.body.name;
    var img=req.body.img
    var des=req.body.des
    var newCamp ={name:name, img:img,des:des};
    //insert database
    Campground.create(newCamp,function (err,newCampground) {
        if(err){
            console.log(err)
        } else {
            rep.redirect("/campgrounds")
        }

        })
});

app.get("/campgrounds/new",function (req,rep) {
    rep.render("campground/new");
});

app.get("/campgrounds/:id",function (req,rep) {
    var picId=req.params.id;
    Campground.findById(picId).populate("comments").exec(function(err,detailId){
        if (err){
            console.log("Error")
        } else {
            console.log(detailId);
            rep.render("campground/show",{detail:detailId});
        }
    })
});

app.get("/campgrounds/:id/comments/new", function(req,rep) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("Id error")
        } else {
            rep.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments",function(req,rep){
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
                    rep.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
});

app.listen(3000,function () {
    console.log("App is running")
})