var express = require("express");
var router = express.Router();
const {isSignedIn, isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {createCategory} = require("../controllers/category")

// params
router.param("userId", getUserById);

router.post("/create-category/:userId", isSignedIn, isAuthenticated, createCategory);

module.exports = router;
