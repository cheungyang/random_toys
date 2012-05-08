var src_dir = "json_soln.20120305";
var dest_dir = "json_modified";

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

    function mergeFacets(data){

        //create new rules
        var photosfacet=data.content["yahoo-media:photos"];
        var newrules=[];
        var i;
        if (typeof photosfacet["elements"] == "undefined") photosfacet["elements"]=[];
        for(i=0; i<photosfacet.elements.length; i++){
            var tmpitem={};
            var ele=photosfacet.elements[i];
            //FIXME position can be a string, break intnetionall down here
            tmpitem.position=i+1;
            tmpitem.target_facets=["yahoo-media:image","yahoo-media:photo"];            
            tmpitem.target_id=ele.target_id;
            newrules[i]=tmpitem;
        }

        //append existing rules if exist
        if (typeof data.content["yahoo-media:photos-rules"]!="undefined"){
            var photosrulesfacet=data.content["yahoo-media:photos-rules"];
            for(var j in photosrulesfacet.rules){
                var ele=photosrulesfacet.rules[j];
                ele.position=i+1;
                newrules[i]=ele;
                i++;
            }
        }

        //replace
        var newfacet={};
        var selffacet=data.content["self"];
        newfacet._id=selffacet._id;
        newfacet._context=selffacet._context;
        newfacet._writer=selffacet._writer;
        newfacet._rev=selffacet._rev;
        newfacet._schema="/ccs/common/deflistrules";        
        newfacet._lang=selffacet._lang;
        newfacet._name="yahoo-media:photos-rules";
        newfacet.rules=newrules;

        data.content["yahoo-media:photos-rules"]=newfacet;

        return data;
    }

    function processCcm(data, filename){
        console.log("processing "+filename);
        var facetWhitelist=["self"];//, "yahoo-media:photos"];

        if (!isPhotosFacetDuplicated(data)){
            facetWhitelist.push("yahoo-media:photos-rules");
            console.log(">> "+filename+" requires changes");
            data = mergeFacets(data);
        }else{
            console.log(">> "+filename+" ok");
            return;
        }

        //remove other facets
        for(var i in data.content){
            var wl=facetWhitelist.length;
            var doFilter=true;
            for(j=0; j<wl; j++){
                if (i==facetWhitelist[j]){
                    doFilter=false;
                }
            }
            if (doFilter){
                delete data.content[i];
            }
        }

        //delete photos facet(or maybe not)
        var content = data.content;
        //content["yahoo-media:photos"]["_deleted"] = "true";

        //save data
        fs.writeFile(dest_dir+"/"+filename, JSON.stringify(content, null, 4), function(err) {
            if(err) {
                console.log(" error when saving uuid "+uuid+":"+err);
            }
        });
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
            loadFile(filenames[i], processCcm); 
            //setTimeout(function(){loadFile(filenames[i], processCcm);}(i), i*100); 
        }
    }


var fs = require('fs');
var dir="./"+src_dir+"/";
fs.readdir(dir, processFiles);
