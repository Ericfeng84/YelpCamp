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
router.get("/login",function (req,res) {
    res.render("login")
});

router.get("/loginout",function (req,res) {
    req.logout();
    res.redirect("/campgrounds")
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect:"/login"
}),function (req,res) {});


module.exports = router;