const mongoose = require("mongoose");

const detailsSchema = mongoose.Schema({
    name: {
        type: String,
    },
    details: {
        type: String,
    },
    price: {
        type: Number,
    },
    fathersName: {
        type: String,
    },
    std: {
        type: String,
    },
    address: {
        type: String,
    },
    contactNo: {
        type: String,
    },
    bloodGroup: {
        type: String,
    },
    child: {
        type: Array,
    },
    about: {
        type: String,
    },
    author: {
        type: String,
    },
    publisher: {
        type: String,
    },
    publishDate: {
        type: String,
    },
    authority: {
        type: String,
    },
    bookImage: {
        type: String,
    },
    authorImage: {
        type: String,
    },
    noOfPage: {
        type: String,
    },
    language: {
        type: String,
    },
    isbnNo: {
        type: String,
    },
    image: {
        type: String,
    }
},{
    timestamps: true,
    versionKey: false,
});

const detailsModel = mongoose.model("details", detailsSchema);
module.exports = detailsModel;