var createChat = function(server) {

  var io = require('socket.io').listen(server)
  var guestNumber = 0;
  var nickNames = {}
  var currentRooms = {}



  io.sockets.on('connection', function (socket) {
    console.log("socket connected!!!");
    guestNumber += 1;
    var thisGuest = guestNumber;
    nickNames[thisGuest] = "guest " + thisGuest;

    io.sockets.emit('userslist', { users: nickNames });
    io.sockets.emit('message', { hello: nickNames[thisGuest] + ' logged in!' });

    socket.on('nickNameChangeRequest', function(nickName) {
      if(nickNames.hasOwnProperty(nickName)){
        socket.emit('nickNameChangeResult', {
          success: false,
          message: 'Name already taken'
        });
      } else if(nickName.slice(0, 5) === "guest"){
        socket.emit('nickNameChangeResult', {
          success: false,
          message: 'Name cannot begin with "guest"'
        });
      } else {
        nickNames[thisGuest] = nickName;
        io.sockets.emit('userslist', { users: nickNames });
      }
    })

    socket.on('roomChangeRequest', function(nickName) {

      nickNames[thisGuest] = nickName;
      io.sockets.emit('userslist', { users: nickNames });
    })

    socket.on('message', function (message) {
      io.sockets.emit('message', { hello: nickNames[thisGuest] + ": " +
        message });
    });

    socket.on('disconnect', function() {
          console.log('Got disconnect!');

          io.sockets.emit('message', { hello: nickNames[thisGuest] + ' logged out!' });
          delete nickNames[thisGuest];
          io.sockets.emit('userslist', { users: nickNames });
       });
  });
}

exports.createChat = createChat;