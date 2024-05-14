require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const app = express();

const globals = require('./globals.js');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.SESSION_DB,
  };
  
const sessionStore = new MySQLStore(sessionOptions);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
    })
);

const defaultRoutes = require("./routes/defaultRoutes");
const publicRoutes = require("./routes/publicRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use((req, res, next) => {
    const user = req.session.user;
    res.locals.globals = globals;
    if (!user) return next();
    res.locals.authUser = user;
    next();
});
  
app.use("/", defaultRoutes);
app.use("/", publicRoutes);
app.use("/", postRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);

app.use((req, res) => {
    res.status(404).render("statuses/404");
});
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).render("statuses/500");
});

app.listen(3000);