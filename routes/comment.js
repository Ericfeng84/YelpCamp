const  express=require("express"),
        router=express.Router({mergeParams:true}),
        Comment = require("../models/comment"),
        Campground = require("../models/campground");

router.get("/new", isLoggedIn, function(req,res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("Id error")
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

router.post("/",isLoggedIn,function(req,res){
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
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
});

router.get("/:commentId/edit",  function(req,res) {

    Comment.findById(req.params.commentId, function (err, findComment) {
        if (err) {
            console.log("Id error")
        } else {
            res.render("comments/edit", {comment: findComment, campground:req.params.id});
        }
    })
});

router.put("/:commentId/",function (req,res) {
    var picId=req.params.commentId;
    var comment={text:req.body.text}
    Comment.findByIdAndUpdate(picId,comment,function(err,detailId){
        if (err){
            console.log("Error")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/:commentId/",function (req,res) {
    var picId=req.params.commentId;
    Comment.findByIdAndRemove(picId,function(err){
        if (err){
            console.log("Error")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

module.exports = router;