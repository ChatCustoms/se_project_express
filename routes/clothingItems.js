const router = require("express").Router();
const { getItems, deleteItem, createItem } = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;