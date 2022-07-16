function addPostToLocalStorage(rq){
    let timestamp = Date.now();
    chrome.storage.local.get('gelbooruPosts').then((rsp) => {
        rsp.gelbooruPosts[rq.id] = {
            imageUrl: rq.imageUrl,
            thumbnail: rq.thumbnail,
            id: rq.id,
            timestamp: timestamp
        };
        chrome.storage.local.set({'gelbooruPosts': rsp.gelbooruPosts});
    });
};

function removeFromLocalStorage(rq){
    chrome.storage.local.get('gelbooruPosts').then((rsp) => {
        delete rsp.gelbooruPosts[rq.id];
        chrome.storage.local.set({'gelbooruPosts': rsp.gelbooruPosts});
    });
};

function downloadPost(rq, sendResponse){
    chrome.downloads.download({url: rq.imageUrl});
    addPostToLocalStorage(rq);
    sendResponse({status: true});
};

function getCache(sendResponse){
    chrome.storage.local.get('gelbooruPosts').then((rsp) => {
        if(!rsp.gelbooruPosts){
            rsp.gelbooruPosts = {};
            chrome.storage.local.set({'gelbooruPosts': rsp.gelbooruPosts});
        };
        sendResponse(rsp.gelbooruPosts);
    });
};

chrome.runtime.onInstalled.addListener(() =>{
    chrome.storage.local.set({'gelbooruPosts': {}})
})


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch (request.type){
            case "download": downloadPost(request, sendResponse); break;
            case "getCache": getCache(sendResponse); break;
            case "remove": removeFromLocalStorage(request); break;
        }
        return true;
    }
)
