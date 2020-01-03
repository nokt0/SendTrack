const ServicesUrl = {
    youtubeMusic: "music.youtube",
    youtube: "youtube",
    spotify: "spotify",
    appleMusic: "music.apple",
    deezer: "deezer"

}
const notValidObj = {notValid: ''};

const logArray = [];

export function searchByWord(str) {
    if (str === '')
        return {notValid: 'empty string'};
    let splitedString;
    if (str.indexOf('-') !== -1)
        splitedString = str.split('-');
    if (str.indexOf('–') !== -1)
        splitedString = str.split('–');

    //LOG
    logArray.push('Entered into text form: [' + splitedString.toString() + ']\n')
    console.log('Entered into text form:' + splitedString);
    //

    splitedString = splitedString.filter(word => word !== '');
    let objectToCompare = {notValid: 'not valid input'};
    if (splitedString.length > 1)
        objectToCompare = createObjectToCompare(splitedString[0].trim(), splitedString[1].trim());

    return objectToCompare;
}

export function urlWorker(url) {
    const serviceObj = checkService(url);
    let objectToCompare;

    if (serviceObj.service === ServicesUrl.youtube || serviceObj.service === ServicesUrl.youtubeMusic) {
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
                notValid: requestObj.notValid,
                artist: '',
                track: requestObj.notValid,
                url: '',
                service: serviceObj.service
            };

        //LOG
        logArray.push('Youtube obj from input: [' + JSON.stringify(requestObj) + ']\n')
        console.log(requestObj);
        //

        let artist;
        let track;
        let index = requestObj.items[0].snippet.title.indexOf('-');

        if (requestObj.items[0].snippet.title.indexOf('-') !== -1) {
            artist = requestObj.items[0].snippet.title.substring(0, index);
            track = requestObj.items[0].snippet.title.substring(index, requestObj.items[0].snippet.title.length);
        } else {
            artist = requestObj.items[0].snippet.channelTitle;
            track = requestObj.items[0].snippet.title;
        }
        //ERASE BRACKETS 
        track = eraseBrackets(track);
        artist = eraseBrackets(artist);
        track = eraseFeat(track);
        artist = eraseFeat(artist);

        let resUrl;
        if (serviceObj.service === 'youtube')
            resUrl = "https://www.youtube.com/watch?v=" + requestObj.items[0].id;
        else if (serviceObj.service === 'youtubeMusic')
            resUrl = "https://www.music.youtube.com/watch?v=" + requestObj.items[0].id;

        objectToCompare = createObjectToCompare(artist, track, resUrl, serviceObj.service);

        index = objectToCompare.artist.indexOf(" - Topic");
        if (index !== -1)
            objectToCompare.artist = objectToCompare.artist.substring(0, index);

        //LOG
        logArray.push('Created youtube obj to compare: [' + JSON.stringify(objectToCompare) + ']\n')
        console.log(objectToCompare);
        //

        return objectToCompare;
    }

    if (serviceObj.service === ServicesUrl.spotify) {
        let requestObj = requestSpotifyObject(
            createSpotifyArguments(serviceObj), 'track');

        //LOG
        logArray.push('Spotify obj from input: [' + JSON.stringify(requestObj) + ']\n')
        console.log(requestObj);
        //

        if (requestObj.type === 'album') {
            return {
                artist: '',
                track: 'this is album',
                url: '',
                notValid: 'this is album'
            }
        }

        if ('notValid' in requestObj)
            return {
                artist: '',
                track: 'error:' + requestObj.notValid,
                url: '',
                notValid: 'error:' + requestObj.notValid
            }

        let track = requestObj.name;
        let url = requestObj.external_urls.spotify;
        let artist = requestObj.artists[0].name;

        //ERASE BRACKETS
        track = eraseBrackets(track);
        artist = eraseBrackets(artist);
        track = eraseFeat(track);
        artist = eraseFeat(artist);

        objectToCompare = createObjectToCompare(artist, track, url, serviceObj.service);

        //LOG
        logArray.push('Created spotify obj to compare: [' + JSON.stringify(objectToCompare) + ']\n')
        console.log(objectToCompare);
        //

        return objectToCompare;
    }

    if (serviceObj.service === ServicesUrl.deezer) {
        let requestObj = requestDeezerObject(createDeezerArguments(serviceObj), 'track');

        //LOG
        logArray.push('Deezer obj from input: [' + JSON.stringify(requestObj) + ']\n')
        console.log(requestObj);
        //

        if (requestObj.type === 'album') {
            return {
                artist: '',
                track: 'this is album',
                url: '',
                notValid: 'this is album'
            }
        }

        if ('notValid' in requestObj)
            return {
                artist: '',
                track: 'error:' + requestObj.notValid,
                url: '',
                notValid: 'error:' + requestObj.notValid
            }

        let track = requestObj.title_short;
        let url = requestObj.link;
        let artist = requestObj.artist.name;

        track = eraseBrackets(track);
        artist = eraseBrackets(artist);
        track = eraseFeat(track);
        artist = eraseFeat(artist);

        objectToCompare = createObjectToCompare(artist, track, url, ServicesUrl.deezer);

        //LOG
        logArray.push('Created deezer obj to compare: [' + JSON.stringify(objectToCompare) + ']\n')
        console.log(objectToCompare);
        //

        return objectToCompare;
    }

    return {
        notValid: 'Not Found:(',
        artist: 'Not Found:(',
        track: '',
        url: ''
    };
}

