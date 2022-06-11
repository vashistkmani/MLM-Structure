const categoryService = require("../services/category");
const categoryModel = require("../model/category");

class school {
    constructor() {
        return {
            home: this.home.bind(this),
            getSubCategories: this.getSubCategories.bind(this),
            addItem: this.addItem.bind(this),
            getData: this.getData.bind(this),
            library: this.library.bind(this),
            viewCategories: this.viewCategories.bind(this),
            categoryDatatable: this.categoryDatatable.bind(this),
            editCategory: this.editCategory.bind(this),
            editCategoryData: this.editCategoryData.bind(this),
            deleteCategory: this.deleteCategory.bind(this),
            categoryDetails: this.categoryDetails.bind(this),
            categoryNew: this.categoryNew.bind(this),
        }
    }

    home = async (req, res) => {
        try {
            res.render("homepage");
        } catch (error) {
            res.status(400).json(String(error));
        }
    };

    categoryNew = async (req, res) => {
        try {
            let response = await categoryService.home();
            res.render("addCategory", { category: response.data, message: undefined });
        } catch (error) {
            res.status(400).json(String(error));
        }
    }

    getSubCategories = async (req, res) => {
        try {
            console.log("inside get sub categories function.")
            let response = await categoryService.getSubCategories(req);
            res.json(response);
        } catch (error) {
            res.status(400).json(String(error));
        }
    }

    addItem = async (req, res) => {
        try {
            let response = await categoryService.addItem(req);
            console.log(response);
            res.redirect("/category/new");
        } catch (error) {
            res.status(400).json(String(error));
        };
    };

    getData = async (req, res) => {
        try {
            let response = await categoryService.getData();
            if (response.status) {
                res.status(200).json(response);
            } else {
                res.status(400).json(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    library = async (req, res) => {
        try {
            res.render("addDetails");
        } catch (error) {
            res.status(400).json(String(error));
        }
    };

    viewCategories = async (req, res) => {
        try {
            res.render("viewCategories", { id: req.query.id })
        } catch (error) {
            res.status(400).json(String(error))
        }
    }

    categoryDatatable = async (req, res) => {
        try {
            let condition = {};
            if (req.query.id) {
                condition = { parentId: req.query.id };
            } else {
                condition = { parentId: null }
            };
            let data = [];
            let count = 1;
            categoryModel.find(condition).exec((err, rows) => {
                if (err) { console.log(err) }
                rows.forEach((index) => {
                    data.push({
                        category: index.category,
                        image: `<img src="${index.image}" alt="no image" width="75" height="75">`,
                        subCategory: `<a href="/view/categories/datatabel?id=${index._id}">Sub Categories</a>`,
                        action: `<a href="/categories/edit?id=${index._id}"><i class="icon-edit"></i> Edit</a> <a href="/categories/delete?id=${index._id}"><i class="icon-remove"></i> Delete</a>`
                    });
                    count++;
                    if (count > rows.length) {
                        let jsonData = JSON.stringify({ data });
                        res.send(jsonData);
                    }
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    editCategory = async (req, res) => {
        try {
            let response = await categoryService.editCategory(req);
            if (response.status) {
                console.log(response);
                res.render("editCategories", { response: response.data });
            } else {
                res.redirect("/view/categories");
            }
        } catch (error) {
            console.log(error);
        }
    };

    editCategoryData = async (req, res) => {
        try {
            let response = await categoryService.editCategoryData(req);
            console.log("response", response);
            if (response) {
                res.redirect("/view/categories");
            }
        } catch (error) {
            console.log(error)
        }
    };

    deleteCategory = async (req, res) => {
        try {
            let response = await categoryService.deleteCategory(req);
            console.log("response >>>>>>>>>>", response)
            res.redirect("/categories/view");
        } catch (error) {
            console.log(error);
        }
    };

    categoryDetails = async (req, res) => {
        try {
            let response = await categoryService.categoryDetails();
            res.render("addDetails", { data: response.data, message: undefined });
        } catch (error) {
            console.log(error);
        }
    };
}

module.exports = new school();