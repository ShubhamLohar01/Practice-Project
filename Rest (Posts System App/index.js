const express = require("express");
const app = express();
const port = 8080;

const path = require("path");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true })); // this command for express to understand client req
app.use(methodOverride("_method")); // this command for express to understand client req

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // path is set

app.use(express.static(path.join(__dirname, "public"))); // serve static files from the public directory

let posts = [
    {
        id: uuid(),
        username: "shubham", // random posts
        content: "i love coding",
    },
    {
        id: uuid(),
        username: "shradhha",
        content: "do hard work",
    },
    {
        id: uuid(), // id always unique and in ""
        username: "rohit",
        content: "i am a coder",
    },
];

app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/posts", (req, res) => {
    let id = uuid();
    let { username, content } = req.body;
    posts.push({ id, username, content });
    res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {//patch is used to update the data
    let { id } = req.params;
    let newContent = req.body.content;
    console.log(req.body); // Add this line to check the content of req.body
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", { post });
});
app.delete("/posts/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
})

app.listen(port, () => {
    console.log("listening to port: 8080");
});

