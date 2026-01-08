import { PostManagerMongo as PostsDao } from "../dao/postManagerMongo.js";

class PostsServices {
  constructor(dao) {
    this.dao = dao;
  }

  getPosts = async () => {
    return await this.dao.getPosts();
  };

  getPostBy = async (filter) => {
    return await this.dao.getPostBy(filter);
  };

  getPostById = async (id) => {
    return await this.dao.getPostById(id);
  };

  addPost = async (post) => {
    return await this.dao.addPost(post);
  };

  deletePost = async (id) => {
    return await this.dao.deletePost(id);
  };

  updatePost = async (id, post) => {
    return await this.dao.updatePost(id, post);
  };
}

export const postServices = new PostsServices(new PostsDao());
