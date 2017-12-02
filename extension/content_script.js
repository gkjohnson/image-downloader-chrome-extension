var MIN_HEIGHT = 100;
var MIN_WIDTH = 100;

// Registers for request of list
registerForMessages(function(msg, sender, sendResponse) {
    album.initialize();
    sendResponse(album.getImageList());
});

// finds the appropriate div for pictures
$(document).ready(function() {
    album.initialize();
});

// Album that contains all the images and is the interface for retrieving them
var album = {};
album.container = null;

// Initializes the album by finding the album with relevant images in it
album.initialize = function() {
    /*
    var tallestHeight = -1;
    var that = this;
    // Find the tallest div in the page and assume that that is the one with the primary content
    $("*").each(function(i,dom)
    {
        dom = $(dom);

        if( dom.height() >= tallestHeight )
        {
            tallestHeight = dom.height();
            that.container = dom;
        }
    });
    */
    
    var that = this;

    var szScore = 0;
    var largestImg = null;
    $("img").each(function(i,dom) {
        dom = $(dom);

        if(!that._isImageValid(dom)) return;

        var thisScore = dom.width() * dom.height();
        if( thisScore > szScore )
        {
            szScore = thisScore;
            largestImg = dom;
        }
    });
    
    if( largestImg == null ) {   
        this.container = null;
        return;
    }

    var cand = largestImg.parent();
    while(true) {
        if(cand[0] == $("body")[0] ) break;

        var imgCount = 0;
        cand.find("img").each(function(i,dom){
            if(that._isImageValid($(dom))) imgCount ++;
        });
        if(imgCount > 2) break;

        cand = cand.parent();
    }

    this.container = cand;

};

// Returns a list with images within the album along with relevant meta data
album.getImageList = function() {

    var that = this;

    // Generate meta data
    var title = document.title;
    var folder = title;
    var file = title;

    var index = file.indexOf(' ',15);
    if( index != -1) file = file.substr(0, file.indexOf(' ', 15));

    list = 
    {
        srcURL : document.URL,
        folderName : folder,
        fileName : file,
    };

    // Generate list of images
    var imgList = new Array();

    // Save each image into an array
    if(this.container != null )
    {
        this.container.find("img").each(function(i,dom){

            dom = $(dom);

            // skip if it's small
            if( !that._isImageValid(dom) ) return;

            var src = that.getImgSrc(dom);
            var linkSrc = that.getLinkSrc(dom);

            if( src === "" ) src = linkSrc;
            if( linkSrc === "" ) linkSrc = src;

            imgList.push({
                display  : src,
                download : linkSrc
            });
        });
    }

    list.imgList = imgList;

    return list;
};



// TODO: Rethink Size Validation and src fetching
// Returns the image source
album.getImgSrc = function(img) {
    var src = "";
    if( isUrlToImage(img[0].src)) src = img[0].src;

    //console.log("NEW SRC! " + src + " : " + img[0].src + " : " + isUrlToImage(img[0].src));

    // if the src isn't in there yet, look for data-src (for imgur)
    // if( src == "" )
    // {
    //  if(img.data("src") != undefined)
    //  {
    //      img.attr("src", img.data("src"));
    //      var tempsrc = img[0].src;
    //      img.attr("src","");

    //      if(isUrlToImage(tempsrc)) {
    //          src = tempsrc;
    //      }
    //  }
    // }
    

    return src;
}

// Returns to the source that is linked to
album.getLinkSrc = function(img) {
    // find the parent
    var linkPrnt = img.parent("a");
    var linkSrc = "";
    if( linkPrnt.size() > 0 && isUrlToImage(linkPrnt[0].href)) linkSrc = linkPrnt[0].href;

    return linkSrc;
}

// Returns true if the image is valid, false otherwise
album._isImageValid = function(img) {
    // check size first and return early because it's faster
    var sizeValid = img.height() > MIN_HEIGHT && img.width() > MIN_WIDTH;   

    // get the sources
    var src = this.getImgSrc(img);
    var linkSrc = this.getLinkSrc(img);
    var srcValid = src != "" || linkSrc != "";

    var valid = srcValid && sizeValid;
    return valid;
};
