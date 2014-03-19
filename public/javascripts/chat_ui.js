(function(root) {
  var ChatApp = root.ChatApp = ( root.ChatApp || {} )

  var ChatUi = ChatApp.ChatUi = function() {
    this.socket = io.connect();
    this.socket.on('message', this.addMessageToUserDisplay)
    this.socket.on('userslist', this.addUsersToUserDisplay)
    this.chat = new ChatApp.Chat(this.socket);
  }

  ChatUi.prototype.getMessageFromInput = function(msg) {
    if (msg[0] === "/") {
      var cmd = msg.split(' ')[0]
      var arg = msg.split(' ')[1]

      this.chat.sendCommand(cmd, arg)
    } else {
      this.sendMessageToUsers(msg);
      this.addMessageToUserDisplay(msg);
    }
  }

  ChatUi.prototype.sendMessageToUsers = function(msg) {
    this.chat.sendMessage(msg);
  }

  ChatUi.prototype.addMessageToUserDisplay = function(msg) {
    var $el = $('<p></p>')

    $el.text(msg.hello)
    $('#display').append($el)
  }

  ChatUi.prototype.addUsersToUserDisplay = function(msg) {
    $('#users').empty()
    for(var i = 0; i < Object.keys(msg.users).length; i++) {
      var $el = $('<p></p>');
      $el.text(msg.users[Object.keys(msg.users)[i]]);
      $('#users').append($el);
    }
  }

  ChatUi.prototype.setUsername = function (username) {
    this.chat.changeUsername(username)
  }

})(this)