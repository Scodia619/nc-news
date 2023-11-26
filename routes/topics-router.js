const { getTopics, postNewTopic } = require("../cotrollers/topics.controller")

const topicRouter = require("express").Router()

topicRouter.route("/").get(getTopics).post(postNewTopic)

module.exports = topicRouter