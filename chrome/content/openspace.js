
var openspace = {

    /**
     * The preference manager which gives one access to the preferences.
     */
    prefs: Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
                        .getBranch( "extensions.openspace." ),
  
    /**
     * Loads some modules and populates the listbox with spaces known
     * in the space directory. After the initialization this object
     * is registered as an observer in the OpenSpace javascript module.
     */
    onLoad: function() {

        // load the notification module used to confirm the selection
        // of a hackerpsace
        // Note: This code module is imported by Firefox chrome windows,
        //       so this doesn't have to be done oneself in most extensions.
        // Components.utils.import('resource://app/modules/PopupNotifications.jsm');

        //this.notify = new PopupNotifications(gBrowser,  
        //                document.getElementById("notification-popup"),  
        //                document.getElementById("notification-popup-box")); 
    
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
        jQuery.each(directory, function(space, url){
            listbox.appendItem(space);
        });
        
        //attach an event handler to the 'add' label
        jQuery("#add-hackerspace").click(this.addSpace);
        
        // attach an event handler to the submit button
        jQuery("#add-hackerspace-submit").click(this.submitSpace);
        
        //jQuery("#refresh-interval").change(this.saveRefreshInterval);                
                
        registerOpenSpaceObserver(this);
        this.initialized = true;
        
        Components.utils.reportError("OpenSpace instance initialized");
    },
    
    /**
     * Unregisters this object as an observer in the OpenSpace javascript module.
     */
    onUnLoad: function(){
        unregisterOpenSpaceObserver(this);
        Components.utils.reportError("OpenSpace instance unregistered as an observer");
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
     * Flag used to execute a certain action when the panel is first shown.
     */
    panelInitialized: false,
    
    /**
     * Initialize the panel with the space and refresh interval according to the user's configuration.
     */
    initPanel: function(){
    
        Components.utils.reportError("Initializing the panel");
    
        // select the user's hackerspace
	var myspace = this.prefs.getCharPref("myspace");
        Components.utils.reportError("Saved space is"+ myspace);
        
	var list = document.getElementById("spaces-list");
        jQuery.each(list.childNodes, function(index,item){
            Components.utils.reportError("Iterating over "+ item.label);
            if(myspace === item.label){
                list.selectItem(item);
                Components.utils.reportError("Selected the item");
            }
        });
         
        var refresh_interval = this.prefs.getIntPref("refresh_interval");
	document.getElementById("refresh-interval").value = refresh_interval;
        
        // attach an event handlers to the panel
        jQuery("#spaces-list").select(this.saveMyspace);
        
        // the panel is now initialized and flip the flag
        this.panelInitialized = true;
    },

    /**
     * Opens the OpenSpace panel.
     */
    showPanel: function(){
        var spanel = document.getElementById('openspace-panel');
        var panel = document.getElementById('thepanel');
        panel.openPopup(spanel, "before_end", -28, -1, false, false);
    },
    
    /**
     * The event handler executed when the panel is displayed.
     */
    onPanelShowing: function(){
        
        // The panel must be first shown before it can be initialized.
        // There was big trouble when trying to initialize the panel
        // in the onLoad method. The space saved in the prefence should
        // be preselected but preselecting it before first shown didn't
        // work.
        this.showPanel();
        if(! this.panelInitialized)
            this.initPanel();
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

        // the timeout for hiding the notification panel automatically        
        //var _timeout = Date.now()+3000;
        //Components.utils.reportError(_timeout);        
    
                
        var notify = PopupNotifications;
        var notification =  notify.show(
            gBrowser.selectedBrowser,  /*browser*/
            "OpenSpace-infopopup", /*id*/
            "Your selection '"+ myspace +"' got saved to the preferences.",/*message*/
            null, /* anchor ID */   
            null, /* mainAction */
           null, /* secondaryActions*/
            {close: true}//{ dismissed: false, timeout: _timeout}/*  /* data */
        );
        //notification.close = false;
        
        
        //document.getElementById("thepanel").setAttribute("fade", "fast");
        //jQuery("#thepanel").attr("fade","fast");
        //*
        setTimeout(function(){
            notification.remove();
            //alert(notification.);
            //Components.utils.reportError(notification["OpenSpace-infopopup"]);
            //*
            var o = notification["options"];
            Components.utils.reportError(o);
            for(att in o){
                Components.utils.reportError(att+ " -> "+o[att]);
            }
        }, 3500);
        //*/
    },
    
    /**
     * Saves the refresh interval to the preferences.
     */
    saveRefreshInterval: function(){
        // doesn't work with jQuery
        //jQuery("#refresh-interval").attr("value");
        var seconds = document.getElementById("refresh-interval").value;
        this.prefs.setIntPref("refresh_interval", seconds);
    },
    
    /**
     * Hides the link and displays a textbox with a submit button.
     */
    addSpace: function(){
        // jQuery(...).show() doesn't work
        jQuery("#add-hackerspace-submit").css("display","block");
        jQuery("#space-url-input").css("display","block");
        jQuery("#add-hackerspace").hide();
        
    },
    
    /**
     * Requests OpenSpaceLint to add the given URL to the space directory
     * and hides the panel afterwards.
     */
    submitSpace: function(){
        var url = jQuery("#space-url-input").val();
        gBrowser.selectedTab = gBrowser.addTab("http://openspace.slopjong.de/#add=" + url);
        jQuery("#space-url-input").val("");
        jQuery("#space-url-input").hide();
        jQuery("#add-hackerspace-submit").hide();
        jQuery("#add-hackerspace").css("display","block");
        document.getElementById("thepanel").hidePopup();
    }
};

window.addEventListener("load", function(e) { openspace.onLoad(e); }, false);
window.addEventListener("unload", function(e){ openspace.onUnLoad(e); }, false);