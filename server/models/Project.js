
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    technology: {
        type: String,
        required: true
    },
    url: {
        type: String,
        default: ""
    },
    githubUrl: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Project", projectSchema);
