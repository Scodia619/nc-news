const {
  selectArticleById,
  selectArticleComments,
  selectArticles,
  updateArticleById,
  selectUsers,
  insertCommentByArticle,
  insertNewArticle,
  removeArticleById,
} = require("../models/articles.model");
const { getTopics } = require("../models/topics.model");

exports.getArticles = (req, res, next) => {
  const topicQuery = req.query.topic;
  const sortby = req.query.sortby || "created_at";
  const order = req.query.order || "DESC";
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;

  getTopics()
    .then((topics) => {
      if (topicQuery) {
        const topicExists = topics.some((topic) => topic.slug === topicQuery);
        if (!topicExists && !isNaN(Number(topicQuery))) {
          return Promise.reject({
            status: 400,
            msg: "Bad request",
          });
        }else if(!topicExists){
          return Promise.reject({
            status: 404,
            msg: "Topic not found",
          });
        }
      }

      return selectArticles(
        topicQuery,
        sortby,
        order.toUpperCase(),
        limit,
        page
      );
    })
    .then(({articles, total_count}) => {
      res.status(200).send({ articles, total_count });
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

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const limit = req.query.limit || 10
  const page = req.query.page || 1
  selectArticleComments(article_id, parseInt(limit), parseInt(page))
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  selectArticleById(article_id)
    .then((rows) => {
      return insertCommentByArticle(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.postNewArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  insertNewArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      return selectArticleById(article.article_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(() => {
      return removeArticleById(article_id);
    })
    .then(() => res.sendStatus(204))
    .catch(next);
};