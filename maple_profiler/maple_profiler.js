var http = require("http"),
    url = require("url"),
    fs = require('fs'),
    xml2js = require('xml2js');
    
MP=function(){
};

MP.prototype={
    "execute": function(url){
        var host="omg.yahoo.com";
        var endpoint="/?maple_profiler=1";
        
        //var data=MP.curl(host, 80, endpoint, "GET", MP.extractXML);
        this.read("./data.html", this.extractXML, {that:this});
    },
    
    "getModules": function(data){
        if (data==null){
            console.log(">> getModules: data is null");        
            return false;
        }
        
        var profiles=[];
        var totali=data.Event.Event.length;
        for(var i=0; i< totali; i++){
            var event=data.Event.Event[i];
            if (event.Name=="maple:engine:execute"){
                var totalj=event.Event.length;
                for(var j=0; j<totalj; j++){
                    var event2=event.Event[j];
                    if (event2.Name=="maple:module"){
                        profiles.push(event2);
                    }
                }
            }
        }
        //!!!
        console.dir(profiles);
    },
    
    "parseXML": function(text, callback, args){
        if (text==null) {
            console.log(">> parseXML: text is null");
            return false;
        }
        
        var parser = new xml2js.Parser();
        parser.parseString(text, function (err, result) {
            callback(result, args);
            return false;
        });  
    },
    
    "extractXML": function(status, data, args){
        if (200!=status){
            console.log(">> terminate as status returned is "+status);
            return false;
        }

        var regex=new RegExp(/<Profiler>[\w\W\n\r]*<\/Profiler>/igm);
        //var regex=new RegExp(/<Event>[\n\r\s]*<Name>maple:module<\/Name>[\w\W\n\r]*<\/Event>[\n\r\s]*<\/Event>[\n\r\s]*<\/Event>/igm);
        profiles = data.match(regex);
        if (profiles==null){
            console.log(">> no profiler");
            return false;            
        } else {
            var profileStr=profiles[0];
            args.that.parseXML(profileStr, args.that.getModules, args);
        }
    },
    
    "curl": function(host, port, endpoint, method, callback, args){
        var text = "";
        var options = {
            "host": host,
            "port": port,
            "path": endpoint,
            "method": method
        };

        var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                text += chunk;
            });
            res.on("end", function(){
                callback(res.statusCode, text, args);
                return false;
            });
        });

        req.on('error', function(e) {
            callback(500, {"error":e.message});
            return false;
        });
        req.end();
    }, 
    
    "read": function(path, callback, args){
        var input = fs.createReadStream(path);
        var text="";

        input.on('data', function(data) {
            text+=data;
        });
        input.on('end', function() {
            callback(200, text, args);
            return false;
        });
    } 
}

var url="news.yahoo.com";
var mp=new MP();
mp.execute(url);