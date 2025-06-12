const router = require("express").Router();
const { updateUser } = require("../controllers/users");

router.patch("/me", updateUser);

module.exports = router;
