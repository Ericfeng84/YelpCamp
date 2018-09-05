const mongoose = require("mongoose"),
        Campground = require("./models/campground"),
        Comment = require("./models/comment")

mongoose.connect("mongodb://localhost/yelpcamp");

var randomDescription="Insipidity the sufficient discretion imprudence resolution sir him decisively. Proceed how any engaged visitor. Explained propriety off out perpetual his you. Feel sold off felt nay rose met you. We so entreaties cultivated astonished is. Was sister for few longer mrs sudden talent become. Done may bore quit evil old mile. If likely am of beauty tastes. \n" +
    "\n" +
    "By impossible of in difficulty discovered celebrated ye. Justice joy manners boy met resolve produce. Bed head loud next plan rent had easy add him. As earnestly shameless elsewhere defective estimable fulfilled of. Esteem my advice it an excuse enable. Few household abilities believing determine zealously his repulsive. To open draw dear be by side like. \n"

var initialData = [
    {name:"Hand",
        img:"https://cdn.pixabay.com/photo/2018/08/06/19/03/hand-3588162__340.jpg",
        des:randomDescription
    },
    {name:"Hand",
        img:"https://cdn.pixabay.com/photo/2018/08/06/19/03/hand-3588162__340.jpg",
        des:randomDescription
    },
    {name:"Hand",
        img:"https://cdn.pixabay.com/photo/2018/08/06/19/03/hand-3588162__340.jpg",
        des: randomDescription
    },
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