export function urlValidator(url) {
    let index;
    if (url.indexOf('.') !== -1)
        index = url.indexOf('.');
    else
        return false;

    index = url.indexOf('/', index);
    if (index !== -1)
        return true;
    else
        return false;
}

function eraseDomain(urlString) {
    const index = urlString.indexOf('/');
    return urlString.substring(index + 1);
}

function eraseBrackets(str) {
    let result = str;
    let index;
    if (str.indexOf('(') !== -1 && str.indexOf(')') !== -1) {
        index = str.indexOf('(');
        result = str.substring(0, index) + str.substring(str.indexOf(')') + 1, str.length);
    }

    if (str.indexOf('[') !== -1 && str.indexOf(']') !== -1) {
        index = str.indexOf('[');
        result = str.substring(0, index) + str.substring(str.indexOf(']') + 1, str.length);
    }

    return result;
}

function eraseFeat(str) {
    let result = str;
    let index;
    if (str.indexOf(/feat/i) !== -1) {
        index = str.indexOf(/feat/i);
        result = str.substring(0, index);
    }

    return result;
}


function requestYoutubeObject(argumentsObj, requestType) {

    const objType = argumentsObj.type;
    delete argumentsObj.type;

    const xhr = new XMLHttpRequest();
    const YOUTUBE_API_SERVER = "/youtube/";
    let resultRequest = YOUTUBE_API_SERVER;
    const maxResults = 25;

    let videoInfoObj = notValidObj;

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
            videoInfoObj.notValid = "Not valid youtube request type";
            //LOG
            logArray.push('Not valid youtube request type\n');
            console.log(logArray[logArray.length - 1]);
            //
            return videoInfoObj;

    }
    resultRequest += 'part=snippet';

    for (const argument in argumentsObj) {
        switch (argument) {
            case 'v':
                resultRequest += "&id=" + argumentsObj[argument];
                break;
            case 'q':
                resultRequest += "&q=" + argumentsObj[argument] +
                    "&maxResults=" + maxResults + "&type=video&videoCategoryId=10";
                break;
            case 'list':
                break;
            case 'feature':
                break;

            default:
                //LOG
                logArray.push('Bad youtube argument\n');
                console.log(logArray[logArray.length - 1]);
                //
                break;
        }
    }

    //LOG
    logArray.push('Request youtube url: ' + resultRequest + '\n');
    console.log(logArray[logArray.length - 1]);
    //

    xhr.open('GET', resultRequest, false);
    // 3. Отсылаем запрос
    xhr.send();


    // 4. Если код ответа сервера не 200, то это ошибка
    if (xhr.status !== 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        videoInfoObj.notValid = xhr.status + ':' + xhr.statusText;
    } else {
        // вывести результат
        // responseText -- текст ответа.
        if (JSON.parse(xhr.responseText).pageInfo.totalResults !== 0)
            videoInfoObj = JSON.parse(xhr.responseText);
        else
            videoInfoObj.notValid = 'Not Found';
    }

    console.log(videoInfoObj);
    //LOG
    logArray.push('Requested youtube obj: [' + JSON.stringify(videoInfoObj) + ']\n');
    console.log(videoInfoObj);
    //

    return videoInfoObj;
}

