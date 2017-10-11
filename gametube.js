var API_KEY = 'AIzaSyC_cec0UVnf6e9qfO2j6fKpjmykSH_EJbE';
var PLAY_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-a7O8wuUkBCmoyrCZyfJAMPx1zbM8tianwBpnzWD6lP5a8tp4CkGBRfxi2oYJSwRErpUr1n-1sLe1/pub?gid=11&single=true&output=csv';
var DONE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-a7O8wuUkBCmoyrCZyfJAMPx1zbM8tianwBpnzWD6lP5a8tp4CkGBRfxi2oYJSwRErpUr1n-1sLe1/pub?gid=12&single=true&output=csv';

function rng(a, b) {  // [a, b)
  return a + Math.random() * (b - a);
}

function irng(a, b) {  // [a, b]
  return Math.floor(rng(a, b + 1));
}

function random(list) {
  return list[irng(0, list.length - 1)];
}

function playRandomVideo(q) {
  q = encodeURIComponent(q);
  $.get('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&key=' + API_KEY + '&q=' + q, function(search_results) {
    console.log(search_results);
    var video_id = random(search_results.items).id.videoId;
    $.get('https://content.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + video_id + '&key=' + API_KEY, function(video_details) {
      console.log(video_details);
      var length = moment.duration(video_details.items[0].contentDetails.duration).asSeconds();
      console.log(length);
      var start = irng(length/3, 2*length/3);
      document.getElementById('frame').src = 'https://www.youtube.com/embed/' + video_id + '?autoplay=1&start=' + start + '&listType=search&list=' + q;
    });
  });
}

function playForPavel() {
  $.get(PLAY_URL, function(spreadsheet) {
    var rows = spreadsheet.split('\n');
    rows.shift();  // remove heading
    var name = '';
    while (name == '') {
      name = random(rows).split(',')[0];
    }
    playRandomVideo(name + ' gameplay');
  });
}

function playForBrittany() {
  $.get(PLAY_URL, function(data) {
    var play_rows = data.split('\n');
    play_rows.shift();  // remove heading
    $.get(DONE_URL, function(data) {
      var done_rows = data.split('\n');
      done_rows.shift();  // remove heading
      var rows = play_rows.concat(done_rows);
      var name = '';
      while (name == '') {
        name = random(rows).split(',')[0];
      }
      playRandomVideo(name + ' gameplay');
    });
  });
}

/*if (location.protocol != 'https:') {
 location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}*/
