const express = require("express");

const { getTopics } = require("./cotrollers/topics.controller");
const { getEndpoints } = require("./cotrollers/baseCall.controller");
const { getArticleById, getArticleComments, getArticles, removeCommentById, getUsers , patchArticleById, postCommentByArticle } = require("./cotrollers/articles.controller");

const { psqlErrors, customErrors } = require("./errors");

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getArticleComments)
app.get("/api/articles", getArticles)

app.delete("/api/comments/:comment_id", removeCommentById)
app.get("/api/users", getUsers)
app.patch("/api/articles/:article_id", patchArticleById)
app.post("/api/articles/:article_id/comments", postCommentByArticle)
app.use(psqlErrors)
app.use(customErrors)

module.exports = app;