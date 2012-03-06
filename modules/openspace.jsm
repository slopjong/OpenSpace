var EXPORTED_SYMBOLS = ["directory","registerOpenSpaceObserver","unregisterOpenSpaceObserver"];

var directory;
var observers = [];

function registerOpenSpaceObserver(observer){
    observers.push(observer);
    //Components.utils.reportError(observers.length);
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
 
// load the space directory   
try{
    var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
                        .createInstance(Components.interfaces.nsIXMLHttpRequest);

    req.open("GET", "http://openspace.slopjong.de/directory.json", false);
    req.send(null);
    
    directory = JSON.parse(req.responseText);
    directory = sortObject(directory);
    
}catch(e){
    Components.utils.reportError("Could not load the space directory");
}


function pollSpace(){
      
      
      //var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
      //                        .getService(Components.interfaces.nsIPrefService).getBranch( "extensions.openspace." );
      //var myspace = prefManager.getIntPref("myspace");
      //// in seconds
      //var refresh_interval = prefManager.getIntPref("refresh_interval");
            
      //Components.classes[ "@mozilla.org/consoleservice;1" ]
      //                .getService( Components.interfaces[ "nsIConsoleService" ] )
      //                .logStringMessage(OpenSpace.spaces[myspace]);

      
    //let consoleService = Components.classes["@mozilla.org/consoleservice;1"].
    //            getService(Components.interfaces.nsIConsoleService);
    //consoleService.logStringMessage(aMsg);
        
      //alert(OpenSpace.spaces[myspace].name);
      Components.utils.reportError("polling");
    
      //setTimeout("pollSpace()", 1000);
}

// setup the timer and its handler
var event = {
  observe: function(subject, topic, data) {  
    Components.utils.reportError("polling");
    timer.delay = timer.delay+1000;
  }  
}

var timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);  
const TYPE_REPEATING_SLACK = Components.interfaces.nsITimer.TYPE_REPEATING_SLACK;  
  
timer.init(event, 1000, TYPE_REPEATING_SLACK);