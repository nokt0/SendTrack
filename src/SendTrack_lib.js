var ServicesUrl = {
    YoutubeMusic : "youtube.music",
    Youtube : "youtube",
    
}

function InputStringWorker(inputUrl) {
    var index = -1;
    var serviceName = "";

    for (Service in ServicesUrl) {
        if (checkServiceUrl(inputUrl, ServicesUrl[Service]) !== false) {
            index = checkServiceUrl(inputUrl, ServicesUrl[Service]);
            serviceName = Service;
            break;
        }
    }

    return {
        service : serviceName,
        cutUrl : inputUrl.substring(index),
    }

}

function checkServiceUrl(UrlString, ServiceString) {
    var index;
    if (index = UrlString.indexOf(ServiceString) !== -1)
        return index + ServiceString.length();
    else
        return false;
}

