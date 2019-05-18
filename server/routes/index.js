var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
/* GET home page. */

router.post('/imageUpload', function(req, res, next) {
  console.log(req);
  res.json('abc');
});

module.exports = router;
