var openspace = {
  
    onLoad: function() {

        // load our javascript module
        //Components.utils.import("chrome://openspace/content/openspace.jsm");
        try{        
            Components.utils.import("resource://openspace/openspace.jsm");
        }catch(e){
            Components.utils.reportError("The module 'openspace.jsm' could not be loaded "+e);
            return;
        }
        
        // load jQuery
        var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].
                getService(Components.interfaces.mozIJSSubScriptLoader);

        jsLoader.loadSubScript("resource://openspace/jquery-1.7.1.min.js");
        jQuery.noConflict();
        
        // populate the listbox with known supported hackerspaces
        var listbox = document.getElementById("spaces-list");     

        //directory = openspace.sortObject(directory);
        jQuery.each(directory, function(space, url){
            listbox.appendItem(space);
        });
        
        registerOpenSpaceObserver(this);

        this.initialized = true;
    },
    
    setStatus: function(status){

            if(typeof status == "undefined") {
                  jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/grey.png");
                  return;
            }
            
          if(typeof status == "string") {
                  if(status == "true")
                          status = true;
                  else
                          status = false;
          }
            
            if(status == true)
                  jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/green.png");
            else
                  jQuery("#openspace-status-image").attr("src","chrome://openspace/skin/red.png");

    }
};


window.addEventListener("load", function(e) { openspace.onLoad(e); }, false);

/*
function openspace_save_myspace(index){
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService).getBranch( "extensions.openspace." );
	prefManager.setIntPref("myspace", index);
}

function openspace_save_refresh_interval(seconds){
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService).getBranch( "extensions.openspace." );
	prefManager.setIntPref("refresh_interval", seconds);
}

function openspace_select_userspace(){
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService).getBranch( "extensions.openspace." );
	var myspace = prefManager.getIntPref("myspace");
	
	var list = document.getElementById("spaces-list");
	var xulel = list.getItemAtIndex(myspace);
	list.selectItem(xulel);
}

function openspace_set_refresh_interval(){
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService).getBranch( "extensions.openspace." );
	var refresh_interval = prefManager.getIntPref("refresh_interval");
	
	document.getElementById("refresh-interval").value = refresh_interval;
}

function openspace_init(){
	openspace_select_userspace();
	openspace_set_refresh_interval();
}
*/