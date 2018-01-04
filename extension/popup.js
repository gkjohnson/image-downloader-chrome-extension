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
    if(list) {
        document.querySelector('#folder-name-field').value = list.folderName.removeChar(ILLEGAL_CHAR);
        document.querySelector('#file-name-field').value = list.fileName.removeChar(ILLEGAL_CHAR);

        for(let i = 0; i < list.imgList.length; i ++) {
            const d = $('<div><div class = "mark"></div></div>');
            d.css('background-image','url("'+list.imgList[i].display+'")');
            d.addClass('selected');

            d[0].setAttribute('display-src', list.imgList[i].display);
            d[0].setAttribute('download-src', list.imgList[i].download)

            d.click(function() {
                if(this.classList.contains('selected')) this.classList.remove('selected');
                else this.classList.add('selected');

                updateImageCount();
            });

            document
                .getElementById('image-list')
                .appendChild(d[0]);
        }

        updateImageCount();
    } else {
        document.getElementById('image-list').innerHTML = '<span>There was an issue fetching images...</span>';
        document.getElementById('save-button').remove();
        return; 
    } 
}

// Saves the images to a folder in the downloads folder
function saveOutImages() {
    document
        .querySelectorAll('.selected')
        .forEach((dom, i) => {
            const src = dom.getAttribute('download-src');
            let index = src.lastIndexOf('.');
            let filetype = src.substr(index, src.length - index);
            
            index = filetype.indexOf('?');
            if(index != -1 ) filetype = filetype.substr(0,index);

            let folder = document.getElementById('folder-name-field').value.trim();
            if(folder !== '') folder += '/';

            let file = document.getElementById('file-name-field').value.trim();
            if(file === '') file = 'image';

            chrome.downloads.download({
                url : src,
                filename : folder + file + ' ' + i + filetype
            }); 
        });
}

// Updates the counter of images
function updateImageCount() {
    const selected = document.querySelectorAll('.selected')
    document.querySelector('#image-count').innerText = `${selected.length} images`;
}

/* Initialize */
document.addEventListener('DOMContentLoaded', () => {
    // reset the height to zero again because body may not have existed yet before
    resizePopup(null, 0);

    // ask for the current tab's images
    // TODO: Can't we just get the 'activeTab' here?
    chrome.windows.getCurrent(win => {
        chrome.tabs.query({
            active: true,
            windowId: win.id
        },
        tabs => {
            if(tabs.length === 0) return;
            
            chrome.tabs.sendMessage(tabs[0].id, 'requestImages', list => {
                OnRetrieveImages(list);
            });
        });
    });

    // save the images when the button is pressed
    document
        .querySelector('#save-button')
        .addEventListener('click', () => saveOutImages());

    // ignore keypresses if they're illegal
    $('input').keypress(e => {
        const key = String.fromCharCode(e.keyCode);
        if (ILLEGAL_CHAR.indexOf(key) != -1) {
            e.preventDefault();
        }
    });
});

resizePopup(null,0);
