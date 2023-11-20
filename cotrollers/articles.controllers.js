const { getArticleById, getArticles } = require("../models/articles.models.js")

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