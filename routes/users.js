const router = require("express").Router();
const { updateUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const { validateUserUpdate } = require("../middlewares/validation");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateUser);

module.exports = router;
