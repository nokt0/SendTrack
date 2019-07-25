const express = require("express");
var req = require("request");
var fs = require("fs");
var cors = require('cors')



const app = express();
const base64key =
    "Yjc0MmYwNWIxM2JkNGIzZmFmYzQ1MWNhOTYzYTMwNTM6NDM1M2FiZjQxMThjNGZkZDg2ODdhZjk4ZDQ3ZTA1NmM=";

var token = {
    key: "",
    date: 0,
    expires: 0
};

var options = {
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
        "Authorization": "Basic " + base64key,
        'content-type': 'application/x-www-form-urlencoded'
    }
};

app.use(cors());

app.get("/token", function (request, response, next) {
    var content = fs.readFileSync("./private/token.json", "utf8");
    var token = JSON.parse(content);
    console.log(token.date);
    console.log(Date.now() + 3600000);

    if (token.key === "" || Date.now() > token.date.valueOf() + token.expires - 120000 || token.date === 0) {

        function callback(error, resp, body) {
            if (!error && resp.statusCode == 200) {
                
                var info = JSON.parse(body);
                token.key = info.access_token;
                token.date = Date.now();
                token.expires = info.expires_in * 1000;
                console.log(token.date.toString());
                fs.writeFileSync("./private/token.json", JSON.stringify(token));
                response.send({token: token.key});
            }
            else
                console.log(resp.statusCode);
                console.log(body);

        }

        req(options, callback);
    }
    else
        response.send({token: token.key});
});

app.get("/", function (request, response) {
    console.log("Route /");
    response.send("Hello");
});
app.listen(9741);
