const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
// CRUD
// create
router.post("/", createItem);
// Read
router.get("/", getItems);
// Update
// router.put("/:itemId", updateItem);
// Delete
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
