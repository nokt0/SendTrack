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

const express = require('express');
const constants = require('./consts');
const requestData = require('./requestLib');
const fs = require("fs");
const app = express();
const req = require("request");
const cors = require('cors');
const fetch = require('node-fetch');
const freeze = require('deep-freeze-node');
require('dotenv').config();
const deezerRouter = express.Router();
const spotifyRouter = express.Router();
const youTubeRouter = express.Router();
app.use(cors());

const base64key = process.env.BASE64_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const deezerOptions = freeze({
    url: "https://api.deezer.com/",
    headers: {
        "content-type": "application/json"
    }
});

const spotifyOptions = freeze({
    url: "https://api.spotify.com/v1",
    headers: {
        "Accept": "application/json",
        "Authorization": "Bearer ",
        "content-type": "application/json"
    }
});


function requestToken() {
    const spotifyTokenOptions = {
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            "Authorization": "Basic " + base64key,
            'content-type': 'application/x-www-form-urlencoded'
        }
    };

    let content = fs.readFileSync("./private/token.json", "utf8");
    let token = JSON.parse(content);
    console.log(new Date(token.date).toString());
    console.log(new Date(Date.now() + 3600000).toString());

    if (token.key === "" || Date.now() > token.expires || token.date === 0) {

        function callback(error, resp, body) {
            if (!error && resp.statusCode === 200) {

                let info = JSON.parse(body);
                token.key = info.access_token;
                token.date = Date.now();
                token.expires = Date.now() + 3600000;
                console.log(token.date.toString());
                fs.writeFileSync("../private/token.json", JSON.stringify(token));
                return {
                    token: token.key,
                    expires: token.expires
                };
            } else
                console.log(resp.statusCode);
            console.log(body);
        }

        req(spotifyTokenOptions, callback);
    } else
        return { token: token.key, expires: token.expires };
};

function youtubeRequest(request, response, route) {
    const youTubeOptions = {
        url: "https://www.googleapis.com/youtube/v3",
        headers: {
            'content-type': 'application/json'
        }
    };

    let requestUrl = route;
    for (let q in request.query) {
        requestUrl += q + "=" + request.query[q] + "&";
    }

    requestUrl += "key=" + YOUTUBE_API_KEY;
    req({ ...youTubeOptions }.url + requestUrl, function (error, resp, body) {
        if (error != null) {
            response.send({ error: error });
            return;
        }
        response.send(JSON.parse(body));
    });
}


app.get("/search", async (request, response) => {
    let responseJson = { ...constants.RESPONSE_JSON };

    let spotify = requestData.spotify(request.query, constants.SEARCH_REQUEST);
    let youtube = requestData.youtube(request.query,constants.SEARCH_REQUEST);
    let deezer = requestData.deezer(request.query, constants.SEARCH_REQUEST);
    let promisesArr = [spotify,youtube,deezer];

   responseJson = await Promise.allSettled(promisesArr)
    .then(values=>
        values.reduce((accumulator,currentValue)=>{
            return {...accumulator,...currentValue.value};
    },{}));

    response.json(responseJson);

});

app.get("/track", (request, response) => {
    let responseJson = { ...constants.RESPONSE_JSON };

})

app.use("/youtube", youTubeRouter);

youTubeRouter.get("/search", (request, response) => youtubeRequest(request, response, "/search?"));
youTubeRouter.get("/videos", (request, response) => youtubeRequest(request, response, "/videos?"));


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
    let requestOptions = { ...deezerOptions };
    requestOptions.url = 'https://api.deezer.com/search?q=';
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
        ...spotifyOptions, headers: {
            "Authorization": "Bearer " + requestToken().token,
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
        ...spotifyOptions, headers: {
            "Authorization": "Bearer " + requestToken().token,
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
