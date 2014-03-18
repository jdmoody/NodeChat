(function(root) {
  var ChatApp = root.ChatApp = ( root.ChatApp || {} )

  var ChatUi = ChatApp.ChatUi = function() {
    this.socket = io.connect();
    this.socket.on('message', this.addMessageToUserDisplay)
    this.chat = new ChatApp.Chat(this.socket);
  }

  ChatUi.prototype.getMessageFromInput = function(msg) {
    this.sendMessageToUsers(msg);
    this.addMessageToUserDisplay(msg);
  }

  ChatUi.prototype.sendMessageToUsers = function(msg) {
    this.chat.sendMessage(msg);
  }

  ChatUi.prototype.addMessageToUserDisplay = function(msg) {
    var $el = $('<p></p>')

    $el.text(msg.hello)
    $('#display').append($el)
  }
})(this)