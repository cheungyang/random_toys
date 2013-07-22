(function(){

    var scripts = document.getElementsByTagName("script"),
        links = document.getElementsByTagName("link"),
        jsUrls = [],
        cssUrls = [],
        i,j;

    i = scripts.length;
    j = 0;
    while (i--){
        var src = scripts[i].src;
        if (src.trim() !== ""){
            jsUrls[j++] = src;
        }
    }

    i = links.length;
    j = 0;
    while (i--){
        var href = links[i].href;
        if (href.trim() !== ""){
            cssUrls[j++] = href;
        }
    }

    //alert("CSS@content script:"+ cssUrls.length);
    //alert("JS@content script:"+ jsUrls.length);
    chrome.runtime.sendMessage({
        js: jsUrls,
        css: cssUrls
    }, function(){});
})();