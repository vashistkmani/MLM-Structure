// Package Required ....................................................
const mongoose = require("mongoose");

// Model Required .......................................................
const categoriesModel = require("../model/category");
const detailsModel = require("../model/details");

class detailsService {
    constructor() {
        return {
            addDetailsData: this.addDetailsData.bind(this),
        }
    }

    addDetailsData = async (req) => {
        try {
            let { parentId, name, details, price, fathersName, std, address, contactNo, bloodGroup, about, author, publisher, publishDate, authority, bookImage, authorImage, noOfPage, language, isbnNo, } = req.body;
            let image = `/images/${req.file.filename}`;
            console.log("image", image);
            console.log("req.body >>>>>>>", req.body);
            if (parentId && mongoose.Types.ObjectId.isValid(parentId) && (name || details || price || fathersName || std || address || contactNo || bloodGroup || about || author || publisher || publishDate || authority || bookImage || authorImage || noOfPage || language || isbnNo || image)) {
                let chain = await categoriesModel.findOne({ _id: parentId });
                if (chain.chain && Array.isArray(chain.chain) && chain.chain.length > 0) {
                    chain = chain.chain;
                    chain.push(mongoose.Types.ObjectId(parentId));
                } else {
                    chain = [];
                    chain.push(mongoose.Types.ObjectId(parentId));
                };
                let data = detailsModel({ parentId, name, details, price, fathersName, std, address, contactNo, bloodGroup, chain, about, author, publisher, publishDate, authority, bookImage, authorImage, noOfPage, language, isbnNo, image });
                data = await data.save();
                return {
                    message: "Data Added..",
                    status: true,
                    data: data,
                }
            };
            return {
                message: "Unable to add Data",
                status: false,
                data: {},
            };
        } catch (error) {
            console.log("error in services", error);
            return {
                message: String(error),
                status: false,
                data: {},
            };
        };

    }
}

module.exports = new detailsService();