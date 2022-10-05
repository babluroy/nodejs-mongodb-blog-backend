const {body, validationResult} = require("express-validator");
const Blog = require("../models/blog");
const Category = require("../models/category");
const firebaseAdmin = require("firebase-admin");
const  { v4: uuidv4 } = require("uuid")
const formidable =  require("formidable");
const storageRef = firebaseAdmin.storage().bucket(`gs://mern-blog-2b7fa.appspot.com`);
const _ = require("lodash");

exports.createBlog = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Issue with the image file"
            })
        }
        const {title,category,desc} = fields;

        if(!title || !category || !desc) {
            return res.status(400).json({
                error: "Please fill-up all the fields"
            })
        }

        let blog = new Blog(fields);
        
        if(file.image) {

            if(file.image.size > 5000000){
                return res.status(400).json({
                    error: "Image is larger than 5MB"
                })
            }

            const newFileName = new Date() + file.image.originalFilename
            const isFileUploaded = await uploadFile(file.image.filepath, newFileName);

            if(isFileUploaded) {
                const imageUrl = isFileUploaded[0].metadata.mediaLink;
                blog.image = imageUrl;
                blog.save((err, blog)=>{
                    if(err) {
                        return res.status(400).json({error: "Error while saving data"});
                    }
                    return res.status(200).json({success: "Successfully uploaded the blog"});
                })
            }
        }
    })
}

exports.getAllBlogs = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Blog
    .find()
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, blogs) => {
        if(err){
            return res.status(400).json({
                error: "No blogs found"
            })
        }
        res.status(200).json(blogs);
    })
}

exports.getBlogById = (req, res, next, id) => {
    Blog
    .findById(id)
    .populate("category")
    .exec((err, blog) => {
        if(err){
            return res.status(400).json({
                error: "Blog not found"
            })
        }
        req.blog = blog;
        next();
    })
}

exports.getBlog = (req, res) => {
    return res.json(req.blog);
}

exports.getAllCategories = (req, res) => {
    Category
    .find()
    .populate()
    .exec((err, category) => {
        if(err) {
            return res.status(400).json({
                error: "No categories found"
            })
        }
        return res.json(category);
    })
}


exports.deleteBlog = (req, res) => {
    let blog = req.blog;
    blog.remove((err, deleteBlog) => {
        if(err) {
            return res.status(400).json({
                error: "Failed to delete the blog"
            })
        }
        res.json({
            message: "Successfully deleted the blog"
        })
    })
}

exports.updateBlog = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "Issue with the image file"
            })
        }
        
        let blog = req.blog;
        blog = _.extend(blog, fields);
        
        if(file.image) {

        if(file.image) {
            if(file.image.size > 5000000){
                return res.status(400).json({
                    error: "Image is larger than 5MB"
                })
            }
            const newFileName = new Date() + file.image.originalFilename
            var isFileUploaded = await uploadFile(file.image.filepath, newFileName);
        }

            if(isFileUploaded) {
                if(isFileUploaded) {
                  var imageUrl = isFileUploaded[0].metadata.mediaLink;
                  blog.image = imageUrl;
                }

                blog.save((err, blog)=>{
                    if(err) {
                        return res.status(400).json({error: "Error while saving data"});
                    }
                    return res.status(400).json({success: "Successfully updated the blog"});
                })
            }
        }
    })
}

const uploadFile = async (path, filename) => {
    return storageRef.upload(path, {
        public: true,
        destination: `/uploads/blog/${filename}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    }).then((res) => {
        return res;
    }).catch((err) => {
        return false;
    });
}
 
