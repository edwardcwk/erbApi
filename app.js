var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
//var session = require('express-session');
var indexRouter = require('./routes/index');
var memberRouter = require('./routes/member');
var apiRouter = require('./routes/api');
var messageRouter = require('./routes/message'); 
var messagepriorityRouter = require('./routes/messagepriority');

var app = express();
//app.use(session({secret:'edward is the best'}));

//====for mysql  
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "erb-homewor-7967.mysql.a.osc-fr1.scalingo-dbs.com",  user: "erb_homewor_7967",password: "ZVJs5lp7O2f_Ce3sA5n4",port: 33309
  //host: "localhost",  user: "root",password: "root",port: 10005

});
con.connect(function (err) {
  if (err) {
    throw err;
  };

  con.query("use memberdb");
  con.query("SELECT * FROM member", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});
app.use(function (req, res, next) {
  req.con = con;
  next();
});



app.use(cors({
  origin: '*'
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/member', memberRouter);
app.use('/message', messageRouter);
app.use('/messagepriority', messagepriorityRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
