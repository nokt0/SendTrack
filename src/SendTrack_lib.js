const ServicesUrl = {
    youtubeMusic: "music.youtube",
    youtube: "youtube",
    spotify: "spotify",
    appleMusic: "music.apple"

}

var SPOTIFY_API_KEY = ''


export function urlWorker(url) {

    /* var base64key = 'Yjc0MmYwNWIxM2JkNGIzZmFmYzQ1MWNhOTYzYTMwNTM6NDM1M2FiZjQxMThjNGZkZDg2ODdhZjk4ZDQ3ZTA1NmM=';
    var xhr = new XMLHttpRequest();
    var body = 'grant_type=' + encodeURIComponent('client_credentials');
    const spotifyAuthServer = 'https://accounts.spotify.com/api/token';
    xhr.open("POST", spotifyAuthServer + '?' + body, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + base64key);
    var result;

    xhr.send();
    if (xhr.status !== 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        // responseText -- текст ответа.
        result = JSON.parse(xhr.responseText);
    }
    SPOTIFY_API_KEY = result.access_token;
 */


    var serviceObj = checkService(url);
    var objectToCompare;

        if(serviceObj.service === ServicesUrl.youtube || serviceObj.service === ServicesUrl.youtubeMusic) {
            let requestObj = requestYoutubeObject(
                createYoutubeArguments(serviceObj), 'track');

            if ('isAlbum' in requestObj)
                return {
                    notValid: 'this is playlist. Now we cant work with them',
                    artist: '',
                    track: 'this is playlist. Now we cant work with them',
                    url: '',
                    service: serviceObj.service
                }

            if ('notValid' in requestObj)
                return {
                    notValid: 'Not found:(',
                    artist: '',
                    track: 'Not found:(',
                    url: '',
                    service: serviceObj.service
                };

            console.log(requestObj);

            var artist;
            var track;
            let index = requestObj.items[0].snippet.title.indexOf('-');

            if (requestObj.items[0].snippet.title.indexOf('-') !== -1) {
                artist = requestObj.items[0].snippet.title.substring(0, index);
                track = requestObj.items[0].snippet.title.substring(index, requestObj.items[0].snippet.title.length);
            }
            else {
                artist = requestObj.items[0].snippet.channelTitle;
                track = requestObj.items[0].snippet.title;
            }
            //ERASE BRACKETS
            track = eraseBrackets(track);
            artist = eraseBrackets(artist);

            var resUrl;
            if (serviceObj.service === 'youtube')
                resUrl = "https://www.youtube.com/watch?v=" + requestObj.items[0].id;
            else
                if (serviceObj.service === 'youtubeMusic')
                    resUrl = "https://www.music.youtube.com/watch?v=" + requestObj.items[0].id;

            objectToCompare = createObjectToCompare(artist, track, resUrl, serviceObj.service);
            console.log(objectToCompare);
            index = objectToCompare.artist.indexOf(" - Topic");
            if (index !== -1)
                objectToCompare.artist = objectToCompare.artist.substring(0, index);
           return objectToCompare;
        }

       if(serviceObj.service === ServicesUrl.spotify) {
            let requestObj = requestSpotifyObject(
                createSpotifyArguments(serviceObj), 'track');
            console.log(requestObj);

            if (requestObj.type === 'album') {
                return {
                    artist: '',
                    track: 'this is album',
                    url: ''
                }
            }

            if ('notValid' in requestObj)
                return {
                    artist: '',
                    track: 'error:' + requestObj.notValid,
                    url: ''
                }

            track = requestObj.name;
            url = requestObj.external_urls.spotify;
            artist = requestObj.artists[0].name;

            //ERASE BRACKETS
            track = eraseBrackets(track);
            artist = eraseBrackets(artist);

            objectToCompare = createObjectToCompare(artist, track, url, serviceObj.service);

            return objectToCompare;
        }
            return {
                notValid: 'Not Found:(',
                artist: 'Not Found:(',
                track: '',
                url: ''
            };
    }



/* function processInputUrl() {
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

} */

