const { getArticleById } = require("../models/articles.model")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    getArticleById(article_id).then(article => {
        console.log("Article: ",article)
        res.status(200).send({article})
    }).catch(next)
}