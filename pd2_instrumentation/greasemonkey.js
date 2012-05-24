// ==UserScript==
// @name       Data driven layout design for layouts
// @namespace  http://start.producersdesktop.yahoo.com:9999/v1/index.html
// @version    0.1
// @description  welcome!
// @match      http://*.yahoo.com:9999/panes/media/layout_editor*
// @match      http://*.yahoo.com:9999/panes/media/module_instance_editing_form*
// @copyright  2012+, ycheung@
// @resource   customCSS2 http://mallocworks.s3.amazonaws.com/hackday2012S/css/tooltip.css
// @require    http://code.jquery.com/jquery-1.7.2.min.js
// @require    http://craigsworks.com/projects/qtip2/packages/latest/jquery.qtip.min.js
// @require    http://www.geertdedeckere.be/shop/graphup/download/script/jquery.graphup.pack.js
// ==/UserScript==


GM_addStyle (GM_getResourceText ("customCSS2"));
GM_addStyle(".ybtn { margin-left: 10px; } .ybtn img { width: 25px; height: 25px;}");
GM_addStyle(".stat{width: 460px; margin:0px; padding:0px; max-width:460px;} .stat_left{width: 150px; float: left; background: #F0F0F0; margin:0px; padding: 10px;} .stat_right{250px; float: right; margin:0px;} .icon{ width:100px; text-align: center;}");
GM_addStyle(".statnow{font-size: 36px; line-height: 45px;} .green{color:green;} .red{color:red;} .from{font-size: 14px; float:right;} .updated{float: right; color: #666;} .plot{width:250px; height: 160px;}");
GM_addStyle(".plot th { width:4em; text-align:right; padding-right:10px;} .plot td { width:20em; text-align:right; } .plot span { padding:0.1em 0.2em; background:rgba(255,255,255,0.5); -moz-border-radius:2px; } .plot .bar { -moz-border-radius-topright:5px; -moz-border-radius-bottomright:5px; -webkit-border-top-right-radius:5px; -webkit-border-bottom-right-radius:5px; }");
GM_addStyle(".mtooltip{line-height: 18px;} .mtooltip img{height: 15px; padding-right: 5px;} .mtooltip th{font-weight: bold;}");

var PV_MIN = 100;
var PV_MID = 1000;
var MONEY_MIN = 100;
var MONEY_MID = 1000;
var TIME_MIN = 100;
var TIME_MID = 1000;


