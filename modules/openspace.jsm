var EXPORTED_SYMBOLS = ["directory","registerOpenSpaceObserver","unregisterOpenSpaceObserver"];

var directory;
var observers = [];

function registerOpenSpaceObserver(observer){
    observers.push(observer);
};

// Borrowed from http://ejohn.org/blog/javascript-array-remove/
// By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

function unregisterOpenSpaceObserver(observer){
    var i;
    for(i=0; i<observers.length; i++){
        if(observers[i] === observer) break;
    }
    Components.utils.reportError(observers.length);
    Array.remove(observers,i);
    Components.utils.reportError(observers.length);
};

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
                        
// load the space directory   
try{
    req.open("GET", "http://openspace.slopjong.de/directory.json", false);
    req.send(null);
    
    directory = JSON.parse(req.responseText);
    directory = sortObject(directory);
    
}catch(e){
    Components.utils.reportError("Could not load the space directory");
}

function notifyObservers(response){
    for(i=0; i<observers.length; i++)
        observers[i].setStatus(response);
}

// openspace's preferences
var prefs = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService).getBranch( "extensions.openspace." );

// setup the timer and its handler
var event = {
  observe: function(subject, topic, data) {
    try{
        req.open("GET", directory[prefs.getCharPref("myspace")], false);
        req.send(null);
    
        spacejson = JSON.parse(req.responseText);
        notifyObservers(spacejson.open);
    }catch(e){
        notifyObservers(undefined);
    }
    
    // TODO: better to reset the timer delay if the preferences have changed instead
    //       of setting it all time. there should be something like a preferences observer
    // set the timer delay to what the user wishes to be
    timer.delay = 1000 * prefs.getIntPref("refresh_interval");
  }  
}

var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);  
const TYPE_REPEATING_SLACK = Components.interfaces.nsITimer.TYPE_REPEATING_SLACK;  
  
timer.init(event, 100, TYPE_REPEATING_SLACK);