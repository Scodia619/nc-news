const app = require('../server.js')
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const { userData, topicData, commentData, articleData } = require("../db/data/test-data/index.js");

describe("Dummy Test", ()=>{
    test("Dummy Test", ()=>{
        expect(1).toBe(1)
    })
})