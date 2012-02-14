var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                getService(Components.interfaces.mozIJSSubScriptLoader);

jsLoader.loadSubScript("chrome://openspace/content/jquery-1.7.1.min.js");
jQuery.noConflict();

var OpenSpace = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    setTimeout("OpenSpace.timer()", 2000);
  },

  onClick: function() {
    //window.open("chrome://openspace/content/window.xul", "", "width=400,height=200,chrome");
  },
  
  timer: function(){

	  jQuery("#my-panel").css("background-image","url('chrome://inspector/skin/btnSelecting-act.gif')");
	//alert('test');
	//setTimeout("OpenSpace.alert()", 2000);
  }
};

window.addEventListener("load", function(e) { OpenSpace.onLoad(e); }, false); 
