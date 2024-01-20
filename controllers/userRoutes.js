const router = require("express").Router();
const bcrypt = require("bcrypt");

const generateToken = require("../config/generateToken");
const { User, Post, Comment } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");

// GET a single user by id
router.get("/:id", authMiddleware, async (req, res) => {
  if(!req.session){
    res.status(401).json({message:"Log in to view user"});
    return;
  }
  try{
  let user = await User.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Post,
        attributes: ["id", "title", "post_text", "created_at"],
      },
      // include the Comment model here:
      {
        model: Comment,
        attributes: ["id", "comment_text", "created_at"],
        include: {
          model: Post,
          attributes: ["title"],
        },
      },
    ],
  })
  if (!user) {
    res.status(404).json({ message: "No user found with this id" });
    return;
  }

  res.json(user);
  }
  catch(err){
    res.status(400).json(err);
  }
});

// CREATE new user
router.post("/register", async (req, res) => {
  try {
    let user = User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    let token = await generateToken(user.id);
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      res.json({ message: "You are now logged in!", token: token });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOG IN for users/ verify users
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Not all fields have been entered." });
  try {
    let user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(400).json({ message: "No user with that email address!" });
      return;
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }
    let token = await generateToken(user.id);
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      res.json({ message: "You are now logged in!", token: token });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOG OUT
router.post("/logout", authMiddleware, (req, res) => {
  if(req.session){
  req.session.destroy(() => {
    res.status(204).json({ message: "You are now logged out!" })
  });
}
res.status(404).end();
return;

});

// UPDATE a user
router.put("/:id", authMiddleware, async (req, res) => {
  if(!req.session){
    res.status(401).json({message:"Log in to update user"});
    return; 
  }
  const { username, password } = req.body;
  try {
    if(req.session.user_id != req.params.id){
      res.status(401).json({message:"You are not authorized to update this user"});
      return;
    }
    let user = User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ message: "No user found with this id" });
      return;
    }
    await User.update(
      { username, password },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.json({ msg: "User update successfully" });
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }

});

// DELETE a user
router.delete("/:id", authMiddleware, async (req, res) => {
  if(!req.session){
  res.status(401).json({message:"Log in to delete user"});
  }
  try {
    if(req.session.user_id != req.params.id){
      res.status(403).json({message:"You are not authorized to update this user"});
      return;
    }
    let user = User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ message: "No user found with this id" });
      return;
    }
    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ msg: "User deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }

});

module.exports = router;
