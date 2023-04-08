import multer from "multer";
import fs from "fs";



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = '../client/public/images';
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });
   var multipleupload = multer({ storage: storage })
   export default multipleupload