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
    shortDesc: {
        type: String,
        required: true,
        maxlength: 80,
    },
    desc: {
        type: String,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    highlighted: {
        type: Boolean,
        default: false,
    }
 },
    {timestamps: true}
 )

module.exports = mongoose.model("Blog", blogSchema);