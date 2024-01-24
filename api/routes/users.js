const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

const checkAuth = require("../middleware/check-auth");

router.post("/signup", UserController.User_signUp);

router.post("/login", UserController.User_login);

router.delete("/:userId", checkAuth, UserController.User_delete);

module.exports = router;
