const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { log } = require("console");

app.set('view engine', "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('views', path.join(__dirname, "/views"));

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
});

app.get('/profile', isLoogedIn , async(req,res)=>{
    let user = await userModel.findOne({email : req.user.email}).populate("posts");
   
    res.render("profile", {user});
    
})
app.post('/post', isLoogedIn , async(req,res)=>{
    let user = await userModel.findOne({email : req.user.email})
    // console.log(user);
    let {content} = req.body;
    let post = await postModel.create({
        content,
         user: user._id
        });
    // console.log(post);
    
    user.posts.push(post._id);
    await user.save();
    console.log(post);
    
    res.redirect('/profile');
})

app.post('/register', async (req, res) => {
    console.log("Registration attempt:", req.body);

    let { email, username, age, name, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) return res.send("User already registered");

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        let newUser = await userModel.create({
            email,
            username,
            age,
            name,
            password: hash
        });
        let token = jwt.sign({ email: email, userid: newUser._id }, "secretkey");
        res.cookie("token", token);
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
    }
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.send("Something went wrong");

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "secretkey");
            res.cookie("token", token);
            res.status(200).redirect("/profile");
        } else {
            res.redirect("/login");
        }
    });
});

function isLoogedIn(req,res, next){
    if(req.cookies.token ==="") res.send("You must looged in first");//checking cookie string is present or not
    else{
        let data = jwt.verify(req.cookies.token, "secretkey");
        req.user = data;
        next();
    }

}
const port = 5000;
app.listen(port, () => {
    console.log("Server is running on port 5000");
});
