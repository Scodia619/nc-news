const express = require("express");

const { getTopics } = require("./cotrollers/topics.controller");
const { getEndpoints } = require("./cotrollers/baseCall.controller");
const { getArticleById, getArticleComments, getArticles, removeCommentById, getUsers } = require("./cotrollers/articles.controller");

const { psqlErrors, customErrors } = require("./errors");

const app = express();

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getArticleComments)
app.get("/api/articles", getArticles)

app.delete("/api/comments/:comment_id", removeCommentById)
app.get("/api/users", getUsers)

app.use(psqlErrors)
app.use(customErrors)

module.exports = app;