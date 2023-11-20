const { getEndpoints } = require("../models/baseCall.model")

exports.getEndpoints = (req, res, next) => {
    getEndpoints().then(responses => {
        res.status(200).send({responses})
    })
}