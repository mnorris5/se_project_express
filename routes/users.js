// GET /users — returns all users
// GET /user/:userId - returns a user by _id
// POST /users — creates a new user
const router = require("express").Router();

const {getUsers,getUser,createUser} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

module.exports = router;