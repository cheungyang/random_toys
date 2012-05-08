var http = require("http"),
    url = require("url"),
    fs = require('fs');


    function getUUIDs(context, start, count){
        var port=4080;
        var endpoint='/pages_api/v1/layouts;start='+start+';count='+count+'?ycb_ctx=site:'+context.site+'&region='+context.region+'&lang='+context.lang;
        curl(japi_host, port, endpoint, "GET", getIndivObject);
    }

    function getIndivObject(status, data){        
        if (200!=status){
            console.log(">> terminate as status returned to getIndivObject is "+status);
            return;
        }

        //set total
        total=data.total;
        //console.log("total:"+total);

        var port=4080;
        for(var id in data.elements){
            var ele = data.elements[id];
            var uuid = ele.content.self._id;
            //console.log(">> loading "+uuid);            
            var endpoint="/media_common_api/v1/object/"+uuid+"?format=json";
            curl(japi_host, port, endpoint, "GET", checkCCM, uuid);
        }
    }

    function checkCCM(status, data, uuid){
        current_count++;

        if (200!=status){
            console.log(current_count+">> "+uuid+" ERROR-status "+status);
            return;
        }
        if (typeof data.content=="undefined"){
            console.log(current_count+">> "+uuid+" ERROR-no content is returned");
            return;
        }

        console.log(current_count+">> UUID "+uuid+" downloading...."); 
        /*fs.writeFile(target_dir+"/"+uuid+".json", JSON.stringify(data.content), function(err) {
            if(err) {
                console.log(current_count+">> "+uuid+" ERROR-saving:"+err);
            }
        });*/
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

    function init(context, start, batch_size){
        getUUIDs(context, start, batch_size);
        console.log("> fired from "+start+". sleep for a couple seconds, total:"+total);
        start+=batch_size;
        if (start<total){
            setTimeout(init, 10000, context, start, batch_size); 
        }
    }


var total=1000; //useless number
var current_count=1;

//var japi_host="japi1.int1.global.media.yahoo.com";
var japi_host="japi1.global.media.yahoo.com";

var contexts = [
    { site: "news", region: "US", lang: "en-US" }
];

for (var i in contexts){
    init(contexts[i], 0, 50);
}
