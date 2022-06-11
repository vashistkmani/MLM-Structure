const mongoose = require("mongoose");

const schoolSchema = mongoose.Schema({
    parentId: {
        type: mongoose.Types.ObjectId,
        default: null,
    },
    chain: {
        type: Array,
    },
    category: {
        type: String,
    },
    image: {
        type: String,
    }
}, {
    timestamps: true,
    versionKey: false,
});

const bookModel = mongoose.model("school", schoolSchema);
module.exports = bookModel;