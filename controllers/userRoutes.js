const router = require("express").Router();
const bcrypt = require("bcrypt");

const generateToken = require("../config/generateToken");
const authMiddleware = require("../middlewares/authMiddleware");
const { callStoredProcedure } = require("../config/connection");

// GET a single user by id
router.get("/", authMiddleware, async (req, res) => {
  if(!req.session){
    res.status(401).json({message:"Log in to view user"});
    return;
  }
  try{
    console.log(req.session.id);
  let user = await callStoredProcedure("get_user_data", req.session.user_id);
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
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const checkUser = await callStoredProcedure("get_user_by_email", [email]);
    if(checkUser){
      res.status(400).json({message:"User with this email already exists"});
      return;
    }
    const user = await callStoredProcedure("create_user", [username, email, hashedPassword]);
  let token = await generateToken(user[0].id);
    req.session.save(() => {
      req.session.user_id = user[0].id;
      req.session.username = user[0].username;
      res.json({ message: "You are now logged in!", token: token, });
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
    const user = await callStoredProcedure("get_user_by_email", [email]);
    if (!user) {
      res.status(400).json({ message: "No user with that email address!" });
      return;
    }
    const validPassword = bcrypt.compareSync(password, user[0].password);
    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }
    let token = await generateToken(user[0].id);
    req.session.save(() => {
      req.session.user_id = user[0].id;
      req.session.username = user[0].username;
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
  const { username } = req.body;
  try {
    if(req.session.user_id != req.params.id){
      res.status(401).json({message:"You are not authorized to update this user"});
      return;
    }
    let user = await callStoredProcedure("get_user_by_id", req.params.id);
    console.log(user)
    if (!user) {
      res.status(404).json({ message: "No user found with this id" });
      return;
    }
    await callStoredProcedure("update_user", [req.params.id,username]);
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
  console.log(req.session.user_id, req.params.id)
  try {
    if(req.session.user_id != req.params.id){
      res.status(403).json({message:"You are not authorized to update this user"});
      return;
    }
    let user = await callStoredProcedure("get_user_by_id", req.params.id);
    if (!user) {
      res.status(404).json({ message: "No user found with this id" });
      return;
    }

   await callStoredProcedure("delete_user", req.params.id);
    res.json({ msg: "User deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }

});

module.exports = router;
