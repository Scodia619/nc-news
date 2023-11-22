const app = require("../server.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const {
  userData,
  topicData,
  commentData,
  articleData,
} = require("../db/data/test-data/index.js");
const routes = require("../endpoints.json");
const { expect } = require("@jest/globals");
require("jest-sorted");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  test("200 - gets all endpoints and examples", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(typeof endpoints).toEqual("object");
        expect(endpoints).toEqual(routes);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Received a Response", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: Resource not found based on a valid integer but no record", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: Invalid data type", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200 - Gets all articles with comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("200 - Getting all comments for a related article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        expect(comments).toBeSorted("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200 - empty array if given an article with no comments", () => {
    return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  test("404 - Article not found with valid data id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400 - Invalid id data type", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("204 - Deletes the resource", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400 - Invalid data type", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - No resource found with valid data type", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("GET: /api/users", () => {
  test("200 - Gets all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("PATCH: /api/article/:article_id", () => {
    test("200 - Updates data", () => {
      const incVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(incVotes)
        .expect(200)
        .then(({ body: {article} }) => {
          expect(article).toMatchObject({
            article_id: 1,
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: expect.any(String),
            votes: 101,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
  
    test("400 - No data given", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad request")
        })
    })
    test("400 - Incorrect Data for id", () => {
        const incVotes = { inc_votes: 1 };
        return request(app)
          .patch("/api/articles/Banana")
          .send(incVotes)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    
      test("400 - Incorrect Data", () => {
        const incVotes = { inc_votes: "one" };
        return request(app)
          .patch("/api/articles/1")
          .send(incVotes)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    
      test("404 - No article_id", () => {
        const incVotes = { inc_votes: 1 };
        return request(app)
          .patch("/api/articles/999")
          .send(incVotes)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
          });
      });
})

describe("POST: /api/articles/:article_id/comments", ()=> {
    test("201 - creates the comment", ()=>{
        const comments = {username: 'butter_bridge', body: 'This article is awesome'}
        return request(app)
        .post("/api/articles/1/comments")
        .send(comments)
        .expect(201)
        .then(({body: {comment}}) => {
            expect(comment).toMatchObject(
                {
                    body: "This article is awesome",
                    votes: 0,
                    author: "butter_bridge",
                    article_id: 1,
                    created_at: expect.any(String),
                    comment_id: 19
                  },
            )
        })
    })
    test("400 - missing data", () => {
        const comments = {username: 'butter_bridge'}
        return request(app)
        .post("/api/articles/1/comments")
        .send(comments)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    test("400 - incorrect data type article_id", () => {
        const comments = {username: 'butter_bridge',body: "This article is awesome"}
        return request(app)
        .post("/api/articles/banana/comments")
        .send(comments)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        })
    })
    test("404 - no article given with id", () => {
        const comments = {username: 'butter_bridge',body: "This article is awesome"}
        return request(app)
        .post("/api/articles/999/comments")
        .send(comments)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Article not found")
        })
    })
})
  
describe("GET /api/articles/:article_id", ()=>{
  test("200 - Gets the article and comment count", ()=>{
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body:{ article}})=>{
      expect(article).toMatchObject({
        article_id: 1,
        author: "butter_bridge",
        title: "Living in the shadow of a great man",
        body: "I find this existence challenging",
        topic: "mitch",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: 11
        });
    })
  })
  test("404: Resource not found based on a valid integer but no record", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: Invalid data type", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
})