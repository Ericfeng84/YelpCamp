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
            rep.render("index",{campgrounds:campgroundall})
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
    rep.render("new");
});

app.get("/campgrounds/:id",function (req,rep) {
    var picId=req.params.id;
    Campground.findById(picId).populate("comments").exec(function(err,detailId){
        if (err){
            console.log("Error")
        } else {
            console.log(detailId);
            rep.render("show",{detail:detailId});
        }
    })


});

app.listen(3000,function () {
    console.log("App is running")
});