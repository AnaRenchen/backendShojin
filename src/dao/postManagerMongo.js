import { postModel } from "./models/postModel.js";

export class PostManagerMongo {
  async getPosts() {
    let posts = await postModel.find().sort({ createdAt: -1 }).lean();
    return posts;
  }

  async getPostBy(filter) {
    return await postModel.find(filter).lean();
  }

  async addPost(post) {
    let newPost = await postModel.create(post);
    return newPost;
  }

  async getPostById(id) {
    return await postModel.findOne({ _id: id }).lean();
  }

  async updatePost(id, post) {
    return await postModel.findByIdAndUpdate({ _id: id }, post, {
      runValidators: true,
      returnDocument: "after",
    });
  }

  async deletePost(id) {
    return await postModel.deleteOne({ _id: id });
  }
}
