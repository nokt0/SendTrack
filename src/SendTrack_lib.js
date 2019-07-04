
const ServicesUrl = {
    youtubeMusic: "youtube.music",
    youtube: "youtube",
    spotify: "spotify"

}

function createObjectToCompare(artist, track, url) {
    return {
        artist: artist,
        track: track,
        url: url,
    }
}

export function urlWorker(url) {

    var serviceObj = checkService(url);
    var objectToCompare;

    switch (serviceObj.service) {
        case "youtube.music":
            ;
        case "youtube":
            var requestObj = requestYoutubeObject(
                createYoutubeArguments(serviceObj));
            const artist = requestObj.items[0].snippet.channelTitle;
            const track = requestObj.items[0].snippet.title;

            var resUrl;
            if (serviceObj.service === 'youtube')
                resUrl = "https://www.youtube.com/watch?v=" + requestObj.items[0].id;
            else
                if (serviceObj.service === 'music.youtube')
                    resUrl = "https://www.music.youtube.com/watch?v=" + requestObj.items[0].id;

            objectToCompare = createObjectToCompare(artist, track, resUrl);
            console.log(objectToCompare);
            var index = objectToCompare.artist.indexOf(" - Topic");
            if (index !== -1)
                objectToCompare.artist = objectToCompare.artist.substring(0, index);
            break;

        case "spotify":
            var requestObj = requestSpotifyObject(
                createSpotifyArguments(serviceObj));
            console.log(requestObj);
            break;


        default:
            return {
                artist: '',
                track: 'Not found:(',
                url: ''
            };
    }

    return objectToCompare;

};


function processInputUrl() {
    var form = document.getElementById("urlForm");
    var urlForm = document.getElementById("inputUrlForm");

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('link was sent');

        var requestObj = requestYoutubeObject(
            createYoutubeArguments(
                checkService(urlForm.value)
            )
        );

        var result = document.getElementById("result");
        if (result.firstChild === null)
            result.appendChild(document.createTextNode(JSON.stringify(requestObj)));
        else
            result.firstChild.nodeValue = JSON.stringify(requestObj);

        var artist = requestObj.items[0].channelTitle;
        var track = requestObj.items[0].snippet.title;
        var url = "https://www.youtube.com/watch?v=" + requestObj.items[0].id;

        var objectToCompare = createObjectToCompare(artist, track, url);
        var index = objectToCompare.artist.indexOf(" - Topic");
        if (index !== -1)
            objectToCompare.artist = objectToCompare.artist.substring(0, index - 1);

    });

}

export function urlValidator(url) {
    return true;
}


function requestYoutubeObject(argumentsObj) {

    var xhr = new XMLHttpRequest();
    const YOUTUBE_API_SERVER = "https://www.googleapis.com/youtube/v3/videos?part=snippet";
    const API_KEY = "AIzaSyBEYdv5D-1VmQHgb5d3jR2qn2mo_mvlr9g";
    var resultRequest = YOUTUBE_API_SERVER;

    for (var argument in argumentsObj) {
        switch (argument) {
            case "v":
                resultRequest += "&id=" + argumentsObj[argument];
                break;
            default:
                break;
        }
    }

    resultRequest += "&key=" + API_KEY;

    xhr.open('GET', resultRequest, false);

    // 3. Отсылаем запрос
    xhr.send();

    var videoInfoObj = JSON.parse(xhr.responseText);

    // 4. Если код ответа сервера не 200, то это ошибка
    if (xhr.status !== 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        alert(xhr.responseText); // responseText -- текст ответа.
    }
    return videoInfoObj;
}

function requestSpotifyObject(argumentsObj) {
    const SPOTIFY_API_SERVER = "https://api.spotify.com/v1/";
    const API_KEY = "BQBYUBCmIjakdPnX6XLr3G08b9l73kjHh7iJ56vvCClSi_q68WDdyHvAlsPjsiHQs8OJYJ1Nm_Ne4GQULE1VyFYr9XAPTEXJMgyRugIQ8fl24UwY_U1eulpzB68d3PiytNm5t-l71xvQW4-VAjD-A0fa2AHGhfNLPIkhJ33-E15AV-NkOKzfNB5FCV2K2NM39OgyMR6ls21EbyDSU8Q3oNFMzvG_2QgY6GpMtW0-V1I09aWhIKnAk6HYiy0HFbxyU5rKTbKvhD_YQrnE6vVC033yrftfVm1lfXc";

    var url = SPOTIFY_API_SERVER;
    for (var arg in argumentsObj) {
        url += arg + '/' + argumentsObj[arg];
    }
    var xhr = new XMLHttpRequest();
    
    console.log(url);
    xhr.open('GET', url, false);
    
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + API_KEY);

    xhr.send();

    if (xhr.status !== 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        alert(xhr.responseText); // responseText -- текст ответа.
    }

    var requestObj = JSON.parse(xhr.responseText);
    console.log(xhr.responseText);

    return requestObj;

}

function createSpotifyArguments(serviceObj) {

    var urlSubstring = serviceObj.cutUrl;
    var argumentsObj = {};

    var arrayArguments = urlSubstring.split('/');
    argumentsObj[arrayArguments[0]] = arrayArguments[1];

    console.log(argumentsObj);

    return argumentsObj;
}

function createYoutubeArguments(serviceObj) {

    var urlSubstring = serviceObj.cutUrl;

    function eraseYoutubeWatchArg(urlSubstring) {
        var index = urlSubstring.indexOf('watch?');
        return urlSubstring.substring(index + 'watch?'.length);
    }

    var result = {};

    var arrayArguments = eraseYoutubeWatchArg(urlSubstring).split('&');
    for (var i = 0; i < arrayArguments.length; i++) {
        var index = arrayArguments[i].indexOf("=");
        var argument = arrayArguments[i].substring(0, index > 1 ? index - 1 : index);
        var value = arrayArguments[i].substring(index + 1, arrayArguments[i].length);
        result[argument] = value;
    }

    return result;

}

function eraseDomain(urlString) {
    var index = urlString.indexOf('/');
    return urlString.substring(index + 1);
}

function checkService(inputUrl) {
    var index = -1;
    var serviceName = "";

    for (var Service in ServicesUrl) {
        var found = checkServiceUrl(inputUrl, ServicesUrl[Service]);
        if (found !== -1) {
            index = found;
            serviceName = ServicesUrl[Service];
        }
    }

    var cutUrl = inputUrl.substring(index);
    cutUrl = eraseDomain(cutUrl);


    return {
        service: serviceName,
        cutUrl: cutUrl,
    }

}

function checkServiceUrl(urlString, serviceString) {
    var index = urlString.indexOf(serviceString);
    if (index !== -1)
        index += serviceString.length;

    return index;
}