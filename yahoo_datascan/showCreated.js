var src_dir = "created";

    function displayCreated(data, filename){
	console.log(data["created"]);
    }

    function loadFile(filename, callback){
        var input = fs.createReadStream(dir+filename);
        var text="";
        console.log(">> loading "+dir+filename);

        input.on('data', function(data) {
            text+=data;
        });
        input.on('end', function() {
            var json=JSON.parse(text);
            callback(json, filename);
        });
    }    

    function processFiles(err, filenames){
        if (err){
            console.log(" error when getting file:"+err);
        }
        for(var i in filenames){
            loadFile(filenames[i], displayCreated); 
            //setTimeout(function(){loadFile(filenames[i], processCcm);}(i), i*100); 
        }
    }


var fs = require('fs');
var dir="./"+src_dir+"/";
fs.readdir(dir, processFiles);
