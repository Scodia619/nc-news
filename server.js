const express = require("express");

const { getTopics } = require("./cotrollers/topics.controller");
const { getEndpoints } = require("./cotrollers/baseCall.controller");
const { getArticleById, getArticleComments } = require("./cotrollers/articles.controller");

const {customErrors, psqlErrors} = require('./errors.js')

const app = express();

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getArticleComments)

app.use(psqlErrors)
app.use(customErrors)

module.exports = app;