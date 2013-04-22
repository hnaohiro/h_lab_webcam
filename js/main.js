$(function() {
  var ws = new WebSocket('ws://0.0.0.0:51234');

  ws.onopen = function() {
    $('#connecting').hide();
    $('#capture-area').append($('<img>').attr('id', 'capture'));
  };

  ws.onclose = function() {
  };

  ws.onmessage = function(evt) {
    var src = 'data:image/jpeg;base64,' + evt.data;
    $('#capture').attr('src', src);
  };
});

