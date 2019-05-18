var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
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
  const [result] = client.documentTextDetection(fileName);
  const fullTextAnnotation = result.fullTextAnnotation; 
console.log(`Full text: ${fullTextAnnotation.text}`)
  res.json('abc');
});

module.exports = router;
