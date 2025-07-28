const router = require("express").Router();

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const { validateUser, validateLogin } = require("../middlewares/validation");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUser, createUser);

router.use("/items", clothingRouter);
router.use("/users", auth, userRouter);

module.exports = router;
