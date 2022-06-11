//Package reQuired .....................................................................
let mongoose = require("mongoose");
const fs = require("fs");

//Model Required .......................................................................
const categoriesModel = require("../model/category");
const detailsModel = require("../model/details");

// Servicess ...........................................................................
class categoryService {
    constructor() {
        return {
            home: this.home.bind(this),
            getSubCategories: this.getSubCategories.bind(this),
            addItem: this.addItem.bind(this),
            getData: this.getData.bind(this),
            subCategories: this.subCategories.bind(this),
            getCategories: this.getCategories.bind(this),
            editCategory: this.editCategory.bind(this),
            editCategoryData: this.editCategoryData.bind(this),
            deleteCategory: this.deleteCategory.bind(this),
            categoryDetails: this.categoryDetails.bind(this),
        }
    };
    // get all category and sub Category.
    home = async () => {
        try {
            let data = await categoriesModel.find();
            let result = [];
            let parent = data.filter(i => i.parentId == null);
            function CATT(parent) {
                for (let i of parent) {
                    if (i.category) {
                        let length = i.chain.length;
                        let underScore = "_".repeat(length);
                        let newString = underScore.concat(i.category)
                        result.push({ id: i._id, category: newString });
                        let child = data.filter(j => String(i._id) == String(j.parentId));
                        if (child.length > 0 && Array.isArray(child)) {
                            CATT(child);
                        };
                    } else {
                        continue;
                    }
                }
            };
            CATT(parent);
            if (data && Array.isArray(data) && data.length > 0) {
                return {
                    message: "Data get Successfully",
                    status: true,
                    data: result,
                }
            }
            return {
                message: "no data found",
                status: false,
                data: {}
            }
        } catch (error) {
            return {
                message: String(error),
                status: false,
                data: {},
            }
        }
    };

    // get Sub Categories   ................................
    getSubCategories = async (req) => {
        try {
            let id = req.body.id;
            let response = await categoriesModel.find({ parentId: id });
            if (response && Array.isArray(response) && response.length > 0) {
                return {
                    message: "Category found",
                    status: true,
                    data: response,
                }
            }
            return {
                message: "no sub category found",
                status: false,
                data: {},
            }
        } catch (error) {
            return {
                message: String(error),
                status: false,
                data: {},
            }
        }
    }

    // Create Category and sub Category ...........................
    addItem = async (req) => {
        try {
            console.log("req.body >>>>>..", req.body);
            let { parentId, category } = req.body;
            let image = `/images/${req.file.filename}`;
            if (category && !parentId) {
                category = category.toLowerCase().trim();
                let chain = [];
                category = categoriesModel({ category, chain, image });
                category = await category.save();
                return {
                    message: "New Category added",
                    status: true,
                    data: category,
                };
            } else if (category && parentId && mongoose.Types.ObjectId.isValid(parentId)) {
                category = category.toLowerCase().trim();
                let isAvailabe = await categoriesModel.findOne({ parentId, category });
                if (!isAvailabe && isAvailabe !== {}) {
                    let chain = await categoriesModel.findOne({ _id: parentId });
                    if (chain.chain && Array.isArray(chain.chain) && chain.chain.length > 0) {
                        chain = chain.chain;
                        chain.push(mongoose.Types.ObjectId(parentId));
                    } else {
                        chain = [];
                        chain.push(mongoose.Types.ObjectId(parentId));
                    };
                    category = categoriesModel({ parentId, category, chain: chain, image });
                    category = await category.save();
                    return {
                        message: "New Sub Category Created ",
                        status: true,
                        data: category,
                    }
                }
                return {
                    message: "Category already Exist",
                    status: false,
                    data: {}
                }
            }
            return {
                message: "Required Catergory Name",
                status: false,
                data: {}
            }
        } catch (error) {
            return {
                message: String(error),
                status: false,
                data: {},
            }
        };
    };

