const router = require("express").Router();
const { callStoredProcedure } = require("../config/connection");
const authMiddleware = require("../middlewares/authMiddleware");

// GET all posts
router.get("/", async (req, res) => {
  if(!req.session) {
    res.status(401).json({message:"Log in to view posts"});
    return;
  }
  try{
  const post = await callStoredProcedure("get_posts");
  res.json(post);
  }

    catch(err){
      console.log(err);
      res.status(400).json(err);
    };
});

// GET a single post by id
router.get("/:id", authMiddleware, async (req, res) => {
  if(!req.session) {
    res.status(401).json({message:"Log in to view post"});
    return;
  }
  try {
    const post = await callStoredProcedure("get_post_by_id", [req.params.id]);
    if (!post) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// CREATE a new post
router.post("/new", authMiddleware, async (req, res) => {
  if (!req.session) {
    res.status(401).json({ message: "Log in to create posts" });
    return;
  }

  try {
    const post = await callStoredProcedure("create_post", [
      req.body.title,
      req.body.post_text,
      req.session.user_id,
    ]);
    res.json(post);
  } catch (error) {
    res.status(400).json(error);
  }
});

// UPDATE a post
router.put("/:id", authMiddleware, async (req, res) => {
  if (!req.session) {
    res.status(401).json({ message: "Log in to update posts" });
    return;
  }
  try {
    const post = await callStoredProcedure("get_post_by_id", [req.params.id]);
    if (!post) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    if (req.session.user_id != post[0].user_id) {
      res
        .status(401)
        .json({ message: "You are not authorized to update this post" });
      return;
    }
    await callStoredProcedure("update_post", [
      req.params.id,
      req.body.title,
      req.body.post_text,
    ]);
    res.json({ msg: "Post updated successfully" });
  } catch (error) {
    console.log(err);
    res.status(400).json(err);
  }
});

// DELETE A post
router.delete("/:id", authMiddleware, async (req, res) => {
  if (!req.session) {
    res.status(401).json({ message: "Log in to delete posts" });
    return;
  }
  try {
    const post = await callStoredProcedure("get_post_by_id", [req.params.id]);
    if (!post) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    if (req.session.user_id != post[0].user_id) {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this post" });
      return;
    }
    await callStoredProcedure("delete_post", [req.params.id]);
    
    res.json({ msg: "Post deleted" });
  } catch (error) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
