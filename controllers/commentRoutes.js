const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { Comment } = require("../models");

// GET all comments of users
router.get("/", authMiddleware, async (req, res) => {
  if(!req.session) {
  res.status(401).json({message:"Log in to view comments"});
  return;
  }
  try {
    let comment = await Comment.findAll({
      where: {
        user_id: req.session.user_id,
      }
    });
    res.json(comment);
    return;
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get comment by post id
router.get("/:id", authMiddleware, async (req, res) => {
  if(!req.session) {
    res.status(401).json({message:"Log in to view comments"});
    return;
  }
  try {
    let comment = await Comment.findAll({
      where: {
        post_id: req.params.id,
      }
    })
    res.json(comment);
    return;
  } catch (error) {
    res.status(500).json(error);
    return;
  }
})

// CREATE new comments
router.post("/new", authMiddleware, async (req, res) => {
  // check session
  if (!req.session) {
    res.status(401).json({ message: "Log in to create comments" });
    return;
  }
  let comment = await Comment.create({
    comment_text: req.body.comment_text,
    post_id: req.body.post_id,
    user_id: req.session.user_id,
  });
  res.json(comment);
});

// DELETE COMMENT
router.delete("/:id", authMiddleware, async (req, res) => {
  if (!req.session) {
    res.status(401).json({ message: "Log in to delete comments" });
    return;
  }
  try {
    let comment = await Comment.findByPk(req.params.id);
    if (req.session.user_id != comment.user_id) {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this comment" });
      return;
    }

    await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ msg: "Comment deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
