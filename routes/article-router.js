const { getArticles, getArticleById, patchArticleById, getArticleComments, postCommentByArticle, postNewArticle, deleteArticleById } = require("../cotrollers/articles.controller");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postNewArticle);
articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById).delete(deleteArticleById);
articleRouter.route("/:article_id/comments").get(getArticleComments).post(postCommentByArticle);

module.exports = articleRouter;
