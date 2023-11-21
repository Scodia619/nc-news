const express = require("express");

const { getTopics } = require("./cotrollers/topics.controller");
const { getEndpoints } = require("./cotrollers/baseCall.controller");
const { getArticleById, patchArticleById } = require("./cotrollers/articles.controller");

const {customErrors, psqlErrors} = require('./errors.js')

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)
app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", patchArticleById)

app.use(psqlErrors)
app.use(customErrors)

module.exports = app;