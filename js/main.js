$(function() {
  var current = 0;

  var ws = new WebSocket('ws://0.0.0.0:51234');
  ws.onmessage = function(evt) {
    var obj = JSON.parse(evt.data);
    var msg = obj['msg'];
    var data = obj['data'];

    if (msg == 'init') {
      init(data);
    } else if (msg == 'update') {
      update(data);
    }
  };

  ws.onclose = function() {
  };

  ws.onopen = function() {
  };

  function init(data) {
    $('#connecting').hide();

    for (var i = 0; i < data['size']; i++) {
      // nav-tab
      var li = $('<li>');
      var a = $('<a>').attr({
        'href': '#tab' + i,
        'data-toggle': 'tab'
      });
      var img = $('<img>').attr('id', 'thumb' + i);
      $('.nav-tabs').append(li.append(a.append(img)));

      // tab-ontent
      var div = $('<div>').attr({
        'id': 'tab' + i,
        'class': 'tab-pane'
      });
      img = $('<img>').attr('id', 'image' + i);
      $('.tab-content').append(div.append(img));
    }

    $('.nav-tabs li:first').addClass('active');
    $('.tab-content div:first').addClass('active');
  }

  function update(data) {
    for (var i = 0; i < data['size']; i++) {
      var src = 'data:image/gif;base64,' + data['images'][i];
      $('#thumb' + i).attr('src', src);
      $('#image' + i).attr('src', src);
    }
  }
});