export function urlValidator(url) {
    let index = url.indexOf('.');
    index = url.indexOf('/', index);
    if(index !== -1)
        return true;
    else
        return false;
}

function eraseBrackets(str) {
    let result = str;
    let index;
    if (str.indexOf('(') !== -1 && str.indexOf(')') !== -1) {
        index = str.indexOf('(');
        result = str.substring(0, index) + str.substring(str.indexOf(')') + 1, str.length);
    }

    return result;
}


function requestYoutubeObject(argumentsObj, requestType) {

    var objType = argumentsObj.type;
    delete argumentsObj.type;

    var xhr = new XMLHttpRequest();
    const YOUTUBE_API_SERVER = "https://www.googleapis.com/youtube/v3/";
    const API_KEY = "AIzaSyBEYdv5D-1VmQHgb5d3jR2qn2mo_mvlr9g";
    var resultRequest = YOUTUBE_API_SERVER;

    const maxResults = 10;
    const notValidObj = { notValid: '' }

    if (objType === 'album') {
        resultRequest += 'playlistItems?';
        return {
            isAlbum: ''
        }
    }

    switch (requestType) {
        case 'track':
            resultRequest += 'videos?';
            break;
        case 'search':
            resultRequest += 'search?';
            break;
        default:
            console.log("not valid request type");
            return notValidObj;

    }
    resultRequest += 'part=snippet';

    for (var argument in argumentsObj) {
        switch (argument) {
            case 'v':
                resultRequest += "&id=" + argumentsObj[argument];
                break;
            case 'q':
                resultRequest += "&q=" + argumentsObj[argument] +
                    "&maxResults=" + maxResults;
                break;
            case 'list':
                break;
            case 'feature':
                break;

            default:
                console.log("bad argument = Not Found")
                return notValidObj;
        }
    }
    resultRequest += "&key=" + API_KEY;


    xhr.open('GET', resultRequest, false);
    // 3. Отсылаем запрос
    xhr.send();

    let videoInfoObj = {
        notValid: ''
    }

    // 4. Если код ответа сервера не 200, то это ошибка
    if (xhr.status !== 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        // responseText -- текст ответа.
        if(JSON.parse(xhr.responseText).pageInfo.totalResults !== 0)
            videoInfoObj = JSON.parse(xhr.responseText);
        else
            videoInfoObj.notValid = 'Not Found';
    }

    console.log(videoInfoObj);

    return videoInfoObj;
}

function requestSpotifyObject(argumentsObj, requestType) {

    const SPOTIFY_API_SERVER = "https://api.spotify.com/v1/";
    const API_KEY = "BQCDFfEk2MG9WV9hrKRfQkEyyoL44ELMfwwmAfvGOhgFxSsoXz7ZSaN_m_q_lBru_fy3h9VUFnNoOR4tRmY";
    const notValidObj = { notValid: '' };
    let requestObj = notValidObj;
    const maxResults = 10;
    var url = SPOTIFY_API_SERVER;


    if ('artists' in argumentsObj){
        requestObj.notValid = 'artist';
        return requestObj;
    }
    
    switch (requestType) {
        case 'track':
            url += 'tracks/' + argumentsObj.track;
            break;
        case 'search':
            url += 'search?q=' + argumentsObj.q + '&type=track&limit=' + maxResults;
            break;
        default:
            return notValidObj;
    }

    console.log(url);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + API_KEY);

    xhr.send();

    if (xhr.status !== 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        requestObj[notValidObj] = xhr.statusText;
    } else {
        // вывести результат
        // responseText -- текст ответа.
        if(JSON.parse(xhr.responseText).total !== 0)
            requestObj = JSON.parse(xhr.responseText);
    }


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

function eraseYoutubeWatchArg(urlSubstring) {
    var index = urlSubstring.indexOf('watch?');
    return urlSubstring.substring(index + 'watch?'.length);
}

