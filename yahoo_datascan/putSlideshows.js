var http = require("http"),
    url = require("url"),
    fs = require('fs');

var dest_dir = "json_modified";

//var api_host="japi1.int1.global.media.yahoo.com";
//var api_host="japi1.global.media.yahoo.com";
var api_host="real1.api.int1.global.media.yahoo.com";

    function curlPUT(host, port, endpoint, method, data, callback, args){
        var options = {
            "host": host,
            "port": port,
            "path": endpoint,
            "method": method,
            "headers": {
                'Cookie': "B=4vjcrtp7h7o2b&b=4&d=jc0lNidpYEPJXPv1Z03_OfXjwgQeAqy4Hv4-&s=pl&i=9bYvL5qKmcnQotPEkbhT; adxf=1071831@3@392.6332697@1@387; adxid=015ecf4f3b5678d1; Y=v=1&n=cg3ibaf1ikki0&l=o0d6a8d63ec/o&p=m2jvvtw113000g00&iz=115&r=6g&lg=zh-Hant-HK&intl=hk; F=a=CtxEKEwMvTeBwam5BESHNMQBE4dceSO8Lpc_e5kZa8e5yIT6y0KxZwwJtzS4JMd7ARzvdaHNjLLFFLq1EqF8fyn6RQ--&b=uLP_; ucs=hs=1; U=mt=YE8z2p2MhYiA4Ug706qYjQcc8AnpbEQv8btk8g--&ux=5INRPB&un=cg3ibaf1ikki0; CH=AgBPRNEwABlZMAAwhBAAH08wABChIAATKzAAB5EwABQ4EAAOPzAAOnAgABZ7IAApVBAANZMgACmsEAAOKQ==; HP=0; YLS=v=1&p=1&n=1; PH=fn=RcuFJkhPuOM5ZmqX.Q--&l=zh-Hant-HK; T=z=4INRPB4c0VPBMz3mAV6wgGdNDZPBjY0T08zNzZOMk4-&a=YAE&sk=DAA0IIOPxJsUlW&ks=EAA6PclOttKg4EBNNE2uS.JDQ--~E&d=c2wBTXpFNEFURXpPRGcwTURFNU5Uay0BYQFZQUUBZwFQN09BT1JJQ0tLVlVWSjRXUUVLTUpaQ0pXQQFvawFaVzAtAXRpcAFZSHBOUEEBenoBNElOUlBCQTdF&af=QXdBQjFDJnRzPTEzMjk5MTAzMjgmcHM9LjZZMGFLRHI4alkwOFRCOVJzVE5UQS0t; YBY=id%3D150593%26userid%3Dycheung%26sign%3DRl4iTXjuK8PF3i2yGV1EhTPBcHdyZk5_Dhpdlm682g6J7erWU4hftSyrm9VuW4mqemkK2OETxmJCaH0jRh18twfPlat1ct6TlSDvzzFWgDCN5qtvg1L5HZNSu5Em4blGJXULnUF0YQHLOTKM3m5Kd9bn2L6w1Csd7cgYNkgIoQI-%26time%3D1330516562%26expires%3D480%26ip%3D216.145.54.15%26roles%3D%7C1.IE%7C121.U%7C13.V%7C20.U%7C248.Q%7C292.SU%7C3.I%7C4.E%7C50.U%7C6951.I%7C6982.I%7C7181.I%7C7348.A%7C7458.A%7C7534.A%7C7600.A%7C7612.S%7C7741.U%7C7790.S%7C7897.A%7C8165.E%7C8325.U%7C8422.U%7C8588.B%7C8684.A%7C8878.A%7C8899.A%7C9026.T%7C9108.R%7C9148.A%7C9508.A%7C9605.BCE%7C9654.A%7C9971.UP%7C%5BProperty%7CViewers%5D%7Cdomain.yahoo.com%7Cip2.216.145.54.15%7C; YMOSI0=00%7B%22pd%22%3A%7B%22fr%22%3A%7B%22stp%22%3A%7B%22plugin%22%3A%22media%5C%2Fsitemap%22%2C%22params%22%3A%22%22%2C%22byappid%22%3A%22groups.yahoo-media.news.GB.en-GB%22%2C%22propid%22%3A370%2C%22ignoreifopen%22%3Atrue%2C%22width%22%3A1132%2C%22panesmode%22%3A%22default%22%2C%22startpane%22%3Atrue%2C%22section%22%3A%22main%22%2C%22ns%22%3A%22pd_startpane%22%2C%22id%22%3A%22pdpane-0%22%2C%22taskId%22%3A1%2C%22mask%22%3Afalse%2C%22oldWidth%22%3A350%2C%22maximize%22%3Atrue%2C%22dirty%22%3Afalse%2C%22shallNotify%22%3Afalse%2C%22shallNotifyRefresh%22%3Afalse%2C%22confirmMessage%22%3A%22This+pane+has+been+modified%2C+are+you+sure+you+want+to+close+or+refresh%3F%22%2C%22iframesrc%22%3A%22http%3A%5C%2F%5C%2Fpdplugins.global.media.yahoo.com%3A9999%5C%2Fpanes%5C%2Fmedia%5C%2Fsitemap%3Fbyappid%3D-1%26lang%3Den-US%26paneid%3Dpdpane-0%26taskid%3D1%26panename%3Dnull-pane-1%26pd-params%3Dpropid%253D370%22%2C%22ylang%22%3A%22en-US%22%7D%7D%7D%7D",
                'Content-Length': data.length,
                'Content-Type': 'application/x-ccm+json;utf-8',
            },
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
                callback(res.statusCode, data, args);
                return false;      
            });
        });
        
        req.write(data);
        req.end();
    }

    function putCcm(data, filename){
        //remove "content" wrapper
        //var content=data.content;
        var content=data;
        var text=JSON.stringify(content);
        var uuid=filename.substr(0, filename.length-5);
        var lang=data.self._lang;
        var region=lang.substr(3,2);
	var site="";

        //put
        var port=4080;
        var endpoint="/v1/slideshow/"+uuid;
        endpoint += "/?format=ccm&lang="+lang+"&region="+region+"&ycb_ctx=site:"+site+",device:full,proxy:on&y_ctx=status:live";  

        curlPUT(api_host, port, endpoint, "PUT", text,
            function(status, data, filename){
                if (status!=200){
                    console.log("[error]"+filename+ ", status "+status);
                    console.log("        "+endpoint);
                } else {
                    console.log("[okay]"+filename);            
                }
            } 
            , filename
        );        
    }

    function loadFile(filename, callback){
        var input = fs.createReadStream(dir+filename);
        var text="";
        //console.log(">> loading "+dir+filename);

        input.on('data', function(data) {
            text+=data;
        }); 
        input.on('end', function() {
            var json=JSON.parse(text);
            callback(json, filename);
        }); 
    }    

    function processPutFiles(err, filenames){
        if (err){
            console.log(" error when getting files: "+err);
        }   
        for(var i in filenames){
            loadFile(filenames[i], putCcm); 
        }   
    }   


var fs = require('fs');
var dir="./"+dest_dir+"/";
fs.readdir(dir, processPutFiles);

