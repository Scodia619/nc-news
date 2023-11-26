const { getTopics, insertNewTopic } = require("../models/topics.model")

exports.getTopics = (req,res,next) => {
    getTopics().then((topics) => {
        res.status(200).send({topics})
    })
}

exports.postNewTopic = (req, res, next) => {
    const {slug, description} = req.body
    insertNewTopic(slug, description).then(topic => {
        res.status(201).send(topic)
    }).catch(next)
}