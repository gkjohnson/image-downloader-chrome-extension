// returns whether or not the passed link is to an image or not
// TODO : Fix this so it works with regex
function isUrlToImage(url) {
    //return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    return (url.indexOf(".jpeg")!=-1 || url.indexOf(".jpg")!=-1 || url.indexOf(".gif")!=-1 || url.indexOf(".png")!=-1);
}

// register for Messages
function registerForMessages(callback) {
    chrome.runtime.onMessage.addListener(callback);
}

// send Messages
function sendMessage(msgName, msg, response) {
    if( response == undefined) response = function(){};
    chrome.runtime.sendMessage(null,{"name":msgName,"content":msg}, response);
}

String.prototype.removeChar = function(char) {
    var temp = this;
    for( var i = 0 ; i < char.length ; i ++ ) {
        while(temp.indexOf(char[i]) != -1) {
            temp = temp.replace(char[i],'');
        }
    }
    return temp;
}