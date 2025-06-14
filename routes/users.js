const router = require("express").Router();
const { updateUser, getCurrentUser } = require("../controllers/users");

router.patch("/me", updateUser);
router.get("/me", getCurrentUser);

module.exports = router;
