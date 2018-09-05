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

router.post("/",function (req,res) {
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

router.get("/new",function (req,res) {
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


module.exports = router