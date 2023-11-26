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
        expect(topics).toHaveLength(4);
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
        expect(articles).toHaveLength(10);
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
        expect(comments).toHaveLength(10);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: 1,
            body: expect.any(String),
            comment_id: expect.any(Number),
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
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 1,
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400 - No data given", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
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
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("201 - creates the comment", () => {
    const comments = {
      username: "butter_bridge",
      body: "This article is awesome",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comments)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "This article is awesome",
          votes: 0,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
          comment_id: 19,
        });
      });
  });
  test("400 - missing data", () => {
    const comments = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comments)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400 - incorrect data type article_id", () => {
    const comments = {
      username: "butter_bridge",
      body: "This article is awesome",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(comments)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - no article given with id", () => {
    const comments = {
      username: "butter_bridge",
      body: "This article is awesome",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(comments)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET: /api/articles?topic=topic_name", () => {
  test("200 - Returns based on a correct topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "mitch",
            author: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("400 - incorrect Data type for query", () => {
    return request(app)
      .get("/api/articles?topic=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - topic doesnt exist", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
  test("400 - incorrect data type article_id", () => {
    const comments = {
      username: "butter_bridge",
      body: "This article is awesome",
    };
    return request(app)
      .post("/api/articles/banana/comments")
      .send(comments)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - no article given with id", () => {
    const comments = {
      username: "butter_bridge",
      body: "This article is awesome",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(comments)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200 - Gets the article and comment count", () => {
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
          comment_count: 11,
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

describe("GET /api/articles Sorting Queries", () => {
  test("200 Gets based on sorting queries", () => {
    return request(app)
      .get("/api/articles?sortby=article_id&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(10);
        expect(articles).toBeSorted("article_id", { descending: false });
      });
  });
  test("200 Given no sorting info defaults to set values", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(10);
        expect(articles).toBeSorted("created_at", { descending: true });
      });
  });
  test("404 No column name of sort query", () => {
    return request(app)
      .get("/api/articles?sortby=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort column or order");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200 - gets the correct user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("400 - Incorrect data type for username", () => {
    return request(app)
      .get("/api/users/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - No user found", () => {
    return request(app)
      .get("/api/users/scodia619")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No users found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200 - Updates and returns correct increased votes", () => {
    const incVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(incVotes)
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String),
        });
      });
  });
  test("400 - No data given", () => {
    return request(app)
      .patch("/api/comments/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400 - Incorrect Data for id", () => {
    const incVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/Banana")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("400 - Incorrect Data", () => {
    const incVotes = { inc_votes: "one" };
    return request(app)
      .patch("/api/comments/1")
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404 - No article_id", () => {
    const incVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/999")
      .send(incVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("POST /api/articles", () => {
  test("201 inserts article and responds with new article", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Football Mania has hit Anfield",
      body: "Fans flocked to the stadium today to support Liverpool vs Everton",
      topic: "football",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: "butter_bridge",
          title: "Football Mania has hit Anfield",
          body: "Fans flocked to the stadium today to support Liverpool vs Everton",
          topic: "football",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          article_id: 14,
          comment_count: 0,
        });
      });
  });
  test("201 - Defaults the image and create new article", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Football Mania has hit Anfield",
      body: "Fans flocked to the stadium today to support Liverpool vs Everton",
      topic: "football",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: "butter_bridge",
          title: "Football Mania has hit Anfield",
          body: "Fans flocked to the stadium today to support Liverpool vs Everton",
          topic: "football",
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          article_id: 14,
          comment_count: 0,
        });
      });
  });
  test("400 - Missing Data", () => {
    const newArticle = {
      title: "Football Mania has hit Anfield",
      body: "Fans flocked to the stadium today to support Liverpool vs Everton",
      topic: "football",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles Pagination", () => {
  test("200 - Gets a limit of 10 as a default value", () => {
    return request(app)
      .get("/api/articles?page=1")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(10);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: expect.any(Number),
            comment_count: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("200 - Defines the limit at 5", () => {
    return request(app)
      .get("/api/articles?page=1&limit=5&sortby=article_id&order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(5);
        expect(articles).toBeSortedBy("article_id", { descending: false });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: expect.any(Number),
            comment_count: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("200 - Gets the second page of results", () => {
    return request(app)
      .get("/api/articles?page=2&limit=5&sortby=article_id&order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(5);
        expect(articles).toBeSortedBy("article_id", { descending: false });
        let first = 6;
        let last = 11;
        articles.forEach((article) => {
          expect(article.article_id).toBe(first);
          expect(article.article_id).not.toBe(last);
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: expect.any(Number),
            comment_count: expect.any(Number),
            article_img_url: expect.any(String),
          });
          first++;
        });
      });
  });
  test("400 - Incorrect data type for limit", () => {
    return request(app)
      .get("/api/articles?limit=one&page=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - Page that cant have any articles", () => {
    return request(app)
      .get("/api/articles?page=999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Articles not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments Pagination", () => {
  test("200 - Gets a limit of 10 as a default value", () => {
    return request(app)
      .get("/api/articles/1/comments?page=1")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(10);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: 1,
            body: expect.any(String),
            comment_id: expect.any(Number),
          });
        });
      });
  });
  test("200 - Defines the limit at 5", () => {
    return request(app)
      .get(
        "/api/articles/1/comments?page=1&limit=5&sortby=article_id&order=ASC"
      )
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(5);
        expect(comments).toBeSortedBy("article_id", { descending: false });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: 1,
            body: expect.any(String),
            comment_id: expect.any(Number),
          });
        });
      });
  });
  test("200 - Gets the second page of results", () => {
    return request(app)
      .get(
        "/api/articles/1/comments?page=2&limit=5&sortby=article_id&order=ASC"
      )
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(5);
        expect(comments).toBeSortedBy("article_id", { descending: false });
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_id: 1,
            body: expect.any(String),
            comment_id: expect.any(Number),
          });
        });
      });
  });
  test("400 - Incorrect data type for limit", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=one&page=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404 - Page that cant have any comments", () => {
    return request(app)
      .get("/api/articles/1/comments?page=999")
      .expect(200)
      .then(({ body: {comments} }) => {
        expect(comments).toEqual([]);
      });
  });
});

describe("POST /api/topics", ()=>{
  test("201 - Posts new topic and returns that topic object",()=>{
    const newTopic = {slug: "Rugby League", description: "A topic to discuss the great rugby league"}
    return request(app)
    .post("/api/topics")
    .send(newTopic)
    .expect(201)
    .then(({body: topic})=>{
      expect(topic).toMatchObject({
        slug: "Rugby League",
        description: "A topic to discuss the great rugby league"
      })
    })
  })
  test("400 - Missing Data", ()=>{
    const newTopic = {slug: "Rugby Union"}
    return request(app)
    .post("/api/topics")
    .send(newTopic)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request")
    })
  })

  test("400 - Unique Violation", ()=>{
    const newTopic  = {description: 'The man, the Mitch, the legend',slug: 'mitch'}
    return request(app)
    .post("/api/topics")
    .send(newTopic)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Slug already exists")
    })
  })
})

describe("DELETE", () => {
  test("DELETE:204 responds 204 if deleted", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toMatchObject({});
      });
  });
  test("DELETE:204 should delete relatvant comments ", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(() => {
        return request(app).get("/api/articles/1/comments").expect(404);
      })
      .then(({ body}) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("DELETE:400 bad request if id not a number", () => {
    return request(app)
      .delete("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("DELETE:404 article does not exist", () => {
    return request(app)
      .delete("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});