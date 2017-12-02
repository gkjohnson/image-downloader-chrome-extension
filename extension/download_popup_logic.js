// Illegal characters for the input fields
var ILLEGAL_CHAR = "?!@#$%^&*(){}[]|<>/\\\'\":;";

// Resizes the popup
function resizePopup(w,h)
{
	if( w != null )
	{
		w += "px";
		if(document.body != null) document.body.style.width=w;
		document.getElementsByTagName("html")[0].style.width=w;
	}
	if(h != null)
	{
		h += "px";
		if(document.body != null) document.body.style.height=h;
		document.getElementsByTagName("html")[0].style.height=h;
	}
}
resizePopup(null,0);

$(document).ready(function(){
	// reset the height to zero again because body may not have existed yet before
	resizePopup(null,0);

	// ask for the current tab's images
	chrome.windows.getCurrent(function(win)
	{
		chrome.tabs.query({
			active:true,
			windowId:win.id
		},
		function(tabs){
			if(tabs.length == 0) return;
			chrome.tabs.sendMessage(tabs[0].id,"requestImages",function(list){
				OnRetrieveImages(list);
			});
		});
	});

	// save the images when the button is pressed
	$("#saveButton").click(function(){	
		saveOutImages();
	});

	// ignore keypresses if they're illegal
	$("input").keypress(function(e)
	{
		for(var i = 0; i < illegal.length ; i ++ )
		{
			if( String.fromCharCode(e.keyCode).indexOf(ILLEGAL_CHAR[i]) != -1)
			{
				e.preventDefault();
				return;
			}
		}
	});
});

// Fill in the data of the page
function OnRetrieveImages(list)
{
	if( list == undefined )
	{
		$("#imageList").html("<span>There was an issue fetching images...</span>");
		$("#saveButton").remove();
		return;	
	} 

	$("#folderNameField").val(list.folderName.removeChar(ILLEGAL_CHAR));
	$("#fileNameField").val(list.fileName.removeChar(ILLEGAL_CHAR));

	for( var i = 0 ; i < list.imgList.length ; i ++ )
	{
		var d = $("<div><div class = 'mark'></div></div>");
		d.css("background-image","url('"+list.imgList[i].display+"')");
		d.addClass("selected");

		d.data("display-src", list.imgList[i].display);
		d.data("download-src", list.imgList[i].download)

		d.click(function()
		{
			dom = $(this);
			if(dom.hasClass("selected"))
			{
				dom.removeClass("selected");
			}
			else
			{
				dom.addClass("selected");
			}

			updateImageCount();
		});

		$("#imageList").append(d);
	}

	updateImageCount();
}

// Saves the images to a folder in the downloads folder
function saveOutImages()
{
	$(".selected").each(function(i, dom){
		dom = $(dom);

		var src = dom.data("download-src");
		var index = src.lastIndexOf('.');
		var filetype = src.substr(index, src.length - index);
		
		index = filetype.indexOf('?');
		if(index != -1 ) filetype = filetype.substr(0,index);

		var folder = $("#folderNameField").val().trim();
		if(folder !== "") folder += "/";

		var file = $("#fileNameField").val().trim();
		if(file === "") file = "image";

		console.log(src + " : " + filetype + " : " + (folder + file + " " + i + filetype));

		chrome.downloads.download({
			url : src,
			filename : folder + file + " " + i + filetype
		});	
	});
}

// Updates the counter of images
function updateImageCount()
{
	$("#imageCount").html($(".selected").size() + " images");
}