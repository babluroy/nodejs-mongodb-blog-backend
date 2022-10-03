var mongoose =  require("mongoose");
const {ObjectId} = mongoose.Schema;

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 500,
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        maxlength: 500,
    },
 },
    {timestamps: true}
 )

module.exports = mongoose.model("Blog", blogSchema);