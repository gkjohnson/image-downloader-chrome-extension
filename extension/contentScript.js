const MIN_HEIGHT = 100;
const MIN_WIDTH = 100;

// Album that contains all the images and is the interface for retrieving them
const album = {};
album.container = null;

// Initializes the album by finding the album with relevant images in it
album.initialize = function() {
    /*
    var tallestHeight = -1;
    var that = this;
    // Find the tallest div in the page and assume that that is the one with the primary content
    $('*').each(function(i,dom)
    {
        dom = $(dom);

        if( dom.height() >= tallestHeight )
        {
            tallestHeight = dom.height();
            that.container = dom;
        }
    });
    */
    
    let szScore = 0;
    let largestImg = null;
    Array.from(document.getElementsByTagName('img'))
        .forEach(img => {
            if(this._isImageValid(img)) {
                let thisScore = img.clientWidth * img.clientHeight;
                if(thisScore > szScore) {
                    szScore = thisScore;
                    largestImg = img;
                }
            }
        });
    
    if(largestImg == null) {   
        this.container = null;
        return;
    }

    let cand = largestImg.parentNode;
    while(true) {
        if(cand == document.body) break;

        const imgCount = 
            Array.from(cand.getElementsByTagName('img'))
                .filter(img => this._isImageValid(img))
                .length;
        if(imgCount > 2) break;

        cand = cand.parentNode;
    }

    this.container = cand;
};

// Returns a list with images within the album along with relevant meta data
album.getImageList = function() {

    const that = this;

    // Generate meta data
    const title = document.title;
    const folder = title;
    let file = title;

    if(file.indexOf(' ',15) != -1) file = file.substr(0, file.indexOf(' ', 15));

    list = {
        srcURL : document.URL,
        folderName : folder,
        fileName : file,
    };

    // Generate list of images
    const imgList = new Array();

    // Save each image into an array
    if(this.container != null ) {
        const imgDict = {};
        Array.from(this.container.getElementsByTagName('img'))
            .forEach(dom => {
                if(!that._isImageValid(dom)) return;

                let src = that.getImgSrc(dom);
                let linkSrc = that.getLinkSrc(dom);

                if( src === '' ) src = linkSrc;
                if( linkSrc === '' ) linkSrc = src;

                if (!(linkSrc in imgDict)) {
                    imgDict[linkSrc] = true;
                    imgList.push({
                        display  : src,
                        download : linkSrc
                    });
                }
            });
    }

    list.imgList = imgList;

    return list;
};
    
// TODO: Rethink Size Validation and src fetching
// Returns the image source
album.getImgSrc = function(img) {
    let src = '';
    if(isUrlToImage(img.src)) src = img.src;

    //console.log('NEW SRC! ' + src + ' : ' + img[0].src + ' : ' + isUrlToImage(img[0].src));

    // if the src isn't in there yet, look for data-src (for imgur)
    // if( src == '' )
    // {
    //  if(img.data('src') != undefined)
    //  {
    //      img.attr('src', img.data('src'));
    //      var tempsrc = img[0].src;
    //      img.attr('src','');

    //      if(isUrlToImage(tempsrc)) {
    //          src = tempsrc;
    //      }
    //  }
    // }
    

    return src;
}

// Returns to the source that is linked to
album.getLinkSrc = img => {
    // find the parent
    let linkTag = img;
    while (linkTag != null && linkTag.tagName !== 'A') linkTag = linkTag.parentNode;

    let linkSrc = '';
    if(linkTag != null && isUrlToImage(linkTag.href)) linkSrc = linkTag.href;

    return linkSrc;
}

// Returns true if the image is valid, false otherwise
album._isImageValid = function (img) {
    // check size first and return early because it's faster
    const sizeValid = img.clientHeight > MIN_HEIGHT && img.clientWidth > MIN_WIDTH;   

    // get the sources
    const src = this.getImgSrc(img);
    const linkSrc = this.getLinkSrc(img);
    const srcValid = src != '' || linkSrc != '';

    const valid = srcValid && sizeValid;
    return valid;
};

// Registers for request of list
registerForMessages((msg, sender, sendResponse) => {
    album.initialize();
    sendResponse(album.getImageList());
});

// finds the appropriate div for pictures
document.addEventListener('DOMContentLoaded', () => album.initialize());
