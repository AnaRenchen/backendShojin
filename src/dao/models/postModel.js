import mongoose from "mongoose";

const postCollection = "posts";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    image: { type: String, required: false },
    code: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const postModel = mongoose.model(postCollection, postSchema);
