const router = require("express").Router();
const {
  getItems,
  deleteItem,
  createItem,
  unlikeItem,
  likeItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

const { validateCardBody, validateId } = require("../middlewares/validation");

router.get("/", getItems);

router.post("/", auth, validateCardBody, createItem);
router.delete("/:itemId", auth, validateId, deleteItem);
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, unlikeItem);

module.exports = router;
