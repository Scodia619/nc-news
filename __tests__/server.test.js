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

describe("GET /api/articles/:article_id", ()=>{
    test("200: Received a Response", ()=>{
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body: {article}})=>{
            console.log(article)
            expect(article).toMatchObject({
                article_id: expect.any(Number),
                author: expect.any(String),
                title: expect.any(String),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
        })
    })
    test("404: Resource not found based on a valid integer but no record", ()=>{
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Article not found")
        })
    })
    test("400: Invalid data type", ()=>{
        return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
        })
    })
})