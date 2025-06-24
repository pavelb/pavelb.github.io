const PAPOY_1 = 'QUl6YVN5Q2R5N';
const PAPOY_2 = 'GZQVThM';
const PAPOY_3 = 'ckt0djRDX1ZxRTlTellxRU';
const PAPOY_4 = 'RGZ01wNjY0'
const HUH = 'a' + 't';
const PAPOY = window[HUH + 'o' + 'b'](PAPOY_1 + PAPOY_2 + PAPOY_3 + PAPOY_4);
const PLAY_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-a7O8wuUkBCmoyrCZyfJAMPx1zbM8tianwBpnzWD6lP5a8tp4CkGBRfxi2oYJSwRErpUr1n-1sLe1/pub?gid=11&single=true&output=csv';
const DONE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-a7O8wuUkBCmoyrCZyfJAMPx1zbM8tianwBpnzWD6lP5a8tp4CkGBRfxi2oYJSwRErpUr1n-1sLe1/pub?gid=12&single=true&output=csv';

function rng(a, b) {  // [a, b)
  return a + Math.random() * (b - a);
}

function irng(a, b) {  // [a, b]
  a = Math.floor(a);
  b = Math.floor(b);
  return Math.floor(rng(a, b + 1));
}

function random(list) {
  return list[irng(0, list.length - 1)];
}

function showGame(game) {
  var q = game + ' gameplay';
  $(document).attr('title', q);
  q = encodeURIComponent(q);
  $.get('https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&key=' + PAPOY + '&q=' + q, function(search_results) {
    console.log('search_results', search_results);
    const videoId = random(search_results.items).id.videoId;
    $.get('https://content.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + videoId + '&key=' + PAPOY, function(video_details) {
      console.log('video_details', video_details);
      const lengthSeconds = moment.duration(video_details.items[0].contentDetails.duration).asSeconds();
      const startSeconds = irng(lengthSeconds/3, 2*lengthSeconds/3);
      // const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${startSeconds}&iv_load_policy=3&modestbranding=1`;
      // document.getElementById('frame').src = embedUrl;
      window.open(`https://www.youtube.com/v/${videoId}?start=${startSeconds}`);
    }).fail(function() {
      showGame2(game);
    });
  }).fail(function() {
    showGame2(game);
  });
}

function showGame2(game) {
  window.open('https://www.youtube.com/results?search_query=' + game + ' gameplay')
}

function processRawRows(row_data) {
  var raw_rows = row_data.split('\n');
  var rows = [];
  for (var i = 0; i < raw_rows.length; ++i) {
    var row = raw_rows[i].split(',');
    if (row.length < 3) {  // remove separators
      continue;
    }
    if (row[0].trim() === '') {  // remove blank lines
      continue;
    }
    if (row[0] === 'Name') {  // remove headings
      continue;
    }
    if (window.location.hash.includes('have') && row[5] !== 'TRUE') {  // remove unowned games
      continue;
    }
    rows.push(row);
  }
  return rows;
}

function showRandomGame(row_data) {
  var rows = processRawRows(row_data);
  console.log('rows', rows);
  var row = random(rows);
  console.log('row', row);
  if (window.location.hash.includes('embed')) {
    showGame(row[0]);
  } else {
    showGame2(row[0]);
  }
}

function playForPavel() {
  $.get(PLAY_URL, showRandomGame);
}

function playForBrittany() {
  $.get(PLAY_URL, function(play_data) {
    $.get(DONE_URL, function(done_data) {
      showRandomGame(play_data + '\n' + done_data);
    });
  });
}

/*if (location.protocol != 'https:') {
 location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}*/
