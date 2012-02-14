var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                getService(Components.interfaces.mozIJSSubScriptLoader);

jsLoader.loadSubScript("chrome://openspace/content/jquery-1.7.1.min.js");
jQuery.noConflict();

var OpenSpace = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    setTimeout("OpenSpace.timer()", 500);
  },

  onClick: function() {
    window.open("chrome://openspace/content/window.xul", "", "width=400,height=200,chrome");
  },
  
  timer: function(){
	var myspace = 1;
	jQuery.get(OpenSpace.spaces[myspace].url, OpenSpace.spaces[myspace].handler, OpenSpace.spaces[myspace].type);
		
	setTimeout("OpenSpace.timer()", 60000);
  },
  
  spaces: [
		// raumzeitlabor
		{
			url: "http://status.raumzeitlabor.de/",
			type: "html",
			handler: function(data){
				
				var match = data.match(/green.png/g);
				if(match == "green.png")
					OpenSpace.setStatus(true);
				else
					OpenSpace.setStatus(false);
				
			}
		},
		// syn2cat
		{
			url: "http://www.hackerspace.lu/od/",
			type: "json",
			handler: function(data){
				OpenSpace.setStatus(data.open);
			}
		}
	],
  
  setStatus: function(status){
	  if(status == true)
		jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/green.png");
	  else
		jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/red.png");
  }
};

window.addEventListener("load", function(e) { OpenSpace.onLoad(e); }, false); 
