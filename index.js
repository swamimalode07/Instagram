const express = require("express");
const fs = require('fs');
const path = require('path');
const methodOverride = require('method-override');
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 8080;

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let posts = [
    {
        img: "https://images.lifestyleasia.com/wp-content/uploads/sites/2/2022/11/21110827/Untitled-design-2022-11-21T083807.566.jpg",
        id: uuidv4(),
        username: "Swami",
        caption: "GOAT's",
        likes: 1000
    },
    {
        img: "https://img.allfootballapp.com/www/M00/3A/1B/720x-/-/-/CgAGVWOge8CAFNljAAElzgMhK5Q817.jpg.webp",
        id: uuidv4(),
        username: "Swami",
        caption: "Vamos Argentina",
        likes: 390
    },
    {
        img: "https://media.allure.com/photos/6290f260fbf12093193b08ee/1:1/w_354%2Cc_limit/5-27%2520olivia%2520rodrigo.jpg",
        id: uuidv4(),
        username: "Olivia",
        caption: "Deja vu' Out now ",
        likes: 200
    },
    {
        img: "https://th-i.thgim.com/public/entertainment/movies/g7tgsr/article68377623.ece/alternates/FREE_1200/Bieber.jpg",
        id: uuidv4(),
        username: "Justin Bieber",
        caption: "Ambani wedding Night",
        likes: 800
    },
    {
        img: "https://static.standard.co.uk/2023/08/14/14/GettyImages-1249539065.jpg?width=1200&height=900&fit=crop",
        id: uuidv4(),
        username: "Cristiano Ronaldo",
        caption: "Champion",
        likes: 400
    },
    
];

app.get("/home", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/home/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/home", upload.single('img'), (req, res) => {
    let { username, caption } = req.body;
    let id = uuidv4();
    let img = `/uploads/${req.file.filename}`;
    posts.push({ id, username, img, caption });
    res.redirect("/home");
});

app.post("/home/:id/like", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    if (post) {
        post.likes = (post.likes || 0) + 1;
        res.redirect("/home");
    } else {
        res.status(404).send("Post not found");
    }
});

app.get("/home/:id", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => p.id === id);
    res.render("show.ejs", { post });
});

app.delete("/home/:id", (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.redirect("/home");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
