var EXPORTED_SYMBOLS = ["directory"];

var directory;

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
}
    
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



//$.getJSON("http://openspace.slopjong.de/directory.json", function(directory){
    // we must use the global variable here instead of this
    // because this is bound to the jQuery object
    //spacelist = directory;
    /*    
    directory = openspace.sortObject(directory);
    $.each(directory, function(space, url){
        listbox.appendItem(space);
    });
    */
//});