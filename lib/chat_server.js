/* module require, console */
var createChat = function(server) {

  var io = require('socket.io').listen(server);
  var guestNumber = 0;
  var nickNames = {};
  var currentRooms = {};

  io.sockets.on('connection', function (socket) {
    console.log("socket connected!!!");
    guestNumber += 1;
    var thisGuest = guestNumber;
    nickNames[thisGuest] = "guest " + thisGuest;
    var room = '';

    var switchRoom = function (newRoom) {

      socket.join(newRoom);

      if(currentRooms[newRoom]) {
        currentRooms[newRoom].push(socket.id)
      } else {
        currentRooms[newRoom] = [socket.id]
      }

      if(room !== '') {
        socket.leave(room);
        if(currentRooms[room] === [socket.id]) {
          delete currentRooms[room];
        } else {
          var idx = currentRooms[room].indexOf(socket.id);
          if(idx > -1) {
            currentRooms[room].splice(idx, 1)
          }
        }
      }

      room = newRoom;
      io.sockets.in(room).emit('message', { hello: nickNames[thisGuest] +
        'joined the room!' });
      socket.emit('setroom', { room: room });
    };

    switchRoom('lobby')

    io.sockets.in(room).emit('userslist', { users: nickNames });
    io.sockets.in(room).emit('message', { hello: nickNames[thisGuest] +
      ' logged in!' });
    socket.emit('setroom', { room: room });

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
        io.sockets.in(room).emit('userslist', { users: nickNames });
      }
    });

    socket.on('roomChangeRequest', switchRoom);

    socket.on('message', function (message) {
      io.sockets.in(room).emit('message',
        { hello: nickNames[thisGuest] + ": " + message });
    });

    socket.on('disconnect', function() {
      console.log('Got disconnect!');

      io.sockets.in(room).emit('message',
        { hello: nickNames[thisGuest] + ' logged out!' });
      delete nickNames[thisGuest];
      io.sockets.in(room).emit('userslist', { users: nickNames });
    });

    socket.on('leave', function (room) {
      io.sockets.in(room).emit('message',
        { hello: nickNames[thisGuest] + ' left the room' });
    });


  });
};

exports.createChat = createChat;