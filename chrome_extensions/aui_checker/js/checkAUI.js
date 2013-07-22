var EXPIRY_DURATION = 86400,
    KEY_AUI_INFO = "aui_info",
    KEY_EXPIRY = "expiry";

var output = {},
    info_expiry = null,
    aui_info = {};

(function(){
    var checkAUIVersion = function(request, callback){
        var msg = [
            "JS@background:"+request.js.length,
            "CSS@background:"+request.css.length
        ].join(", <br/>\n");

        getAUIInfo(function(aui_info){
            output["msg"] = msg;
            callback(true);
        });
    };

    var getAUIInfo = function(callback){
        //From runtime variable
        if (info_expiry && Date.now() > info_expiry){
            callback(aui_info);
        } else {
            chrome.storage.local.get(KEY_EXPIRY, function(expiry){
                if (expiry && Date.now() < expiry) {
                    info_expiry = expiry;
                    fetchInfoFromStorage(callback);
                } else {
                    fetchInfoFromUrl(callback);
                }
            });
        }
    };

    var fetchInfoFromStorage = function(callback) {
        chrome.storage.local.get(KEY_AUI_INFO, function(tmp_aui_info){
            aui_info = tmp_aui_info;
            callback(aui_info);
        });
    };

    var fetchInfoFromUrl = function(callback) {
        //TODO get real aui info here
        aui_info = {
            versions: {
                js: 0,
                css: 0
            }
        };
        info_expiry = Date.now() + EXPIRY_DURATION * 1000;

        chrome.storage.local.set({
            KEY_AUI_INFO: aui_info,
            KEY_EXPIRY: info_expiry
        });
        callback(aui_info);
    };

    var getUrl = function(url, callback) {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.onload = callback(this);
        req.send(null);
    };

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            checkAUIVersion(request, function(isAUI) {
                if (isAUI){
                    chrome.pageAction.show(sender.tab.id);
                } else {
                    chrome.pageAction.hide(sender.tab.id);
                }
            });
        }
    );
})();