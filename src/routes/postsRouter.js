import { Router } from "express";
import { PostsController } from "../controllers/postsController.js";
import { upload } from "../utils/utils.js";

export const routerPosts = Router();

routerPosts.get("/", PostsController.getPosts);
routerPosts.get("/filterResult", PostsController.getPostBy);
routerPosts.get("/:id", PostsController.getPost);
routerPosts.post("/", upload.single("image"), PostsController.addPost);
routerPosts.put("/:id", upload.single("image"), PostsController.updatePost);
routerPosts.delete("/:id", PostsController.deletePost);
