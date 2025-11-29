import { postServices } from "../repository/postsServices.js";
import { isValidObjectId } from "mongoose";
import CustomError from "../utils/CustomError.js";
import { TYPES_ERROR } from "../utils/EErrors.js";
import __dirname from "../utils/utils.js";
import path from "path";
import fs from "fs";

export class PostsController {}
