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

const constants = require('./consts');
const requestData = require('./requestLib');
const express = require('express');
const req = require('request')
const cors = require('cors');

const deezerRouter = express.Router();
const spotifyRouter = express.Router();
const youTubeRouter = express.Router();
const app = express();

app.use(cors());

app.get("/search", async (request, response) => {
    let responseJson = { ...constants.RESPONSE_JSON };
    function setResponseJson(data) {
        responseJson = {...responseJson,...data};
    };

    async function requestAll() {
        return Promise.allSettled([requestData.youtube(request, constants.SEARCH_REQUEST)
            .then((json) => {
                setResponseJson(json);
                console.log(responseJson)
            })]);

    };

    await requestAll();
    response.json(responseJson);

})

app.get("/track", (request, response) => {
    let responseJson = { ...constants.RESPONSE_JSON };
    console.log(requestData.tokenSpotify());

})

app.use("/youtube", youTubeRouter);

youTubeRouter.get("/search", (request, response) => youtubeRequest(request, response, "/search?"));
youTubeRouter.get("/videos", (request, response) => youtubeRequest(request, response, "/videos?"));


app.use('/deezer', deezerRouter);

deezerRouter.get('/track', function (request, response) {
    let trackId = request.query.id;
    let requestOptions = constants.DEEZER_OPTIONS;
    requestOptions.url = constants.API_DEEZER_URL + 'track/' + trackId;
    console.log(requestOptions.url);
    req(requestOptions, function (error, resp, body) {
        response.send(JSON.parse(body));
    })

});

deezerRouter.get('/search', function (request, response) {
    let track = request.query.track;
    let artist = request.query.artist;
    let requestOptions = { ...constants.DEEZER_OPTIONS };
    requestOptions.url = constants.API_DEEZER_URL + 'search?q=';
    if (track && artist)
        requestOptions.url += 'track:"' + track + '" artist:"' + artist + '"';
    else if (artist)
        requestOptions.url += 'artist:"' + artist + '"';
    else if (track)
        requestOptions.url += track;

    console.log(requestOptions.url);
    requestOptions.url = encodeURI(requestOptions.url);
    req(requestOptions, function (error, resp, body) {
        if (error != null) {
            response.send({ error: error });
            return;
        }
        response.send(JSON.parse(body));
    })
});

deezerRouter.get('/', function (request, response) {
    response.send('deezer api');
});

app.use("/spotify", spotifyRouter);

spotifyRouter.get("/tracks/:trackName", function (request, response) {
    let options = {
        ...constants.SPOTIFY_OPTIONS, headers: {
            "Authorization": "Bearer " + requestData.tokenSpotify().token,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    };
    options.url += "/tracks/" + request.query.trackName;
    req(options, function (error, resp, body) {
        if (error != null) {
            response.send({ error: error });
            return;
        }
        response.send(JSON.parse(body));
    });
});

spotifyRouter.get("/search", function (request, response) {
    let requestUrl = "/search?";
    let options = {
        ...constants.SPOTIFY_OPTIONS, headers: {
            "Authorization": "Bearer " + request.tokenSpotify,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    };

    for (let q in request.query) {
        requestUrl += q + "=" + request.query[q] + "&";
    }

    options.url += requestUrl;

    req(options, function (error, resp, body) {
        if (error != null) {
            response.send({ error: error });
            return;
        }
        response.send(JSON.parse(body));
    });

});

app.use('/SendTrack', express.static(__dirname + '../build'));
app.use('/SendTrack/static', express.static(__dirname + '../build/static'));

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + "../build/index.html");
});

if (module === require.main) {
    const server = app.listen(process.env.PORT || 8080, () => {
        const port = server.address().port;
        console.log(`App listening on port ${port}`);
    });
}

module.exports = app;
