var express = require("express");
var router = express.Router();
const {check, validationResult} = require("express-validator")
const {signup, signin, isAuthenticated, signout} =  require("../controllers/auth") 

router.post('/signup',
[
  check("name", "Name should be atleast 3 character").isLength({min: 3}),
  check("email", "E-mail is required").isEmail(),
  check("password", "Password should be atleast 8 character").isLength({min: 8}),
],
signup
)

router.post('/signin',
[
  check("email", "Email is required").isEmail(),
  check("password", "password field is required").isLength({ min: 1 }),
],
signin
)
router.get('/signout', signout);

module.exports = router;