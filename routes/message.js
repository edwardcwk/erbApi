var express = require('express');
var router = express.Router();

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var con = req.con;
    con.query("select * from message where id = " + req.params.id, function (err, row) {
      console.log(row);
      if (err) {
        res.end(JSON.stringify({ message: [], success: false }));
        return;
      }
      res.end(JSON.stringify({ message: row[0], success: true }));
    });
  })
  
  router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var con = req.con;
    con.query("select * from message", function (err, row) {
      if (err) {
        res.end(JSON.stringify({ message: [], success: false }));
        return;
      }
      res.end(JSON.stringify({ message: row, success: true }));
    });
  
  });
  
  router.post('/', function (req, res, next) {
    console.log('posting message============');
    console.log(JSON.stringify(req.body));
  
    let query = "INSERT INTO message (sender_id, receiver_id, message, priority) VALUES (?, ?, ?, ?);";
    con = req.con;
    con.query(query, [req.body.sender_id, req.body.receiver_id, req.body.message,req.body.priority], (err, rows) => {
      if (err) {
        console.log(err);
        res.end(JSON.stringify({success:false}));
        return;
      }
      // console.log("Row inserted with id = "
      //   + rows.insertId);
        req.body.id = rows.insertId;
        req.body.created_date = Date();
        //req.body.created_date = ;
        console.log(JSON.stringify( rows));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({  success: true,data : req.body }));  
    });
    
  
  });
  
  // router.put('/message', function (req, res, next) {
  //   let query = "UPDATE message SET name =?  , age = ? ,gender = ?  WHERE id = ?";
  //   con = req.con;
  //   con.query(query, [req.body.name, req.body.age, req.body.gender, req.body.id], (err, rows) => {
  //     if (err) throw err;
  //     console.log(rows);
  //   });
  //   res.setHeader('Content-Type', 'application/json');
  //   res.end(JSON.stringify({ message: message, success: true }));
  
  // });
  
  router.delete('/:pid', function (req, res, next) {
    let query = "delete from message WHERE id = ?";
    con = req.con;
    con.query(query, [req.params.pid], (err, rows) => {
      if (err) {
        console.log(error);
        return;
      }
      console.log(rows);
    });
    // con.query("select * from message", function (err, row) {
    //   if (err) {
    //     res.end(JSON.stringify({ message: [], success: false }));
    //     return;
    //   }
    //   res.end(JSON.stringify({ message: row, success: true }));
    // });
  })

  module.exports = router;
  