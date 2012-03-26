/**
 * This module is the core of the OpenSpace add-on and loads the space JSON in the
 * user's defined (or default) time interval. It checks the member 'open' and
 * sets the status of the registered observers by calling their 'setStatus(status)'
 * method.
 */

/**
 * The symbols made public to the scope this module is loaded to.
 */
var EXPORTED_SYMBOLS = ["space_directory","registerOpenSpaceObserver","unregisterOpenSpaceObserver"];

/**
 * In the debugging mode the space directory is not retrieved from the web server but is locally hard-coded.
 */
var debugging_mode = false;

/**
 * The directory of known hackerspaces which will be loaded
 * from http://openspace.slopjong.de
 */
var space_directory;

/**
 * Flag of the space status when their JSON got last polled.
 * True means the space is open and false means the space
 * is closed.
 */
var last_space_status = undefined;

/**
 * A counter used to count fetching attempts after a space status couldn't
 * be determined because of latency issues caused by ssh tunnelling or another
 * proxy.
 */
var fetch_attempts = 0;

/**
 * Maximum amount of fetch attempts until the window
 * gets notified with the undefined status.
 */
const MAX_FETCH_ATTEMPTS = 10;

/**
 * The observers that are listening to the status 
 */
var observers = [];

/**
 * Register an observer listening to the space status.
 */
function registerOpenSpaceObserver(observer){
    observers.push(observer);
    observer.setStatus(last_space_status);
};

// Borrowed from http://ejohn.org/blog/javascript-array-remove/
// By John Resig (MIT Licensed)
/**
 * Removes an element completely from an array. Deleting an element leads
 * to a hole in the array with the type 'undefined'.
 */
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

/**
 * Unregister a window (e.g. because it's closing)
 */
function unregisterOpenSpaceObserver(observer){
    var i;
    for(i=0; i<observers.length; i++){
        if(observers[i] === observer) break;
    }
    //Components.utils.reportError(observers.length);
    Array.remove(observers,i);
    //Components.utils.reportError(observers.length);
};

/**
 * Sorts an object alphabetically.
 */
function sortObject(object) {
    
    var sorted = {},
    key, a = [];

    // push the keys to an array
    for (key in object) {
        if (object.hasOwnProperty(key)) {
                a.push(key);
        }
    }

    // sort the array
    a.sort(function(a,b){ 
    
        var compA = a.toLowerCase();
        var compB = b.toLowerCase();
    
        return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    });

    // create a new object with the elements sorted alphabetically
    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = object[a[key]];
    }
    
    return sorted;
};
 
var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
    .createInstance(Components.interfaces.nsIXMLHttpRequest);
    
// set the timeout to 4 seconds to avoid latency issues when
// tunnelling the traffic through ssh or another proxy
// tip: only firefox 11 and upwards support the timeout attribute
//req.timeout = 6000;

/**
 * The timeout to abort the XHR.
 */
var timeout = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);  
const TYPE_ONE_SHOT = Components.interfaces.nsITimer.TYPE_ONE_SHOT;
                        
// load the space directory   
try{
    if(debugging_mode)
    {
        space_directory =
        {
            "ACKspace": "https://ackspace.nl/status.php",
            "Beta-Space": "http://status.kreativitaet-trifft-technik.de/status.json",
            "Bitlair": "https://bitlair.nl/statejson.php",
            "Fabelier": "http://status.fabelier.org/status.json",
            "Frack": "http://frack.nl/spacestate/?api",
            "Garoa Hacker Clube": "https://garoahc.appspot.com/status",
            "HeatSync Labs": "http://intranet.heatsynclabs.org/~access/cgi-bin/spaceapi.rb",
            "Hickerspace": "http://hickerspace.org/api/info/",
            "Kwartzlab MakerSpace": "http://at.kwartzlab.ca/spaceapi/index.php",
            "Makers Local 256": "https://256.makerslocal.org/status.json",
            "MidsouthMakers": "http://midsouthmakers.org/spaceapi/",
            "miLKlabs": "http://status.mlkl.bz/json",
            "Milwaukee Makerspace": "http://apps.2xlnetworks.net/milwaukeemakerspace/",
            "Noisebridge": "http://api.noisebridge.net/spaceapi/",
            "Pumping Station: One": "http://space.pumpingstationone.org:8000/spaceapi/ps1",
            "RaumZeitLabor": "http://openspace.slopjong.de/raumzeitlabor.json",
            "RevSpace": "https://revspace.nl/status/status.php",
            "Shackspace": "http://openspace.slopjong.de/shackspace.json",
            "Syn2cat": "http://www.hackerspace.lu/od/",
            "Tetalab": "http://status.tetalab.org/status.json",
            "TkkrLab": "http://tkkrlab.nl/statejson.php",
            "TOG": "http://tog.ie/cgi-bin/space",
            "Void Warranties": "http://we.voidwarranties.be/SpaceAPI/"
        }
    } else
    {
        req.open("GET", "http://openspace.slopjong.de/directory.json", false);
        req.send(null);
        
        space_directory = JSON.parse(req.responseText);
        space_directory = sortObject(space_directory);
    }
    
}catch(e){
    Components.utils.reportError("Could not load the space directory");
}

