// returns whether or not the passed link is to an image or not
// TODO : Fix this so it works with regex
function isUrlToImage(url) {
    //return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    return (url.indexOf('.jpeg') != -1 || url.indexOf('.jpg') != -1 || url.indexOf('.gif') != -1 || url.indexOf('.png') != -1);
}

// register for Messages
function registerForMessages(callback) {
    chrome.runtime.onMessage.addListener(callback);
}

// send Messages
function sendMessage(name, content, response) {
    chrome.runtime.sendMessage(null, { name, content }, response || function() {});
}

String.prototype.removeChar = function(char) {
    let resultStr = this;
    for(let i = 0; i < char.length; i ++ ) {
        while(resultStr.indexOf(char[i]) != -1) {
            resultStr = resultStr.replace(char[i], '');
        }
    }
    return resultStr;
}