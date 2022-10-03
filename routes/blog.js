var express = require("express");
var router = express.Router();
const {isSignedIn,isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {createBlog, getAllBlogs, getBlogById, getBlog, getAllCategories, deleteBlog, updateBlog} = require("../controllers/blog")

// params
router.param("userId", getUserById);
router.param("blogId", getBlogById);

router.post("/create-blog/:userId", isSignedIn, isAuthenticated, createBlog);

router.get("/all-blogs", isSignedIn, getAllBlogs);

router.get("/blog/:blogId", getBlog);

router.get("/categories", getAllCategories);

router.delete("/delete-blog/:blogId/:userId", isSignedIn, isAuthenticated, deleteBlog);

// TODO: test it
router.put("/updateBlog/:blogId/:userId", isSignedIn, isAuthenticated, updateBlog)


module.exports = router;