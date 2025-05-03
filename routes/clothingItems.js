const router = require("express").Router();
const {
  getItems,
  deleteItem,
  createItem,
  deleteLike,
  likeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", deleteLike);

module.exports = router;
