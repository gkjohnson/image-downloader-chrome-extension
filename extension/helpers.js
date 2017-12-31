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
    chrome.runtime.sendMessage(null, { name, content }, response || () => {});
}

String.prototype.removeChar = function(char) {
    let temp = this;
    for(let i = 0; i < char.length; i ++ ) {
        while(temp.indexOf(char[i]) != -1) {
            temp = temp.replace(char[i], '');
        }
    }
    return temp;
}