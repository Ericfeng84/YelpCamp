
const   Comment = require("../models/comment"),
        Campground = require("../models/campground");

const middlewareObj= {};

middlewareObj.isLoggedIn = function (req,res,next){
    if (req.isAuthenticated()){
        return next()
    }
    req.flash("error","You must login in!")
    res.redirect("/login")
};

middlewareObj.commentOwnerCheck = function (req,res,next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.commentId, function (err,findComment) {
            if(err){
                req.flash("error","Do not find Comment!")
            } else {
                if (res.locals.currentUser && findComment.author.id.equals(res.locals.currentUser._id)){
                    next()
                } else {
                    req.flash("error","You do not have permission to edit")
                    res.redirect("back")
                }
            }

        })
    } else {
        req.flash("error","You must login in!")
        res.redirect("/login")
    }

};

middlewareObj.campgroundOwnerCheck=function(req,res,next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function (err,findCampground) {
            if(err){
                res.send("not find cam")
            } else {
                if (res.locals.currentUser && findCampground.author.id.equals(res.locals.currentUser._id)){
                    next()
                } else {
                    req.flash("error","You do not have permission to edit")
                    res.redirect("back")
                }
            }

        })
    } else {
        req.flash("error","You must login in!")
        res.redirect("/login")
    }
};

module.exports = middlewareObj;