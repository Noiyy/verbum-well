const express = require("express");
const router = express.Router();
const multer = require("multer");
const dbHandler = require("../util/dbHandler");
const { fileFilter, avatarStorage } = require("../util/fileUpload");
let avatarUpload = multer({ storage: avatarStorage, fileFilter, limits: { fileSize: "10MB" } });

router.get("/user/:id", async (req, res) => {
    if (!req.session.user) return res.status(401).render("statuses/401");
    const userId = req.params.id;
    try {
        const userData = await dbHandler.getUserDetail(userId);

        if (userData.length > 0) {
            const formattedDate = res.locals.globals.epochSecToDateString(userData[0].dateCreatedS);

            userData[0].dateCreated = formattedDate;
            userData[0].isAdmin = userData[0].isAdmin ? true : false;
            userData[0].hasPremium = userData[0].hasPremium ? true : false;
            console.log("user", userData[0]);

            return res.render("user", {user: userData[0]});
        }
    } catch (error) {
        console.log(error.message);
    }
});

router.post("/changeUserAvatar/:id", avatarUpload.single("avatarImg"), async (req, res) => {
    const userId = req.params.id;
    let imageLocation = "";
    if (req.file.path) {
        imageLocation = req.file.path.substring(req.file.path.indexOf("\\") + 1);
        if (userId == res.locals.authUser.id) res.locals.authUser.avatarLocation = imageLocation;
    }
    try {
        await dbHandler.updateUserAvatar(imageLocation, userId);
        console.log("changed user avatar successfully!");
        req.session.save(() => {
            res.redirect(`/user/${userId}`);
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).render("statuses/500");
    }
});

module.exports = router;
