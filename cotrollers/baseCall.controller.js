const { getEndpoints } = require("../models/baseCall.model")

exports.getEndpoints = (req, res, next) => {
    getEndpoints().then(endpoints => {
        res.status(200).send({endpoints})
    })
}