var mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 500,
        unique: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Category", categorySchema);