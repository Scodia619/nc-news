const app = require('../server.js')
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const { userData, topicData, commentData, articleData } = require("../db/data/test-data/index.js");
const endpoints = require('../endpoints.json')
require('jest-sorted');

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

describe("GET: /api/articles/:article_id/comments", ()=>{
    test("200 - Getting all comments for a related article",()=>{
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({body: {comments}}) => {
            expect(comments).toHaveLength(11)
            expect(comments).toBeSorted("created_at", {descending: true})
            comments.forEach(comment => {
                expect(comment).toMatchObject({
                    comment_id : expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
            })
        })
    })
    test("200 - empty array if given an article with no comments", ()=> {
        return request(app)
        .get("/api/articles/13/comments")
        .expect(200)
        .then(({body: {comments}})=> {
            expect(comments).toEqual([])
        })
    })
    test("404 - Article not found with valid data id",()=>{
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Article not found")
        })
    })
    test("400 - Invalid id data type", ()=>{
        return request(app)
        .get("/api/articles/banana/comments")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
        })
    })
})