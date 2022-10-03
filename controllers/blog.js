const {body, validationResult} = require("express-validator");
const Blog = require("../models/blog");
const firebaseAdmin = require("firebase-admin");
const  { v4: uuidv4 } = require("uuid")
const formidable =  require("formidable");
const storageRef = firebaseAdmin.storage().bucket(`gs://mern-blog-2b7fa.appspot.com`);

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
                    return res.status(400).json({success: "Successfully uploaded the blog"});
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
 