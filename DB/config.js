const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@img.i7ebc.mongodb.net/${process.env.MONGODB_DATABASE}`;

// const uri = "mongodb://localhost:27017/parentchild";

mongoose.connect(uri, (err) => {
    mongoose.set("debug", true);
    if (err) return err;
    console.log(`DB ${process.env.MONGODB_DATABASE} Connected..`)
});