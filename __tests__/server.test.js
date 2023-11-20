const app = require('../server.js')
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const { userData, topicData, commentData, articleData } = require("../db/data/test-data/index.js");
const endpoints = require('../endpoints.json')

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("GET /api/topics", ()=>{
    test("200", ()=>{
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body: {topics}}) => {
            expect(topics).toHaveLength(3)
            topics.forEach(topic => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe("GET /api", ()=>{
    test("200 - gets all endpoints and examples", ()=>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body: {endpoints}})=>{
            expect(typeof endpoints).toEqual('object')
            expect(endpoints).toEqual(endpoints)
        })
    })
})