    // get all category and his sub Category ......................................
    getData = async (req, res) => {
        try {
            let document = await categoriesModel.find();
            let data = document.filter(i => i.parentId == null);
            let tree = [];
            if (data && Array.isArray(data) && data.length > 0) {
                for (let i of data) {
                    let subCat = await this.subCategories(i, document);
                    tree.push(subCat);
                };
            };
            return {
                message: "Data get Sucessfully",
                status: true,
                tree
            }
        } catch (error) {
            console.log(error);
        }
    };
    // to find all sub Category of getData ..............................
    subCategories = async (category, document) => {
        try {
            let data = document.filter(j => String(j.parentId) == String(category._id));
            category.child = data;
            if (data && Array.isArray(data) && data.length > 0) {
                for (let j of data) {
                    await this.subCategories(j, document);
                }
            }
            return category;
        } catch (error) {
            console.log(error);
        }

    };

    // to find all parent category.
    getCategories = async (req) => {
        try {
            let result = await categoriesModel.find({ parentId: null });
            if (Array.isArray(result) && result.length > 0) {
                return {
                    message: "Data Fetched Successfully",
                    status: true,
                    data: result,
                }
            };  
            return {
                message: "No data found",
                status: false,
                data: {}
            };
        } catch (error) {
            console.log(error);
        }
    };

    // to get details for edit category details..........................................
    editCategory = async (req) => {
        try {
            let id = req.query.id;
            let result = await categoriesModel.findOne({ _id: id });
            if (result) {
                return {
                    message: "Record Found",
                    status: true,
                    data: result,
                }
            } return {
                message: "No Data Found",
                status: false,
                data: {},
            }
        } catch (error) {
            console.log(error);
        }
    };
    // to update edited category data .......................................
    editCategoryData = async (req) => {
        try {
            let { id, category, } = req.body;
            category = category.toLowerCase().trim();
            if (req.file) {
                let image = `/images/${req.file.filename}`;
                let data = await categoriesModel.findOne({ _id: id });
                if (data) {
                    if (fs.existsSync(`public/${data.image}`)) {
                        fs.unlinkSync(`public/${data.image}`);
                        console.log(" >>>>>>>>>>> deleted <<<<<<<<<<<<<<");
                    }
                    let result = await categoriesModel.findOneAndUpdate({ _id: id }, { $set: { category, image } });
                    if (result) {
                        return {
                            message: "update sucessfull",
                            status: true,
                            data: {}
                        }
                    }
                    return {
                        message: "update Failed",
                        status: false,
                        data: {}
                    }
                }
            } else {
                let result = await categoriesModel.findOneAndUpdate({ _id: id }, { $set: { category } });
                if (result) {
                    return {
                        message: "updated successfully",
                        status: true,
                        data: {},
                    }
                }
                return {
                    message: "update error",
                    status: false,
                    data: {}
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    // to delete category and his all sub Category ..............................
    deleteCategory = async (req) => {
        try {
            let id = req.query.id;
            let result = await categoriesModel.find({ parentId: id });
            if (result && result.length > 0 && Array.isArray(result)) {
                async function deleteCategory(result) {
                    for (let i of result) {
                        let result = await categoriesModel.find({ parentId: i._id });
                        if (result && result.length > 0 && Array.isArray(result)) {
                            await deleteCategory(result);
                        }
                        if (fs.existsSync(`public/${i.image}`)) {
                            fs.unlinkSync(`public/${i.image}`);
                            console.log(" >>>>>>>>>>>inside deleted <<<<<<<<<<<<<<");
                        }
                        await categoriesModel.findOneAndDelete({ _id: i._id });
                    }
                }
                deleteCategory(result);
            }
            let i = await categoriesModel.findOne({ _id: id });
            if (fs.existsSync(`public/${i.image}`)) {
                fs.unlinkSync(`public/${i.image}`);
                console.log(" >>>>>>>>>>> Outside deleted <<<<<<<<<<<<<<");
            }
            await categoriesModel.findOneAndDelete({ _id: id });
            return {
                message: "Data Deleted",
                status: true,
                data: {}
            }
        } catch (error) {
            console.log(error);
        }
    };

    // to find all Parent catgory ................................................
    categoryDetails = async () => {
        try {
            let data = await categoriesModel.find({ parentId: null });
            if (data && data.length > 0 && Array.isArray(data)) {
                return {
                    message: "Category found",
                    status: true,
                    data: data,
                }
            }
            return {
                message: "Category not found",
                status: false,
                data: {},
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new categoryService();