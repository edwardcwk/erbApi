var express = require('express');
var router = express.Router();

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var con = req.con;
    con.query("select * from message_priority where message_priority.id=" + req.params.id+"", function (err, row) {
      console.log("message_priority");
      console.log(row);
      if (err) {
        res.end(JSON.stringify({ data: [], success: false }));
        return;
      }
      res.end(JSON.stringify({ data: row, success: true }));
    });
  })
  
  router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var con = req.con;
    con.query("select * from message_priority", function (err, row) {
      if (err) {
        res.end(JSON.stringify({ data: [], success: false }));
        return;
      }
      res.end(JSON.stringify({ data: row, success: true }));
    });
  
  });
  
  module.exports = router;
  