var data={
    "TBS2": {
        "time": 121,
        "pv"  : 113,
        "money" : 341,
        "exp" : {
            "layout_title": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "inherit_target": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    },
    "NT1": {
        "time": 121,
        "pv"  : 113,
        "money" : 341,
        "exp" : {
            "layout_title": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "inherit_target": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    },
    "MediaEmpty": {
        "time": 4560,
        "pv"  : 40,
        "money" : 451,
        "exp" : {
            "fieldA": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "fieldB": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    },
    "MediaGalleryListTabbedCA": {
        "time": 341,
        "pv"  : 761,
        "money" : 21,
        "exp" : {
            "fieldA": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "fieldB": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    },
    "MediaCOKEMostViewedPhotos": {
        "time": 671,
        "pv"  : 2131,
        "money" : 231,
        "exp" : {
            "fieldA": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "fieldB": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    },    
    "LREC": {
        "time": 8901,
        "pv"  : 71,
        "money" : 861,
        "exp" : {
            "fieldA": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "fieldB": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    },
    "MREC": {
        "time": 51,
        "pv"  : 671,
        "money" : 441,
        "exp" : {
            "fieldA": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "fieldB": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    },
    "MIP": {
        "time": 341,
        "pv"  : 21,
        "money" : 31,
        "exp" : {
            "fieldA": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "fieldB": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    },
    "MediaAdsDarla": {
        "time": 161,
        "pv"  : 751,
        "money" : 31,
        "exp" : {
            "fieldA": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "fieldB": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    },
    "MediaFreeHtmlEditorial": {
        "time": 31,
        "pv"  : 15,
        "money" : 31,
        "exp" : {
            "instance_title": {
                "html": "hihi from moduleA fieldA",
                "def" : "hihi"
            },
            "instance_description": {
                "html": "hihi from moduleA fieldB",
                "def" : null
            }            
        }
    }
};


var original_stats=null;

$(document).ready(function()
{    
    $('body').append('<div id="stagearea" style="display:none;">');
    
    setupGrowl();
    //FIXME: this is not working
    setTimeout(function(){ setupStatsBar()}(setupStatsBar) , 1000);
    
    
    //upper controls
    $(".controls_top")
        .append('<span id="time" class="ybtn"><a href="#" title="Time"><img src=""/></a></span>')
        .append('<span id="pv" class="ybtn"><a href="#" title="PV"><img src=""/></a></span>')
        .append('<span id="money" class="ybtn"><a href="#" title="Revenue"><img src=""/></a></span>');        

    //display of the upper controls
    $("#pv a").qtip({
        content: {
            // Set the text to an image HTML string with the correct src URL to the loading image you want to use
            text: $("#pv_stat"),
            title: {
                text: "<center>CTR Estimations</center>", // Give the tooltip a title using each elements text
                button: false
            }
        },
        position: {
            at: 'bottom center', // Position the tooltip above the link
            my: 'top center',
            viewport: $(window), // Keep the tooltip on-screen at all times
            effect: false // Disable positioning animation
        },
        show: {
            event: 'hover',
            solo: true // Only show one tooltip at a time
        },
        hide: 'unfocus',
        style: {
            classes: 'ui-tooltip-wiki ui-tooltip-light ui-tooltip-shadow stat',
            width: '460px'
        }
    });
    $("#time a").qtip({
        content: {
            // Set the text to an image HTML string with the correct src URL to the loading image you want to use
            text: $("#time_stat"),
            title: {
                text: "<center>Loading Time Estimations</center>", // Give the tooltip a title using each elements text
                button: false
            }
        },
        position: {
            at: 'bottom center', // Position the tooltip above the link
            my: 'top center',
            viewport: $(window), // Keep the tooltip on-screen at all times
            effect: false // Disable positioning animation
        },
        show: {
            event: 'hover',
            solo: true // Only show one tooltip at a time
        },
        hide: 'unfocus',
        style: {
            classes: 'ui-tooltip-wiki ui-tooltip-light ui-tooltip-shadow stat',
            width: '460px'
        }
    });
    $("#money a").qtip({
        content: {
            // Set the text to an image HTML string with the correct src URL to the loading image you want to use
            text: $("#money_stat"),
            title: {
                text: "<center>Revenue Estimations</center>", // Give the tooltip a title using each elements text
                button: false
            }
        },
        position: {
            at: 'bottom center', // Position the tooltip above the link
            my: 'top center',
            viewport: $(window), // Keep the tooltip on-screen at all times
            effect: false // Disable positioning animation
        },
        show: {
            event: 'hover',
            solo: true // Only show one tooltip at a time
        },
        hide: 'unfocus',
        style: {
            classes: 'ui-tooltip-wiki ui-tooltip-light ui-tooltip-shadow stat',
            width: '460px'
        }
    });    
    

    $('.ybtn a').click(function(event) { 
        updateStatsBar(true);
        event.preventDefault(); 
    });
    
    /*
    $('#time').hover(function(event) { drawGraphs("time"); });
    $('#pv').hover(function(event) { drawGraphs("pv"); });
    $('#money').hover(function(event) { drawGraphs("money"); });
    */
    $('body').keypress(function(e) { if(e.keyCode == 13) { updateStatsBar(true); }}); //another trick
    
    
    //FIXME: experiment results in module page
    $('.yet-bd > ol > .field-wrapper').each(function(){ setupTooltips($(this)); });
    $('.yet-bd > fieldset > ol > .field-wrapper').each(function(){ setupTooltips($(this)); });
    
    //FIXME: in new module page
    $('#module_category').change(function(){
        $('li[id^=yui-gen]').each(function(){ setupModuleTooltips($(this)); });
    });
    $('li[id^=yui-gen]').each(function(){ setupModuleTooltips($(this)); }); //for the first set

});


var updateStatsBar = function(isFirst){

    var stats = calculateAll();
    
    if (original_stats==null || original_stats.money==0){ //a trick
        original_stats=stats;        
    }    
    $("#pv_left .orig").text(original_stats.pv);
    $("#money_left .orig").text(original_stats.money);
    $("#time_left .orig").text(original_stats.time);
    
    
    //update value
    $("#pv_left .statnow").text(stats.pv);
    if (stats.pv < original_stats.pv){
        $("#pv_left .statnow").addClass("red").removeClass("green");
        $("#pv_left .trend").attr("src", "http://mallocworks.s3.amazonaws.com/hackday2012S/img/down.png");
    } else if (stats.pv > original_stats.pv){
        $("#pv_left .statnow").addClass("green").removeClass("red");
        $("#pv_left .trend").attr("src", "http://mallocworks.s3.amazonaws.com/hackday2012S/img/up.png");
    } else {
        $("#pv_left .statnow").removeClass("green").removeClass("red");
        $("#pv_left .trend").attr("src", "");
    }
    
    $("#money_left .statnow").text(stats.money);
    if (stats.money < original_stats.money){
        $("#money_left .statnow").addClass("red").removeClass("green");
        $("#money_left .trend").attr("src", "http://mallocworks.s3.amazonaws.com/hackday2012S/img/down.png");
    } else if (stats.money > original_stats.money){
        $("#money_left .statnow").addClass("green").removeClass("red");
        $("#money_left .trend").attr("src", "http://mallocworks.s3.amazonaws.com/hackday2012S/img/up.png");
    } else {
        $("#money_left .statnow").removeClass("green").removeClass("red");
        $("#money_left .trend").attr("src", "");
    }
    
    $("#time_left .statnow").text(stats.time);
    if (stats.time < original_stats.time){
        $("#time_left .statnow").addClass("green").removeClass("red");
        $("#time_left .trend").attr("src", "http://mallocworks.s3.amazonaws.com/hackday2012S/img/up.png");        
    } else if (stats.time > original_stats.time){
        $("#time_left .statnow").addClass("red").removeClass("green");
        $("#time_left .trend").attr("src", "http://mallocworks.s3.amazonaws.com/hackday2012S/img/down.png");        
    } else {
        $("#time_left .statnow").removeClass("red").removeClass("green");
        $("#time_left .trend").attr("src", "");        
    }
    
    //update icon
    if (stats.pv < PV_MIN){
        $('#pv img').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/pv1.png');
        $('#pv_left .icon').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/pv1.png');
    } else if(stats.pv < PV_MID){
        $('#pv img').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/pv2.png');
        $('#pv_left .icon').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/pv2.png');
    } else {
        $('#pv img').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/pv3.png');
        $('#pv_left .icon').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/pv3.png');
    }
    
    if (stats.money < MONEY_MIN){
        $('#money img').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/money1.png');
        $('#money_left .icon').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/money1.png');
    } else if(stats.money < MONEY_MIN){
        $('#money img').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/money2.png');
        $('#money_left .icon').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/money2.png');
    } else {
        $('#money img').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/money3.png');
        $('#money_left .icon').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/money3.png');
    }
    
    if (stats.time < TIME_MIN){
        $('#time img').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/time1.png');
        $('#time_left .icon').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/time1.png');
    } else if(stats.time < TIME_MID){
        $('#time img').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/time2.png');
        $('#time_left .icon').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/time2.png');
    } else {
        $('#time img').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/time3.png');
        $('#time_left .icon').attr('src', 'http://mallocworks.s3.amazonaws.com/hackday2012S/img/time3.png');
    }    
        
         
    //recreate tables
    var t=stats.mods.length;
    var l=stats.mods.length>5? 5: stats.mods.length;
    for (var i=0; i<t; i++){
        for (var j=0; j<t-i; j++){
            if (stats.mods[i].data.pv > stats.mods[j].data.pv){
                var tmp=stats.mods[i]; 
                stats.mods[i]=stats.mods[j];
                stats.mods[j]=tmp;
            }
        }
    }
    var pv_div=$("#plot_pv").html(" ");
    var pv_plot=$('<table class="plot" cellspacing="0">'); 
    for(var i=0; i<l; i++){
        th=$('<th>').text(stats.mods[i].mod_id); sp=$('<span>').text(stats.mods[i].data.pv); td=$('<td>').append(sp); tr=$('<tr>').append(th).append(td); pv_plot.append(tr);        
    }
    pv_div.append(pv_plot);
    
    var t=stats.mods.length;
    for (var i=0; i<t; i++){
        for (var j=0; j<t-i; j++){
            if (stats.mods[i].data.money > stats.mods[j].data.money){
                var tmp=stats.mods[i]; 
                stats.mods[i]=stats.mods[j];
                stats.mods[j]=tmp;
            }
        }
    }
    var money_div=$("#plot_money").html(" ");
    var money_plot=$('<table class="plot" cellspacing="0">'); 
    for(var i=0; i<l; i++){
        th=$('<th>').text(stats.mods[i].mod_id); sp=$('<span>').text(stats.mods[i].data.money); td=$('<td>').append(sp); tr=$('<tr>').append(th).append(td); money_plot.append(tr);        
    } 
    money_div.append(money_plot);    
    
    var t=stats.mods.length;
    for (var i=0; i<t; i++){
        for (var j=0; j<t-i; j++){
            if (stats.mods[i].data.time > stats.mods[j].data.time){
                var tmp=stats.mods[i]; 
                stats.mods[i]=stats.mods[j];
                stats.mods[j]=tmp;
            }
        }
    }
    var time_div=$("#plot_time").html(" ");
    var time_plot=$('<table class="plot" cellspacing="0">'); 
    for(var i=0; i<l; i++){
        th=$('<th>').text(stats.mods[i].mod_id); sp=$('<span>').text(stats.mods[i].data.time); td=$('<td>').append(sp); tr=$('<tr>').append(th).append(td); time_plot.append(tr);        
    }    
    time_div.append(time_plot);

    drawGraphs();
    
    //TODO
    if (isFirst!=null && !isFirst){
        createGrowl("hi", "hi2", false);
    }
}
    

var drawGraphs = function(target_name){
    if (null==target_name || "pv"==target_name){ 
        $('#plot_pv td').graphup({
            min: 0,
            cleaner: 'strip',
            painter: 'bars',
            colorMap: [[145,89,117], [102,0,51]]
        });
    }
    if (null==target_name || "time"==target_name){ 
        $('#plot_time td').graphup({
            min: 0,
            cleaner: 'strip',
            painter: 'bars',
            colorMap: [[145,89,117], [102,0,51]]
        });    
    }
    if (null==target_name || "money"==target_name){ 
        $('#plot_money td').graphup({
            min: 0,
            cleaner: 'strip',
            painter: 'bars',
            colorMap: [[145,89,117], [102,0,51]]
        });
    }
}
    

var setupStatsBar = function(){
    
    original_stats = calculateAll(); 
    
    var th, td, tr, sp;    
    var pv_left=$('<div class="stat_left" id="pv_left">')
        .append('<center><img class="icon" src=""></center>').append("<br/>")
        .append('<img class="trend"src="">')
        .append('<span class="statnow">'+original_stats.total_pv+'</span>')
        .append('<span class="unit">%</span>').append("<br/>")
        .append('<span class="from">(from <span class="orig">'+original_stats.total_pv+'</span> %)</span>').append("<br/><br/><br/>");
    var pv_right=$('<div class="stat_right" id="pv_right">')
        .append('<h3>Top 5 Popular Modules</h3>')
        .append('<div id="plot_pv">')
        .append("<br/>")
        .append('<span class="updated">updated: 25May,2012</span>');    
    var pv=$('<div id="pv_stat">').append(pv_left).append(pv_right);
    $('#stagearea').append(pv);
    

    var time_left=$('<div class="stat_left" id="time_left">')
        .append('<center><img class="icon" src=""></center>').append("<br/>")
        .append('<img class="trend"src="">')
        .append('<span class="statnow">'+original_stats.total_time+'</span>')
        .append('<span class="unit">ms</span>').append("<br/>")
        .append('<span class="from">(from <span class="orig">'+original_stats.total_time+'</span> ms)</span>').append("<br/><br/><br/>");
    var time_right=$('<div class="stat_right" id="time_right">')
        .append('<h3>Top 5 Time Consuming Modules</h3>')
        .append('<div id="plot_time">')
        .append("<br/>")
        .append('<span class="updated">updated: 25May,2012</span>');    
    var time=$('<div id="time_stat">').append(time_left).append(time_right);
    $('#stagearea').append(time);
    
    //money data
    var money_left=$('<div class="stat_left" id="money_left">')
        .append('<center><img class="icon" src=""></center>').append("<br/>")
        .append('<img class="trend"src="">')
        .append('<span class="statnow">'+original_stats.total_money+'</span>')
        .append('<span class="unit">USD</span>').append("<br/>")
        .append('<span class="from">(from <span class="orig">'+original_stats.total_money+'</span> USD)</span>').append("<br/><br/><br/>");
    var money_right=$('<div class="stat_right" id="money_right">')
        .append('<h3>Top 5 Profiting Modules</h3>')
        .append('<div id="plot_money">')
        .append("<br/>")
        .append('<span class="updated">updated: 25May,2012</span>');    
    var money=$('<div id="money_stat">').append(money_left).append(money_right);
    $('#stagearea').append(money);
    
    
    //update graphs
    updateStatsBar(true);
}


var setupTooltips = function(item, mod_id){       
    if (undefined==item || null==item){
        return false;
    }

    if (mod_id==null){
        mod_id=$('#instance_module').val();
        if (mod_id==undefined){
            return false;
        }
    }
    
    //find fieldname can be tricky
    field_name=item.find(":text").attr("name");
    if (field_name==undefined){
        field_name= item.find("textarea").attr("name");
    }
  
    if (typeof data[mod_id]=="undefined" 
        || typeof data[mod_id]["exp"][field_name]=="undefined"
    ){
        console.log('>>error findig record for module "'+mod_id+'", field "'+field_name+'"');
        return false;
    }

    //generate random id for fields
    var id = getRandomString();
    item.attr("id", id);
    var d;
    var def = data[mod_id]["exp"][field_name]["def"];
    if (def!=null){        
        var a = $('<a href="#">')
            .text('click to set field to '+def)
            .click([id, def], function(event){
                var input_box = $('#'+id).find(':text');
                if (null!=input_box){
                    input_box.val(def);
                }
            });
        var p = $('<span>').text(data[mod_id]["exp"][field_name]["html"]);
        var d = $('<div id="tooltip_'+id+'">').append(p).append("<br>").append(a);
    } else {
        var p = $('<span>').text(data[mod_id]["exp"][field_name]["html"]);
        var d = $('<div id="tooltip_'+id+'">').append(p);
    }
    $('#stagearea').append(d);
    
    //run qtip
    item.qtip({
        content: {
            // Set the text to an image HTML string with the correct src URL to the loading image you want to use
            text: $('#tooltip_'+item.attr("id")),
            title: {
                text: item.find("label").text(),
                button: false
            }
        },
        position: {
            at: 'left top', // Position the tooltip above the link
            my: 'right top',
            viewport: $(window), // Keep the tooltip on-screen at all times
            effect: true, // Disable positioning animation
            adjust: { x: -650 },
        },
        show: {
            event: 'hover',
            solo: true // Only show one tooltip at a time
        },
        hide: 'unfocus',
        style: {
            //classes: 'ui-tooltip-wiki ui-tooltip-light ui-tooltip-shadow'
        }
    });
    
    return true;
};


var setupModuleTooltips = function(item){       
    if (undefined==item || null==item){
        return false;
    }
    
    mod_id=item.find('input').attr('id');
    if (undefined==mod_id || null==mod_id){
        return false;
    }
    
    //remove "Config"
    var i = mod_id.indexOf("Config");
    if (i>0){
        mod_id=mod_id.substr(0,i);
    }
  
    if (typeof data[mod_id]=="undefined"){
        console.log('>>error findig record for module "'+mod_id+'"');
        return false;
    }

    var tr1=$('<tr><th><img src="http://mallocworks.s3.amazonaws.com/hackday2012S/img/time2.png"/>Time:</th><td>'+data[mod_id].time+'ms</td></tr>');
    var tr2=$('<tr><th><img src="http://mallocworks.s3.amazonaws.com/hackday2012S/img/pv1.png"/>CTR:</th><td>'+data[mod_id].pv+'%</td></tr>');
    var tr3=$('<tr><th><img src="http://mallocworks.s3.amazonaws.com/hackday2012S/img/money1.png"/>Revenue:</th><td>'+data[mod_id].money+'USD</td></tr>');
    var table=$('<table class="mtooltip">').append(tr1).append(tr2).append(tr3);
    var d = $('<div id="mtooltip_'+mod_id+'">').append(table);
    $('#stagearea').append(d);          
                    
    //run qtip
    item.qtip({
        content: {
            // Set the text to an image HTML string with the correct src URL to the loading image you want to use
            text: $("#mtooltip_"+mod_id),
            title: {
                text: mod_id,
                button: false
            }
        },
        position: {
            at: 'bottom center', // Position the tooltip above the link
            my: 'top center',
            viewport: $(window), // Keep the tooltip on-screen at all times
            effect: true, // Disable positioning animation
            adjust: {},
        },
        show: {
            event: 'hover',
            solo: true // Only show one tooltip at a time
        },
        hide: 'unfocus',
        style: {
            //classes: 'ui-tooltip-wiki ui-tooltip-light ui-tooltip-shadow'
        }
    });
    
    return true;
};


var calculateAll = function(){
    var total_time=0;
    var total_pv=0;
    var total_money=0;
    var mods=[];
    
    $(".module").each(function(){
        var classStr = $(this).attr("class");
        if (undefined!=classStr && null!=classStr){
            var classList = $(this).attr("class").split(/\s+/);
            var mod_id=null, mod_title=null;
            for (var i = 0; i < classList.length; i++) {
                //instance module module:4e2e122b-4425-356b-8229-98c3bbd98a75 module_id:NT1 module_title:ADS%20NT1 config_id:NT1Config module_id:NT1  inherited inherited_from:65277572-c478-4258-acc7-bfd4ceb88db8
                if ("module_id"==classList[i].substr(0,9)) { mod_id=classList[i].substr(10, classList[i].length-10); }
                if ("module_title"==classList[i].substr(0,12)) { mod_title=classList[i].substr(13, classList[i].length-13); }
            }
            if (typeof data[mod_id] == "undefined"){
                console.log(">> module ID "+mod_id+" not found");
            } else {
                total_time = total_time+data[mod_id]["time"];
                total_pv = total_pv+data[mod_id]["pv"];
                total_money = total_money+data[mod_id]["money"];
                
                mods.push({"mod_id": mod_id, "data": data[mod_id]});
            }
        }
    });
    console.log(">>total time/pv/money: "+total_time +"(ms)/"+total_pv+"/"+total_money);
    return {time: total_time, pv: total_pv, money: total_money, mods: mods};
}


var setupGrowl = function(){
    
    window.createGrowl = function(header, text, persistent) {
        // Use the last visible jGrowl qtip as our positioning target
        var target = $('.qtip.jgrowl:visible:last');
 
        // Create your jGrowl qTip...
        $(document.body).qtip({
            // Any content config you want here really.... go wild!
            content: {
                text: text,
                title: {
                    text: header,
                    button: true
                }
            },
            position: {
                my: 'top right',
                // Not really important...
                at: (target.length ? 'bottom' : 'top') + ' right',
                // If target is window use 'top right' instead of 'bottom right'
                target: target.length ? target : $(window),
                // Use our target declared above
                adjust: { y: 33, x: -5 },
                effect: function(api, newPos) {
                    // Animate as usual if the window element is the target
                    $(this).animate(newPos, {
                        duration: 1000,
                        queue: false
                    });
 
                    // Store the final animate position
                    api.cache.finalPos = newPos; 
                }
            },
            show: {
                event: false,
                // Don't show it on a regular event
                ready: true,
                // Show it when ready (rendered)
                effect: function() {
                    $(this).stop(0, 1).fadeIn(400);
                },
                // Matches the hide effect
                delay: 0,
                // Needed to prevent positioning issues
                // Custom option for use with the .get()/.set() API, awesome!
                persistent: persistent
            },
            hide: {
                event: false,
                // Don't hide it on a regular event
                effect: function(api) {
                    // Do a regular fadeOut, but add some spice!
                    $(this).stop(0, 1).fadeOut(400).queue(function() {
                        // Destroy this tooltip after fading out
                        api.destroy();
 
                        // Update positions
                        updateGrowls();
                    })
                }
            },
            style: {
                classes: 'jgrowl ui-tooltip-dark ui-tooltip-rounded',
                // Some nice visual classes
                tip: false // No tips for this one (optional ofcourse)
            },
            events: {
                render: function(event, api) {
                    // Trigger the timer (below) on render
                    timer.call(api.elements.tooltip, event);
                }
            }
        }).removeData('qtip');
    };
 
    // Make it a window property see we can call it outside via updateGrowls() at any point
    window.updateGrowls = function() {
        // Loop over each jGrowl qTip
        var each = $('.qtip.jgrowl'),
            width = each.outerWidth(),
            height = each.outerHeight(),
            gap = each.eq(0).qtip('option', 'position.adjust.y'),
            pos;
 
        each.each(function(i) {
            var api = $(this).data('qtip');
 
            // Set target to window for first or calculate manually for subsequent growls
            api.options.position.target = !i ? $(window) : [
                pos.left + width, pos.top + (height * i) + Math.abs(gap * (i-1))
            ];
            api.set('position.at', 'top right');
            
            // If this is the first element, store its finak animation position
            // so we can calculate the position of subsequent growls above
            if(!i) { pos = api.cache.finalPos; }
        });
    };
 
    // Setup our timer function
    function timer(event) {
        var api = $(this).data('qtip'),
            lifespan = 5000; // 5 second lifespan
        
        // If persistent is set to true, don't do anything.
        if (api.get('show.persistent') === true) { return; }
 
        // Otherwise, start/clear the timer depending on event type
        clearTimeout(api.timer);
        if (event.type !== 'mouseover') {
            api.timer = setTimeout(api.hide, lifespan);
        }
    }
 
    // Utilise delegate so we don't have to rebind for every qTip!
    $(document).delegate('.qtip.jgrowl', 'mouseover mouseout', timer);
};


var getRandomString = function() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}
