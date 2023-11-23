const { getEndpoints } = require("../cotrollers/baseCall.controller");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");
const topicRouter = require("./topics-router");
const userRouter = require("./user-router");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
