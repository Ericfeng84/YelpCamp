const mongoose = require("mongoose"),
        Campground = require("./models/campground"),
        Comment = require("./models/comment")

mongoose.connect("mongodb://localhost/yelpcamp");

var initialData = [
    {name:"Hand",
        img:"https://cdn.pixabay.com/photo/2018/08/06/19/03/hand-3588162__340.jpg",
        dec:"Hand"},
    {name:"Hand",
        img:"https://cdn.pixabay.com/photo/2018/08/06/19/03/hand-3588162__340.jpg",
        dec:"Hand"},
    {name:"Hand",
        img:"https://cdn.pixabay.com/photo/2018/08/06/19/03/hand-3588162__340.jpg",
        dec:"Hand"},
];



function seedDB() {
    // clean the database
    Campground.remove({},function (err) {
        if(err){
            console.log("err");
        } else {
            console.log("Initial database successfully");
            // create the data
            initialData.forEach(function (camp) {
                Campground.create(camp,function (err,newcamp) {
                    if(err){
                        console.log("Create Error")
                    } else {
                        console.log("New campground add")
                        //create campground
                        Comment.create({
                            text:"This hand is great",
                            author:"home"
                            }, function (err,newcomment) {
                                if (err) {
                                    console.log("fail")
                                } else {
                                    newcamp.comments.push(newcomment);
                                    newcamp.save();
                                    console.log("link comment with campground")
                                }

                        })
                    }
                })
                
            })
            
        }
    })
    
}

module.exports = seedDB