var express = require('express');
var router = express.Router();

/* GET users listing. */
//==/api/emailpasschk
//=
//update member set passwordhash = sha1(password) 
router.post('/emailpasschk', function (req, res, next) {
  console.log('password checking');
  console.log(JSON.stringify(req.body));

  let query = "select *  from member where email= ?  ";
  con = req.con;
  con.query(query, [req.body.email], (err, rows) => {
    if (err) {
      console.log(err);
      res.end(JSON.stringify({ success: false }));
      return;
    }
    console.log("logging in");
    console.log(rows.length);

    res.setHeader('Content-Type', 'application/json');
    if (rows.length >0) {
      let tokenstr = randomString(20);
      con.query("delete  from member_token where memberid="+ rows[0].id );
      console.log("updating token");
      con.query("insert member_token (token,memberid) value (?,?)", [ tokenstr,rows[0].id]);
      console.log(JSON.stringify({ success: true, data: { id: rows[0].id, name: rows[0].name,  } }));
      res.end(JSON.stringify({ success: true, data: { id: rows[0].id, name: rows[0].name,token:tokenstr } }));
    } else
      res.end(JSON.stringify({ success: false }));
  });
});
//======/api/chatread
router.get('/chatread/:sender/:receiver', function (req, res, next) {
  console.log('reading chat');
  console.log(JSON.stringify(req.params));

  let query = "select sender_id,message,created_date from message where ((sender_id =? and receiver_id =?) or (sender_id =? and receiver_id =?) ) order by id  ";
  con = req.con;
  con.query(query, [req.params.sender, req.params.receiver, req.params.receiver, req.params.sender], (err, rows) => {
    if (err) {
      console.log(err);
      res.end(JSON.stringify({ success: false }));
      return;
    }
    +

    console.log("reading chat");
    console.log(rows.length);

    res.setHeader('Content-Type', 'application/json');
    if (rows.length > 0) {
      console.log(JSON.stringify({ success: true, data: rows }));
      res.end(JSON.stringify({ success: true, data: rows }));
    } else
      res.end(JSON.stringify({ success: false }));
  });
});

//======/api/inbox
router.get('/inbox/:loginId', function (req, res, next) {
  console.log('reading inbox');
  console.log(JSON.stringify(req.params));

  let query = "select * from message,\
      (select * from member,\
      (SELECT max(id) as msgid ,IF(sender_id< receiver_id, sender_id, receiver_id) as sid, IF(sender_id< receiver_id, receiver_id, sender_id)  as rid, max(created_date) as dtime\
      from message \
      where (sender_id = ? or receiver_id= ?)  group by sid, rid ) as latest\
      where member.id = if(sid=?,rid,sid)) as temp\
      where message.id = msgid";
  con = req.con;
  let login = parseInt(req.params.loginId)
  con.query(query, [login,login,login], (err, rows) => {
    if (err) {
      console.log(err);
      res.end(JSON.stringify({ success: false }));
      return;
    }
    console.log("reading inbox");
    console.log(rows.length);

    res.setHeader('Content-Type', 'application/json');
    if (rows.length > 0) {
      console.log(JSON.stringify({ success: true, data: rows }));
      res.end(JSON.stringify({ success: true, data: rows }));
    } else
      res.end(JSON.stringify({ success: false }));
  });
});


function randomString(length) {
  for (var s=''; s.length < length; s += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.random()*62|0));
  return s;
}

module.exports = router;
