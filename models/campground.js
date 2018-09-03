const mongoose = require("mongoose");
const campgroundSchema = new mongoose.Schema({
    name: String,
    img: String,
    des: String,
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("campground",campgroundSchema);
