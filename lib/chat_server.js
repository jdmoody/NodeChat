var createChat = function(server) {

  var io = require('socket.io').listen(server)

  io.sockets.on('connection', function (socket) {
    console.log("socket connected!!!");
    io.sockets.emit('message', { hello: 'User logged in!' });

    socket.on('message', function (message) {
      io.sockets.emit('message', { hello: message });
      console.log(message);
    });
  });
}

exports.createChat = createChat;