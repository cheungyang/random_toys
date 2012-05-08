var http = require("http"),
    url = require("url"),
    fs = require('fs');

var total=1500;
var current_count=0;

var uuid="3c7c3422-7cff-34ff-a2a4-58f4332ef306";

var vespa_host="int.calp.media.search.yahoo.com";
//var vespa_host="asia.proxy.calp.media.search.yahoo.com";

var japi_host="japi1.int1.global.media.yahoo.com";
//var japi_host="japi1.global.media.yahoo.com";


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

    function getSlideshowUUIDs(start, count){
        var port=4080;
        var endpoint='/content-agility/v1/query%2F%7B%22handler%22%3A%22slideshow%22%2C%22position%22%3Anull%2C%22query%22%3A%7B%22class%22%3A%22connective%22%2C%22subclass%22%3A%22and%22%2C%22inclusive%22%3A%5B%7B%22class%22%3A%22condition%22%2C%22subclass%22%3A%22set%22%2C%22operator%22%3A%22contains%22%2C%22field%22%3A%22facets%22%2C%22value%22%3A%22yahoo-media%3Aslideshow%22%7D%2C%7B%22class%22%3A%22connective%22%2C%22subclass%22%3A%22or%22%2C%22inclusive%22%3A%5B%7B%22class%22%3A%22condition%22%2C%22subclass%22%3A%22age%22%2C%22operator%22%3A%22lt%22%2C%22field%22%3A%22expires%22%2C%22value%22%3A%220%22%7D%2C%7B%22class%22%3A%22condition%22%2C%22subclass%22%3A%22integer%22%2C%22operator%22%3A%22eq%22%2C%22field%22%3A%22expires%22%2C%22value%22%3A%220%22%7D%5D%7D%2C%7B%22class%22%3A%22condition%22%2C%22subclass%22%3A%22age%22%2C%22operator%22%3A%22gt%22%2C%22field%22%3A%22embargo%22%2C%22value%22%3A%220%22%7D%5D%7D%2C%22params%22%3A%7B%22count%22%3A'+count+'%2C%22start%22%3A'+start+'%7D%7D';
        curl(vespa_host, port, endpoint, "GET", getIndivSlideshow);
    }

    function getOneSlideshow(uuid){        
        var port=4080;
        //console.log(">> loading "+uuid);            
        var endpoint="/media_common_api/v1/object/"+uuid+"?format=json";
        curl(japi_host, port, endpoint, "GET", checkPhotosFacet, uuid);
    }

    function checkPhotosFacet(status, data, uuid){
        if (200!=status){
            console.log(">> "+uuid+" terminate as status returned to checkPhotosFacet is "+status);
            return;
        }
        if (typeof data.content==undefined){
            console.log(">> "+uuid+" terminate as content is not returned, status is "+status);
            return;
        }

        current_count++;
        if (data.content["yahoo-media:photos"]!=undefined){
            if (isPhotosFacetDuplicated(data)){
                console.log(current_count+">> UUID "+uuid+" has dup photos facet, okay"); 
            } else {
                console.log(current_count+">> UUID "+uuid+" requires to be changed, downloading...."); 
                /*fs.writeFile("json/"+uuid+".json", JSON.stringify(data, null, 4), function(err) {
                    if(err) {
                        console.log(" error when saving uuid "+uuid+":"+err);
                    }
                });*/
            }             
        }else{
            console.log(current_count+">> UUID "+uuid+" okay"); 
        }
    }

    function isPhotosFacetDuplicated(data){
        if (typeof data.content["yahoo-media:photos-rules"]=="undefined"){
            return false;
        }
        
        //get photos uuids
        var photosfacet=data.content["yahoo-media:photos"];
        var photosfacet_uuid=[];
        for(var i in photosfacet.elements){
            var ele=photosfacet.elements[i];
            photosfacet_uuid[i]=ele.target_id;
        }

        //get photos-rules uuids
        var photosrulesfacet=data.content["yahoo-media:photos-rules"];
        var photosrulesfacet_uuid=[];
        for(var i in photosrulesfacet.rules){
            var ele=photosrulesfacet.rules[i];
            if (typeof ele.target_id!="undefined"){
                photosrulesfacet_uuid[i]=ele.target_id;
            } else {
                return false;
            }
        }

        //additional checks
        if (photosfacet_uuid.length!=photosrulesfacet_uuid.length){
            return false;
        }

        for(var i=0; i<photosfacet_uuid.length; i++){
            if (photosfacet_uuid[i]!=photosrulesfacet_uuid[i]){
                return false;
            }
        }

        return true;
    } 

    
getOneSlideshow(uuid);
