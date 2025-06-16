const router = require("express").Router();
const {
  getItems,
  deleteItem,
  createItem,
  unlikeItem,
  likeItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
