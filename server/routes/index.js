var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');
var unirest = require('unirest');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.json('a');
});
const upload = multer({
  dest: "D:/image"
});
async function getText(targetPath) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file

  const [result] = await client.documentTextDetection(targetPath);
  const fullTextAnnotation = result.fullTextAnnotation;
  console.log(`Full text: ${fullTextAnnotation.text}`);
  var sentenceCount = Math.floor(fullTextAnnotation.text.split(".").length / 2);
  let textSent = { "key": '7338c0f741743c862fee7b5ec0a2db78', "txt": fullTextAnnotation.text, "sentences": sentenceCount };
  textSent = JSON.stringify(textSent);
  return textSent;
}
function summarize(textSent) {
  return new Promise((resolve, reject) => {
    var returnValue = {};
    unirest.post("https://api.meaningcloud.com/summarization-1.0")
      .header("Content-Type", "application/json")
      .send(textSent)
      .end(function (result) {
        console.log(result.body.summary);
        returnValue.text = JSON.parse(textSent).txt;
        returnValue.summary = result.body.summary;
        console.log(returnValue);
        return resolve(returnValue);
      });
  })

}
router.post('/imageUpload', upload.single("pic"), function (req, res, next) {
  const tempPath = req.file.path;
  console.log(tempPath);
  var targetPath = path.join("D:/image", req.file.originalname);
  console.log(targetPath);
  fs.rename(tempPath, targetPath, () => {
    getText(targetPath).then((value) => {
      summarize(value).then((returnValue) => {
        res.json(returnValue);
      })
    });
  });

});

module.exports = router;
