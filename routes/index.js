const router = require("express").Router();
const { NOT_FOUND_ERROR } = require("../utils/errors");
const clothingItem = require("./clothingItems");
const userRouter = require("./users");



router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
