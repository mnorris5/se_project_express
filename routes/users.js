// GET /users — returns all users
// GET /user/:userId - returns a user by _id
// POST /users — creates a new user
const router = require("express").Router();
const auth = require("../middlewares/auth");

router.use(auth);

const { getCurrentUser, updateUser } = require("../controllers/users");

//router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
