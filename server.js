var express = require('express');
var app = express();
var path = require("path");
var expressWs = require('express-ws')(app);

app.use(function (req, res, next) {
  req.testing = 'testing';
  return next();
});
app.use(express.static('public'));

app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.sendFile(path.join(__dirname+'/views/home.html'));
  //res.end();
});

app.ws('/', function(ws, req) {
  // Here you'd parse the commands you want to send back and do any
  var msg = {lol: 'asdf', blah: 'qq'};
  var totalMessages = 0;

  ws.on('message', function(message) {
    totalMessages += 1;
    console.log('received: %s', message, totalMessages);
    //ws.send(JSON.stringify(message));

    if (message == 'stop') {
      ws.send('this.isMovingUp = false');
    }
    if (message == 87){
      ws.send('this.isMovingUp = true');
    };
    if (message == 65){
      ws.send('goLeft');
    };

    //console.log(expressWs.getWss().clients.length);
  });

  // Doesn't work - not sure why - prob because it's not a websocket server?
  //   ws.on('open', function(ws) {
  //     console.log('Connection established');
  //     ws.send('something');
  //   });
});

app.listen(3000);
