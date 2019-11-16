var express = require("express");
var bodyParser = require('body-parser');

var app = express();
app.set('port', 3000);

app.use(bodyParser.json());

app.use('/api/download', require('./api/download'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (process.env.NODE_ENV !== 'test') {
	const server = app.listen(app.get('port'), function(){});
}

module.exports = app;
