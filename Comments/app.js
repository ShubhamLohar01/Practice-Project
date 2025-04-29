const express = require('express');
const path = require('path');
const app = express();
const userModel = require("./models/user"); // Corrected path
const commentModel = require("./models/Comment"); // Corrected path
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get('/',(req,res)=>{
    res.render('index');
});
//---------------------* above is setup code

//------Suggest strong passwords
function validatePassword(password) {
    // Minimum 8 characters
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long" };
    }
    
    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter" };
    }
    
    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one lowercase letter" };
    }
    
    // At least one number
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "Password must contain at least one number" };
    }
    
    // At least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: "Password must contain at least one special character" };
    }
    
    return { valid: true, message: "Password is strong" };
}
//----------------------------------------------------------

app.get('/login',(req,res)=>{
    res.render('login');
});
app.get('/logout',(req,res)=>{
    res.cookie("token","");//to remove the token
    res.redirect('/login');
})

app.get('/Dashboard', isLoggedIn, async (req, res) => {
    try {
        // Fetch all comments and populate the author field
        let comments = await commentModel.find({})
            .populate({ path: "author", select: "username email" }) // Populate author details
            .sort({ createdAt: -1 }); // Sort comments by creation date (newest first)

        // Fetch the logged-in user for role-based actions (e.g., delete button visibility)
        let user = await userModel.findById(req.user.userid);

        res.render('Dashboard', { user, comments }); // Pass both user and all comments to the template
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/register',async(req,res)=>{
    console.log("Registration attempt:",req.body);

    let {email,username,age,name,password , role} = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.send("Already registered");

    const passwordValid = validatePassword(password);
    if(!passwordValid.valid){
        return res.send(`
                <script>
                alert("${passwordValid.message}");
                window.location.href = "/register";
                </script>
            `);
    }//latter just add real time functionality in dom

    try{
        const salt = await bcrypt.genSalt(10);  
        const hash = await bcrypt.hash(password,salt);
        let newUser = await userModel.create({
            email,
            username,
            age,
            name,
            role: role || "user",
            password: hash,
        });

        console.log("User created successfully:",newUser);
        let token = jwt.sign({ email: email, userid: newUser._id }, "secretkey");
        res.cookie("token", token);
        res.redirect('/login');
    }catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
    }
});
app.post('/comment' ,isLoggedIn , async(req , res)=>{
    let user = await userModel.findOne({email : req.user.email});
    let {content} = req.body;
    let comment  = await commentModel.create({
        content ,
        author : user._id
    })
    user.comments.push(comment._id);
    await user.save();
    res.redirect('/Dashboard');
});

app.post('/login',async(req,res)=>{
    let {email,password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.send("User not found");

    bcrypt.compare(password,user.password , (err,result)=>{
        if(result){
            let token = jwt.sign({ email: email, userid: user._id }, "secretkey");
            res.cookie("token" , token);
            res.status(200).redirect('/Dashboard');
        }else{
            res.redirect("/login");
        }
        
    })
});

//Crud operations for comments
app.post('/comment/:id/like' , async (req, res) => {
    try {
    let comment = await commentModel.findById(req.params.id); 
    if (!comment) return res.status(404).send("Comment not found");
    comment.likes += 1; // Increment likes
    await comment.save(); // Save the updated comment
    res.redirect('/Dashboard'); // Redirect to the dashboard or wherever you want
} catch (err) {
    console.error(err);
    res.status(500).send("Error liking the comment");
}
});

app.post('/comment/:id/edit', isLoggedIn, async (req, res) => {
    try {
        let { content } = req.body;
        let comment = await commentModel.findById(req.params.id);

        if (!comment) return res.status(404).send("Comment not found");
        if (comment.author.toString() !== req.user.userid) {
            return res.status(403).send("Unauthorized: You can only edit your own comments");
        }

        comment.content = content;
        await comment.save();

        res.redirect('/Dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating the comment");
    }
});
app.post('/comment/:id/delete' , isLoggedIn ,async (req,res)=>{
    try{
        let user = await userModel.findById(req.user.userid)
        if(user.role !== "admin"){
            res.status(403).send("Unauthorized: You cannot delete your own comments");
        }
        await commentModel.findByIdAndDelete(req.params.id);
        res.redirect("/Dashboard")
    }catch{
        console.error(err);
        res.status(500).send("Error deleting the comment");s
    }
})



function isLoggedIn(req, res, next) {
    if (!req.cookies.token || req.cookies.token === "") {
       return res.send(`
        <script>
        alert("Please login first");
        window.location.href = "/login";
        </script>
        `)
    }
    try {
        let data = jwt.verify(req.cookies.token, "secretkey");
        req.user = data;
        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        res.status(401).send("Invalid or expired token");
    }
}