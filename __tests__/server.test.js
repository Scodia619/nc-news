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
            expect(article).toMatchObject({
                article_id: 1,
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
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

describe("PATCH: /api/articles/:article_id", ()=>{
    test("200: Returned updated article",()=>{
        const incVotes = {inc_votes: 1}
        return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(200)
        .then(({body: {article}})=> {
            expect(article).toMatchObject({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                votes: 101,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    })
    test("400: Incorrect Data type", ()=>{
        const incVotes = {inc_votes: 'one'}
        return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(400)
        .then(({body})=> {
            expect(body.msg).toBe("Bad request")
        })
    })
    test("400: No data Given", ()=>{
        return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
        })
    })
    test("404: No article Found", ()=>{
        const incVotes = {inc_votes: 1}
        return request(app)
        .patch("/api/articles/999")
        .send(incVotes)
        .then(({body})=>{
            expect(body.msg).toBe("Article not found")
        })
    })
})