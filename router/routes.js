const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        let filename = file.originalname;
        cb(null, filename);
    }
});

var upload = multer({ storage: storage });

// moduel import ..................
let categoryCotroller = require("../controller/category");
let detailsController = require("../controller/details");

// routes .....
router.get("/", categoryCotroller.home);
router.post("/addItem", upload.single("image"), categoryCotroller.addItem);
router.get("/getData", categoryCotroller.getData);
router.post("/getSubcategory", categoryCotroller.getSubCategories);
router.get("/category/new", categoryCotroller.categoryNew)
router.get("/categories/addDetails", categoryCotroller.categoryDetails);
router.post("/categories/addDetails", upload.single("image"), detailsController.addDetailsData);
router.get("/categories/view", categoryCotroller.viewCategories);
router.get("/view/categories/datatabel", categoryCotroller.categoryDatatable);
router.get("/categories/edit", categoryCotroller.editCategory);
router.post("/categories/edit", upload.single("image"), categoryCotroller.editCategoryData);
router.get("/categories/delete", categoryCotroller.deleteCategory);

module.exports = router;