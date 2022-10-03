var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 32,
        trim: true,
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: String,
    role: {
        type: Number,
        role: 0,
    },
    purchases: {
        type: Array,
        default: [],
    }
  },
  {timeseries: true}
)


module.exports = mongoose.model("User", userSchema);