function createYoutubeArguments(serviceObj) {

    var urlSubstring = serviceObj.cutUrl;
    var result = {};

    if (urlSubstring.indexOf('watch?') !== -1) {
        result.type = 'track';
        eraseYoutubeWatchArg(urlSubstring)
    }
    else {
        result.type = 'album';
        return result;
    }

    var arrayArguments = eraseYoutubeWatchArg(urlSubstring).split('&');
    for (var i = 0; i < arrayArguments.length; i++) {
        var index = arrayArguments[i].indexOf("=");
        var argument = arrayArguments[i].substring(0, index);
        var value = arrayArguments[i].substring(index + 1, arrayArguments[i].length);
        result[argument] = value;
    }
    console.log(result);
    return result;

}

export function createArrayOfUrls(objectToCompare) {
    let arrayOfUrls = {
        spotify: 'Not Found',
        youtube: 'Not Found',
        youtubeMusic: 'Not Found'
    }

    if(objectToCompare.hasOwnProperty('notValid'))
        return arrayOfUrls;

    function writeProps(artist, track, url, albumArt) {
        return {
            artist: artist,
            track: track,
            url: url,
            albumArt: albumArt
        }
    }
    if (objectToCompare.initialService !== ServicesUrl.spotify) {

        let spotifyRequest = {
            q: objectToCompare.artist + ' ' + objectToCompare.track
        }
        console.log(objectToCompare);

        let requestedObj = requestSpotifyObject(spotifyRequest, 'search');
        console.log(requestedObj);

        if (!requestedObj.hasOwnProperty('type') && requestedObj.type !== 'album'
            && !requestedObj.hasOwnProperty('notValid')) {

            let returnedItem = searchInSpotifyObject(requestedObj, objectToCompare);
            if (!returnedItem.hasOwnProperty('notValid')) {
                let artists = '';
                for (var i = 0; i < returnedItem.artists.length; i++) {
                    if (i !== returnedItem.artists.length - 1)
                        artists += returnedItem.artists[i].name + ', ';
                    else
                        artists += returnedItem.artists[i].name;
                }

                arrayOfUrls.spotify = writeProps(artists, returnedItem.name, returnedItem.external_urls.spotify,
                    returnedItem.album.images[1].url);
            }
        }
    }

    if (objectToCompare.initialService !== ServicesUrl.youtubeMusic || objectToCompare.initialService !== 'youtube') {
        let youtubeRequest = {
            q: objectToCompare.artist + ' ' + objectToCompare.track
        }

        console.log('Initial Service: ' + objectToCompare.initialService);  

        let requestedObj = requestYoutubeObject(youtubeRequest, 'search');
        if (!requestedObj.hasOwnProperty('notValid')) {
            let returnedItem = searchInYoutubeObject(requestedObj, objectToCompare);
            if (!returnedItem.hasOwnProperty('notValid')) {
                if (returnedItem.snippet.channelTitle.indexOf('- Topic') === -1) {
                    if (objectToCompare.initialService !== ServicesUrl.youtubeMusic)
                        arrayOfUrls.youtubeMusic = writeProps('', returnedItem.snippet.title, 'https://music.youtube.com/watch?v=' + returnedItem.id.videoId, returnedItem.snippet.thumbnails.medium.url);
                    if (objectToCompare.initialService !== ServicesUrl.youtube)
                        arrayOfUrls.youtube = writeProps('', returnedItem.snippet.title, 'https://youtube.com/watch?v=' + returnedItem.id.videoId, returnedItem.snippet.thumbnails.medium.url);
                }
                else {
                    if (objectToCompare.initialService !== ServicesUrl.youtubeMusic)
                        arrayOfUrls.youtubeMusic = writeProps(returnedItem.snippet.channelTitle.substring(0, returnedItem.snippet.channelTitle.indexOf('- Topic')),
                            returnedItem.snippet.title, 'https://music.youtube.com/watch?v=' + returnedItem.id.videoId,
                            returnedItem.snippet.thumbnails.medium.url);
                    if (objectToCompare.initialService !== ServicesUrl.youtube)
                        arrayOfUrls.youtube = writeProps(returnedItem.snippet.channelTitle.substring(0, returnedItem.snippet.channelTitle.indexOf('- Topic')),
                            returnedItem.snippet.title, 'https://youtube.com/watch?v=' + returnedItem.id.videoId,
                            returnedItem.snippet.thumbnails.medium.url);
                }
            }
        }
    }
    console.log(arrayOfUrls);
    return arrayOfUrls;
}

