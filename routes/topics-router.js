const { getTopics } = require("../cotrollers/topics.controller")

const topicRouter = require("express").Router()

topicRouter.route("/").get(getTopics)

module.exports = topicRouter