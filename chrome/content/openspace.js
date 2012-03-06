
// TODO: when to unregister this window?

var openspace = {
  
    /**
     * Loads some modules and populates the listbox with spaces known
     * in the space directory.
     */
    onLoad: function() {

        // load the openspace module
        try{        
            Components.utils.import("resource://openspace/openspace.jsm");
        }catch(e){
            Components.utils.reportError("The module 'openspace.jsm' could not be loaded");
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

        // load the preference manager
        this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
                        .getBranch( "extensions.openspace." );
           
        // attach event handlers to the panel
        jQuery("#spaces-list").select(this.saveMyspace);
        //jQuery("#refresh-interval").change(this.saveRefreshInterval);                
                
        registerOpenSpaceObserver(this);
        this.initialized = true;
    },
    
    /**
     * Displays a green, red or a grey dot. The colors have the following meaning:
     *
     *    green: space is open
     *    red:   space is closed
     *    grey:  the space json could not be loaded
     *
     * This method is called by the javascript module 'openspace.jsm' whenever the timer
     * triggers.
     *
     * @argument {boolean, undefined} status The space status. Undefined if it could not be determined.
     * @see openspace.jsm
     */
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

    },

    /**
     * Initialize the panel with the space and refresh interval according to the user's configuration.
     */
    initPanel: function(){

        // select the user's hackerspace
	var myspace = this.prefs.getCharPref("myspace");
	var list = document.getElementById("spaces-list");
        jQuery.each(list.childNodes, function(index,item){
            if(myspace === item.label)
                list.selectItem(item);
        });

         
        var refresh_interval = this.prefs.getIntPref("refresh_interval");
	document.getElementById("refresh-interval").value = refresh_interval;     
    },

    /**
     * Saves the chosen hackerspace to the preferences.
     */    
    saveMyspace: function(data){
        //jQuery("#spaces-list");
        var listbox = document.getElementById("spaces-list");
        var myspace = listbox.selectedItem.label;
        // this refers to the listbox since saveMyspace is bound
        // to it as an event handler, so openspace must be used
        openspace.prefs.setCharPref("myspace", myspace);
    },
    
    /**
     * Saves the refresh interval to the preferences.
     */
    saveRefreshInterval: function(){
        // doesn't work with jQuery
        //jQuery("#refresh-interval").attr("value");
        var seconds = document.getElementById("refresh-interval").value;
        this.prefs.setIntPref("refresh_interval", seconds);
    }
};

window.addEventListener("load", function(e) { openspace.onLoad(e); }, false);