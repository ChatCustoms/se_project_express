const router = require("express").Router();

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);

module.exports = router;
