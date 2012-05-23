// ==UserScript==
// @name       Data driven layout design
// @namespace  http://start.producersdesktop.yahoo.com:9999/v1/index.html
// @version    0.1
// @description  welcome!
// @match      http://*.yahoo.com:9999/panes/media/layout_editor*
// @copyright  2012+, ycheung@
// @resource   customCSS2 http://craigsworks.com/projects/qtip2/packages/latest/jquery.qtip.min.css
// @require    http://code.jquery.com/jquery-1.7.2.min.js
// @require    http://craigsworks.com/projects/qtip2/packages/latest/jquery.qtip.min.js
// ==/UserScript==

GM_addStyle (GM_getResourceText ("customCSS2"));
GM_addStyle(".ybtn { border: 1px red solid; margin: 2px; }");

var data={
    "NT1": {
        "time": 1,
        "pv"  : 1,
        "money" : 1,
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
        "time": 0,
        "pv"  : 0,
        "money" : 1,
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
        "time": 1,
        "pv"  : 1,
        "money" : 1,
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
        "time": 1,
        "pv"  : 1,
        "money" : 1,
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
        "time": 1,
        "pv"  : 1,
        "money" : 1,
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
        "time": 1,
        "pv"  : 1,
        "money" : 1,
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
        "time": 1,
        "pv"  : 1,
        "money" : 1,
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
        "time": 1,
        "pv"  : 1,
        "money" : 1,
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
        "time": 1,
        "pv"  : 1,
        "money" : 1,
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
    }
};

    

$(document).ready(function()
{
    //setTimeout("calculateTime()",1000)
    setupGrowl();
    
    //upper controls
    $(".controls_top")
        .append('<span id="pv" class="ybtn"><a href="#" title="a">pv</a></span>')
        .append('<span id="rev" class="ybtn"><a href="#" title="b">revenue</a></span>')
        .append('<span id="time" class="ybtn"><a href="#" title="c">time</a></span>');

    //display of the upper controls
    $('.ybtn a').each(function(){
		$(this).qtip({
			content: {
				// Set the text to an image HTML string with the correct src URL to the loading image you want to use
				text: 'hi',
				/*ajax: {
					url: $(this).attr('rel') // Use the rel attribute of each element for the url to load
				},*/
				title: {
					text: $(this).text(), // Give the tooltip a title using each elements text
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
				classes: 'ui-tooltip-wiki ui-tooltip-light ui-tooltip-shadow'
			}
		})
	});
	       
    //FIXME: growl example when module listing has been changed
    $('.ybtn a').click(function(event) { 
        calculateAll();
        createGrowl($(this).text(), $(this).text(), false);        
        event.preventDefault(); 
    });
    
    //FIXME: experiment results in module page
    $('.yet-bd > ol > .field-wrapper').each(function(){
        //create tooltip content
        if (setupTooltips($(this))){
        //run qtip
            $(this).qtip({
                content: {
                    // Set the text to an image HTML string with the correct src URL to the loading image you want to use
                    text: $('#tooltip_'+$(this).attr("id")),
                    title: {
                        text: $(this).find("label").text(),
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
        }        
	});

});



var setupTooltips = function(item, mod_id){       
    if (undefined==item || null==item){
        return false;
    }

    if (mod_id==null){
        mod_id="NT1";  //for debuging
    }
    field_name=item.find(":text").attr("name");
  
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
    $('body').append(d);
    
    return true;
};


var calculateAll = function(){
    var total_time=0;
    var total_pv=0;
    var total_money=0;
    
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
            }
        }
    });
    console.log(">>total time/pv/money: "+total_time +"(ms)/"+total_pv+"/"+total_money);
    return time;
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
                        duration: 200,
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
