// Illegal characters for the input fields
const ILLEGAL_CHAR = '?!@#$%^&*(){}[]|<>/\\\'\":;';

/* Functions */
// Resizes the popup
function resizePopup(w, h) {
    if(w != null) {
        if(document.body != null) document.body.style.width = `${w}px`;
        document.querySelector('html').style.width = w;
    }

    if(h != null) {
        if(document.body != null) document.body.style.height = `${h}px`;
        document.querySelector('html').style.height = h;
    }
}

// Fill in the data of the page
function OnRetrieveImages(list) {
    if(!list) {
        $('#imageList').html('<span>There was an issue fetching images...</span>');
        $('#saveButton').remove();
        return; 
    } 

    $('#folderNameField').val(list.folderName.removeChar(ILLEGAL_CHAR));
    $('#fileNameField').val(list.fileName.removeChar(ILLEGAL_CHAR));

    for(let i = 0; i < list.imgList.length; i ++) {
        const d = $('<div><div class = "mark"></div></div>');
        d.css('background-image','url("'+list.imgList[i].display+'")');
        d.addClass('selected');

        d.data('display-src', list.imgList[i].display);
        d.data('download-src', list.imgList[i].download)

        d.click(function() {
            if(this.classList.contains('selected')) this.classList.remove('selected');
            else dom.classList.add('selected');

            updateImageCount();
        });

        $("#imageList").append(d);
    }

    updateImageCount();
}

// Saves the images to a folder in the downloads folder
function saveOutImages() {
    $('.selected').each(function(i, dom){
        dom = $(dom);

        const src = dom.data('download-src');
        let index = src.lastIndexOf('.');
        let filetype = src.substr(index, src.length - index);
        
        index = filetype.indexOf('?');
        if(index != -1 ) filetype = filetype.substr(0,index);

        let folder = $('#folderNameField').val().trim();
        if(folder !== '') folder += '/';

        let file = $('#fileNameField').val().trim();
        if(file === '') file = 'image';

        console.log(src + ' : ' + filetype + ' : ' + (folder + file + ' ' + i + filetype));

        chrome.downloads.download({
            url : src,
            filename : folder + file + ' ' + i + filetype
        }); 
    });
}

// Updates the counter of images
function updateImageCount() {
    $('#imageCount').html($('.selected').size() + ' images');
}

/* Initialize */
document.addEventListener('DOMContentLoaded', () => {
    // reset the height to zero again because body may not have existed yet before
    resizePopup(null,0);

    // ask for the current tab's images
    // TODO: Can't we just get the 'activeTab' here?
    chrome.windows.getCurrent(win => {
        chrome.tabs.query({
            active: true,
            windowId: win.id
        },
        tabs => {
            if(tabs.length == 0) return;
            
            chrome.tabs.sendMessage(tabs[0].id, 'requestImages', list => {
                OnRetrieveImages(list);
            });
        });
    });

    // save the images when the button is pressed
    document
        .querySelector('#saveButton')
        .addEventListener('click', () => saveOutImages());

    // ignore keypresses if they're illegal
    $('input').keypress(function(e) {
        const key = String.fromCharCode(e.keyCode);
        if (ILLEGAL_CHAR.indexOf(key) != -1) {
            e.preventDefault();
        }
    });
});

resizePopup(null,0);
