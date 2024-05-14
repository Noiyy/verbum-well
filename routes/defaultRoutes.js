const express = require("express");
const router = express.Router();

const dbHandler = require("../util/dbHandler");

router.get("/", async (req, res) => {
  const posts = await dbHandler.getPosts();
  const users = await dbHandler.getUsers();
  const comments = await dbHandler.getComments();
  const newestPosts = posts.reverse().slice(0,4);

  res.render("index", {newestPosts, postsCount: posts.length, usersCount: users.length, commentsCount: comments.length});
});

// router.get("/about", (req, res) => {
//   res.render("about");
// });

// router.get("/contact", (req, res) => {
//   res.render("contact");
// });

module.exports = router;
