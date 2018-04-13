const express = require("express");
const app = express();
const path = require("path");
const uuid = require("node-uuid");
const bodyParser = require("body-parser");
const isLoggedin = require("./middleware/isLoggedin");
const session = require("express-session");

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

const users = {};
const id = uuid.v4();
const id2 = uuid.v4();
const id3 = uuid.v4();

users[id] = { id, name: "foo" };
users[id2] = { id: id2, name: "bar" };
users[id3] = { id: id3, name: "baz" };

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/welcome", isLoggedin, (req, res) => {
  res.render("welcome");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== "user" || password !== "password") {
    return res.render("login", { error: "Invalid username and password" });
  }

  req.session.userId = uuid.v4();

  res.redirect("/welcome");
});

app.get("/users", (req, res) => {
  res.json(Object.values(users));
});

app.get("/users/:id", (req, res) => {
  res.json(users[req.params.id]);
});

app.post("/users", (req, res) => {
  const { name } = req.query;
  const id = uuid.v4();
  users[id] = { id, name };
  res.json(users[id]);
});

module.exports = app;
