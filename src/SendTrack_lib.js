var ServicesUrl = {
    YoutubeMusic: "youtube.music",
    Youtube: "youtube",

}


function createObjectToCompare(artist, track, url) {
    return {
        artist: artist,
        track: track,
        url: url,
    }
}

function processInputUrl() {
    var form = document.getElementById("urlForm");
    var urlForm = document.getElementById("inputUrlForm");
    var submitBtn = document.getElementById("submitBtn");

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        console.log('link was sent');

        var resObj = requestYoutubeObject(
            createYoutubeArguments(
                checkService(urlForm.value)
            )
        );

        var result = document.getElementById("result");
        if (result.firstChild === null)
            result.appendChild(document.createTextNode(JSON.stringify(resObj)));
        else
            result.firstChild.nodeValue = JSON.stringify(resObj);

        var artist = resObj.items[0].channelTitle;
        var track = resObj.items[0].snippet.title;
        var url = "https://www.youtube.com/watch?v=" + resObj.items[0].id;

        var objectToCompare = createObjectToCompare(artist, track, url);
        var index = objectToCompare.artist.indexOf(" - Topic");
        if(index !== -1)
            objectToCompare.artist = objectToCompare.artist.substring(0, index - 1);

    });

}


/*function CreateRequest(serviceObj){

    
    switch (serviceObj.service){
        case ServicesUrl.Youtube :
        var argarr = createYoutubeArguments(serviceObj.cutUrl);


            break;
    }
    


}*/

function requestYoutubeObject(argumentsObj) {

    var xhr = new XMLHttpRequest();
    var YOUTUBE_API_SERVER = "https://www.googleapis.com/youtube/v3/videos?part=snippet";
    var API_KEY = "AIzaSyBEYdv5D-1VmQHgb5d3jR2qn2mo_mvlr9g";
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

function createYoutubeMusicArguments() {

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
        var finded = checkServiceUrl(inputUrl, ServicesUrl[Service]);
        if (finded !== -1) {
            index = finded;
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