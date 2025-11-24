const mongoose = require("mongoose");

const medicalBlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    mainCategory: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      default: "",
      trim: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalBlog", medicalBlogSchema);
