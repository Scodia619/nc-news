const express = require("express");
const cors = require('cors')

const { psqlErrors, customErrors } = require("./errors");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json())
app.use(cors())

app.use("/api", apiRouter)

app.use(psqlErrors)
app.use(customErrors)

module.exports = app;