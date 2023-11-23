const { getUsers } = require('../cotrollers/articles.controller')
const { getUsersById } = require('../cotrollers/users.controller')

const userRouter = require('express').Router()

userRouter.route("/").get(getUsers)
userRouter.route("/:username").get(getUsersById)

module.exports = userRouter