/**
 * Notifies all the observers of the current space status.
 * The oberservers can be passed true, false or undefined.
 */
function notifyObservers(new_space_status){
    Components.utils.reportError("notifying the observers");
    if(last_space_status !== new_space_status){
        
        last_space_status = new_space_status;
        
        for(i=0; i<observers.length; i++)
            observers[i].setStatus(new_space_status);
    }
}

// openspace's preferences
var prefs = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService).getBranch( "extensions.openspace." );

var prefMySpace = prefs.getCharPref("myspace");
Components.utils.reportError(prefMySpace);
var prefRefreshInterval = prefs.getIntPref("refresh_interval");
Components.utils.reportError(prefRefreshInterval);

// setup the timer and its handler
var event = {
  observe: function(subject, topic, data) {
    
    var spacejson = undefined;
    
    try
    {
        Components.utils.reportError("fetching the json");
  
        // init the timeout
        timeout.init({
            observe: function(subject, topic){
                req.abort();
                Components.utils.reportError("Abort the request");
        }}, 6000, TYPE_ONE_SHOT);

        req.open("GET", space_directory[prefMySpace], false);
        req.send(null);
        
        // cancel the timeout
        timeout.cancel();
    
        spacejson = JSON.parse(req.responseText);
    }
    catch(e)
    {
        Components.utils.reportError("Could not fetch the space api json.");
    }
    
    // if something went wrong while fetching the json, just retry.
    // if the maximum amount got reached 
    if(spacejson === undefined && ++fetch_attempts < MAX_FETCH_ATTEMPTS)
    {
        Components.utils.reportError((fetch_attempts+1)+" retry in 2 seconds");
        
        timer.delay = 2000;
        return;
    }
    
    // if the status is still undefined after 10 attempts then there
    // are server-side problems and thus the timer cancelled.
    if(spacejson === undefined && fetch_attempts == MAX_FETCH_ATTEMPTS)
    {
        timer.cancel();
    }
    else
    {
        fetch_attempts = 0;
        Components.utils.reportError("Notifying the observer with "+ spacejson.open);
        notifyObservers(spacejson.open);
        
        // set the timer delay to what the user wishes to be
        timer.delay = 1000 * prefRefreshInterval;
    }
  }  
}

// initialize the timer
var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);  
const TYPE_REPEATING_SLACK = Components.interfaces.nsITimer.TYPE_REPEATING_SLACK;
var refresh_timer = {
    init: function(){
        // cancel the timer before reinitializing it
        timer.cancel();
        timer.init(event, 100, TYPE_REPEATING_SLACK);
    }}
refresh_timer.init();

/*****************************************************************************************
 * Now initialize the preference manager observer to keep track of any preference changes.
 * 
 * Note: During Gecko 13 development, nsIPrefBranch2 was deprecated, and its methods moved
 *       to nsIPrefBranch. Calling .QueryInterface(Components.interfaces.nsIPrefBranch2)
 *       is no longer required, although it still works.
 *       
 * See: https://developer.mozilla.org/en/Code_snippets/Preferences
 */


/**
 * @constructor
 *
 * @param {string} branch_name
 * @param {Function} callback must have the following arguments:
 *   branch, pref_leaf_name
 */
function PrefListener(branch_name, callback) {
  // Keeping a reference to the observed preference branch or it will get
  // garbage collected.
  var prefService = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService);
  this._branch = prefService.getBranch(branch_name);
  this._branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
  this._callback = callback;
}

PrefListener.prototype.observe = function(subject, topic, data) {
  if (topic == 'nsPref:changed')
    this._callback(this._branch, data);
};

/**
 * @param {boolean=} trigger if true triggers the registered function
 *   on registration, that is, when this method is called.
 */
PrefListener.prototype.register = function(trigger) {
  this._branch.addObserver('', this, false);
  if (trigger) {
    let that = this;
    this._branch.getChildList('', {}).
      forEach(function (pref_leaf_name)
        { that._callback(that._branch, pref_leaf_name); });
  }
};

PrefListener.prototype.unregister = function() {
  if (this._branch)
    this._branch.removeObserver('', this);
};

var myListener = new PrefListener("extensions.openspace.",
                    function(branch, name, value) {
                        switch (name) {
                            case "myspace":
                                prefMySpace = prefs.getCharPref("myspace");
                                
                                // set the status as undefined, otherwise a door status could
                                // be displayed as open or closed even if the actual status
                                // of the selected space couldn't yet be determined.
                                //
                                // TODO: a minor hack is required here to notify the observers
                                //       of the 'undefined' status, this hack is required because
                                //       notifyObservers compares last_space_status with the passed
                                //       argument and it can happen that both are equal and thus
                                //       nothing happens then
                                last_space_status = false;
                                notifyObservers(undefined);
                                last_space_status = undefined;
                                
                                // reinitialize the timer
                                refresh_timer.init();
                                Components.utils.reportError("myspace pref has got changed");
                                break;
                            
                            case "refresh_interval":
                                prefRefreshInterval = prefs.getIntPref("refresh_interval");
                                Components.utils.reportError("refresh-interval pref has got changed");
                                break;
                        }
                    });

myListener.register(true);