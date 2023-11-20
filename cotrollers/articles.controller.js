const { getArticleById, selectArticleComments } = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    getArticleById(article_id).then(article => {
        res.status(200).send({article})
    }).catch(next)
}

exports.getArticles = (req, res, next) => {
    getArticles().then((articles)=>{
        res.status(200).send({articles})
    })
}

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    selectArticleComments(article_id).then((comments)=>{
        res.status(200).send({comments})
    }).catch(next)
}