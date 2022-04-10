const express = require("express");
const router = express.Router();
const { controller } = require("../controllers/controller");
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({ storage: fileStorage });

router.get("/", controller.index);

router.get("/sendFile", controller.sendFile_get);

router.get("/receiveFile", controller.receiveFile_get);

router.post("/upload", upload.single("file"), controller.sendFile_post);

router.post("/download", controller.receiveFile_post);

module.exports = {
  router,
};
