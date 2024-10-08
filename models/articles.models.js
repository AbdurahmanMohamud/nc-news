const db = require("../db/connection");

const findArticle = (id) => {
  return db
    .query(
      `SELECT * FROM articles
        WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          message: "This id does not exist",
        });
      else return rows;
    });
};

const findArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count
     FROM articles
     LEFT JOIN comments ON articles.article_id = comments.article_id
     GROUP BY articles.article_id
     ORDER BY articles.created_at DESC;
      `
    )
    .then(({ rows }) => {
      return rows;
    });
};

const findCommentsById = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: "This id does not exist",
        });
      else return rows;
    });
};

const addCommentById = (body, article_id, username) => {
  if (!body || !username) {
    return Promise.reject({
      status: 400,
      msg: "comment body or username missing",
    });
  }

  return db
    .query(
      `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const changeArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if(rows.length===0) return Promise.reject({
        status: 404,
        msg: "not found",
      })
      else return rows[0];
    });
};

module.exports = {
  findArticle,
  findArticles,
  findCommentsById,
  addCommentById,
  changeArticleById,
};
