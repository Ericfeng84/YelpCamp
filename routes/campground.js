const  express=require("express"),
        router=express.Router({mergeParams:true}),
        middlewareObj = require("../middleware"),
        Campground = require("../models/campground");

router.get("/",function (req,res) {
    Campground.find(function (err,campgroundall) {
        if(err){
            console.log(err)
        } else {
            res.render("campground/index",{campgrounds:campgroundall})
        }

    })
});

router.post("/",middlewareObj.isLoggedIn,function (req,res) {
    var name=req.body.name;
    var img=req.body.img;
    var des=req.body.des;
    var author={
        id: req.user._id,
        username:req.user.username
    };
    var newCamp ={name:name, img:img,des:des,author:author};
    //insert database
    Campground.create(newCamp,function (err,newCampground) {
        if(err){
            console.log(err)
        } else {
            req.flash("Success","New Campground Create")
            res.redirect("/campgrounds")
        }

    })
});

router.get("/new",middlewareObj.isLoggedIn,function (req,res) {
    res.render("campground/new");
});

router.get("/:id",function (req,res) {
    var picId=req.params.id;
    Campground.findById(picId).populate("comments").exec(function(err,detailId){
        if (err){
            console.log("Error")
        } else {
            res.render("campground/show",{detail:detailId});
        }
    })
});

router.get("/:id/edit",middlewareObj.campgroundOwnerCheck,function (req,res) {
    var picId=req.params.id;
    Campground.findById(picId,function(err,detailId){
        if (err){
            console.log("Error")
        } else {
            res.render("campground/edit" ,{detail:detailId});
        }
    })
});

router.put("/:id/",middlewareObj.campgroundOwnerCheck,function (req,res) {
    var picId=req.params.id;
    Campground.findByIdAndUpdate(picId,req.body.campground,function(err,detailId){
        if (err){
            console.log("Error")
        } else {
            req.flash("success","Campground success change")
            res.redirect("/campgrounds/" + detailId._id);
        }
    })
});

router.delete("/:id/",middlewareObj.campgroundOwnerCheck,function (req,res) {
    var picId=req.params.id;
    Campground.findByIdAndRemove(picId,function(err){
        if (err){
            console.log("Error")
        } else {
            req.flash("success","Campground success delete")
            res.redirect("/campgrounds/");
        }
    })
});



module.exports = router