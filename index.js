import express from "express";
import methodOverride from "method-override";

const app = express();
const port = 3000;

//no data base 
var posts = [];

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req,res) => {
    res.render("pages/home.ejs", { posts: posts });
});

app.get("/create", (req,res) => {
    res.render("pages/create-post.ejs");
});

app.post("/create-new-post", (req,res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date(),
    };
    posts.push(newPost);
    res.redirect("/");
});

app.get("/post/:id", (req,res) => {
  const post = posts.find(post => post.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("pages/post.ejs", { post: post });
});

app.get("/edit/:id", (req,res) => {
  const post = posts.find(post => post.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("pages/edit-post.ejs", { post: post });
});

app.put("/update-post/:id", (req,res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(post => post.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).send("Post not found");
  }

  posts[postIndex] = {
    ...posts[postIndex],
    title: req.body.title,
    content: req.body.content,
    updatedAt: new Date()
  };

  res.redirect(`/post/${postId}`);
});

app.delete("/delete-post/:id", (req,res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(post => post.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).send("Post not found");
  }

  posts.splice(postIndex, 1);
  res.redirect("/");
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});