function requestSpotifyObject(argumentsObj, requestType) {

    const SPOTIFY_API_SERVER = "/spotify/";
    let requestObj = notValidObj;
    const maxResults = 10;
    let url = SPOTIFY_API_SERVER;


    if ('artists' in argumentsObj) {
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

    //LOG
    logArray.push('Request spotify url: ' + url + '\n');
    console.log(logArray[logArray.length - 1]);
    //

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();

    if (xhr.status !== 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        requestObj.notValid = xhr.status + ':' + xhr.statusText;
    } else {
        // вывести результат
        // responseText -- текст ответа.
        if (JSON.parse(xhr.responseText).total !== 0)
            requestObj = JSON.parse(xhr.responseText);
    }

    //LOG
    logArray.push('Requested spotify obj: ' + xhr.responseText + '\n');
    console.log(requestObj);
    //
    return requestObj;

}

function requestDeezerObject(argumentsObj, requestType) {
    let requestObj = notValidObj;
    let url = '/deezer/';

    switch (requestType) {
        case 'track':
            url += 'track?id=' + argumentsObj.track;
            break;
        case 'search':
            url += 'search?artist=' + argumentsObj.artist + "&track=" + argumentsObj.track;
            break;
        default:
            requestObj.notValid = 'Bad Request Type';
            return requestObj;
    }

    //LOG
    logArray.push('Request deezer url: ' + url + '\n');
    console.log(logArray[logArray.length - 1]);
    //

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();

    if (xhr.status !== 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        requestObj.notValid = xhr.statusText;
    } else {
        // вывести результат
        // responseText -- текст ответа.
        if (JSON.parse(xhr.responseText).total !== 0)
            requestObj = JSON.parse(xhr.responseText);
    }

    //LOG
    logArray.push('Requested deezer obj: ' + xhr.responseText + '\n');
    console.log(requestObj);
    //

    return requestObj;

}

function getSpotifyToken() {
    /*const base64key = "Yjc0MmYwNWIxM2JkNGIzZmFmYzQ1MWNhOTYzYTMwNTM6NDM1M2FiZjQxMThjNGZkZDg2ODdhZjk4ZDQ3ZTA1NmM=";
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    var xhr = new XMLHttpRequest();
    var body = encodeURIComponent('grant_type') + encodeURIComponent('=') + encodeURIComponent('client_credentials');
    console.log(body);
    const url = 'https://accounts.spotify.com/api/token';
    xhr.open("POST", proxyurl + url, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Basic ' + base64key);
    var result;

    xhr.send(body);
    if (xhr.status !== 200) {
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
    } else {
        result = JSON.parse(xhr.responseText);
    }  */


    let result;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", '/token', false);
    xhr.send();
    if (xhr.status !== 200) {
        alert(xhr.status + ': ' + xhr.statusText + "Can't get spotify token from sendtrack server"); // пример вывода: 404: Not Found
    } else {
        var obj = JSON.parse(xhr.responseText);
        result = obj.token;
        setCookie('spotifyKey', obj.token, {expires: (obj.expires - Date.now()) / 1000});

    }

    /*    fetch('http://sendtrack-backend.ddns.net:9741/token',{ method: 'GET'})
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        alert(result);
        return myJson.token;
      }); */

    return result;
}

function createSpotifyArguments(serviceObj) {

    const cutUrl = serviceObj.cutUrl;
    const argumentsObj = {};

    const arrayArguments = cutUrl.split('/');
    argumentsObj[arrayArguments[0]] = arrayArguments[1];

    //LOG
    logArray.push('Spotify arguments obj: [' + argumentsObj.toString() + ']\n');
    console.log(logArray[logArray.length - 1]);
    //

    return argumentsObj;
}

function createDeezerArguments(serviceObj) {
    const cutUrl = serviceObj.cutUrl;
    const argumentsObj = {};

    const arrayArguments = cutUrl.split('/');
    if (arrayArguments[0] === 'artist' || arrayArguments[0] === 'track')
        argumentsObj[arrayArguments[0]] = arrayArguments[1];

    //LOG
    logArray.push('Deezer arguments obj: [' + argumentsObj.toString() + ']\n');
    console.log(logArray[logArray.length - 1]);
    //

    return argumentsObj;
}


function eraseYoutubeWatchArg(cutUrl) {
    const index = cutUrl.indexOf('watch?');
    return cutUrl.substring(index + 'watch?'.length);
}

function createYoutubeArguments(serviceObj) {

    const {cutUrl} = serviceObj;
    const argumentsObj = {};

    if (cutUrl.indexOf('watch?') !== -1) {
        argumentsObj.type = 'track';
        eraseYoutubeWatchArg(cutUrl)
    } else {
        argumentsObj.type = 'album';
        return argumentsObj;
    }

    const arrayArguments = eraseYoutubeWatchArg(cutUrl).split('&');
    for (let i = 0; i < arrayArguments.length; i++) {
        const index = arrayArguments[i].indexOf("=");
        const argument = arrayArguments[i].substring(0, index);
        argumentsObj[argument] = arrayArguments[i].substring(index + 1, arrayArguments[i].length);
    }
    //LOG
    logArray.push('Youtube arguments obj: [' + JSON.stringify(argumentsObj) + ']\n');
    console.log(argumentsObj);
    //
    return argumentsObj;

}

export function createArrayOfUrls(objectToCompare) {
    let arrayOfUrls = {
        spotify: 'Not Found',
        youtube: 'Not Found',
        youtubeMusic: 'Not Found',
        deezer: 'Not Found'
    };

    //LOG
    logArray.push('Initial Service: ' + objectToCompare.initialService + '\n');
    console.log(logArray[logArray.length - 1]);
    //

    if (objectToCompare.hasOwnProperty('notValid')) {
        //LOG
        logArray.push('Not Valid: ' + objectToCompare.notValid + '\n');
        console.log(logArray[logArray.length - 1]);
        //
        return arrayOfUrls;
    }

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
        //LOG
        logArray.push('Spotify request: ' + JSON.stringify(spotifyRequest) + '\n');
        console.log(spotifyRequest);
        //

        let requestedObj = requestSpotifyObject(spotifyRequest, 'search');

        //LOG
        logArray.push('Requested spotify obj: ' + JSON.stringify(requestedObj) + '\n');
        console.log(requestedObj);
        //

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
                    returnedItem.album.images[0].url);
            }
        }
    }

    if (objectToCompare.initialService !== ServicesUrl.youtubeMusic || objectToCompare.initialService !== ServicesUrl.youtube) {
        let youtubeRequest = {
            q: objectToCompare.artist + ' ' + objectToCompare.track
        }
        //LOG
        logArray.push('Youtube request: ' + JSON.stringify(youtubeRequest) + '\n');
        console.log(youtubeRequest);
        //


        let requestedObj = requestYoutubeObject(youtubeRequest, 'search');
        if (!requestedObj.hasOwnProperty('notValid')) {
            let returnedItem = searchInYoutubeObject(requestedObj, objectToCompare);
            if (!returnedItem.hasOwnProperty('notValid')) {
                if (returnedItem.snippet.channelTitle.indexOf('- Topic') === -1) {
                    let artist = '';
                    let title = returnedItem.snippet.title;
                    const str = returnedItem.snippet.title;
                    const index = str.indexOf('-');
                    if (str.indexOf('-') !== -1) {
                        artist = str.substring(0, index).trim();
                        title = str.substring(index + 1, str.length).trim();
                    }
                    if (objectToCompare.initialService !== ServicesUrl.youtubeMusic)
                        arrayOfUrls.youtubeMusic = writeProps(artist, title, 'https://music.youtube.com/watch?v=' + returnedItem.id.videoId, returnedItem.snippet.thumbnails.high.url);
                    if (objectToCompare.initialService !== ServicesUrl.youtube)
                        arrayOfUrls.youtube = writeProps(artist, title, 'https://youtube.com/watch?v=' + returnedItem.id.videoId, returnedItem.snippet.thumbnails.high.url);
                } else {
                    if (objectToCompare.initialService !== ServicesUrl.youtubeMusic)
                        arrayOfUrls.youtubeMusic = writeProps(returnedItem.snippet.channelTitle.substring(0, returnedItem.snippet.channelTitle.indexOf('- Topic')),
                            returnedItem.snippet.title, 'https://music.youtube.com/watch?v=' + returnedItem.id.videoId,
                            returnedItem.snippet.thumbnails.high.url);
                    if (objectToCompare.initialService !== ServicesUrl.youtube)
                        arrayOfUrls.youtube = writeProps(returnedItem.snippet.channelTitle.substring(0, returnedItem.snippet.channelTitle.indexOf('- Topic')),
                            returnedItem.snippet.title, 'https://youtube.com/watch?v=' + returnedItem.id.videoId,
                            returnedItem.snippet.thumbnails.high.url);
                }
            }
        }
    }

    if (objectToCompare.initialService !== ServicesUrl.deezer) {
        let deezerRequest = {
            artist: objectToCompare.artist,
            track: objectToCompare.track
        }

        //LOG
        logArray.push('Deezer request: ' + JSON.stringify(deezerRequest) + '\n');
        console.log(deezerRequest);
        //

        let requestedObj = requestDeezerObject(deezerRequest, 'search');
        if (!requestedObj.hasOwnProperty('notValid')) {
            let item = searchInDeezerObject(requestedObj, objectToCompare);
            arrayOfUrls.deezer = writeProps(item.artist.name, item.title_short, item.link, item.album.cover_xl);
        } else {
            //LOG
            logArray.push('Deezer request not valid:[' + requestedObj.notValid + ']\n');
            console.log(logArray[logArray.length - 1]);
            //
        }


    }
    //LOG
    logArray.push('Array of Urls:[' + JSON.stringify(arrayOfUrls) + ']\n');
    console.log(arrayOfUrls);
    //
    return arrayOfUrls;
}

