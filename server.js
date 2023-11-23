const express = require("express");

const { getTopics } = require("./cotrollers/topics.controller");
const { getEndpoints } = require("./cotrollers/baseCall.controller");
const { getArticleById, getArticleComments, getArticles, removeCommentById, getUsers , patchArticleById, postCommentByArticle } = require("./cotrollers/articles.controller");

const { psqlErrors, customErrors } = require("./errors");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json())

app.use("/api", apiRouter)

app.use(psqlErrors)
app.use(customErrors)

module.exports = app;