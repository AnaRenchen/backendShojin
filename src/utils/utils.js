import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "./src/public/uploads";

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    let type = file.mimetype.split("/")[0];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    if (type !== "image") {
      return cb(new Error("You can only upload images."));
    }

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
