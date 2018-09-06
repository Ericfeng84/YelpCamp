const  express=require("express"),
        router=express.Router({mergeParams:true}),
        Campground = require("../models/campground");

router.get("/",function (req,res) {
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

router.post("/",isLoggedIn,function (req,res) {
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
            res.redirect("/campgrounds")
        }

    })
});

router.get("/new",isLoggedIn,function (req,res) {
    res.render("campground/new");
});

router.get("/:id",function (req,res) {
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

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

module.exports = router