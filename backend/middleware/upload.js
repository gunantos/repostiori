const util = require("util");
const multer = require("multer");
const maxSize = 100 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/upload/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFile = util.promisify(upload);
module.exports = uploadFile;