var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json('a');
});
const upload = multer({
  dest: "D:/image"
});
async function quickstart(targetPath) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file

  const [result] = await client.documentTextDetection(targetPath);
  const fullTextAnnotation = result.fullTextAnnotation;
  console.log(`Full text: ${fullTextAnnotation.text}`);
  return fullTextAnnotation.text;
}
router.post('/imageUpload', upload.single("pic"), function (req, res, next) {
  const tempPath = req.file.path;
  console.log(tempPath);
  var targetPath = path.join("D:/image", req.file.originalname);
  console.log(targetPath);
  fs.rename(tempPath, targetPath, () => {
    quickstart(targetPath).then((value)=>{
      res.json({
        text:value
      })
    });
  });
 
});

module.exports = router;