function searchInYoutubeObject(youtubeReturnedObject, objectToCompare) {
    const artistName = objectToCompare.artist;
    const trackName = objectToCompare.track;
    const notFound = { notValid: 'Not Found2' };
    var similarObject = notFound;
    let foundFlag = false;

    for (var item of youtubeReturnedObject.items) {
        if (item.snippet.channelTitle.indexOf('- Topic') !== -1) {
            if (!matchStringsWithoutSpecs(trackName, item.snippet.title) && !matchStringsWithoutSpecs(item.snippet.title, trackName))
                continue;
            if (!matchStringsWithoutSpecs(artistName, item.snippet.channelTitle) && !matchStringsWithoutSpecs(item.snippet.channelTitle, artistName))
                continue;
            similarObject = item;
            foundFlag = true;
            break;
        }
    }
    if (!foundFlag) {
        for (var item of youtubeReturnedObject.items) {
            if (!matchStringsWithoutSpecs(artistName + ' ' + trackName, item.snippet.title) && !matchStringsWithoutSpecs(item.snippet.title, artistName + ' ' + trackName))
                continue;
            similarObject = item;
            break;
        }
    }

    return similarObject;

}

function searchInSpotifyObject(spotifyReturnedObject, objectToCompare) {
    const artistName = objectToCompare.artist;
    const trackName = objectToCompare.track;
    const notFound = { url: 'Not Found2' };

    var similarObject = notFound;
    for (var item of spotifyReturnedObject.tracks.items) {

        let validator = false;

        if (item.type === 'track') {

            console.log(item.name);

            if (!matchStringsWithoutSpecs(trackName, item.name) && !matchStringsWithoutSpecs(item.name, trackName))
                continue;

            for (var artist of item.artists) {
                if (matchStringsWithoutSpecs(artistName, artist.name) && matchStringsWithoutSpecs(artist.name, artistName)) {
                    validator = true;
                    break;
                }
                else
                    validator = false
            }
            similarObject = item;

            if (validator)
                return similarObject;

        }
    }


    return similarObject;
}

function matchStringsWithoutSpecs(firstString, secondString) {
    var reg = new RegExp("[\\s-\\]\\[\\)\\(\\/\\.&]", "i");
    const splitedFirstString = firstString.split(reg);
    const splitedSecondString = secondString.split(reg);
    console.log(splitedFirstString);
    console.log(splitedSecondString);

    for (var substringFirst of splitedFirstString) {
        var indicator = false;
        for (var substringSecond of splitedSecondString) {
            let reg = new RegExp(substringSecond, "i");

            if (substringFirst.search(reg) !== -1) {
                indicator = true;
                console.log('Found');
                break;
            }
            else
                indicator = false;
        }
        if (!indicator) {
            console.log('not equal');
            return false;
        }

    }
    console.log('equal');
    return true;
}

function checkService(inputUrl) {
    var index = -1;
    var serviceName = "";

    for (var Service in ServicesUrl) {
        
        var found = checkServiceUrl(inputUrl, ServicesUrl[Service]);
        if (found !== -1) {
            index = found;
            serviceName = ServicesUrl[Service];
            break;
        }
    }

    var cutUrl = inputUrl.substring(index);
    cutUrl = eraseDomain(cutUrl);
    console.log('Service Name: ' + serviceName);

    return {
        service: serviceName,
        cutUrl: cutUrl,
    }

}

function createObjectToCompare(artist, track, url, service) {
    return {
        artist: artist,
        track: track,
        url: url,
        initialService: service
    }
}

function eraseDomain(urlString) {
    var index = urlString.indexOf('/');
    return urlString.substring(index + 1);
}

function checkServiceUrl(urlString, serviceString) {
    var index = urlString.indexOf(serviceString);
    if (index !== -1)
        index += serviceString.length;

    return index;
}