const  express=require("express"),
        router=express.Router({mergeParams:true}),
        middlewareObj = require("../middleware"),
        Comment = require("../models/comment"),
        Campground = require("../models/campground");

router.get("/new", middlewareObj.isLoggedIn, function(req,res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("Id error")
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

router.post("/",middlewareObj.isLoggedIn,function(req,res){
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("Id error")
        } else {
            //Comment creation
            Comment.create(req.body.comment, function(err,newComment){
                if (err){
                    console.log("error")
                } else {
                    //save logged in user
                    newComment.author.id = req.user._id;
                    newComment.author.username=req.user.username;
                    newComment.save();
                    campground.comments.push(newComment);
                    campground.save();
                    req.flash("success","New Comment create")
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
});

router.get("/:commentId/edit", middlewareObj.commentOwnerCheck, function(req,res) {

    Comment.findById(req.params.commentId, function (err, findComment) {
        if (err) {
            console.log("Id error")
        } else {
            res.render("comments/edit", {comment: findComment, campground:req.params.id});
        }
    })
});

router.put("/:commentId/",middlewareObj.commentOwnerCheck,function (req,res) {
    var picId=req.params.commentId;
    Comment.findByIdAndUpdate(picId,req.body.comment,function(err,detailId){
        if (err){
            console.log("Error")
        } else {
            req.flash("success","Comment have been changed!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/:commentId/",middlewareObj.commentOwnerCheck,function (req,res) {
    var picId=req.params.commentId;
    Comment.findByIdAndRemove(picId,function(err){
        if (err){
            console.log("Error")
        } else {
            req.flash("success","Comment have been delete")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});
module.exports = router;