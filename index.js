import express from "express";
import methodOverride from "method-override";

const app = express();
const port = 3000;

//no data base 
var posts = [{postId: 1, title: "First Post", content: "This is the content of the first post", createdAt: new Date()},
             {postId: 2, title: "Second Post", content: "This is the content of the second post", createdAt: new Date()},
             {postId: 3, title: "Third Post", content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", createdAt: new Date()}];

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

app.post("/delete-post/:id", (req,res) => {
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