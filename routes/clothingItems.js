const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
// CRUD
// create
router.post("/", auth, createItem);
// Read
router.get("/", getItems);
// Update
// router.put("/:itemId", updateItem);
// Delete
router.delete("/:itemId", auth, deleteItem);

router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
