const { getTopics } = require("../models/topics.model")

exports.getTopics = (req,res,next) => {
    getTopics().then((rows) => {
        res.status(200).send({topics: rows})
    })
}