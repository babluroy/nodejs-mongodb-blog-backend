const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
var { expressjwt } = require("express-jwt");
const bcrypt = require("bcrypt");
const User =  require("../models/user");

exports.signup = (req, res) => {
   const errors = validationResult(req);
   const {email, password, name, lastname} = req.body;

   if(!errors.isEmpty()){
     return res.status(422).json({
      error: errors.array()[0].msg,
     })
   }

   User.findOne({email: email}).then((user)=>{
      if(user){
        return res.status(400).json({
            error: "E-mail is already registered"
        })
      }
      const newUser = new User(req.body)
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
           if (err) throw err;
           newUser.password = hash;
           newUser.save()
           .then((user)=> res.status(200).json(user))
           .catch((error)=> res.status(400).json(error));
        });
    })
   })
   .catch((error)=>{
     return res.status(400).json({error: error});
   })
}


exports.signin = (req, res) => {
  const errors = validationResult(req);
  const {email, password} = req.body;
  
  if(!errors.isEmpty()){
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }

  User.findOne({email}).then((user)=>{

    if(!user){
      return res.status(400).json({
        error: "User not found"
      })
    }

    bcrypt.compare(password, user.password).then((isCorrect) => {
      if(isCorrect){
        const payload = {
          id: user.id,
          email: user.email, 
        }
        jwt.sign(
          payload,
          process.env.SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            const {name, role, email, _id} = user;
            res.json({
              token: "Bearer " + token,
              name: name,
              role: role,
              email: email,
              _id: _id,
            });
            if (err) {
              res.json({
                success: false,
                error: err,
              });
            }
          }
        );
        } else {
           res.status(400).json({
             error: "Password doesn't match"
           })
        }
    }).catch((error)=>{
      res.status(500).json({
        error: error,
      })
    });
  });
}

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    status: true,
    message: "User signed-out successfully",
  });
}

exports.isSignedIn = (req, res, next) => {
  const secret = process.env.SECRET;
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing JWT' });
  }
  jwt.verify(token, secret, { algorithms: ["sha1", "RS256", "HS256"] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized - Invalid JWT' });
    }
    req.auth = decoded;
    next();
  });
}

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth.id;
  if(!checker) {
    return res.status(401).json({
      error: "ACCCESS DENIED"
    })
  }
  next();
}

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0) {
    return res.status(401).json({
      error: "You are not an admin ! Access Denied",
    })
  } 
  next();
}