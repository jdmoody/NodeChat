
var fs = require('fs');
var chatApp = require('./lib/chat_server');

var ourApp = require('http').createServer(handler);

ourApp.listen(8080);

function handler (req, res) {
  // console.log(req.url);
  fs.readFile(__dirname + '/public' + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

chatApp.createChat(ourApp);

console.log("Server running at localhost:8080");