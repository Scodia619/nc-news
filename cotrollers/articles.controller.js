const {
  selectArticleById,
  selectArticleComments,
  selectArticles,
  deleteCommentById,
  updateArticleById,
  selectUsers,
  insertCommentByArticle
} = require("../models/articles.model");
const { getTopics } = require("../models/topics.model");

exports.getArticles = (req, res, next) => {
  const topicQuery = req.query.topic
  const sortby = req.query.sortby || 'created_at'
  const order = req.query.order || 'DESC'

  getTopics()
    .then((topics) => {
      const topicExists = topics.some((topic) => topic.slug === topicQuery);

      if((!isNaN(Number(topicQuery)))) {
        return Promise.reject({
          status: 400,
          msg: "Bad request",
        });
      }else if (topicQuery && !topicExists) {
        return Promise.reject({
          status: 404,
          msg: "Topic not found",
        })
      };

      return selectArticles(topicQuery, sortby, order.toUpperCase());
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
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
