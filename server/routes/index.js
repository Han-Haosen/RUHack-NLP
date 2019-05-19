// imports
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const unirest = require('unirest');
const express = require('express');
const router = express.Router();

// app const
const app = express();
<<<<<<< HEAD

=======
const language = require('@google-cloud/language');

const client = new language.LanguageServiceClient();

const retext = require('retext');
const keywords = require('retext-keywords');
>>>>>>> master
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

function promiseGenerator(msg) {
  return new Promise(async function(resolve, reject) {
    const document = {
      content: msg.text,
      type: 'PLAIN_TEXT'
    };
    const [result] = await client.analyzeEntities({document});
    const entities = result.entities;
    let replacements = {}
    entities.forEach(entity => {
      if(entity.metadata && entity.metadata.wikipedia_url) {
        replacements[entity.name] = `<a href=${entity.metadata.wikipedia_url}>${entity.name}</a>`
      }
    });
    for(var key in replacements) {
      var value = replacements[key];
      msg.summary = msg.summary.replace(key, value);
    }
    return resolve(msg);
  });
}

// sending the image for ocr
async function getText(targetPath) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.documentTextDetection(targetPath);
  const fullTextAnnotation = result.fullTextAnnotation;
  if (fullTextAnnotation == null){
    return "ERROR"
  } else {
    var sentenceCount = Math.floor(fullTextAnnotation.text.split(".").length / 2);
    let textSent = { "key": '7338c0f741743c862fee7b5ec0a2db78', "txt": fullTextAnnotation.text, "sentences": sentenceCount };
    textSent = JSON.stringify(textSent);
    return textSent;
  }
}

// summerizing the text
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

// save passed json to file
function writeJsonToFile(newReturnValue) {
  var data = JSON.stringify(newReturnValue, null, 4);
  console.log(__dirname);
  fs.writeFile(__dirname+"/info.json", data, (err) => {
    if (err){
      console.log(err)
    } else {
      console.log("JSON to file")
    }
  })
  fs.writeFileSync(__dirname+"/info.json", data);
}

// clean json data, and adding stats
function clean_json(returnValue){
  // creating a new json with stats
  var newReturnValue = {
    original:{
      text: returnValue.text,
      stats:{
        wordCount: returnValue.text.split(' ').length,
        sentenceCount: returnValue.text.split('.').length,
        averageReadTime: Math.floor(returnValue.text.length / 200)
      }
    },
    summerized:{
      text: returnValue.summary,
      stats:{
        wordCount: returnValue.summary.split(' ').length,
        sentenceCount: returnValue.summary.split('.').length,
        averageReadTime: Math.floor(returnValue.summary.length / 200)
      }
    }
  }
  console.log(newReturnValue);
  // write json to file
  writeJsonToFile(newReturnValue);
  return newReturnValue;
}
// returns json object containg data + stats about original & summerized text
router.post('/imageUpload', upload.single("pic"), function (req, res, next) {
  const tempPath = req.file.path;
  var targetPath = path.join("", req.file.originalname);
  fs.rename(tempPath, targetPath, () => {
    getText(targetPath).then((value) => {
<<<<<<< HEAD
      if (value == "ERROR"){
        fs.readFile(__dirname + "/html/error.html", "utf8", (err, text) => {
          res.send(text);
=======
      summarize(value).then((returnValue) => {
        promiseGenerator(returnValue).then(function(returnValue) {
          clean_json(returnValue);
          fs.readFile(__dirname + '/html/loading.html', 'utf8', (err, text) => {
            console.log(__dirname);
            res.send(text);
          });
        }, function() {
          console.log('error!');
>>>>>>> master
        });
      } else {
        summarize(value).then((returnValue) => {
          clean_json(returnValue);
          fs.readFile(__dirname + '/html/loading.html', 'utf8', (err, text) => {
            res.send(text);
          });
        })
      };
    });
  });
});

// save passed json to file
function write_log() {
  var data = new Date().getTime.toString();
  console.log(__dirname);
  fs.writeFile(__dirname+"/log.txt", data, (err) => {
    if (err){
      console.log(err)
    } else { 
      console.log("Logging to JSON to file")
    }
  })
  fs.writeFileSync(__dirname+"/log.txt", data);
}

//moblie image upload
router.post('/mobileUpload', upload.single("pic"), function (req, res, next) {
  console.log({ file: req.file }, 'mobile upload triggered');
  const tempPath = req.file.path;
  
  var targetPath = path.join("", req.file.originalname);

  fs.renameSync(tempPath, targetPath);
  return getText(targetPath)
  .then(value => summarize(value))
  .then((returnValue) => {
    console.log('Finished summarizing');
    clean_json(returnValue);
    write_log();

    const fileContent = fs.readFileSync(__dirname + '/info.json', 'utf8');
    console.log(fileContent, 'Read from file');
    res.json(JSON.parse(fileContent));
  })
  .catch((err) => {
    const errorObject = {
      message: err.message
    };
    console.log(errorObject, 'There was an error');
    res.json(errorObject);
  });
});

// hosting the json data
router.get('/info.json', function (req, res, next) {
  fs.readFile(__dirname + '/info.json', 'utf8', (err, text) => {
    res.json(JSON.parse(text));
  });
})

// dashboard that displays all the information
router.get("/dashboard", function(req, res, next) {
  fs.readFile(__dirname + "/html/dashboard.html", "utf-8", (err, text) => {
    res.send(text);
  })
})

module.exports = router;
