var express = require("express");
var router = express.Router();
const {isSignedIn,isAuthenticated} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {createBlog} = require("../controllers/blog")

// params
router.param("userId", getUserById);

router.post("/create-blog/:userId", isSignedIn, isAuthenticated, createBlog)


module.exports = router;