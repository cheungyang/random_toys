    function printAttrs(prefix, data){
        if (typeof data != "object"){
            return;
        }

        for(var i in data){
            if (!isNaN(i)){ 
                //does not handle array, just maps
                //returning upper level
                ws.write(prefix+"\n");
                return;
            } else if (typeof data[i] == "object"){
                printAttrs(prefix+"|"+i, data[i]);
            } else {
                ws.write(prefix+"|"+i+"\n");
            }
        }
    }

    function processCcm(data, filename){
        console.log("processing "+filename);
        var facetWhitelist=["self", "yahoo-media:photo", "yahoo-media:slideshow", "yahoo-media:image", "yahoo-media:image_embedded_metadata"];

	for(var i in facetWhitelist){
            var facetname = facetWhitelist[i];
            var content = data.content;
            if (typeof content[facetname] != "undefined"){
                printAttrs(facetname, content[facetname]);
            }
        }
    }

    function loadFile(idx, filename, callback){
        var input = fs.createReadStream(src_dir+"/"+filename);
        var text="";
        console.log(">> "+idx+" loading "+src_dir+"/"+filename);
        input.on('data', function(data) {
            text+=data;
        });
        input.on('end', function() {
            var json=JSON.parse(text);
            callback(json, filename);
        });
    }    

    function loadFilenames(err, filenames){
        if (err){
            console.log(" error when getting file:"+err);
        }
        for(var i=start; i<start+batch; i++){ //i<filenames.length; i++){
            //loadFile(i, filenames[i], processCcm);
            //setTimeout(function(){loadFile(i, filenames[i], processCcm);}(i), i);
            setTimeout(loadFile(i, filenames[i], processCcm), i);  
        }
    }


var src_dir = "json_prod";
var dest_file = src_dir+"_out.log";
var fs = require('fs');
var start = 0;
var batch = 20;

var ws = fs.createWriteStream(dest_file);
fs.readdir(src_dir, loadFilenames);
