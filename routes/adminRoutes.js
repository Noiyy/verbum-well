const express = require("express");
const router = express.Router();

const dbHandler = require("../util/dbHandler");

router.get("/adminPanel", async (req, res) => {
    if (!req.session.user) return res.status(401).render("statuses/401");
    else if (!req.session.user.isAdmin) return res.status(403).render("statuses/403");

    try {
        const users = await dbHandler.getUsers();
        const posts = await dbHandler.getPosts();
        const comments = await dbHandler.getComments();

        users.sort((a, b) => a.id - b.id);
        posts.sort((a, b) => a.id - b.id);
        comments.sort((a, b) => a.id - b.id);

        res.render("adminPanel", { users, posts, comments });
    } catch (error) {
        console.log(error.message);
        return res.status(500).render("statuses/500");
    }
});

module.exports = router;
