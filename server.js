const express = require("express");
const { getTopics } = require("./cotrollers/topics.controller");
const { getEndpoints } = require("./cotrollers/baseCall.controller");
const app = express();

app.get("/api/topics", getTopics)
app.get("/api", getEndpoints)

module.exports = app;