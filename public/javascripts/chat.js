(function(root) {
  var ChatApp = root.ChatApp = (root.ChatApp || {});

  var Chat = ChatApp.Chat = function (socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function (message) {
    this.socket.emit('message', message)
  };

  Chat.prototype.changeUsername = function(username) {
    this.socket.emit('nickNameChangeRequest', username);
  };

  Chat.prototype.changeRoom = function(room) {
    this.socket.emit('roomChangeRequest', room);
  };

  Chat.prototype.sendCommand = function(command, argument) {
    switch(command) {
      case "/nick":
        this.changeUsername(argument)
        break;
      case: "/room":
        this.changeRoom(argument)
        break;
    }
  };

})(this);