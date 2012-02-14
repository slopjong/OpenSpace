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
    //window.open("chrome://openspace/content/window.xul", "", "width=400,height=200,chrome");
  },
  
  timer: function(){

	  jQuery.getJSON("http://www.hackerspace.lu/od/", function(data){

		  if(data.open == true)
			jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/green.png");
		  else
			jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/red.png");
		});
		
	setTimeout("OpenSpace.timer()", 60000);
  }
};

window.addEventListener("load", function(e) { OpenSpace.onLoad(e); }, false); 
