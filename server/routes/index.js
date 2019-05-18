// imports
const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const unirest = require('unirest');
// app const
const app = express();

// setting local
app.use(express.static('/home/faheem/Desktop/ruhacks/RUHack-NLP-Backend/server/public/html')); 

/* GET home page. */
router.get('/', function (req, res, next) {
  fs.readFile(__dirname + '/html/index.html', 'utf8', (err, text) => {
    res.send(text);
  });
});

const upload = multer({
  dest: "/home/faheem/Desktop/ruhacks/RUHack-NLP-Backend/server/images/"
});

async function getText(targetPath) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.documentTextDetection(targetPath);
  const fullTextAnnotation = result.fullTextAnnotation;
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
        returnValue.text = JSON.parse(textSent).txt;
        returnValue.summary = result.body.summary;
        return resolve(returnValue);
      });
  })
}

function clean_json(returnValue){
  // creating a new json with stats
  var newReturnValue = {
    original:{
      text: returnValue.text,
      stats:{
        wordCount: returnValue.text.split(' ').length,
        sentenceCount: returnValue.text.split('.').length,
        averageReadTime: Math.floor(returnValue.text.length / 500)
      }
    },
    summerized:{
      text: returnValue.summary,
      stats:{
        wordCount: returnValue.summary.split(' ').length,
        sentenceCount: returnValue.summary.split('.').length,
        averageReadTime: Math.floor(returnValue.summary.length / 500)
      }
    }
  }
  console.log(newReturnValue);
  return newReturnValue;
}

router.post('/imageUpload', upload.single("pic"), function (req, res, next) {
  const tempPath = req.file.path;
  var targetPath = path.join("", req.file.originalname);
  fs.rename(tempPath, targetPath, () => {
    getText(targetPath).then((value) => {
      summarize(value).then((returnValue) => {
        res.json(clean_json(returnValue));
      })
    });
  });
});

module.exports = router;
