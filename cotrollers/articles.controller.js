const { selectArticleById, selectArticleComments, selectArticles, deleteCommentById } = require("../models/articles.model")

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles)=>{
        res.status(200).send({articles})
    })
}

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    selectArticleComments(article_id).then((comments)=>{
        res.status(200).send({comments})
    }).catch(next)
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    selectArticleById(article_id).then(article => {
        res.status(200).send({article})
    }).catch(next)
}

exports.removeCommentById = (req, res, next) => {
    const {comment_id} = req.params
    deleteCommentById(comment_id).then(()=>{
        res.send(204)
    }).catch(next)
}