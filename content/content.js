function downloadFile(container){
    let id = container.children[0].id.replace('p', '');
    let thumbnail = container.children[0].children[0].src;
    let postUrl = `https://gelbooru.com/index.php?page=post&s=view&id=${id}`;

    fetch(postUrl, {method: "get"}).then(r => {r.text().then(result => {
        let imageUrl = result.match(/https:\/\/....\.gelbooru\.com\/images\/[^"']*/g)[0];

        chrome.runtime.sendMessage({imageUrl: imageUrl, id: id, thumbnail: thumbnail, postUrl: postUrl, type: "download"}, (response) => {
            if (response.status){
                container.style = "outline-color:#28a745;outline-width:4px;";
                container.appendChild(getRemoveButton(container));
            };
        });
    })});

};

function removeFromHistory(container){
    let id = container.children[0].id.replace('p', '');
    chrome.runtime.sendMessage({type: 'remove', id: id});
    container.style = "";
    container.removeChild(container.children[2]);
};

function getDownloadButton(elem){
    let downloadButton = document.createElement("button");
    downloadButton.className = "downloadButton";
    downloadButton.title = "download";
    downloadButton.addEventListener("click", () => {downloadFile(elem)});

    let icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('icons/download.png');
    icon.className = "downloadIcon";

    downloadButton.appendChild(icon);
    
    return downloadButton;
};

function getRemoveButton(elem){
    let removeButton = document.createElement('button');
    removeButton.className = "removeButton";
    removeButton.title = 'remove from history';
    removeButton.addEventListener("click", () => {removeFromHistory(elem)});

    let icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('icons/clear.png');
    icon.className = 'removeIcon';

    removeButton.appendChild(icon);

    return removeButton;
};


chrome.runtime.sendMessage({type: 'getCache'}, (cachedPosts) => {
    for (let elem of document.querySelectorAll(".thumbnail-preview")){
        elem.children[0].className = "imageContainer00";
        elem.children[0].children[0].className = 'thumbnail00';
        elem.appendChild(getDownloadButton(elem));
        
        if(cachedPosts.hasOwnProperty(elem.children[0].id.replace('p', ''))){
            elem.style = "outline-color:#28a745;outline-width:4px;";
            elem.appendChild(getRemoveButton(elem));
        };
    };
});
