const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");

// GET all posts
router.get("/", async (req, res) => {
  if(!req.session) {
    res.status(401).json({message:"Log in to view posts"});
    return;
  }
  try{
  const post = await Post.findAll({
    // Query configuration
    attributes: ["id", "post_text", "title", "created_at"],
    // show latest news first
    order: [["created_at", "DESC"]],
    // JOIN to the User table
    include: [
      // comment model -- attaches username to comment
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
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
    const post = await Post.findByPk(req.params.id);
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
    const post = await Post.create({
      title: req.body.title,
      post_text: req.body.post_text,
      user_id: req.session.user_id,
    });
    res.json(post);
  } catch (error) {
    res.status(400).json(err);
  }
});

// UPDATE a post
router.put("/:id", authMiddleware, async (req, res) => {
  if (!req.session) {
    res.status(401).json({ message: "Log in to update posts" });
    return;
  }
  try {
    console.log(req.params.id);
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    if (req.session.user_id != post.user_id) {
      res
        .status(401)
        .json({ message: "You are not authorized to update this post" });
      return;
    }
    await Post.update(
      {
        title: req.body.title,
        post_text: req.body.post_text,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
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
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    if (req.session.user_id != post.user_id) {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this post" });
      return;
    }
    await Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ msg: "Post deleted" });
  } catch (error) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
