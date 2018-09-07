const  express=require("express"),
        router=express.Router({mergeParams:true}),
        passport = require("passport"),
        User = require("../models/user");

router.get("/",function (req,res) {
    res.render("landing")
});

router.get("/register",function (req,res) {
    res.render("register")
});

router.post("/register",function (req,res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function (err,user) {
        if(err){
            req.flash("error","User already exit, Please login in");
            console.log(err)
        } else {

            passport.authenticate("local")(req,res,function () {
                req.flash("success","New user create");
                res.redirect("/campgrounds");
                }
            )
        }
    })
});

//login logic
router.get("/login",function (req,res) {
    res.render("login")
});

router.get("/loginout",function (req,res) {
    req.logout();
    req.flash("success","Success login out");
    res.redirect("/campgrounds")
});


router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}),function (req,res) {});

module.exports = router;