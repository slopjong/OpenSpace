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