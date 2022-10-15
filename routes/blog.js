var express = require("express");
var router = express.Router();
const {isSignedIn,isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")
const {createBlog, getAllBlogs, getBlogById, getBlog, getAllCategories, deleteBlog, updateBlog, getHighlightedBlogs, getFeaturedBlogs} = require("../controllers/blog")

// params
router.param("userId", getUserById);
router.param("blogId", getBlogById);

router.post("/create-blog/:userId", isSignedIn, isAdmin, isAuthenticated, createBlog);

router.get("/all-blogs", getAllBlogs);

router.get("/blog/:blogId", getBlog);

router.get("/categories", getAllCategories);

router.delete("/delete-blog/:blogId/:userId", isSignedIn, isAdmin, isAuthenticated, deleteBlog);

router.put("/update-blog/:blogId/:userId", isSignedIn, isAdmin, isAuthenticated, updateBlog);

router.get("/hightlighted-blogs", getHighlightedBlogs);

router.get("/featured-blogs", getFeaturedBlogs);


module.exports = router;