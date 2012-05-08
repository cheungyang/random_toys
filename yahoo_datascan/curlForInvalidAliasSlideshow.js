var http = require("http"),
    url = require("url"),
    fs = require('fs');

var total=60000;
var current_count=1;

//var vespa_host="int.calp.media.search.yahoo.com";
var vespa_host="asia.proxy.calp.media.search.yahoo.com";

//var japi_host="japi1.int1.global.media.yahoo.com";
var japi_host="japi1.global.media.yahoo.com";


/*
  "_id": "c6ae8ffe-9872-36dd-8312-fca54b270428",
      "_context": "3e2c945a-db67-3157-84cf-74ca403baa77",
      "_writer": "577cd8c8-116d-3ff4-8c13-b80b1e38d800",
      "_rev": "6684f6ae-dd0f-11e0-9fc5-772600954eb5",
      "_name": "yahoo-media:keys",
      "_deleted": false,
      "_schema": "/ccs/common/aliasref",
      "_keys": [
        "ymedia-alias:slideshow=cbe_slideshow12345-1315811901-1315811901-slideshow",
        "ymedia-alias:slideshow=cbe_slideshow12345-1315811901-slideshow",
        "ymedia-alias:slideshow=cbe_slideshow12345-1315811901-slideshow"
      ],
*/




    function checkSlideshow(status, data, uuid){
        current_count++;

        if (200!=status){
            console.log(current_count+">> "+uuid+" ERROR-status "+status);
            return;
        }
        if (typeof data.content=="undefined"){
            console.log(current_count+">> "+uuid+" ERROR-no content is returned");
            return;
        }

	var ss=data.content["yahoo-media:keys"];
        var regex=/[\`~!@\#\$%^&*()=+\|/?.>,<;:\"\[\{\]\}]/g;

        if (typeof ss=="undefined"){
            console.log(current_count+">> "+uuid+" ERROR-keys facet not exists");
            return;
        }
	if (typeof ss["_keys"] != "object"){
            console.log(current_count+">> "+uuid+" : ERROR-keys:_key attr is not an array"); 
            return;
        }

        var hit=false;
        for (var idx in ss["_keys"]){ 
            var k = ss["_keys"][idx].substr("ymedia-alias:slideshow=".length, ss["_keys"][idx].length-"ymedia-alias:slideshow=".length);
            if (!hit && k.search(regex) != -1){                   
                console.log(current_count+">> "+uuid+" : "+k);
                hit=true;
            }	
        }
        //if (!hit){ 
        //    console.log(current_count+">> "+uuid+" okay"); 
        //}
    }

    function getSlideshowUUIDs(start, count){
        var port=4080;
        var endpoint='/content-agility/v1/query%2F%7B%22handler%22%3A%22slideshow%22%2C%22position%22%3Anull%2C%22query%22%3A%7B%22class%22%3A%22connective%22%2C%22subclass%22%3A%22and%22%2C%22inclusive%22%3A%5B%7B%22class%22%3A%22condition%22%2C%22subclass%22%3A%22set%22%2C%22operator%22%3A%22contains%22%2C%22field%22%3A%22facets%22%2C%22value%22%3A%22yahoo-media%3Aslideshow%22%7D%2C%7B%22class%22%3A%22connective%22%2C%22subclass%22%3A%22or%22%2C%22inclusive%22%3A%5B%7B%22class%22%3A%22condition%22%2C%22subclass%22%3A%22age%22%2C%22operator%22%3A%22lt%22%2C%22field%22%3A%22expires%22%2C%22value%22%3A%220%22%7D%2C%7B%22class%22%3A%22condition%22%2C%22subclass%22%3A%22integer%22%2C%22operator%22%3A%22eq%22%2C%22field%22%3A%22expires%22%2C%22value%22%3A%220%22%7D%5D%7D%2C%7B%22class%22%3A%22condition%22%2C%22subclass%22%3A%22age%22%2C%22operator%22%3A%22gt%22%2C%22field%22%3A%22embargo%22%2C%22value%22%3A%220%22%7D%5D%7D%2C%22params%22%3A%7B%22count%22%3A'+count+'%2C%22start%22%3A'+start+'%7D%7D';
        curl(vespa_host, port, endpoint, "GET", getIndivSlideshow);
    }

    function curl(host, port, endpoint, method, callback, args){
        var data = "";
        var options = {
            "host": host,
            "port": port,
            "path": endpoint,
            "method": method
        };

        var req = http.request(options, function(res) {
            //console.log('STATUS: ' + res.statusCode+"["+host+":"+port+options.path+"]");
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on("end", function(){
                //console.log('BODY: ' + data); 
                callback(res.statusCode, JSON.parse(data), args);
                return false;      
            });
        });

        req.on('error', function(e) {
            console.log('ERROR: ' + e.message);
            callback(500, {"error":e.message});
            return false;
        });
        req.end();
    }

    function getIndivSlideshow(status, data){        
        if (200!=status){
            console.log(">> terminate as status returned to getIndivSlideshow is "+status);
            return;
        }

        //set total
        total=data.total;
        //console.log("total:"+total);

        var port=4080;
        for(var id in data.hits){
            var uuid = data.hits[id];
            //console.log(">> loading "+uuid);            
            var endpoint="/media_common_api/v1/object/"+uuid+"?format=json";
            curl(japi_host, port, endpoint, "GET", checkSlideshow, uuid);
        }
    }

    function init(start, batch_size){
        getSlideshowUUIDs(start, batch_size);
        console.log("> fired from "+start+". sleep for a couple seconds, total:"+total);
        start+=batch_size;
        if (start<total){
            setTimeout(init, 10000, start, batch_size); 
        }
    }

init(10200, 50);
