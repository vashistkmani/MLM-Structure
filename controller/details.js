
const detailsService = require("../services/details");

class detailsController {
    constructor() {
        return {
            addDetailsData: this.addDetailsData.bind(this),
        }
    }

    addDetailsData = async (req, res) => {
        try {
            let response = await detailsService.addDetailsData(req);
            if (response) {
                res.redirect("/categories/addDetails");
            } else {
                res.status(400).json(response);
            }
        } catch (error) {
            console.log("error in controller", error);
            res.status(400).json(String(error));
        }
    }
}

module.exports = new detailsController();