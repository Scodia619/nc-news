const app = require('../server.js')
const request = require("supertest");
const db = require("../db/index.js");
const seed = require("../db/seed");
const { userData, topicData, commentData, articleData } = require("../db/data/test-data/index.js");