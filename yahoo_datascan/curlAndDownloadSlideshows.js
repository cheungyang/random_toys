var http = require("http"),
    url = require("url"),
    fs = require('fs');

var total=60000;
var current_count=1;

//var vespa_host="int.calp.media.search.yahoo.com";
var vespa_host="asia.proxy.calp.media.search.yahoo.com";

//var japi_host="japi1.int1.global.media.yahoo.com";
var japi_host="japi1.global.media.yahoo.com";

var target_dir="ss_20120314";

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

        //console.log(current_count+">> UUID "+uuid+" downloading...."); 
        fs.writeFile(target_dir+"/"+uuid+".json", JSON.stringify(data.content), function(err) {
            if(err) {
                console.log(current_count+">> "+uuid+" ERROR-saving:"+err);
            }
        });
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

init(0, 50);

