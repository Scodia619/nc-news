const {
  selectArticleById,
  selectArticleComments,
  selectArticles,
  deleteCommentById,
  updateArticleById,
  selectUsers,
  insertCommentByArticle
} = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
    const {comment_id} = req.params
    deleteCommentById(comment_id).then(()=>{
        res.send(204)
    }).catch(next)
}

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
}

exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    updateArticleById(article_id, inc_votes).then((article) => {
        res.status(200).send({article})
    }).catch(next)
}

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    selectArticleComments(article_id).then((comments)=>{
        res.status(200).send({comments})
    }).catch(next)
}

exports.postCommentByArticle = (req, res, next) => {
  const {article_id} = req.params
  const {username, body} = req.body
  selectArticleById(article_id).then((rows)=>{
    return insertCommentByArticle(article_id, username, body)
  }).then((comment) => {
    res.status(201).send({comment})
  }).catch(next)
}
