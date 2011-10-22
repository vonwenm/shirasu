(function() {
  $(function() {
    var chat, escape, parse, stream;
    escape = function(data) {
      return $("<div/>").text(data).html();
    };
    stream = function(d) {
      var data, line, now;
      now = new Date();
      data = d.data;
      if (data[data.length - 1] !== "\n") {
        data += "\n";
      }
      line = "[" + (d.time.slice(0, 3).join(':')) + "." + d.time[3] + "]&nbsp;" + data;
      return $("#stream").prepend(line);
    };
    parse = function(e) {
      var hours, milliseconds, minutes, now, result, seconds;
      now = new Date();
      hours = now.getHours();
      minutes = now.getMinutes();
      seconds = now.getSeconds();
      milliseconds = now.getMilliseconds();
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      result = {
        data: escape(e.data),
        time: [hours, minutes, seconds, milliseconds]
      };
      return result;
    };
    chat = {
      connect: function() {
        this._ws = new WebSocket("ws://" + window.location["host"] + "/chat");
        this._ws.onmessage = this._onmessage;
        this._ws.onclose = this._onclose;
      },
      send: function(message) {
        var _ref;
        if ((message != null ? message.length : void 0) > 0) {
          if ((_ref = this._ws) != null) {
            _ref.send(message);
          }
        }
      },
      _onmessage: function(e) {
        var $line, d;
        d = parse(e);
        stream(d);
        $line = $("<p/>").html("" + (d.time.slice(0, 3).join(':')) + "&raquo;&nbsp;" + d.data);
        $("#chat .log").prepend($line);
      },
      _onclose: function(e) {
        this._ws = null;
      }
    };
    $("#chat input:submit").click(function() {
      var $text;
      $text = $("#chat .text");
      chat.send($text.val());
      $text.val("").focus();
    });
    return chat.connect();
  });
}).call(this);