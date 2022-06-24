var express = require('express');
var router = express.Router();

//========member
router.get('/:id', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var con = req.con;
  con.query("select id,name,age,gender,email from member where id = " + req.params.id, function (err, row) {
    console.log(row);
    if (err) {
      res.end(JSON.stringify({ member: {}, success: false }));
      return;
    }
    res.end(JSON.stringify({ member: row[0], success: true }));
  });
});
//=
router.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var con = req.con;
  con.query("select id,name,age,gender,email from member order by name", function (err, row) {
    if (err) {
      res.end(JSON.stringify({ member: [], success: false }));
      return;
    }
    res.end(JSON.stringify({ member: row, success: true }));
  });
});
//=
router.post('/', function (req, res, next) {
  console.log('post');
  console.log(JSON.stringify(req.body));

  let query = `INSERT INTO member (name, age, gender,priority) VALUES (?, ?, ?,?);`;
  con = req.con;
  con.query(query, [req.body.name, req.body.age, req.body.gender,req.body.priority], (err, rows) => {
    if (err) throw err;
    console.log("Row inserted with id = "
      + rows.insertId);
  });
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ member: member, success: true }));

});
//=
router.put('/', function (req, res, next) {
  console.log(req);
  let query = "UPDATE member SET name =?  , age = ? ,gender = ? ,email =? WHERE id = ? ";
  con = req.con;
  con.query(query, [req.body.name, req.body.age, req.body.gender, req.body.email, req.body.id], (err, result) => {
    if (err) throw err;
    //console.log(err);

    console.log("updating member");
    console.log(result);
    res.setHeader('Content-Type', 'application/json');
    if (result.affectedRows > 0)
      res.end(JSON.stringify({ success: true }));
    else
      res.end(JSON.stringify({ success: false }));
  });
});

//=
router.delete('/:pid', function (req, res, next) {
  let query = "delete from member WHERE id = ?";
  con = req.con;
  con.query(query, [req.params.pid], (err, rows) => {
    if (err) throw err;
    console.log(rows);
  });
  con.query("select * from member", function (err, row) {
    if (err) {
      res.end(JSON.stringify({ member: [], success: false }));
      return;
    }
    res.end(JSON.stringify({ member: row, success: true }));
  });
});


module.exports = router;
