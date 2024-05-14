const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const dbHandler = require("../util/dbHandler");

router.post("/signUp", async (req, res) => {
    try {
        const {name, email, password, passwordRepeat } = req.body;
        const inputData = {
            ...req.body
        };
        console.log(inputData);
      
        if (
            passwordRepeat != password ||
            password.trim().length < 8 ||
            !email.includes("@")
        ) {
            console.log("invalid input data");
            inputData.errorMessage = "Invalid input data";
            return;
        }
      
        const user = await dbHandler.getUserByEmail(email);
        if (user.length > 0) { console.log("email is in use"); }
        if (inputData.errorMessage) { return; }
        console.log("user:", user);
      
        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 1000, 64, "sha512")
            .toString("hex");
      
        const dateCreatedMs = Math.round(new Date().getTime());
        const dateCreatedS = dateCreatedMs/1000;
        console.log("date:", dateCreatedS);
        try {
             await dbHandler.createUser([name, hashedPassword, salt, email, dateCreatedS]);
             console.log("created user successfully!");
        } catch (error) {
            console.log(error.message);
            return res.status(500).render("500");
        }
    } catch (error) {
        console.log("?", error.message);
    }
});

router.post("/signIn", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("bbb", email, password);
        try {
            const user = await dbHandler.getUserByEmail(email);
            if (user.length === 0) {
                console.log("User not found!");
            }
            const hashedPassword = crypto
                .pbkdf2Sync(password, user[0].salt, 1000, 64, "sha512")
                .toString("hex");
            if (user[0].password === hashedPassword) {
                const formattedDate = res.locals.globals.epochSecToDateString(user[0].dateCreatedS);

                req.session.user = {
                    id: user[0].id,
                    email: user[0].email,
                    name: user[0].name,
                    isAdmin: user[0].isAdmin ? true : false,
                    hasPremium: user[0].hasPremium ? true : false,
                    dateCreatedS: user[0].dateCreatedS,
                    dateCreated: formattedDate,
                    avatarLocation: user[0].avatarLocation
                };
                req.session.save(() => {
                    res.redirect("/");
                });
            } else {
                console.log("Passwords don't match!");
            }
        } catch (error) {
          console.log(error.message);
          return res.status(500).render("500");
        }
    } catch (error) {
        console.log("???", error.message);
    }
});
  
router.post("/logout", (req, res) => {
    req.session.user = null;
    req.session.save(() => {
        res.redirect("/");
    });
});

module.exports = router;