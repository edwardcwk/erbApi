const { json } = require('express');
var express = require('express');
//var member = require('../mockdata/member');
member = [];
var router = express.Router();
var title = "Edward"
//var maxid = member.length + 1;
console.log("index.js");
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: title });
});






module.exports = router;
