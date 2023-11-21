const { getArticleById, updateArticleById } = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    getArticleById(article_id).then(article => {
        res.status(200).send({article})
    }).catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    updateArticleById(article_id, inc_votes).then((article) => {
        res.status(200).send({article})
    }).catch(next)
}