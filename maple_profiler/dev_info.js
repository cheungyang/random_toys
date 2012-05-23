var http = require("http"),
    fs = require('fs'),
    xml2js = require('xml2js'),
    sys = require("util");

    
MP=function(){
};

MP.prototype={
    "execute": function(url, args, mock){
        var host="omg.yahoo.com";
        var endpoint="/?maple_profiler=1";
        
        args.that=this;
        if (mock) {
            this.read("./data_devinfo.html", this.extractXML, args);
        } else {
            this.curl(host, 80, endpoint, "GET", this.extractXML, args);
        }
    },
    
    "getModules": function(data, args){
        if (data==null){
            console.log(">> getModules: data is null");        
            return null;
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
        
        //console.dir(profiles);
        //output
        args.response.writeHead(200, { 'Content-Type': 'text/plain'});
        args.response.write(JSON.stringify(profiles));
        args.response.end();        
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

        var regex=new RegExp(/decorateDevInfo/);
        var line_total=lines.length;
        for(var i=0; i<line_total; i++){
        	if (lines[i].match(regex)){
        		console.log("BINGO");
				fs.writeFile("data_json.json", profileStr);
			
    	        args.that.parseXML(profileStr, args.that.getModules, args);
        	    return false	
        	} else {
        		//console.log(i);
        	}
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


/*http.createServer(function(request, response) {
    var mp=new MP();
    var matrix=require("url").parse(request.url);
    
    var url=matrix && matrix.query || "news.yahoo.com";
    mp.execute(url, {"request": request, "response": response}, true);
}).listen(8081);
*/

    var mp=new MP();
    mp.execute("", {}, true);
