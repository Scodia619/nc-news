const { getEndpoints } = require("../models/baseCall.model")

exports.getEndpoints = (req, res, next) => {
    getEndpoints().then(data => {
        res.status(200).send(data)
    })
}