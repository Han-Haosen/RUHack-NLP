var express = require('express');
var router = express.Router();
const multer = require("multer");
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('a');
});
const upload = multer({
  dest:"D:/image"
});

router.post('/imageUpload',upload.single("pic"), function(req, res, next) {
  const tempPath = req.file.path;
  console.log(tempPath);
  var targetPath = path.join("D:/image", req.file.originalname);
  console.log(targetPath);
  fs.rename(tempPath,targetPath);
  res.json('abc');
});

module.exports = router;
