const multer = require("multer");

/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, "im.jpeg");
  },
});
*/

var storage = multer.memoryStorage();
const multerUpload = () => multer({ storage: storage });

module.exports = multerUpload;
