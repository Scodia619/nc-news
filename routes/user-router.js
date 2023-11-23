const { getUsers } = require('../cotrollers/articles.controller')

const userRouter = require('express').Router()

userRouter.route("/").get(getUsers)

module.exports = userRouter