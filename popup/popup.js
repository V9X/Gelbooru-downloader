let downloadIcon = chrome.runtime.getURL('icons/download.png');
let uploadIcon = chrome.runtime.getURL('icons/upload.png');
let clearIcon = chrome.runtime.getURL('icons/clear.png');
let githubIcon = chrome.runtime.getURL('icons/github.png')
let gelbooruLogo = chrome.runtime.getURL('logo/logo128.png')

document.getElementById('downloadButtonIcon').src = downloadIcon;
document.getElementById('uploadButtonIcon').src = uploadIcon;
document.getElementById('clearButtonIcon').src = clearIcon;
document.getElementById('titleLogo').src = gelbooruLogo;
document.getElementById('githubButtonIcon').src = githubIcon;

function downloadJson(){
    chrome.runtime.sendMessage({type: 'getCache'}, (cachedPosts) => {
        let url = URL.createObjectURL(new Blob([JSON.stringify(cachedPosts, null, 2)], {type: 'application/json'}));
        chrome.downloads.download({url: url, saveAs: true, filename: 'history.json'});
    })
};

function refreshGelbooruPages(){
    chrome.tabs.query({url: ['https://gelbooru.com/*']}, (tabs) => {
        for (let tab of tabs){
            chrome.tabs.reload(tab.id);
        };
    });
};

function readJson(){
    let file = document.getElementById('uploadJsonFile').files[0];
    let reader = new FileReader();
    reader.onload = (i) => {
        try{
            let history = JSON.parse(i.target.result);
            chrome.storage.local.set({'gelbooruPosts': history});
            window.close();
            refreshGelbooruPages()
            alert("Successfully loaded JSON file.");
        } catch{
            alert("Couldn't parse the JSON file.");
        };

    };
    reader.readAsText(file);

}

function clearHistory(){
    if (confirm("Are you sure you want to clear the history? This action cannot be reversed.")){
        chrome.storage.local.set({'gelbooruPosts': {}});
        window.close();
        refreshGelbooruPages()
    };
};

function openGithub(){
    window.open('https://github.com/', '_blank').focus();
}

chrome.runtime.sendMessage({type: 'getCache'}, (cachedPosts) => {
    document.getElementById('downloadToJsonText').textContent = `Save history as JSON [${Object.keys(cachedPosts).length} posts]`;
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("downloadJson").addEventListener("click", () => {downloadJson()});
    document.getElementById("clkInput").addEventListener("click", () => {document.getElementById('uploadJsonFile').click()});
    document.getElementById("clearHistory").addEventListener("click", () => {clearHistory()});
    document.getElementById("openGithubPage").addEventListener("click", () => {openGithub()});
    document.getElementById("uploadJsonFile").addEventListener('change', () => {readJson()});
});