function searchInYoutubeObject(youtubeReturnedObject, objectToCompare) {
    const artistName = objectToCompare.artist;
    const trackName = objectToCompare.track;
    var similarObject = {notValid: 'Not Found2'};
    let foundFlag = false;

    for (let item of youtubeReturnedObject.items) {
        if (item.snippet.channelTitle.indexOf('- Topic') !== -1) {
            var validTitle = item.snippet.channelTitle.substring(
                0, item.snippet.channelTitle.indexOf(' - Topic'));
            if (!matchStringsWithoutSpecs(trackName, item.snippet.title) && !matchStringsWithoutSpecs(item.snippet.title, trackName))
                continue;
            if (!matchStringsWithoutSpecs(artistName, validTitle) && !matchStringsWithoutSpecs(validTitle, artistName))
                continue;
            similarObject = item;
            foundFlag = true;
            break;
        }
    }
    if (!foundFlag) {
        for (let item of youtubeReturnedObject.items) {
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
    let similarObject = {notValid: 'Not Found2'};
    for (const item of spotifyReturnedObject.tracks.items) {

        let validator = false;

        if (item.type === 'track') {

            if (!matchStringsWithoutSpecs(trackName, item.name) && !matchStringsWithoutSpecs(item.name, trackName))
                continue;

            for (const artist of item.artists) {
                if (matchStringsWithoutSpecs(artistName, artist.name) && matchStringsWithoutSpecs(artist.name, artistName)) {
                    validator = true;
                    break;
                } else
                    validator = false
            }
            similarObject = item;

            if (validator)
                return similarObject;

        }
    }


    return similarObject;
}

function searchInDeezerObject(deezerReturnedObject, objectToCompare) {
    const artistName = objectToCompare.artist;
    const trackName = objectToCompare.track;
    var similarObject = {notValid: 'Not Found2'};
    for (var item of deezerReturnedObject.data) {

        if (item.type === 'track') {

            if (!matchStringsWithoutSpecs(trackName, item.title) && !matchStringsWithoutSpecs(item.title, trackName))
                continue;

            if (matchStringsWithoutSpecs(artistName, item.artist.name) && matchStringsWithoutSpecs(item.artist.name, artistName)) {
                similarObject = item;
                break;
            }
        }

    }
    return similarObject;
}

function matchStringsWithoutSpecs(firstString, secondString) {
    const reg = new RegExp("[\\s-\\]\\[\\)\\(\\/\\.&]", "i");
    let splitedFirstString = firstString.split(reg);
    let splitedSecondString = secondString.split(reg);
    splitedFirstString = splitedFirstString.filter(function (el) {
        return el !== "";
    });
    splitedSecondString = splitedSecondString.filter(function (el) {
        return el !== "";
    });

    //LOG
    logArray.push('Splitted first string:[' + splitedFirstString.toString() + ']\n');
    console.log(logArray[logArray.length - 1]);
    logArray.push('Splitted second string:[' + splitedSecondString.toString() + ']\n');
    console.log(logArray[logArray.length - 1]);
    //

    for (const substringFirst of splitedFirstString) {
        let indicator = false;
        for (const substringSecond of splitedSecondString) {
            let reg = new RegExp(substringSecond, "i");

            if (substringFirst.search(reg) !== -1) {
                indicator = true;
                console.log('Found');
                break;
            } else
                indicator = false;
        }
        if (!indicator) {
            //LOG
            logArray.push('Not equal\n');
            console.log(logArray[logArray.length - 1]);
            //
            return false;
        }

    }
    //LOG
    logArray.push('Equal\n');
    console.log(logArray[logArray.length - 1]);
    //
    return true;
}

function checkService(inputUrl) {
    let index = -1;
    let serviceName = "";
    let url = inputUrl;
    if (url.indexOf('youtu.be/') !== -1) {
        url = 'https://www.youtube.com/watch?v=' + url.substring(url.indexOf('youtu.be/') + 'youtu.be/'.length, url.length);
    }

    for (let Service in ServicesUrl) {

        let found = checkServiceUrl(url, ServicesUrl[Service]);
        if (found !== -1) {
            index = found;
            serviceName = ServicesUrl[Service];
            break;
        }
    }

    let cutUrl = url.substring(index);
    cutUrl = eraseDomain(cutUrl);
    //LOG
    logArray.push('Service Name: ' + serviceName + '\n');
    console.log(logArray[logArray.length - 1]);

    return {
        service: serviceName,
        cutUrl: cutUrl,
    }

}

function createObjectToCompare(artist = '', track = '', url = '', service = '') {
    return {
        artist: artist,
        track: track,
        url: url,
        initialService: service
    }
}

function checkServiceUrl(urlString, serviceString) {
    let index = urlString.indexOf(serviceString);
    if (index !== -1)
        index += serviceString.length;

    return index;
}

function setCookie(name, value, options) {
    options = options || {};

    let expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + "=" + value;

    for (const propName in options) {
        updatedCookie += "; " + propName;
        const propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function getCookie(name) {
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function checkTokenInCookie() {
    const buffer = getCookie('spotifyKey');
    if (buffer)
        return buffer;
    else
        return getSpotifyToken();
}

export function getLog() {
    let log = '';
    for (let elem of logArray) {
        log += elem;
    }
    return log;
}