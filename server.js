// Copyright 2018, Google LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
var fs = require("fs");
const app = express();
var req = require("request");
var cors = require('cors');
const deezerRouter = express.Router();

app.use(cors());

const base64key =
  "Yjc0MmYwNWIxM2JkNGIzZmFmYzQ1MWNhOTYzYTMwNTM6NDM1M2FiZjQxMThjNGZkZDg2ODdhZjk4ZDQ3ZTA1NmM=";

var token = {
  key: "",
  date: 0,
  expires: 0
};

var spotifyOptions = {
  url: "https://accounts.spotify.com/api/token",
  method: "POST",
  body: "grant_type=client_credentials",
  headers: {
    "Authorization": "Basic " + base64key,
    'content-type': 'application/x-www-form-urlencoded'
  }
};

var deezerOptions = {
  url: "https://api.deezer.com/",
  headers: {
    'content-type': 'application/json'
  }
}

app.get("/token", function (request, response, next) {
  var content = fs.readFileSync("./private/token.json", "utf8");
  var token = JSON.parse(content);
  console.log(new Date(token.date).toString());
  console.log(new Date(Date.now() + 3600000).toString());

  if (token.key === "" || Date.now() > token.expires || token.date === 0) {

    function callback(error, resp, body) {
      if (!error && resp.statusCode == 200) {

        var info = JSON.parse(body);
        token.key = info.access_token;
        token.date = Date.now();
        token.expires = Date.now() + 3600000;
        console.log(token.date.toString());
        fs.writeFileSync("./private/token.json", JSON.stringify(token));
        response.send(
          {
            token: token.key,
            expires: token.expires
          });
      }
      else
        console.log(resp.statusCode);
      console.log(body);

    }

    req(spotifyOptions, callback);
  }
  else
    response.send({ token: token.key, expires: token.expires });
});



app.use('/deezer', deezerRouter);

deezerRouter.get('/track', function (request, response) {
  let trackId = request.query.id;
  let requestOptions = deezerOptions;
  requestOptions.url = 'https://api.deezer.com/track/' + trackId;
  console.log(requestOptions.url);
  req(requestOptions, function (error, resp, body) {
    response.send(JSON.parse(body));
  })

});

deezerRouter.get('/search', function (request, response) {
  let track = request.query.track;
  let artist = request.query.artist;
  let requestOptions = deezerOptions;
  requestOptions.url = 'https://api.deezer.com/search?q=';
  if (track && artist)
    requestOptions.url += 'track:"' + track + '" ' + 'artist:"' + artist + '"';
  else
    if (artist)
      requestOptions.url += 'artist:"' + artist + '"';
    else
      if (track)
        requestOptions.url += track;

  console.log(requestOptions.url);
  requestOptions.url = encodeURI(requestOptions.url);
  req(requestOptions, function (error, resp, body) {
    response.send(JSON.parse(body));
  })
});

deezerRouter.get('/', function (request, response) {
  response.send('deezer api');
})

app.use('/SendTrack', express.static(__dirname + '/build'));
app.use('/SendTrack/static', express.static(__dirname + '/build/static'));


// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + "/build/index.html");
});
// [END hello_world]

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
